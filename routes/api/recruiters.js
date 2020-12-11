const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Recruiter = require('../../models/Recruiter');

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let recruiter = await Recruiter.findOne({ email });

      if (recruiter) {
        return res
          .status(400)
          .json({ errors: [{ msg: ' This Recruiter already exists ' }] });
      }

      recruiter = new Recruiter({
        name,
        email,
        password
      });

      // Encrypt password

      const salt = await bcrypt.genSaltSync(10);

      recruiter.password = await bcrypt.hashSync(password.toString(), salt);

      await recruiter.save();

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
