const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  date: { 
    type: Date,
  },
  opponent: { 
    type: String,
  },
  location: {
    type: String,
  }, 
});

module.exports = mongoose.model('Match', matchSchema);
