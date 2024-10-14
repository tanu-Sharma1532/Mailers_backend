const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/userLoginRoutes');
const mailroutes = require('./routes/mailSendingRoutes');
const imageUploadRoutes = require('./routes/fileUploadRoutes')
const authenticateToken = require('./middleware/auth');

const app = express();

require('dotenv').config(); 

mongoose.connect("mongodb+srv://mais:7xgMYUW5c7qLa5V3@cluster0.a7umbig.mongodb.net/mailers?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('Error connecting to MongoDB:', err));


app.use(bodyParser.json());
app.use('/images', express.static('public/images'));


// Routes
app.use('/auth', authRoutes);  
app.use('/mails',mailroutes);
app.use('/upload', imageUploadRoutes);

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
