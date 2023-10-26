const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const User = require("./models/userModel.js");
const MessageUser = require("./models/messages.js");
const bcrypt = require("bcrypt");
const middleware = require("./helper/middleware.js"); 
const socket = require("socket.io");

const app = express()
app.use(cors());
app.use(express.json());

mongoose.connect('USE_YOUR_MONGO_URL_HERE',{
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
            const newUserInMessagesCreated = await MessageUser.create({
                username,
                email:email.toLowerCase(),
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

const server = app.listen(4500,()=>{
    console.log("The server is running on 4500 port")
}) 



global.onlineUsers = new Map();
global.onlineUsers2 = new Map();

const io = socket(server, {
    cors: {
      origin: '*',
    },
    pingInterval: 2000,
    pingTimeout: 5000,
  });

  io.on('connection', (socket) => {
    console.log('user arrived')

    socket.on('messageFromClient', (data) => {
        // console.log('Data received from the client: ' , data);
        onlineUsers.set(data, socket.id);
        onlineUsers2.set(socket.id, data);
        let connectedUsers = [];
        onlineUsers.forEach((value, key) => {
            if(data.email!==key.email){
                connectedUsers.push(key)
            }
          });
        socket.broadcast.emit("newUser",data)
        // console.log(connectedUsers)
        io.to(socket.id).emit('connectedUsersList',connectedUsers)
    });

    socket.on("selectUser",(user)=>{
        console.log(user)
        const requiredSocketID = onlineUsers.get(user);
        console.log(requiredSocketID)
        // socket.broadcast.emit("selectedUser",user)
        onlineUsers.forEach((value, key) => {
            if(user.email===key.email){
                io.to(value).emit('selectedUser',user)
                console.log(value)
            }})
    })

    socket.on("RejectConnection",(data)=>{
        console.log(data)
        onlineUsers.forEach((value, key) => {
            if(data.user.senderEmail===key.email){
                console.log('done')
                io.to(value).emit('RejectConnectionMsg',data.text)
            }
          });
    })
    
    socket.on("initiatingVideoCall",(data)=>{
        onlineUsers.forEach((value, key) => {
            if(data.email===key.email){
                io.to(value).emit('recievingVideoCall',data)
            }
          });
    })

    socket.on('rejectVideoCall',(data)=>{
        // console.log(data)
        onlineUsers.forEach((value, key) => {
            if(data.user.senderEmail===key.email){
                io.to(value).emit('recievingAnswerFromVideoCall',{...data,accepted:false})
            }
          });
    })

    socket.on('acceptedVideoCall',(data)=>{

        onlineUsers.forEach((value, key) => {
            if(data.user.senderEmail===key.email){
                io.to(value).emit('recievingAnswerFromVideoCall',{...data,accepted:true})
            }
          });
    })

    socket.on('sendingPeerID',(data)=>{
        console.log('dataa we are looking for',data)
        onlineUsers.forEach((value, key) => {
            if(data.email===key.email){
                io.to(value).emit('recievingPeerId',data)
            }
          });
    })



    socket.on('disconnect', () => {
        console.log('user disconnected')
        const userToDelete = onlineUsers2.get(socket.id)
        console.log(userToDelete)
        socket.broadcast.emit("userDisconnected",userToDelete)
        onlineUsers2.delete(socket.id);
        onlineUsers.delete(userToDelete);
      })
  })

