const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'recruiter'
  },
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
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Job = mongoose.model('job', JobSchema);
