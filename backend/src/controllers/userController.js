const UserModel = require('../models/UserModel');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { full_name, bio, profile_picture } = req.body;

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (bio !== undefined) updates.bio = bio;
    if (profile_picture !== undefined) updates.profile_picture = profile_picture;

    const updated = await UserModel.updateProfile(userId, updates);

    if (!updated) {
      return res.status(400).json({ message: 'Failed to update profile' });
    }

    const user = await UserModel.findById(userId);
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (paginated)
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

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const deleted = await UserModel.deleteUser(userId);

    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete account' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
