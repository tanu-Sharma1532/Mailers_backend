const mailSender = require('../utils/mailSender'); // Adjust the path as necessary

exports.sendEmailToMultipleRecipients = async (req, res) => {
    const { emails, subject, message, senderName } = req.body;

    // Validate input
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ message: 'A list of email addresses is required' });
    }
    if (!subject || !message) {
        return res.status(400).json({ message: 'Subject and message are required' });
    }

    try {
        // Pass the senderName to the mailSender function
        const emailPromises = emails.map(email => mailSender(email, subject, message, senderName));
        
        // Wait for all email promises to resolve
        await Promise.all(emailPromises);

        return res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error.message);
        return res.status(500).json({ message: 'Failed to send emails' });
    }
};
