const mongoose = require('mongoose');

const monthSchema = new mongoose.Schema({
  income: { 
    type: Number,
  },
  outcome: { 
    type: Number,
  },
  filedRentFee: {
    type: Number,
  },
  food: {
    type: Number,
  },
  ect: {
    type: Number,
  },
  equipment: {
    type: Number,
  }
});

module.exports = mongoose.model('Month', monthSchema);
