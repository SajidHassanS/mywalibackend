const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation"),
  _ = require("lodash");

const catchAsync = require("../utils/catchAsync");
const { autoIncrement, getDetailsById } = require("../utils/commonFunctions");
const guid = require("guid");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

const TableName = "User";
const saltRounds = 10;
const incrementalId = "userId"; // id is auto incremented

// fetch table list function

const fetchTableDataListAndCard = async (
  tableDataCondition,
  cardsCondition,
  paginationCondition,
  searchCondition
) => {
  let limit = paginationCondition.limit || 10; // The Number Of Records Want To Fetch
  let skipPage = paginationCondition.skipPage || 0; // The Number Of Page Want To Skip
  const aggregateArray = [
    {
      $match: {
        status: {
          $ne: "delete",
        },
      },
    },
    {
      $facet: {
        total: [{ $match: cardsCondition }, { $count: "total" }],

        cards: [
          { $match: cardsCondition },
          {
            $group: {
              _id: null,
              totalActive: {
                $sum: {
                  $cond: [{ $eq: ["$status", "active"] }, 1, 0],
                },
              },
              totalBlock: {
                $sum: {
                  $cond: [{ $eq: ["$status", "block"] }, 1, 0],
                },
              },
              totalReject: {
                $sum: {
                  $cond: [{ $eq: ["$status", "reject"] }, 1, 0],
                },
              },

              total: {
                $sum: 1,
              },
            },
          },
        ],

        tableData: [
          { $match: tableDataCondition },

          {
            $project: {
              _id: 1,
              userId: 1,
              fullName: 1,
              email: 1,
              phoneNumber: 1,
              address: 1,
              birthday: 1,
              accountType: 1,
              gender: 1,
              role: 1,
              personalInformation: 1,
              status: 1,
            },
          },
          {
            $sort: { _id: -1 },
          },
          // search from project
          {
            $match: searchCondition,
          },
          { $skip: skipPage },
          { $limit: limit },
        ],
      },
    },
  ];
  return await generalService.getRecordAggregate("User", aggregateArray);
};

// end fetch table list function

const userDetail = [
  "_id",
  "userId",
  "email",
  "fullName",
  "role",
  "status",
  "createdAt",
  "accountType",
  " address",
  "token",
  "birthday",
];

// ==================== Fetch all users list ====================//
const fetchUserList = async (condition) => {
  const aggregateArray = [
    { $match: condition },
    {
      $project: {
        userId: 1,
        fullName: 1,
        profileImageUrl: 1,
        phoneNumber: 1,
        status: 1,
        email: 1,
        accountType: 1,
        address: 1,
        token: 1,
        emergencyContact: 1,
        personalInformation: 1,
        salaryInformation: 1,
        experienceInformation: 1,
        educationInformation: 1,
      },
    },
    {
      $sort: { _id: -1 },
    },
  ];

  return await generalService.getRecordAggregate(TableName, aggregateArray);
};

// ==================== Get Record and search conditions ====================//
const getUsers = catchAsync(async (req, res) => {
  const data = JSON.parse(req.params.query);
  // const data = req.body;
  console.log(data);
  const user = req.user;
  let tableDataCondition = {};
  let searchCondition = {};

  // Variables For Pagination
  let limit = parseInt(data.limit);
  let skipPage = limit * (parseInt(data.pageNumber) - 1);
  let paginationCondition = {
    limit: limit,
    skipPage: skipPage,
  };

  if (data.name) {
    searchCondition = {
      $expr: {
        $regexMatch: {
          input: {
            $concat: ["$fullName", "$email", { $toString: "$userId" }],
          },
          regex: `.*${data.name}.*`,
          options: "i",
        },
      },
    };
  }

  // Search Filter With Status
  if (data.key === "status" && data.value && data.value !== "all") {
    searchCondition["status"] = data.value;
  }

  const Record = await fetchTableDataListAndCard(
    tableDataCondition,
    {},
    paginationCondition,
    searchCondition
  );

  // Formatting Data For Pagination
  let dataObj = {};
  const tableDataRecord = Record[0].tableData;
  if (tableDataRecord && tableDataRecord.length > 0) {
    let metaData = Record[0].total;
    dataObj = {
      page: parseInt(parseInt(metaData[0].total) / limit),
    };
  }
  Record[0].page = dataObj.page;
  // Check if variable Total in record has no length then assign 0
  if (Record[0].total.length == 0) {
    Record[0].total[0] = {
      total: 0,
    };
  }
  Record[0].total = Record[0].total[0].total;
  res.send({
    status: constant.SUCCESS,
    message: "User record fetch successfully",
    Record: Record[0],
  });
});

// ==================== update user record ====================//
const updateUsers = catchAsync(async (req, res) => {
  const data = req.body;
  const userId = req.user._id;

  data.updatedAt = Date.now();
  data.updatedBy = userId;
  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: data._id },
    data
  );
  const RecordAll = await fetchTableDataListAndCard(
    {
      _id: Record._id,
    },
    {},
    {},
    {}
  );

  res.send({
    status: constant.SUCCESS,
    message: "Record updated successfully",
    Record: RecordAll[0],
  });
});

// ==================== activate user account ====================//
const activeUserAccount = catchAsync(async (req, res) => {
  const data = req.body;
  data.accountActivationDate = Date.now();
  data.status = "active";
  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: data._id },
    data
  );
  const RecordAll = await fetchTableDataListAndCard(
    {
      _id: Record._id,
    },
    {},
    {},
    {}
  );
  res.send({
    status: constant.SUCCESS,
    message: "Account activated successfully",
    Record: RecordAll[0],
  });
});

/*                              add user record                                       */
/* ************************************************************************************** */
const addUsers = catchAsync(async (req, res) => {
  const data = req.body;
  console.log("=====data", data);
  data[incrementalId] = await autoIncrement(TableName, incrementalId);
  const Record = await generalService.addRecord(TableName, data);
  res.send({
    status: constant.SUCCESS,
    message: "Record added successfully",
    Record: Record,
  });
});

/*                              delete user record                                       */
/* ************************************************************************************** */
const deleteUsers = catchAsync(async (req, res) => {
  const data = req.body;
  const userId = req.user._id;
  let cardsCondition = {};
  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: data._id },
    { status: "delete" }
  );
  const RecordAll = await fetchTableDataListAndCard(
    { _id: Record._id },
    cardsCondition,
    {},
    {}
  );
  res.send({
    status: constant.SUCCESS,
    message: "User deleted successfully",
    Record: {
      tableData: [{ _id: data._id }],
      cards: RecordAll[0].cards,
      total: RecordAll[0].total,
    },
  });
});

/*                              resetpassword user record                                       */
/* ************************************************************************************** */
const resetPassword = catchAsync(async (req, res) => {
  let data = req.body;
  const password = await bcrypt.hash(data.password, saltRounds);
  const userObj = await generalService.updateRecord(
    "User",
    {
      _id: data._id,
    },
    {
      password: password,
    }
  );

  if (userObj) {
    let record = await fetchUserList({ _id: userObj._id });
    res.status(200).send({
      status: constant.SUCCESS,
      message: "Password Set Successfully",
      Record: record,
    });
  } else {
    throw new AppError("Some error occur while setting password ", 400);
  }
});

/* ************************************************************************************** */
/*                               get  details by his id                            */
/* ************************************************************************************** */
const getUserDetailById = catchAsync(async (req, res) => {
  const  userId  = req.query._id;
  if (userId) {
    const UserRecord = await getDetailsById(userId);
    res.send({
      status: constant.SUCCESS,
      message: "User details fetch successfully",
      Record: UserRecord[0],
    });
  } else {
    res.send({
      status: constant.ERROR,
      message: "Something went wrong while fetching User details",
    });
  }
});

// ==================== Get groom Record  ====================//
const AddGroom = catchAsync(async (req, res) => {
  const data = req.body;
  const userId = await generalService.getLimitedAndSortedRecord(
    "User",
    {},
    { userId: -1 },
    1
  );

  if (userId && userId.length > 0) {
    data["userId"] = parseInt(userId[0].userId) + 1;
  }

  const addGroom = await generalService.addRecord("User", data);

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch successfully",
    Record: addGroom,
  });
});

const getAllGroom = catchAsync(async (req, res) => {
  let data = req.params.query ? JSON.parse(req.params.query) : {};
  const user = req.user;
  let tableDataCondition = { role: "groom" };
  let searchCondition = {};

  // Variables For Pagination
  let limit = parseInt(data.limit) || 10; // set default limit to 10
  if (limit <= 0) {
    // ensure that limit is positive
    return res.send({
      status: "ERROR",
      message: "Limit must be a positive number",
    });
  }
  let skipPage = limit * (parseInt(data.pageNumber) - 1);
  let paginationCondition = {
    limit: limit,
    skipPage: skipPage,
  };

  if (data.name) {
    searchCondition["$expr"] = {
      $regexMatch: {
        input: {
          $concat: ["$fullName", "$email", { $toString: "$userId" }],
        },
        regex: `.*${data.name}.*`,
        options: "i",
      },
    };
  }

  // Search Filter With Status
  if (data.key === "status" && data.value && data.value !== "all") {
    searchCondition["status"] = data.value;
  }

  const Record = await fetchTableDataListAndCard(
    tableDataCondition,
    {},
    {},
    {}
  );

  // Formatting Data For Pagination
  let dataObj = {};
  const tableDataRecord = Record[0].tableData;
  if (tableDataRecord && tableDataRecord.length > 0) {
    let metaData = Record[0].total;
    dataObj = {
      page: parseInt(parseInt(metaData[0].total) / limit),
    };
  }
  Record[0].page = dataObj.page;
  // Check if variable Total in record has no length then assign 0
  if (Record[0].total.length == 0) {
    Record[0].total[0] = {
      total: 0,
    };
  }
  Record[0].total = Record[0].total[0].total;
  res.send({
    status: constant.SUCCESS,
    message: "Record fetch successfully",
    Record: Record[0],
  });
});

// ==================== Get favourite list Record  ====================//

const getFavouriteList = catchAsync(async (req, res) => {
  const user = req.user;
  const favoriteGrooms = user.myFavorite || [];
  const limit = parseInt(req.query.limit) || 10;
  const skip = (parseInt(req.query.pageNumber) - 1) * limit;

  let tableDataCondition = {
    _id: { $in: favoriteGrooms },
    role: "groom",
  };

  const searchCondition = {
    role: "groom",
  };

  if (req.query.name) {
    searchCondition["$expr"] = {
      $regexMatch: {
        input: {
          $concat: ["$fullName", "$email", { $toString: "$userId" }],
        },
        regex: `.*${req.query.name}.*`,
        options: "i",
      },
    };
  }

  let aggregate = [
    { $match: tableDataCondition },
    {
      $lookup: {
        from: "countries",
        let: { countryId: "$countryId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$countryId"] },
            },
          },
          {
            $project: {
              _id: 1,
              countryName: 1,
            },
          },
        ],
        as: "countryDetails",
      },
    },
    {
      $project: {
        _id: 1,
        name: "$fullName",
        countryName: { $arrayElemAt: ["$countryDetails.countryName", 0] },
        age: 1,
        profileImageUrl: 1,
        fav: 1,
      },
    },
    {
      $sort: { _id: -1 },
    },
  ];

  const groomRecords = await generalService.getRecordAggregate(
    TableName,
    aggregate
  );
  groomRecords.map((Item) => {
    Item.fav = true;
  });
  res.send({
    status: constant.SUCCESS,
    message: "Records fetched successfully",
    Record: {
      tableData: groomRecords,
      page: 1,
    },
  });
});

const manageFavouritePeople = catchAsync(async (req, res) => {
  const data = req.body;
  const userId = req.user._id;
  const groomId = req.body.groomId;
  //const userId = mongoose.Types.ObjectId("644b97ae5237a8276094a14d");
  //const groomId = mongoose.Types.ObjectId("644b980c5237a8276094a169");
  const favourite = await generalService.getRecord(TableName, { _id: userId });

  if (favourite && favourite.length > 0) {
    const isAlreadyFavourite = favourite[0].myFavorite.includes(groomId);

    if (isAlreadyFavourite) {
      await generalService.findAndModifyRecord(
        TableName,
        { _id: userId },
        {
          $pull: {
            myFavorite: groomId,
          },
        }
      );
    }

    await generalService.findAndModifyRecord(
      TableName,
      { _id: userId },
      {
        $addToSet: {
          myFavorite: groomId,
        },
      }
    );
  }

  res.send({
    status: constant.SUCCESS,
    message: "Record added successfully",
    Record: favourite,
  });
});

const addFavourite = catchAsync(async (req, res) => {
  const user = req.user;
  const groomId = new mongoose.Types.ObjectId(req.body._id);

  let myFavorite = user.myFavorite;
  let checkExit = myFavorite.includes(groomId);
  if (checkExit) {
    myFavorite = myFavorite.filter((x) => String(x) !== String(groomId));
  } else {
    myFavorite.push(groomId);
  }

  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: user._id },
    { myFavorite }
  );

  res.send({
    status: constant.SUCCESS,
    message: "Groom added to favorites",
    Record: { _id: groomId },
  });
});

//==================== Get groom Record  ====================//

const getGroomDetails = catchAsync(async (req, res) => {
  const _id = req.params.query;

  if (_id) {
    const UserRecord = await getDetailsById(_id);
    res.send({
      status: constant.SUCCESS,
      message: "User details fetch successfully",
      Record: UserRecord[0],
    });
  } else {
    res.send({
      status: constant.ERROR,
      message: "Something went wrong while fetching User details",
    });
  }
});

const searchGroom = catchAsync(async (req, res) => {
  let data = JSON.parse(req.params.query);
  const user = req.user;

  let tableDataCondition = {};
  let searchCondition = {
    role: "groom",
  };

  // Variables For Pagination
  let limit = parseInt(data.limit) || 10; // set default limit to 10

  if (limit <= 0) {
    // ensure that limit is positive
    return res.send({
      status: "ERROR",
      message: "Limit must be a positive number",
    });
  }

  let skipPage = limit * (parseInt(data.pageNumber) - 1);

  let paginationCondition = {
    limit: limit,
    skipPage: skipPage,
  };

  if (data.country) {
    searchCondition["countryId"] = new mongoose.Types.ObjectId(data.country);
  }

  if (data.maxAge) {
    searchCondition["age"] = {
      $lte: parseInt(data.maxAge),
      $gte: parseInt(data.minAge),
    };
  }

  const aggregateArray = [
    { $match: searchCondition },
    {
      $lookup: {
        from: "countries",
        let: { countryId: "$countryId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$countryId"] },
            },
          },
          {
            $project: {
              _id: 1,
              countryName: 1,
            },
          },
        ],
        as: "countryDetails",
      },
    },
    {
      $project: {
        _id: 1,
        name: "$fullName",
        countryName: { $arrayElemAt: ["$countryDetails.countryName", 0] },
        age: 1,
        profileImageUrl: 1,
      },
    },
    {
      $sort: { _id: -1 },
    },
  ];

  const Record = await generalService.getRecordAggregate(
    "User",
    aggregateArray
  );

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch successfully",
    Record: Record,
  });
});

module.exports = {
  addUsers,
  getUsers,
  updateUsers,
  deleteUsers,
  resetPassword,
  getUserDetailById,
  activeUserAccount,
  getAllGroom,
  getFavouriteList,
  manageFavouritePeople,
  searchGroom,
  addFavourite,
  getGroomDetails,
  AddGroom,
};
