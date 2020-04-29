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
  }
});

module.exports = mongoose.model('Team', teamSchema);
