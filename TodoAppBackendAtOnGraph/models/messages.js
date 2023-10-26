const mongoose = require("mongoose");

const messagesSchema = mongoose.Schema({
   username:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   messages: [
    {
       sender: String,
       receiver: String,
       type: String
    }
 ]
})

module.exports = mongoose.model('Messages',messagesSchema);