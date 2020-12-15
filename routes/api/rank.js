const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const rankModel = require('../../models/Rank');
const User = require('../../models/User');

router.get('/', auth, (req, res) => {
  rankModel
    .find()
    .exec()
    .then(
      function (response) {
        res.status(200).send(response);
      },
      function (error) {
        res.status(404).send('Error');
      }
    );
});

router.get('/', async (req, res) => {
  try {
    const ranks = await Rank.find().populate('company', ['count']);
    res.json(ranks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/', auth, async (req, res) => {
  try {
    var body = req.body;
    var comName = body.company;
    let cur = await User.findOne({ _id: req.user.id });
    // console.log(cur.voted);

    if (!cur.voted) {
      cur = await User.findOneAndUpdate(
        { _id: req.user.id },
        { voted: true },
        { new: true }
      );
      user = new User(cur);
      await user.save();
      // console.log(cur);
      var comEntry = await rankModel.findOne({ company: comName });
      if (comEntry != null) {
        comEntry.count += 1;

        rankModel.create(comEntry);

        return res.status(200).send('Voted successfully');
      } else {
        rankModel.create(body);
        return res.status(200).send('Voted successfully');
      }
    } else {
      res.status(400).send('You have voted.');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
