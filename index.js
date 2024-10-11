const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/userLoginRoutes');
const authenticateToken = require('./middleware/auth');

const app = express();

require('dotenv').config(); 

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('Error connecting to MongoDB:', err));


app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);  // All authentication-related routes



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
