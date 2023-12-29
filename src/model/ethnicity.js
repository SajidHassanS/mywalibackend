"use strict";
const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Ethnicity = new mongoose.Schema(
  {
    ethnicityId: {
      type: Number,
      default: 1,
    },
    ethnicityName: {
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

Ethnicity.plugin(aggregatePaginate);
mongoose.model("Ethnicity", Ethnicity);
