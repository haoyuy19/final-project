const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// const rankSchema = require('../../config/rankModel');


const rankModel = require('../../models/Rank');
const User = require('../../models/User');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/', (req, res) => {
    rankModel.find().exec().then(
        function(response) {
            res.status(200).send(response);
        },
        function (error) {
            res.status(404).send('Error');
        }
    )
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

  router.put('/', async(req, res) => {
    try {
        var body = req.body;
      var comName = body.company;
      //const ranks = await Rank.find().populate('company', ['count']);
      //console.log(body.count);
      var comEntry = await rankModel.findOne({company: comName})
      if (comEntry != null) {
        comEntry.count += 1;
        console.log(comEntry);
        console.log(rankModel.findOne({company: comName}));
        // rankModel.findOneAndDelete({company: comName}, function (err, docs) {
        //     if (err) {
                
        //         console.log(err);
        //     }
        // })
        rankModel.create(comEntry)
        //console.log(rankModel.findOne({company: comName}));
        return res.status(200).send('update successfully');

      } else {
        rankModel.create(body);
        return res.status(200).send('update successfully');
      }
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });
      
  

module.exports = router;