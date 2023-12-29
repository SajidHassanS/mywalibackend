"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SiteActivity = Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
mongoose.model("SiteActivity", SiteActivity);
