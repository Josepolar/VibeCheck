const db = require('../config/db');

class MoodboardModel {
  // Create new moodboard
  static async create({ user_id, title, description, mood_category, tags, is_public }) {
    try {
      const tagsJson = JSON.stringify(tags || []);
      const [result] = await db.query(
        'INSERT INTO moodboards (user_id, title, description, mood_category, tags, is_public) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, title, description, mood_category, tagsJson, is_public !== false]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get moodboard by ID
  static async findById(moodboardId) {
    try {
      const [rows] = await db.query(
        `SELECT m.*, u.username, u.profile_picture 
         FROM moodboards m 
         JOIN users u ON m.user_id = u.user_id 
         WHERE m.moodboard_id = ?`,
        [moodboardId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all public moodboards
  static async getPublicMoodboards(limit = 20, offset = 0) {
    try {
      const [rows] = await db.query(
        `SELECT m.*, u.username, u.profile_picture 
         FROM moodboards m 
         JOIN users u ON m.user_id = u.user_id 
         WHERE m.is_public = TRUE 
         ORDER BY m.created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get moodboards by user
  static async getByUserId(userId, limit = 20, offset = 0) {
    try {
      const [rows] = await db.query(
        `SELECT m.*, u.username, u.profile_picture 
         FROM moodboards m 
         JOIN users u ON m.user_id = u.user_id 
         WHERE m.user_id = ? 
         ORDER BY m.created_at DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update moodboard
  static async update(moodboardId, updates) {
    try {
      const fields = [];
      const values = [];

      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          if (key === 'tags') {
            fields.push(`${key} = ?`);
            values.push(JSON.stringify(updates[key]));
          } else {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
          }
        }
      });

      values.push(moodboardId);
      const [result] = await db.query(
        `UPDATE moodboards SET ${fields.join(', ')} WHERE moodboard_id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete moodboard
  static async delete(moodboardId) {
    try {
      const [result] = await db.query('DELETE FROM moodboards WHERE moodboard_id = ?', [moodboardId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Increment views
  static async incrementViews(moodboardId) {
    try {
      await db.query('UPDATE moodboards SET views_count = views_count + 1 WHERE moodboard_id = ?', [moodboardId]);
    } catch (error) {
      throw error;
    }
  }

  // Increment likes
  static async incrementLikes(moodboardId) {
    try {
      await db.query('UPDATE moodboards SET likes_count = likes_count + 1 WHERE moodboard_id = ?', [moodboardId]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MoodboardModel;
