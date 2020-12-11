const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authRecruiter = require('../../middleware/authRecruiter');
const jwt = require('jsonwebtoken');
const config = require('config');

const { check, validationResult } = require('express-validator');

router.get('/', authRecruiter, async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.recruiter.id).select(
      '-password'
    );
    res.json(recruiter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let recruiter = await Recruiter.findOne({ email });

      if (!recruiter) {
        return res
          .status(400)
          .json({ errors: [{ msg: ' Invalid Crendentials ' }] });
      }

      const isMatch = await bcrypt.compare(
        password.toString(),
        recruiter.password
      );

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: ' Invalid Crendentials ' }] });
      }

      const payload = {
        recruiter: {
          id: recruiter.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
