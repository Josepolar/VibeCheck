const express = require('express');
const router = express.Router();
const moodboardController = require('../controllers/moodboardController');
const auth = require('../middleware/auth');

// Public routes
router.get('/public', moodboardController.getPublicMoodboards);
router.get('/:id', moodboardController.getMoodboardById);

// Protected routes
router.use(auth);

router.post('/', moodboardController.createMoodboard);
router.get('/user/:userId?', moodboardController.getUserMoodboards);
router.put('/:id', moodboardController.updateMoodboard);
router.delete('/:id', moodboardController.deleteMoodboard);
router.post('/:id/like', moodboardController.likeMoodboard);

module.exports = router;
