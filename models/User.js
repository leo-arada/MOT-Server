const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
  },
  email: {
    type: String,
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }],
  password: {
    type: String,
  }
});

module.exports = mongoose.model('User', userSchema);
