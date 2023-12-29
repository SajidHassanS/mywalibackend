const catchAsync = require("../utils/catchAsync");
const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation"),
  bcrypt = require("bcryptjs"),
  passport = require("passport"),
  _ = require("lodash");
const guid = require("guid");

const saltRounds = 10;
const TableName = "User";
const incrementalId = "userId";
let userFieldSendFrontEnd = [
  "_id",
  "email",
  "fullName",
  "phoneNumber",
  "role",
  "status",
  "createdAt",
];

const signIn = catchAsync(async (req, res, next) => {
  const data = req.body;
  console.log("=====", data);
  passport.authenticate("local", {}, (err, user, info) => {
    if (err || !user) {
      res.status(400).send({
        status: constant.ERROR,
        message: constant.EMAIL_PASSWORD_ERROR,
      });
      return;
    }
    req.logIn(user, async (err) => {
      if (err) {
        res.status(400).send({
          status: constant.ERROR,
          message: err.message,
        });
        return;
      }

      console.log("====== role =====", user.role, process.env.SUPER_ADMIN_URL);

      // if (
      //   user.role === "superAdmin" &&
      //   req.headers.origin !== process.env.SUPER_ADMIN_URL
      // ) {
      //   res.status(400).send({
      //     status: constant.ERROR,
      //     message: "Incorrect username or password",
      //   });
      //   return;
      // } else if (
      //   user.role === "principal" &&
      //   req.headers.origin !== process.env.PRINCIPAL_URL
      // ) {
      //   res.status(400).send({
      //     status: constant.ERROR,
      //     message: "Incorrect username or password",
      //   });
      //   return;
      // }

      if (user.status === "active") {
        let token = await user.generateAuthToken();
        let data = _.pick(user, userFieldSendFrontEnd);
        data.token = token;
        res.append("x-auth", token);
        res.append("Access-Control-Expose-Headers", "x-auth");

        res.status(200).send({
          status: constant.SUCCESS,
          message: constant.USER_LOGIN_SUCCESS,
          user: data,
        });
      } else {
        res.status(400).send({
          status: constant.ERROR,
          message: "your account is not active. kindly contact with admin",
        });
        return;
      }
    });
  })(req, res, next);
});

const signUp = catchAsync(async (req, res) => {
  const data = req.body;
  let user = null;
  data.status = "active";
  data[incrementalId] = await autoIncrement(TableName, incrementalId);

  
  // Calculate age from date of birth
  const dob = new Date(data.birthday);
  const ageDiffMs = Date.now() - dob.getTime();
  const ageDate = new Date(ageDiffMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  // Add age to user object
  data.age = age;

  if (data._id) {
    const password = await bcrypt.hash(data.password, saltRounds);
    data.password = password;
    user = await generalService.findAndModifyRecord(
      TableName,
      { _id: data._id },
      data
    );
  } else {
    user = await generalService.addRecord(TableName, data);
  }

  let token = await user.generateAuthToken();
  user.token = token;

  res.header({ "x-auth": token }).send({
    status: constant.SUCCESS,
    message: constant.USER_REGISTER_SUCCESS,
    user: _.pick(user, [
      "_id",
      "email",
      "token",
      "fullName",
      "role",
      "phoneNumber",
      "birthday",
      "age",
      
    ]),
  });
});


const getProfile = catchAsync(async (req, res) => {
  let aggregateArr = [
    { $match: { _id: req.user._id } },
    {
      $project: {
        fullName: 1,
        email: 1,
        address: 1,
        role: 1,
        phoneNumber: 1,
        myWali:1,
      },
    },
  ];
  let Record = await generalService.getRecordAggregate(TableName, aggregateArr);
  console.log("========", res.get("x-auth"));
  res.send({
    status: constant.SUCCESS,
    message: "Profile record fetch successfully",
    Record: Record[0],
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const data = req.body;
  const user = req.user;
  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: user._id },
    data
  );

  let aggregateArr = [
    { $match: { _id: Record._id } },
    {
      $project: {
        _id: 1,
        email: 1,
        fullName: 1,
        phoneNumber: 1,
        role: 1,
        status: 1,
        createdAt: 1,
        profileImageUrl: 1,
      },
    },
  ];
  let RecordObj = await generalService.getRecordAggregate(
    TableName,
    aggregateArr
  );
  res.status(200).send({
    status: constant.SUCCESS,
    message: constant.PROFILE_UPDATE_SUCCESS,
    Record: RecordObj[0],
  });
});

const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  let obj = req.body;
  const password = await bcrypt.hash(obj.password, saltRounds);

  const checkPassword = await generalService.getRecord(TableName, {
    _id: user._id,
  });

  await bcrypt
    .compare(obj.oldPassword, checkPassword[0].password)
    .then((result) =>
      result
        ? result
        : res.send({
            status: constant.ERROR,
            message: constant.OLD_PASSWORD_ERROR,
          })
    );

  const userObj = await generalService
    .updateRecord(
      "User",
      {
        _id: user._id,
      },
      {
        password: password,
      }
    )
    .then((value) => {
      console.log(value);
      res.send({
        status: constant.SUCCESS,
        message: constant.PASSWORD_RESET_SUCCESS,
      });
    })
    .catch((e) => {
      res.send({
        status: constant.ERROR,
        message: constant.PASSWORD_RESET_ERROR,
      });
    });
});

module.exports = {
  signUp,
  signIn,
  getProfile,
  updateProfile,
  changePassword,
};
