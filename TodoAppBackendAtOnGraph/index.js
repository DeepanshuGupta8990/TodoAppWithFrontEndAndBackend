const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const User = require("./models/userModel.js");
const bcrypt = require("bcrypt");
const middleware = require("./helper/middleware.js"); 


const app = express()
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://deepanshugupta899:ZxEBEU2tZW5sI9BF@cluster0.ki6bgeh.mongodb.net/todoApp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("DB connected");
}).catch((err)=>{
    console.log(err);
})



app.get("/",(req,res)=>{
    res.send("sdsadsa")
})
app.post('/login',async(req,res)=>{
    // console.log('login request arrived')
    const { email, password} = await req.body
    const checkUser = await User.findOne({email:email.toLowerCase()})
    if(checkUser){
        const isPasswordCorrect = await bcrypt.compare(password, checkUser.password);
        if(isPasswordCorrect){
            res.json({status:201,msg:"You can login"})
        }else{
            res.json({status:401,msg:"Email or password are incorrect"})
        }
    }else{
        res.json({status:401,msg:"Email or password are incorrect"})
    }
})
app.post('/signup',async(req,res)=>{
    // console.log('signup request arrived')
    try{
        const {username, email, password} = await req.body
        // console.log(username,password,email);
        const checkUser = await User.findOne({email:email.toLowerCase()})
        if(checkUser){
            res.json({status:401,msg:"User already exist"})
        }else{
            const hashedPassword = await bcrypt.hash(password,10);
            const newUserCreated =  await User.create({
                username,
                email:email.toLowerCase(),
                password:hashedPassword,
               })
            //    console.log(newUserCreated)
            res.json({status:201,msg:"User created succesfully"})
        }
    }catch(err){
        res.json({status:301,msg:err.message})
    }
})

app.post('/add',middleware,async(req,res)=>{
    const {todoArray,email} = req.body;
    const userInfo = req.customData 
    const result = await User.updateOne({_id:userInfo._id},{$set:{todosArray:todoArray}})
    const updatedArray = await User.findOne({email:email.toLowerCase()});
    // console.log(result)
    res.json({status:201,msg:"Todo add succesfully",todosArray:updatedArray.todosArray})
})

app.post("/getTodos",middleware,async(req,res)=>{
    // console.log('request arrived')
    const userInfo = req.customData;
    const todoArray = userInfo.todosArray
    // console.log(todoArray)
    res.json({todosArray:todoArray,status:200});
})
app.post("/deleteTodo",middleware,async(req,res)=>{
    // console.log('request arrived')
    const {todoArray} = req.body;
    const userInfo = req.customData 
    const result = await User.updateOne({_id:userInfo._id},{$set:{todosArray:todoArray}})
    if(result.acknowledged){
        res.json({msg:'Todo deleted succesfully',status:200});
    }else{
        res.json({msg:'Todo deletion failed',status:401});
    }
})
app.post("/updateTodo",middleware,async(req,res)=>{
    // console.log('request arrived')
    const {todoArray,email} = req.body;
    const userInfo = req.customData 
    const result = await User.updateOne({_id:userInfo._id},{$set:{todosArray:todoArray}})
    const updatedArray = await User.findOne({email:email.toLowerCase()});
    if(result.acknowledged){
        res.json({msg:'Todo deleted succesfully',status:200,todosArray:updatedArray.todosArray});
    }else{
        res.json({msg:'Todo upgradation failed',status:401});
    }
})

app.listen(4500,()=>{
    console.log("The server is running on 4500 port")
}) 