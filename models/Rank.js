const mongoose = require('mongoose');

const RankSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,

  },
  count: {
      type: Number,
      //required:true,
      
  }
  
  
});

module.exports = Rank = mongoose.model('rank', RankSchema);