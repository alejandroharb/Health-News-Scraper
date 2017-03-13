var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    body: {
        type: String,
        require: true,
        unique: true
    }
})

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;