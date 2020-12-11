const mongoose = require('mongoose');

const RecruiterProfileSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'recruiter'
  },

  company: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  }
});

module.exports = RecruiterProfile = mongoose.model(
  'recruiterprofile',
  RecruiterProfileSchema
);
