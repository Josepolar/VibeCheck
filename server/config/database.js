const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../vibecheck.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Goals table
    db.run(`
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        is_public INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Streaks table
    db.run(`
      CREATE TABLE IF NOT EXISTS streaks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        goal_id TEXT NOT NULL,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_completed DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (goal_id) REFERENCES goals(id)
      )
    `);

    // Mood check-ins table
    db.run(`
      CREATE TABLE IF NOT EXISTS mood_checkins (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        mood TEXT NOT NULL,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Reactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS reactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        goal_id TEXT NOT NULL,
        reaction_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (goal_id) REFERENCES goals(id),
        UNIQUE(user_id, goal_id, reaction_type)
      )
    `);

    // Boosts table
    db.run(`
      CREATE TABLE IF NOT EXISTS boosts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        goal_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (goal_id) REFERENCES goals(id),
        UNIQUE(user_id, goal_id)
      )
    `);

    // Joined challenges table
    db.run(`
      CREATE TABLE IF NOT EXISTS joined_challenges (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        original_goal_id TEXT NOT NULL,
        personal_goal_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (original_goal_id) REFERENCES goals(id),
        FOREIGN KEY (personal_goal_id) REFERENCES goals(id)
      )
    `);

    // Friendships table
    db.run(`
      CREATE TABLE IF NOT EXISTS friendships (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        friend_id TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (friend_id) REFERENCES users(id)
      )
    `);

    // Community support messages (anonymous)
    db.run(`
      CREATE TABLE IF NOT EXISTS community_messages (
        id TEXT PRIMARY KEY,
        message TEXT NOT NULL,
        category TEXT,
        is_anonymous INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Daily completions for streak tracking
    db.run(`
      CREATE TABLE IF NOT EXISTS daily_completions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        goal_id TEXT NOT NULL,
        completion_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (goal_id) REFERENCES goals(id),
        UNIQUE(user_id, goal_id, completion_date)
      )
    `);

    console.log('Database tables initialized');
  });
}

module.exports = db;
