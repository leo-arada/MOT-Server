const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { 
    type: String,
  },
  writer: { 
    type: mongoose.Schema.Types.ObjectId,
   },
});

module.exports = mongoose.model('Comment', commentSchema);
