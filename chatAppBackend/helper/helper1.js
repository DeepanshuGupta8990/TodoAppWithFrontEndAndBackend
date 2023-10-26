const mongoose = require("mongoose");
const MessageUser = require("../models/messages.js");

// Function to fetch messages with a specific sender
const getMessagesFromSender = async (sender, receiver) => {
  const messagesFromDB = await MessageUser.aggregate([
    {
      $match: {
        email: sender,
      },
    },
    {
      $unwind: "$messages",
    },
    {
      $match: {
        $or: [
          { "messages.sender": sender, "messages.receiver": receiver },
          { "messages.sender": receiver, "messages.receiver": sender },
        ],
      },
    },
    {
      $group: {
        _id: null,
        messages: { $push: "$messages" },
      },
    },
    {
      $project: {
        _id: 0,
        messages: { $slice: ["$messages", -200] } // Retrieve the last 10 messages
      }
    },
  ]);

  if (messagesFromDB.length > 0) {
    return { messages: messagesFromDB[0].messages };
  } else {
    return { messages: [] };
  }
};



module.exports = getMessagesFromSender;





// const mongoose = require("mongoose");
// const MessageUser = require("../models/messages.js");

// // Function to fetch messages with a specific sender
// const getMessagesFromSender = async (sender, receiver) => {
//   const messagesFromDB = await MessageUser.aggregate([
//     {
//       $match: {
//         email: sender
//       },
//     },
//     {
//       $unwind: "$messages"
//     },
//     {
//       $match: {
//         $or: [
//           { "messages.sender": sender, "messages.receiver": receiver },
//           { "messages.sender": receiver, "messages.receiver": sender }
//         ]
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         messages: { $push: "$messages" }
//       }
//     }
//   ]);

//   if (messagesFromDB.length > 0) {
//     return { messages: messagesFromDB[0].messages };
//   } else {
//     return { messages: [] };
//   }
// };
// module.exports = getMessagesFromSender;