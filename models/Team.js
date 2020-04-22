const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
  x: {
    type: String,
  },
  y: {
    type: String,
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  formation: [circleSchema],
  forum: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  finance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Month',
    required: true,
  }],
  notice:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notice',
  }],
  location: [],
  image: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
  description: {
    type: String,
    default: '',
  }
});

module.exports = mongoose.model('Team', teamSchema);
