const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');
const authenticateToken = require('../middleware/auth');

// Route for login
router.post('/login', authenticateToken ,authController.login);

module.exports = router;
