const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Comment', 
    },
  ],
  content: { 
    type: String,
  },
  date: { 
    type: String,
   },
});

module.exports = mongoose.model('Post', postSchema);
