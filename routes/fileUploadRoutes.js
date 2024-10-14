const express = require('express');
const { upload, uploadImage } = require('../controllers/fileUploadController');

const router = express.Router();

// Define the route to upload the image
router.post('/image-upload', upload.single('image'), uploadImage);

module.exports = router;
