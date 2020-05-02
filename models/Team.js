const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
  innerText: {
    type: String,
  },
  marginLeft: {
    type: String,
  },
  marginTop: {
    type: String,
  },
  // writer: {
  //   type: mongoose.Schema.Types.ObjectId,
  // },
});

const noticeSchema = new mongoose.Schema({
  content: { 
    type: String,
  },
  date: {
    type: String,
  },
});

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


const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
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
  notices: [noticeSchema],
  admin: { 
    type: mongoose.Schema.Types.ObjectId,
  },
  match: [matchSchema],
});

module.exports = mongoose.model('Team', teamSchema);
