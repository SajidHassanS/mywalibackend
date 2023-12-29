"use strict";
const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Marital = new mongoose.Schema(
  {
    maritalId: {
      type: Number,
      default: 1,
    },

    maritalStatus: {
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

Marital.plugin(aggregatePaginate);
mongoose.model("Marital", Marital);
