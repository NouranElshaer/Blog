const jwt = require('jsonwebtoken')
const { JWT_secrt } = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
   const {authorization} =req.headers
    //authorization === blog token
   if(!authorization){
       res.status(401).json({error:"you must be loggin!"})
   }
   const token = authorization.replace("blog ", "")
   jwt.verify(token, JWT_secrt, (err,payload)=>{
       if(err){
           res.status(401).json({error:"you must be login!"})
       }

       const {_id} = payload
       User.findById(_id).then(userdata=>{
           req.user = userdata
           next()
       })
    //    next() //not in the right place
   })
}