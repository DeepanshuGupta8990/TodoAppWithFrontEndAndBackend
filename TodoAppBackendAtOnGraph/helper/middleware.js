const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const middleware = async(req,res,next)=>{
    const { email, password} = await req.body
    // console.log(password,'password')
    const checkUser = await User.findOne({email:email.toLowerCase()})
    if(checkUser){
        const isPasswordCorrect = await bcrypt.compare(password, checkUser.password);
        if(isPasswordCorrect){
            req.customData = checkUser;
            next();
        }else{
            res.json({status:401,msg:"Email or password are incorrect"})
        }
    }else{
        res.json({status:401,msg:"error"})
    }
 }

 module.exports = middleware