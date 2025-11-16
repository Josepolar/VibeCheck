const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  // Create new user
  static async create({ username, email, password, full_name, bio }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (username, email, password_hash, full_name, bio) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name, bio]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(userId) {
    try {
      const [rows] = await db.query(
        'SELECT user_id, username, email, full_name, profile_picture, bio, created_at, is_active FROM users WHERE user_id = ?',
        [userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, updates) {
    try {
      const fields = [];
      const values = [];

      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      });

      values.push(userId);
      const [result] = await db.query(
        `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all users (for admin)
  static async getAllUsers(limit = 50, offset = 0) {
    try {
      const [rows] = await db.query(
        'SELECT user_id, username, email, full_name, created_at, is_active FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = UserModel;
