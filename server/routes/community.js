const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Post anonymous community message
router.post('/messages', authenticateToken, (req, res) => {
  const { message, category } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const messageId = uuidv4();

  db.run(
    'INSERT INTO community_messages (id, message, category, is_anonymous) VALUES (?, ?, ?, ?)',
    [messageId, message, category || null, 1],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to post message' });
      }
      res.status(201).json({ message: 'Message posted successfully', id: messageId });
    }
  );
});

// Get community messages
router.get('/messages', authenticateToken, (req, res) => {
  const category = req.query.category;
  const limit = parseInt(req.query.limit) || 50;

  let query = 'SELECT * FROM community_messages';
  let params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  db.all(query, params, (err, messages) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(messages);
  });
});

module.exports = router;
