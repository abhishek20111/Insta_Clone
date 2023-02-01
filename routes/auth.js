const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User_Schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config()



router.post('/signup', async(req, res)=>{
    const {name, userName, email, password} = req.body;
    if(!name|| !userName|| !email|| !password){
        return res.status(400).send({error: "Please Fill all data"})
    }

    const data = await User.findOne({$or: [{email: email},{userName: userName}]});
    if(data){
        return res.status(422).json({error: "user already exist"})
    }
    const pass = await bcrypt.hash(password, 12);
 
    const user = User({
        name,
        userName,
        email,
        password: pass
    })
    try{
        await user.save();
        res.status(201).json({message: "save data"});
    } catch (error){
         
        res.status(409).json({ message: error.message});  
    }
})

router.post('/signin', (req, res)=>{ 
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({error: "Please add email and password"})
    }

    User.findOne({email: email}).then((saveUser)=>{
        if(!saveUser){
            return res.status(422).json({error: "Invalid User"})
        }
        bcrypt.compare(password, saveUser.password).
        then((match)=>{
            if(match){
                // return res.status(200).json({message: "Signed In Successfully"})
                const token = jwt.sign({_id: saveUser.id}, process.env.jwt_secret_key);
                const {_id, name, email, userName} = saveUser

                res.json({token, user:{_id, name, email, userName}});
                console.log({token, user:{_id, name, email, userName}});
            }else{
                return res.status(422).json({error: "Invalid Credentials"})
            }
        })

    }).catch(err => console.log("error2 "+err))
})

module.exports = router;