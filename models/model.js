const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    userName:{
        type: String,
        require: true,
        
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    Photo:{
        type:String,
    },
    followers:[{
        type:ObjectId,
        ref: "User_Schema"
    }],
    following:[{
        type:ObjectId,
        ref: "User_Schema"
    }]

},{timestamps: true})

module.exports = mongoose.model('User_Schema', userSchema);