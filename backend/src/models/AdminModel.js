const db = require('../config/db');
const bcrypt = require('bcryptjs');

class AdminModel {
  // Create new admin
  static async create({ username, email, password, full_name, role }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO admins (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name, role || 'moderator']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find admin by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find admin by ID
  static async findById(adminId) {
    try {
      const [rows] = await db.query(
        'SELECT admin_id, username, email, full_name, role, created_at, last_login, is_active FROM admins WHERE admin_id = ?',
        [adminId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update last login
  static async updateLastLogin(adminId) {
    try {
      const [result] = await db.query(
        'UPDATE admins SET last_login = NOW() WHERE admin_id = ?',
        [adminId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all admins
  static async getAllAdmins() {
    try {
      const [rows] = await db.query(
        'SELECT admin_id, username, email, full_name, role, created_at, last_login, is_active FROM admins ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = AdminModel;
