const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Send friend request
router.post('/request', authenticateToken, (req, res) => {
  const { friend_username } = req.body;

  if (!friend_username) {
    return res.status(400).json({ error: 'Friend username is required' });
  }

  // Find the friend user
  db.get('SELECT id FROM users WHERE username = ?', [friend_username], (err, friend) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!friend) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (friend.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot add yourself as friend' });
    }

    const friendshipId = uuidv4();

    db.run(
      'INSERT INTO friendships (id, user_id, friend_id, status) VALUES (?, ?, ?, ?)',
      [friendshipId, req.user.id, friend.id, 'pending'],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to send friend request' });
        }
        res.status(201).json({ message: 'Friend request sent successfully' });
      }
    );
  });
});

// Accept friend request
router.post('/accept/:id', authenticateToken, (req, res) => {
  const friendshipId = req.params.id;

  db.run(
    'UPDATE friendships SET status = ? WHERE id = ? AND friend_id = ?',
    ['accepted', friendshipId, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to accept friend request' });
      }
      res.json({ message: 'Friend request accepted' });
    }
  );
});

// Get friends list
router.get('/list', authenticateToken, (req, res) => {
  const query = `
    SELECT u.id, u.username, f.status
    FROM friendships f
    JOIN users u ON (f.friend_id = u.id OR f.user_id = u.id)
    WHERE (f.user_id = ? OR f.friend_id = ?) AND u.id != ?
    ORDER BY f.created_at DESC
  `;

  db.all(query, [req.user.id, req.user.id, req.user.id], (err, friends) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(friends);
  });
});

// Get friends' goals
router.get('/goals', authenticateToken, (req, res) => {
  const query = `
    SELECT g.*, u.username,
           (SELECT COUNT(*) FROM reactions r WHERE r.goal_id = g.id) as reaction_count,
           (SELECT COUNT(*) FROM boosts b WHERE b.goal_id = g.id) as boost_count
    FROM goals g
    JOIN users u ON g.user_id = u.id
    JOIN friendships f ON (f.friend_id = g.user_id OR f.user_id = g.user_id)
    WHERE (f.user_id = ? OR f.friend_id = ?) 
      AND f.status = 'accepted'
      AND g.user_id != ?
      AND g.is_public = 1
    ORDER BY g.created_at DESC
    LIMIT 50
  `;

  db.all(query, [req.user.id, req.user.id, req.user.id], (err, goals) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(goals);
  });
});

module.exports = router;
