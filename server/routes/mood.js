const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create a mood check-in
router.post('/', authenticateToken, (req, res) => {
  const { mood, note } = req.body;

  if (!mood) {
    return res.status(400).json({ error: 'Mood is required' });
  }

  const checkinId = uuidv4();

  db.run(
    'INSERT INTO mood_checkins (id, user_id, mood, note) VALUES (?, ?, ?, ?)',
    [checkinId, req.user.id, mood, note || null],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create mood check-in' });
      }
      res.status(201).json({ message: 'Mood check-in recorded successfully', id: checkinId });
    }
  );
});

// Get user's mood history
router.get('/my-moods', authenticateToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 30;

  db.all(
    'SELECT * FROM mood_checkins WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
    [req.user.id, limit],
    (err, moods) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(moods);
    }
  );
});

module.exports = router;
