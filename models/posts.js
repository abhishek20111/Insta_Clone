const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userPost = new mongoose.Schema({
    body: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        require: true
    },
    likes:[{
        type:ObjectId,
        ref: "User_Schema"
    }],
    comments:[{
        comment: {type: String},
        postedBy:{type: ObjectId, ref: "User_Schema"}
    }],
    postedBy: {
        type: ObjectId,
        ref: "User_Schema"
    }
    
},{timestamps: true})

module.exports = mongoose.model('Post_User', userPost);