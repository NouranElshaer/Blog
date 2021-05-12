const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_secrt} = require('../keys')
const requireLogin = require('../middlewares/requireLogin')

router.get('/',(req,res)=>{
    res.send('Hello Router1!')
})
router.get('/protected',requireLogin,(req,res)=>{
    res.send('Hello user!')
})

router.post('/signup',(req,res)=>{
    // console.log(req.body.name)
    const {name,email,password} = req.body
    if(!email || !password || !name){
       return res.status(422).json({error: "Enter all your data!"})
    }
    // res.json({message:"Success Posted"})
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error: "User already exists with this Email!"})
        }

        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,//email(keyword):email(data from body)
                password:hashedpassword,
                name
            })
    
            user.save().then(user=>{
                res.json({message:"Signed UP Successfully"})
            }).catch(err=>{
                console.log(err)
            })
        })
        
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error: "Please enter your data!"})
    }
    // res.json({message:"Success Posted"})
    User.findOne({email:email})
    .then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error: "Invalid Email or Password!"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // res.json({message:"Success LogIn"})
                const token = jwt.sign({_id:savedUser._id},JWT_secrt)
                const {_id, name, email} = savedUser;
                res.json({token, user:{_id,name,email}})
            }
            else{
                return res.status(422).json({error: "Invalid Email or Password!"})
             }
        })
        
        
    }).catch(err=>{
        console.log(err)
    })
})
module.exports = router