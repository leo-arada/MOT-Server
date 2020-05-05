const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  verifiedToken: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('Token', tokenSchema);
