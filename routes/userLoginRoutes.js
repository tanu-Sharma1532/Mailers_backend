const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');
const authenticateToken = require('../middleware/auth');

// Route for login
router.post('/login', authController.login);
router.post('/signup',authController.signup);
router.post('/change-password',authenticateToken.auth,authController.changePassword)

module.exports = router;
