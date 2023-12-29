const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");

const TableName = "Ethnicity";
const incrementalId = "ethnicityId"; // id is auto incremented

// ==================== Fetch all ethnicity list ====================//
const fetchEthnicityList = async (searchCondition, pagination) => {
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
              ethnicityId: 1,
              ethnicityName: 1,
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

// ==================== get ethnicity record ====================//
const getEthnicity = catchAsync(async (req, res) => {
  const data = JSON.parse(req.params.query);
  let limit = data.limit || 10;
  let condition = {};
  if (data.name) {
    condition = {
      $expr: {
        $regexMatch: {
          input: {
            $concat: ["$ethnicityName", { $toString: "$ethnicityId" }],
          },
          regex: `.*${data.name}.*`,
          options: "i",
        },
      },
    };
  }
  const Record = await fetchEthnicityList(condition, {});

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

// ==================== add ethnicity record ====================//
const addEthnicity = catchAsync(async (req, res) => {
  const data = req.body;
  console.log("=====data", data);

  data.createdBy = req.user._id;
  data[incrementalId] = await autoIncrement(TableName, incrementalId);

  //add auto incremental id here
  const Record = await generalService.addRecord(TableName, data);
  const AllRecord = await fetchEthnicityList({ _id: Record._id }, {});

  res.send({
    status: constant.SUCCESS,
    message: "Record added successfully",
    Record: AllRecord[0],
  });
});

// ==================== update ethnicity record ====================//
const updateEthnicity = catchAsync(async (req, res) => {
  const data = req.body;
  const Record = await generalService.findAndModifyRecord(
    TableName,
    {
      _id: data._id,
    },
    data
  );
  const updatedRecord = await fetchEthnicityList({ _id: Record._id }, {});
  res.send({
    status: constant.SUCCESS,
    message: "Record updated successfully",
    Record: updatedRecord[0],
  });
});

// ==================== delete ethnicity record ====================//
const deleteEthnicity = catchAsync(async (req, res) => {
  const { _id } = req.body;
  const isExist = await generalService.getRecord("User", { ethnicity: _id });
  if (isExist && isExist.length > 0) {
    res.send({
      status: constant.ERROR,
      message: "Record can not deleted because its in use",
    });
  } else {
    const deletedRecord = await generalService.deleteRecord(TableName, {
      _id: _id,
    });
    const Record = await fetchEthnicityList({}, {});
    console.log("======Record", Record);

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
  addEthnicity,
  getEthnicity,
  updateEthnicity,
  deleteEthnicity,
};
