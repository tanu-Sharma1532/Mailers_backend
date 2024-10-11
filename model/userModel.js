// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for a User
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 8);
  next();
});

// Method to compare the password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
