const db = require('../config/db');

class LogsModel {
  // Create new log entry
  static async create({ admin_id, action_type, target_type, target_id, description, ip_address }) {
    try {
      const [result] = await db.query(
        'INSERT INTO logs (admin_id, action_type, target_type, target_id, description, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
        [admin_id, action_type, target_type, target_id, description, ip_address]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get logs by admin ID
  static async getByAdminId(adminId, limit = 50, offset = 0) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM logs WHERE admin_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [adminId, limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all logs
  static async getAllLogs(limit = 100, offset = 0) {
    try {
      const [rows] = await db.query(
        `SELECT l.*, a.username as admin_username 
         FROM logs l 
         LEFT JOIN admins a ON l.admin_id = a.admin_id 
         ORDER BY l.created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get logs by action type
  static async getByActionType(actionType, limit = 50, offset = 0) {
    try {
      const [rows] = await db.query(
        `SELECT l.*, a.username as admin_username 
         FROM logs l 
         LEFT JOIN admins a ON l.admin_id = a.admin_id 
         WHERE l.action_type = ? 
         ORDER BY l.created_at DESC 
         LIMIT ? OFFSET ?`,
        [actionType, limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete old logs (cleanup)
  static async deleteOldLogs(daysOld = 90) {
    try {
      const [result] = await db.query(
        'DELETE FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)',
        [daysOld]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LogsModel;
