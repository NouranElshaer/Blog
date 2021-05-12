const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Post = mongoose.model('Post')


router.get('/allposts',(req,res)=>{
    Post.find().populate('postedBy','name')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.post('/createpost',requireLogin,(req,res)=>{
    // console.log(req.body.name)
    const {title,body, picUrl} = req.body
    if(!title || !body || !picUrl){
       return res.status(422).json({error: "Enter all your data!"})
    }
    // console.log(req.user._id)
    // res.send('OK')
    // req.user.password = undefined
    const post = new Post({
        title,
        body,
        picUrl,
        postedBy: req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    }).catch(err=>{
        console.log(err)
    })

})

router.get('/myposts',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id}).populate('postedBy','_id name')
    .then(myposts=>{
        res.json({myposts})
        console.log(req.user)
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router