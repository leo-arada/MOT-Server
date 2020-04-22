const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
   }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',
  }],
  content: { 
    type: String,
  },
  datae: { 
    type: Date,
   },
});

module.exports = mongoose.model('Post', postSchema);

