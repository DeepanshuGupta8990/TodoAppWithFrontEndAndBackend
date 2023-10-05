const mongoose = require("mongoose");

const newUserSchema = mongoose.Schema({
    username : {
        type: String,
        required: true,
        min: 3,
        max: 20,
        // unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    todosArray:[
     {
        todo:{
            type:String,
        },
        id:{
            type:String,
        },
        date: {
            type:String
        }
     }
    ]
     
})

module.exports = mongoose.model('Users',newUserSchema);