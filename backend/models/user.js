const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  displayName: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String, // Hashed password
  plainPassword: String, // New field for storing plain password
  role: String,
  registeredModules: Array, // List of modules the user has access to
});

const User = mongoose.model('User', userSchema);

module.exports = User;