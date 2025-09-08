const express = require('express')
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken'); 

const router = express.Router()

router.post('/register',async (req,res)=>{
    const {username, password} = req.body
    const user  = await userModel.create({
        username,password
    })

    const token = jwt.sign({
        id:user._id,

    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        message:"user registered successfully",
        user
    })
})
router.post("/login",async (req,res)=>{
    const {username, password} = req.body

    const users = await userModel.findOne({
        username: username
    })

    if(!users){
        return res.status(401).json({
            message: "user doesn't exists"
        })
    }

    const isPasswordValid = password == users.password;
    if(!isPasswordValid){
         return res.status(401).json({
            message: "invalid password"
        })
    }
    res.status(200).json({
            message: "user logged in successfully"
        })
})
router.get("/user",async (req,res)=>{
    const {token} = req.cookies

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET )
        const user = await userModel.findOne({
            _id: decoded.id
        }).select("-password -__v")
        res.status(200).json({
            message: "user data fetched successfully",
            user
        })
    }
    catch(err){
        res.status(401).json({
            message: "Unauthorized, Invalid User "
        })
    }
})

module.exports = router 