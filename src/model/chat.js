"use strict";
const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Chat = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    lastMessage: {
      type: String,
    },
    lastMessageDate: {
      type: Date,
    },

    chatId: {
      type: Number,
      ref: "Chat",
    },
    message: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

       
        receiverId: {
          type: Number,
          ref: "User",
        },
        messageText: {
          type: String,
          trim: true,
        },
        sendAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

Chat.plugin(aggregatePaginate);
mongoose.model("Chat", Chat);
