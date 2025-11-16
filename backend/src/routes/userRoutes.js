const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// User routes
router.get('/profile/:id?', userController.getUserProfile);
router.put('/profile', userController.updateProfile);
router.delete('/account', userController.deleteAccount);
router.get('/all', userController.getAllUsers);

module.exports = router;
