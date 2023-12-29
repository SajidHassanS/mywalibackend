"use strict";
const mongoose = require("mongoose"),
  requireWalk = require("./requireWalk").requireWalk;
const chalk = require("chalk");
const log = console.log;
// Mongoose connecting event

mongoose.set("strictQuery", false);
mongoose.connection.on("connecting", function () {
  // log("Mongoose connecting to ");
});

// Mongoose conneccted event
mongoose.connection.on("connected", function () {
  log(chalk.green("Mongoose connected "));
});

// Mongoose open event
mongoose.connection.once("open", function () {
  // console.log("Mongoose connection opened to ");
});

// Mongoose reconnected event
mongoose.connection.on("reconnected", function () {
  log(chalk.green("Mongoose reconnected to "));
});

// Mongoose disconnected event
mongoose.connection.on("disconnected", function () {
  log(chalk.red("Mongoose disconnected"));
});

// Mongoose error event
mongoose.connection.on("error", function (error) {
  log(chalk.red("Mongoose error: " + error));
  mongoose.disconnect();
});

const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
log(chalk.green("===== url ======", url));
mongoose.connect(url, {
  useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "%s MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

mongoose.Promise = global.Promise;
let requireModels = requireWalk(__dirname + "/../model");
requireModels();
