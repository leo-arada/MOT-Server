const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  yearAndMonth: {
    type: String
  },
  income: { 
    type: String,
  },
  outcome: { 
    type: String,
  },
  fieldFee: {
    type: String,
  },
  foodFee: {
    type: String,
  },
  ect: {
    type: String,
  },
  equipmentFee: {
    type: String,
  }
});

module.exports = mongoose.model('Finance', financeSchema);
