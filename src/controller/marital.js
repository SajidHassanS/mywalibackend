const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const mongoose = require("mongoose");
const AppError = require("../utils/appError");

const TableName = "Marital";
const incrementalId = "maritalId"; // id is auto incremented

// ==================== Fetch all marital list ====================//
const fetchMaritalList = async (searchCondition, pagination) => {
  let limit = pagination.limit || 10;
  let skipPage = pagination.skipPage || 0;
  const aggregateArray = [
    {
      $facet: {
        total: [{ $count: "total" }],
        tableData: [
          { $match: searchCondition },
          {
            $project: {
              maritalId: 1,
              maritalStatus: 1,
              createdAt: 1,
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

// ==================== get marital record ====================//
const getMarital = catchAsync(async (req, res) => {
  const data = JSON.parse(req.params.query);

  console.log("===search data: " + data);
  let limit = data.limit || 10;
  let condition = {};

  if (data.key === "status" && data.value !== "all" && data.value !== "") {
    condition.maritalStatus = data.value;
  }
  const Record = await fetchMaritalList(condition, {});

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
    message: "Record fetch Successfully",
    Record: Record[0],
  });
});

// ==================== add marital record ====================//
const addMarital = catchAsync(async (req, res) => {
  const data = req.body;
  const isExist = await generalService.getRecord(TableName, {
    maritalStatus: data.maritalStatus,
  });
  if (isExist && isExist.length > 0) {
    throw new AppError("Marital Status already exists with the same name", 409);
  } else {
    data.createdBy = req.user._id;
    data[incrementalId] = await autoIncrement(TableName, incrementalId);
    const Record = await generalService.addRecord(TableName, data);
    const AllRecord = await fetchMaritalList({ _id: Record._id }, {});

    res.send({
      status: constant.SUCCESS,
      message: "Record added successfully",
      Record: AllRecord[0],
    });
  }
});

// ==================== update marital record ====================//
const updateMarital = catchAsync(async (req, res) => {
  const data = req.body;
  const isExist = await generalService.getRecord(TableName, {
    maritalStatus: data.maritalStatus,
  });
  console.log(isExist.length);
  if (isExist && isExist.length > 0) {
    res.send({
      status: constant.ERROR,
      message: "Marital Status already exists with the same name",
    });
  } else {
    const Record = await generalService.findAndModifyRecord(
      TableName,
      {
        _id: data._id,
      },
      data
    );
    const updatedRecord = await fetchMaritalList({ _id: Record._id }, {});
    res.send({
      status: constant.SUCCESS,
      message: "Record updated successfully",
      Record: updatedRecord[0],
    });
  }
});

// ==================== delete marital record ====================//
const deleteMarital = catchAsync(async (req, res) => {
  const { _id } = req.body;
  const isExist = await generalService.getRecord("Marital", { marital: _id });
  if (isExist && isExist.length > 0) {
    res.send({
      status: constant.ERROR,
      message: "Record can not deleted because its in use",
    });
  } else {
    const deletedRecord = await generalService.deleteRecord(TableName, {
      _id: _id,
    });
    const Record = await fetchMaritalList({}, {});
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
  addMarital,
  getMarital,
  updateMarital,
  deleteMarital,
};
