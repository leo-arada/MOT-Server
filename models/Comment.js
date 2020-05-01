const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { 
    type: String,
  },
  name: {
    type: String,
  },
  writer: { 
    type: mongoose.Schema.Types.ObjectId,
   },
   postId: {
     type: String,
   }
});

module.exports = mongoose.model('Comment', commentSchema);
