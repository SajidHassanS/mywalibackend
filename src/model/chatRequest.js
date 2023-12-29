"use strict";
const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const ChatRequest = new mongoose.Schema(
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
    message: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        receiverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        messageText: {
          type: String,
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

ChatRequest.plugin(aggregatePaginate);
mongoose.model("ChatRequest", ChatRequest);
