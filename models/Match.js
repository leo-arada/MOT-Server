const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  date: { 
    type: String,
  },
  time: {
    type: String
  },
  opponent: { 
    type: String,
  },
  location: [],
});

module.exports = mongoose.model('Match', matchSchema);
