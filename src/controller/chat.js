const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const AppError = require("../utils/appError");

  _ = require("lodash");

const guid = require("guid");
const bcrypt = require("bcryptjs");

const TableName = "Chat";



const sendMessage = catchAsync(async (req, res) => {
  const data = req.body;
  console.log("==============",data);

  const Record = await generalService.findAndModifyRecord(
    TableName,
    { chatId: data.chatId},
    {$push:{message:data.message}}

  );


  res.send({
    status: constant.SUCCESS,
    message: "Record updated successfully",
    Record: Record,
  });
});

const fetchMessages = async (condition) => {
  
  const aggregateArray = [
    { $match: condition },
    {
      $project: {
        _id:1,
        chatId: 1,
        message: 1,
        createdAt:1,
        members:1,
    
      
      },
    },
    {
      $sort: { _id: -1 },
    },
  ];

  return await generalService.getRecordAggregate(TableName, aggregateArray);
};

const getUserChat = catchAsync(async (req, res) => {

  const data = JSON.parse(req.params.query);
  let limit = data.limit || 10;
  let condition = {};

  if (data.chatId) {
    condition = { chatId: data.chatId }; // Update the condition object
  }
  
  const Record = await fetchMessages(condition);
  
  res.send({
    status: constant.SUCCESS,
    Category: "Record fetch Successfully",
    Record: Record[0],
  });
});

module.exports = {
  sendMessage,
  getUserChat,
};
