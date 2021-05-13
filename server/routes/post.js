const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Post = mongoose.model('Post')


router.get('/allposts',requireLogin,(req,res)=>{
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
        photo:picUrl,
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

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})




    router.put('/unlike',requireLogin,(req,res)=>{
        Post.findByIdAndUpdate(req.body.postId,{
            $pull:{likes:req.user._id}
        },{
            new:true
        }).exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
    })








module.exports = router