const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const mongoose = require("mongoose");
const AppError = require("../utils/appError");

const TableName = "City";
const incrementalId = "cityId";

// ==================== Fetch all city list ====================//
const fetchCityList = async (searchCondition, pagination) => {
  let limit = pagination.limit || 10;
  let skipPage = pagination.skipPage || 0;
  const aggregateArray = [
    {
      $facet: {
        total: [{ $count: "total" }],
        tableData: [
          { $match: searchCondition },
          {
            $lookup: {
              from: "countries",
              let: { countryId: "$countryId" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", { $toObjectId: "$$countryId" }] },
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
              cityId: 1,
              cityName: 1,
              createdAt: 1,
              countryName: { $arrayElemAt: ["$countryDetails.countryName", 0] },
              countryId: { $arrayElemAt: ["$countryDetails._id", 0] },
              createdBy: 1,
            },
          },
          {
            $sort: { _id: -1 },
          },
          { $skip: skipPage },
          { $limit: limit },
        ],
      },
    },
  ];

  return await generalService.getRecordAggregate(TableName, aggregateArray);
};

// ==================== get city record ====================//
const getCity = catchAsync(async (req, res) => {
  const data = JSON.parse(req.params.query);
  let limit = data.limit || 10;
  let condition = {};
  if (data.name) {
    condition = {
      $expr: {
        $regexMatch: {
          input: {
            $concat: ["$cityName", { $toString: "$cityId" }],
          },
          regex: `.*${data.name}.*`,
          options: "i",
        },
      },
    };
  }
  const Record = await fetchCityList(condition, {});

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
    Category: "Record fetch Successfully",
    Record: Record[0],
  });
});

// ==================== add city record ====================//
const addCity = catchAsync(async (req, res) => {
  const data = req.body;
  const isExist = await generalService.getRecord(TableName, {
    cityName: data.cityName,
    countryId: data.countryId,
  });
  if (isExist && isExist.length > 0) {
    throw new AppError("City already exists with the same name", 409);
  } else {
    data.createdBy = req.user._id;
    data[incrementalId] = await autoIncrement(TableName, incrementalId);
    const Record = await generalService.addRecord(TableName, data);
    const AllRecord = await fetchCityList({ _id: Record._id }, {});
    res.send({
      status: constant.SUCCESS,
      message: "Record added successfully",
      Record: AllRecord[0],
    });
  }
});

// ==================== update city record ====================//
const updateCity = catchAsync(async (req, res) => {
  const data = req.body;
  const isExist = await generalService.getRecord(TableName, {
    cityName: data.cityName,
    countryId: data.countryId,
  });
  if (isExist && isExist.length > 0) {
    throw new AppError("City already exists with the same name", 409);
  } else {
    const Record = await generalService.findAndModifyRecord(
      TableName,
      {
        _id: data._id,
      },
      data
    );
    const updatedRecord = await fetchCityList({ _id: Record._id }, {});
    res.send({
      status: constant.SUCCESS,
      message: "Record updated successfully",
      Record: updatedRecord[0],
    });
  }
});

// ==================== delete city record ====================//
const deleteCity = catchAsync(async (req, res) => {
  const { _id } = req.body;
  const isExist = await generalService.getRecord("User", { cityId: _id });
  if (isExist && isExist.length > 0) {
    res.send({
      status: constant.ERROR,
      message: "Record can not deleted because its in use",
    });
  } else {
    const deletedRecord = await generalService.deleteRecord(TableName, {
      _id: _id,
    });
    const Record = await fetchCityList({}, {});
    res.send({
      status: constant.SUCCESS,
      message: "Record deleted successfully",
      Record: {
        tableData: [{ _id: _id }],
        total: Record[0].total,
      },
    });
  }
});

module.exports = {
  addCity,
  getCity,
  updateCity,
  deleteCity,
};
