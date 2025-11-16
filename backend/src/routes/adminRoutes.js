const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Public admin login route
router.post('/login', adminController.adminLogin);

// Protected admin routes
router.use(adminAuth);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/logs', adminController.getLogs);

module.exports = router;
