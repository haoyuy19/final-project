const mongoose = require('mongoose');

const RecruiterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  voted: {
    type: Boolean,
    default: false
  }
});

module.exports = Recruiter = mongoose.model('recruiter', RecruiterSchema);
