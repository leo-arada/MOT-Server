const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  content: { 
    type: String,
  },
  date: {
    type: Date,
  }
});

module.exports = mongoose.model('Notice', noticeSchema);
