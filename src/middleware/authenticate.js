const mongoose = require("mongoose");
const constant = require("../utils/constant");
const _ = require("lodash");

const authenticate = (req, res, next) => {
  const token = req.header("authorization");
  const User = mongoose.model("User");

  User.findByToken(token)
    .then(async (user) => {
      if (!user) {
        return Promise.reject();
      }
      let userObj = _.pick(user, ["_id", "email", "fullName", "role", "token" ,"myFavorite"]);
      req.user = userObj;
      req.token = token;
      next();
    })
    .catch((e) => {
      res.status(401).send({
        status: constant.ERROR,
        message: "Unauthorized User",
      });
    });
};

module.exports = { authenticate };
