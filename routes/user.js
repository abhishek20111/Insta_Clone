//this file is mainly when one user visit on another user profile

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const USER = require("../models/model.js")
const POST = require("../models/posts.js")
const requireLogin = require("../middlewares/requireLogin.js")

router.get("/user/:id", (req, res)=>{
    USER.findOne({_id: req.params.id})
        .select("-password")
        .then(user => {
                POST.find({postedBy: req.params.id})
                .populate("postedBy", "_id")
                .exec((err, post)=>{
                    if(err){
                        return res.status(422).json({error: err})
                    }
                    res.status(200).json({user, post})
            })
        }).catch(err =>{
            return res.status(404).json({error: "User not Found"})
        })
})


//To follow user
router.put("/follow", requireLogin, (req, res)=>{
    console.log(req.body.followId);
    USER.findByIdAndUpdate(req.body.followId,{ // we have req.body from frontent
        $push: {followers: req.user._id}        // we have req.user from middle ware
    },{
        new: true
    },(err, result)=>{
        if(err){
            return res.status(422).json({error: err})
        }
        console.log("data666666666"+req.user._id+" "+req.body.followId)
        USER.findByIdAndUpdate(req.user._id,{
            $push: {following: req.body.followId}
        },{new : true})
        .then(result => res.json(result))
        // .then(result => ) 
        .catch(err => {return res.status(422).json({error: err})})
    }) 
})
//To unfollow user
router.put("/unfollow", requireLogin, (req, res)=>{
    USER.findByIdAndUpdate(req.body.followId,{ // we have req.body from frontent
        $pull: {followers: req.user._id}        // we have req.user from middle ware
    },{
        new: true
    },(err, result)=>{
        if(err){
            return res.status(422).json({error: err})
        }USER.findByIdAndUpdate(req.user._id,{
            $pull: {following: req.body.followId}
        },{new : true}).then(result => res.json(result))
        .catch(err => {return res.status(422).json({error: err})})
    }) 
})

//to uplad profile pic
router.put("/uploadProfilePic", requireLogin,(req, res)=>{
    USER.findByIdAndUpdate(req.user._id,{
        $set:{Photo: req.body.pic}
    },{
        new: true
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error: err})
        }else{
            res.json(result)
        }
    })
})

module.exports = router;