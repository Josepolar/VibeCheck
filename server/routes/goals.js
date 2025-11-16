const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all goals (public feed)
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT g.*, u.username,
           (SELECT COUNT(*) FROM reactions r WHERE r.goal_id = g.id) as reaction_count,
           (SELECT COUNT(*) FROM boosts b WHERE b.goal_id = g.id) as boost_count,
           (SELECT COUNT(*) FROM joined_challenges jc WHERE jc.original_goal_id = g.id) as join_count
    FROM goals g
    JOIN users u ON g.user_id = u.id
    WHERE g.is_public = 1
    ORDER BY g.created_at DESC
    LIMIT 50
  `;

  db.all(query, [], (err, goals) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(goals);
  });
});

// Get user's goals
router.get('/my-goals', authenticateToken, (req, res) => {
  const query = `
    SELECT g.*,
           (SELECT COUNT(*) FROM reactions r WHERE r.goal_id = g.id) as reaction_count,
           (SELECT COUNT(*) FROM boosts b WHERE b.goal_id = g.id) as boost_count,
           (SELECT COUNT(*) FROM joined_challenges jc WHERE jc.original_goal_id = g.id) as join_count,
           s.current_streak, s.longest_streak
    FROM goals g
    LEFT JOIN streaks s ON g.id = s.goal_id
    WHERE g.user_id = ?
    ORDER BY g.created_at DESC
  `;

  db.all(query, [req.user.id], (err, goals) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(goals);
  });
});

// Create a goal
router.post('/', authenticateToken, (req, res) => {
  const { title, description, category, is_public } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const goalId = uuidv4();
  const streakId = uuidv4();

  db.run(
    'INSERT INTO goals (id, user_id, title, description, category, is_public) VALUES (?, ?, ?, ?, ?, ?)',
    [goalId, req.user.id, title, description || null, category || null, is_public !== false ? 1 : 0],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create goal' });
      }

      // Initialize streak tracker
      db.run(
        'INSERT INTO streaks (id, user_id, goal_id) VALUES (?, ?, ?)',
        [streakId, req.user.id, goalId],
        (err) => {
          if (err) {
            console.error('Failed to create streak tracker:', err);
          }

          res.status(201).json({
            message: 'Goal created successfully',
            goal: { id: goalId, user_id: req.user.id, title, description, category, is_public }
          });
        }
      );
    }
  );
});

// Complete a goal (mark daily completion)
router.post('/:id/complete', authenticateToken, (req, res) => {
  const goalId = req.params.id;
  const completionId = uuidv4();
  const today = new Date().toISOString().split('T')[0];

  // Check if already completed today
  db.get(
    'SELECT * FROM daily_completions WHERE user_id = ? AND goal_id = ? AND completion_date = ?',
    [req.user.id, goalId, today],
    (err, existing) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existing) {
        return res.status(400).json({ error: 'Goal already completed today' });
      }

      // Add completion
      db.run(
        'INSERT INTO daily_completions (id, user_id, goal_id, completion_date) VALUES (?, ?, ?, ?)',
        [completionId, req.user.id, goalId, today],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to record completion' });
          }

          // Update streak
          updateStreak(req.user.id, goalId, () => {
            res.json({ message: 'Goal completed for today!' });
          });
        }
      );
    }
  );
});

// Helper function to update streaks
function updateStreak(userId, goalId, callback) {
  db.get(
    'SELECT * FROM streaks WHERE user_id = ? AND goal_id = ?',
    [userId, goalId],
    (err, streak) => {
      if (err || !streak) {
        return callback();
      }

      const today = new Date();
      const lastCompleted = streak.last_completed ? new Date(streak.last_completed) : null;

      let newStreak = 1;
      if (lastCompleted) {
        const daysDiff = Math.floor((today - lastCompleted) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          newStreak = (streak.current_streak || 0) + 1;
        }
      }

      const longestStreak = Math.max(newStreak, streak.longest_streak || 0);

      db.run(
        'UPDATE streaks SET current_streak = ?, longest_streak = ?, last_completed = ? WHERE user_id = ? AND goal_id = ?',
        [newStreak, longestStreak, today.toISOString(), userId, goalId],
        callback
      );
    }
  );
}

// React to a goal
router.post('/:id/react', authenticateToken, (req, res) => {
  const { reaction_type } = req.body;
  const goalId = req.params.id;

  if (!reaction_type) {
    return res.status(400).json({ error: 'Reaction type is required' });
  }

  const reactionId = uuidv4();

  db.run(
    'INSERT OR REPLACE INTO reactions (id, user_id, goal_id, reaction_type) VALUES (?, ?, ?, ?)',
    [reactionId, req.user.id, goalId, reaction_type],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add reaction' });
      }
      res.json({ message: 'Reaction added successfully' });
    }
  );
});

// Boost a goal
router.post('/:id/boost', authenticateToken, (req, res) => {
  const goalId = req.params.id;
  const boostId = uuidv4();

  db.run(
    'INSERT OR REPLACE INTO boosts (id, user_id, goal_id) VALUES (?, ?, ?)',
    [boostId, req.user.id, goalId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to boost goal' });
      }
      res.json({ message: 'Goal boosted successfully' });
    }
  );
});

// Join a challenge
router.post('/:id/join', authenticateToken, (req, res) => {
  const originalGoalId = req.params.id;

  // Get original goal
  db.get('SELECT * FROM goals WHERE id = ?', [originalGoalId], (err, originalGoal) => {
    if (err || !originalGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Create a personal copy of the goal
    const personalGoalId = uuidv4();
    const joinId = uuidv4();
    const streakId = uuidv4();

    db.run(
      'INSERT INTO goals (id, user_id, title, description, category, is_public) VALUES (?, ?, ?, ?, ?, ?)',
      [personalGoalId, req.user.id, originalGoal.title, originalGoal.description, originalGoal.category, 1],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create personal goal' });
        }

        // Record the join
        db.run(
          'INSERT INTO joined_challenges (id, user_id, original_goal_id, personal_goal_id) VALUES (?, ?, ?, ?)',
          [joinId, req.user.id, originalGoalId, personalGoalId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to join challenge' });
            }

            // Initialize streak
            db.run(
              'INSERT INTO streaks (id, user_id, goal_id) VALUES (?, ?, ?)',
              [streakId, req.user.id, personalGoalId],
              () => {
                res.json({ message: 'Challenge joined successfully', personalGoalId });
              }
            );
          }
        );
      }
    );
  });
});

// Delete a goal
router.delete('/:id', authenticateToken, (req, res) => {
  const goalId = req.params.id;

  db.run(
    'DELETE FROM goals WHERE id = ? AND user_id = ?',
    [goalId, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete goal' });
      }
      res.json({ message: 'Goal deleted successfully' });
    }
  );
});

module.exports = router;
