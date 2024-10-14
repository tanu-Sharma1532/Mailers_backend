const express = require('express');
const router = express.Router();
const { sendEmailToMultipleRecipients } = require('../controllers/mailSendingController');
const auth = require('../middleware/auth');

router.post('/send-emails',sendEmailToMultipleRecipients);

module.exports = router;
