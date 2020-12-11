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
  },
  jobs: [
    {
      jobtitle: {
        type: String,
        required: true
      },
      summary: {
        type: String,
        required: true
      },
      responsibilites: {
        type: String
      },
      skills: {
        type: [String],
        required: true
      },
      salary: {
        type: String
      }
    }
  ]
});

module.exports = RecruiterProfile = mongoose.model(
  'recruiterprofile',
  RecruiterProfileSchema
);
