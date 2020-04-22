const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }
});

module.exports = mongoose.model('User', userSchema);
