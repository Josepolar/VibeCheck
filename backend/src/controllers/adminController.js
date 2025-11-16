const AdminModel = require('../models/AdminModel');
const UserModel = require('../models/UserModel');
const LogsModel = require('../models/LogsModel');
const generateToken = require('../utils/generateToken');

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await AdminModel.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!admin.is_active) {
      return res.status(403).json({ message: 'Admin account is deactivated' });
    }

    const isMatch = await AdminModel.verifyPassword(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await AdminModel.updateLastLogin(admin.admin_id);

    // Log the login
    await LogsModel.create({
      admin_id: admin.admin_id,
      action_type: 'admin_login',
      target_type: 'system',
      description: 'Admin logged in',
      ip_address: req.ip
    });

    const token = generateToken(admin.admin_id, 'admin');
    delete admin.password_hash;

    res.json({
      message: 'Admin login successful',
      admin,
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (admin view)
exports.getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const users = await UserModel.getAllUsers(limit, offset);
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin action)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await UserModel.deleteUser(userId);

    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete user' });
    }

    // Log the action
    await LogsModel.create({
      admin_id: req.adminId,
      action_type: 'user_deleted',
      target_type: 'user',
      target_id: userId,
      description: `Deleted user ID: ${userId}`,
      ip_address: req.ip
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const db = require('../config/db');

    // Get various counts
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [moodboardCount] = await db.query('SELECT COUNT(*) as count FROM moodboards');
    const [postCount] = await db.query('SELECT COUNT(*) as count FROM posts');
    const [reportCount] = await db.query('SELECT COUNT(*) as count FROM reports WHERE status = "pending"');

    res.json({
      totalUsers: userCount[0].count,
      totalMoodboards: moodboardCount[0].count,
      totalPosts: postCount[0].count,
      pendingReports: reportCount[0].count
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all logs
exports.getLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const logs = await LogsModel.getAllLogs(limit, offset);
    res.json({ logs, count: logs.length });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
