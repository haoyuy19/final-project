const express = require('express');
const router = express.Router();
const authRecruiter = require('../../middleware/authRecruiter');
const { check, validationResult } = require('express-validator');

const Job = require('../../models/Job');
const Recruiter = require('../../models/Recruiter');
const RecruiterProfile = require('../../models/RecruiterProfile');

router.post(
  '/',
  [
    authRecruiter,
    check('jobtitle', 'Jobtitle is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
    check('summary', 'Summary is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const recruiter = await Recruiter.findById(req.recruiter.id).select(
        '-password'
      );

      const newJob = new Job({
        recruiter: req.recruiter.id,
        name: recruiter.name,
        email: recruiter.email,
        jobtitle: req.body.jobtitle,
        summary: req.body.summary,
        skills: req.body.skills,
        responsibilites: req.body.responsibilites,
        salary: req.body.salary
      });

      const job = await newJob.save();

      res.json(job);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', authRecruiter, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', authRecruiter, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', authRecruiter, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check the recruiter owns the job
    if (job.recruiter.toString() !== req.recruiter.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await job.remove();

    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
