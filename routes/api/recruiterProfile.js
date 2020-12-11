const express = require('express');
const router = express.Router();
const authRecruiter = require('../../middleware/authRecruiter');
const { check, validationResult } = require('express-validator');

const RecruiterProfile = require('../../models/RecruiterProfile');
const Recruiter = require('../../models/Recruiter');

router.get('/me', authRecruiter, async (req, res) => {
  try {
    const recruiterprofile = await RecruiterProfile.findOne({
      recruiter: req.recruiter.id
    }).populate('recruiter', ['name', 'email']);

    if (!recruiterprofile) {
      return res
        .status(400)
        .json({ msg: 'There is no profile for this recruiter' });
    }

    res.json(recruiterprofile);
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
      check('company', 'Company is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company, title } = req.body;

    const profileFields = {};
    profileFields.recruiter = req.recruiter.id;
    if (company) profileFields.company = company;
    if (title) profileFields.title = title;

    try {
      // Using upsert option (creates new doc if no match is found):
      let recruiterprofile = await RecruiterProfile.findOne({
        recruiter: req.recruiter.id
      });

      if (recruiterprofile) {
        // update
        recruiterprofile = await RecruiterProfile.findOneAndUpdate(
          { recruiter: req.recruiter.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(recruiterprofile);
      }

      recruiterprofile = new RecruiterProfile(profileFields);

      await recruiterprofile.save();
      return res.json(recruiterprofile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const recruiterprofiles = await RecruiterProfile.find().populate(
      'recruiter',
      ['name', 'email']
    );
    res.json(recruiterprofiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/recruiter/:recruiter_id', async (req, res) => {
  try {
    const recruiterprofile = await RecruiterProfile.findOne({
      recruiter: req.params.recruiter_id
    }).populate('recruiter', ['name', 'email']);

    if (!recruiterprofile)
      return res
        .status(400)
        .json({ msg: 'There is no profile for this recruiter' });

    res.json(recruiterprofile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/', authRecruiter, async (req, res) => {
  try {
    await RecruiterProfile.findOneAndRemove({ recruiter: req.recruiter.id });

    await Recruiter.findOneAndRemove({ _id: req.recruiter.id });
    res.json({ msg: 'recruiter deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
