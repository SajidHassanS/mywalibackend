"use strict";
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secretKey = process.env.SECRET_KEY;

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const User = new mongoose.Schema(
  {
    userId: {
      type: Number,
      default: 0,
    },

    fullName: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "active", "block", "delete", "rejected"],
      default: "active",
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["superAdmin", "groom", "wali", "bride"],
    },

    myWali: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    myFavorite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    ethnicity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ethnicity",
    },
    marital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marital",
    },
    mahr: {
      type: Boolean,
      default: false,
    },

    fav: {
      type: Boolean,
      default: false,
    },
    birthday: {
      type: Date,
    },
    age: {
      type:Number,
      
    },

    personalInformation: {
      type: Object,
    },
    bio: {
      type: String,
    },

    profileImageUrl: {
      type: String,
    },
    verification: {
      type: String,
    },
    relationStatus: {
      type: Object,
    },
    wifeDetails: {
      type: Object,
    },
    token: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    accountActivationDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
  }
);



User.methods.generateAuthToken = async function (extra = "") {
  let user = this;
  let access = "auth";

  let token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access,
        email: user.email,
        role: user.role,
        isDeleted: user.isDeleted,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        token: user.token,
      },
      secretKey,
      {
        expiresIn: "2d",
      }
    )
    .toString();
  user.token = token;
  user.lastLogin = new Date();
  user.loginStatus = "online";

  return user.save().then(() => {
    return token;
  });
};

//===================== Password hash middleware =================//
User.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });````````````````````````````````````````````
});

//===================== Helper method for validating user's password =================//
User.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  try {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
    });
  } catch (error) {
    console.log("=========== Error in Comparing Password", error);
  }
};

User.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, secretKey);
  } catch (error) {
    return Promise.reject(error);
  }

  return User.findOne({
    _id: decoded._id,
    token: token,
  });
};

mongoose.model("User", User);
