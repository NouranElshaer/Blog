const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Post = mongoose.model('Post')
const User = mongoose.model('User')


router.get('/user/:id',requireLogin,(req,res)=>{
    // Post.find().populate('postedBy','name')
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy", "_id name")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
        
        res.json({user})
    })
    
    .catch(err=>{
        // console.log(err)
        return res.status(422).json({error: "User Not Found!"})

    })
})

module.exports = router