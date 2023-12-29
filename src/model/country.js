"use strict";
const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Country = new mongoose.Schema(
  {
    countryId: {
      type: Number,
      default: 1,
    },
    countryName: {
      type: String,
      lowercase: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
  }
);

Country.plugin(aggregatePaginate);
mongoose.model("Country", Country);
