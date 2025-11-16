require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize database
const db = require('./server/config/database');

// Import routes
const authRoutes = require('./server/routes/auth');
const goalRoutes = require('./server/routes/goals');
const moodRoutes = require('./server/routes/mood');
const communityRoutes = require('./server/routes/community');
const friendsRoutes = require('./server/routes/friends');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/friends', friendsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VibeCheck API is running' });
});

// Serve frontend for all other routes (non-API)
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`VibeCheck server running on port ${PORT}`);
});
