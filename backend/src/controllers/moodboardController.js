const MoodboardModel = require('../models/MoodboardModel');
const LogsModel = require('../models/LogsModel');

// Create moodboard
exports.createMoodboard = async (req, res) => {
  try {
    const { title, description, mood_category, tags, is_public } = req.body;
    const user_id = req.userId;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const moodboardId = await MoodboardModel.create({
      user_id,
      title,
      description,
      mood_category,
      tags,
      is_public
    });

    const moodboard = await MoodboardModel.findById(moodboardId);
    res.status(201).json({ message: 'Moodboard created successfully', moodboard });
  } catch (error) {
    console.error('Create moodboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all public moodboards
exports.getPublicMoodboards = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const moodboards = await MoodboardModel.getPublicMoodboards(limit, offset);
    res.json({ moodboards, count: moodboards.length });
  } catch (error) {
    console.error('Get public moodboards error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get moodboard by ID
exports.getMoodboardById = async (req, res) => {
  try {
    const moodboardId = req.params.id;
    const moodboard = await MoodboardModel.findById(moodboardId);

    if (!moodboard) {
      return res.status(404).json({ message: 'Moodboard not found' });
    }

    // Increment views
    await MoodboardModel.incrementViews(moodboardId);

    res.json({ moodboard });
  } catch (error) {
    console.error('Get moodboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's moodboards
exports.getUserMoodboards = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const moodboards = await MoodboardModel.getByUserId(userId, limit, offset);
    res.json({ moodboards, count: moodboards.length });
  } catch (error) {
    console.error('Get user moodboards error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update moodboard
exports.updateMoodboard = async (req, res) => {
  try {
    const moodboardId = req.params.id;
    const { title, description, mood_category, tags, is_public } = req.body;

    // Check if moodboard exists and belongs to user
    const moodboard = await MoodboardModel.findById(moodboardId);
    if (!moodboard) {
      return res.status(404).json({ message: 'Moodboard not found' });
    }

    if (moodboard.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this moodboard' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (mood_category !== undefined) updates.mood_category = mood_category;
    if (tags !== undefined) updates.tags = tags;
    if (is_public !== undefined) updates.is_public = is_public;

    const updated = await MoodboardModel.update(moodboardId, updates);

    if (!updated) {
      return res.status(400).json({ message: 'Failed to update moodboard' });
    }

    const updatedMoodboard = await MoodboardModel.findById(moodboardId);
    res.json({ message: 'Moodboard updated successfully', moodboard: updatedMoodboard });
  } catch (error) {
    console.error('Update moodboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete moodboard
exports.deleteMoodboard = async (req, res) => {
  try {
    const moodboardId = req.params.id;

    const moodboard = await MoodboardModel.findById(moodboardId);
    if (!moodboard) {
      return res.status(404).json({ message: 'Moodboard not found' });
    }

    if (moodboard.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this moodboard' });
    }

    const deleted = await MoodboardModel.delete(moodboardId);

    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete moodboard' });
    }

    res.json({ message: 'Moodboard deleted successfully' });
  } catch (error) {
    console.error('Delete moodboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like moodboard
exports.likeMoodboard = async (req, res) => {
  try {
    const moodboardId = req.params.id;

    const moodboard = await MoodboardModel.findById(moodboardId);
    if (!moodboard) {
      return res.status(404).json({ message: 'Moodboard not found' });
    }

    await MoodboardModel.incrementLikes(moodboardId);
    res.json({ message: 'Moodboard liked successfully' });
  } catch (error) {
    console.error('Like moodboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
