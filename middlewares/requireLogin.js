const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

const USER = mongoose.model('User_Schema')
 
module.exports = (req, res, next) =>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error: "You must login first"});
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, process.env.jwt_secret_key, (err, payload)=>{
        if(err){
            return res.status(401).json({error: "You must login first error"});
        }
        const {_id} = payload;
        USER.findById(_id).then(userData =>{
            console.log(userData);
            req.user = userData 
            next()
        })
    })
}