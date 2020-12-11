const express = require('express');
const router = express.Router();
const authRecruiter = require('../../middleware/authRecruiter');
const { check, validationResult } = require('express-validator');

const Job = require('../../models/Job');
const Recruiter = require('../../models/Recruiter');

router.get('/iposted', authRecruiter, async (req, res) => {
  try {
    const job = await Job.findOne({
      recruiter: req.recruiter.id
    }).populate('recruiter', ['name', 'email', 'company']);

    if (!job) {
      return res.status(400).json({ msg: 'No job has been post yet' });
    }
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  [
    authRecruiter,
    [
      check('jobtitle', 'Jobtitle is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
      check('summary', 'Summary is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobtitle, summary, skills, responsibilites, salary } = req.body;

    const jdFields = {};
    jdFields.recruiter = req.recruiter.id;
    if (jobtitle) jdFields.jobtitle = jobtitle;
    if (summary) jdFields.summary = summary;
    if (responsibilites) jdFields.responsibilites = responsibilites;
    if (salary) jdFields.salary = salary;
    if (skills) {
      jdFields.skills = skills.split(',').map(skill => skill.trim());
    }

    try {
      let job = await Job.findOne({ recruiter: req.recruiter.id });

      if (job) {
        // update
        job = await Job.findOneAndUpdate(
          { recruiter: req.recruiter.id },
          { $set: jdFields },
          { new: true }
        );

        return res.json(job);
      }

      // Save the job
      job = new Job(jdFields);

      await job.save();
      return res.json(job);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'email']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'email']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'email']);

    if (!profile)
      return res.status(400).json({ msg: 'There is no profile for this user' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete and user
// @access  Private

router.delete('/', authRecruiter, async (req, res) => {
  try {
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private

router.put(
  '/experience',
  [
    authRecruiter,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', authRecruiter, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
