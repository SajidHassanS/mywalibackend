const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { autoIncrement } = require("../utils/commonFunctions");
const mongoose = require("mongoose");

const getBrideDashboard = catchAsync(async (req, res) => {
  const aggregateArray = [
    {
      $facet: {
        users: [
          {
            $group: {
              _id: null,
              totalGroom: {
                $sum: {
                  $cond: [{ $eq: ["$role", "groom"] }, 1, 0],
                },
              },
              totalWali: {
                $sum: {
                  $cond: [{ $eq: ["$role", "wali"] }, 1, 0],
                },
              },
              totalPending: {
                $sum: {
                  $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
                },
              },
              totalUser: {
                $sum: {
                  $add: [
                    {
                      $cond: [
                        { $in: ["$role", ["groom", "wali", "bride"]] },
                        1,
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        ],
        notifications: [
          {
            $lookup: {
              from: "siteactivities",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    createdBy: 1,
                    createdAt: 1,
                  },
                },
              ],
              as: "notificationDetails",
            },
          },
        ],
      },
    },
  ];

  const Record = await generalService.getRecordAggregate(
    "User",
    aggregateArray
  );

  res.send({
    status: constant.SUCCESS,
    message: "Dashboard record fetch successfully",
    Record,
  });
});

const getBrideMonthlyAnalytics = catchAsync(async (req, res) => {
  const last12Months = [];
  let Record = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    last12Months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
  }
  let endDate = new Date(new Date(new Date()).setHours(23, 59, 59));
  let startDate = new Date(
    new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000).setHours(00, 00, 00)
  );
  aggregateArr = [
    {
      $match: {
        createdAt: {
          $gt: startDate,
          $lte: endDate,
        },
      },
    },

    {
      $addFields: {
        created_date: {
          $dateToParts: {
            date: { $toDate: { $toLong: "$createdAt" } },
          },
        },
      },
    },

    {
      $group: {
        _id: {
          year: "$created_date.year",
          month: "$created_date.month",
        },
        totalGroom: {
          $sum: { $cond: [{ $eq: ["$role", "groom"] }, 1, 0] },
        },
        totalWali: {
          $sum: { $cond: [{ $eq: ["$role", "wali"] }, 1, 0] },
        },
      },
    },

    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalGroom: 1,
        totalWali: 1,
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ];
  Record = await generalService.getRecordAggregate("User", aggregateArr);

  const monthArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthNumberArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let resultArr = [];
  monthNumberArr.map((Item, index) => {
    const filterRecord = Record.filter((x) => x.month === Item);
    if (filterRecord.length > 0) {
      resultArr.push({
        name: monthArr[index] + " " + filterRecord[0].year,
        totalGroom: filterRecord[0].totalGroom,
        totalWali: filterRecord[0].totalWali,
      });
    } else {
      last12Months.map((Item) => {
        if (Item.month === index + 1) {
          resultArr.push({
            name: monthArr[index] + " " + Item.year,
            totalGroom: 0,
            totalWali: 0,
          });
        }
      });
    }
  });
  Record = resultArr.sort(function (a, b) {
    // Extract the year and month from the name property of each object
    const [aMonth, aYear] = a.name.split(" ");
    const [bMonth, bYear] = b.name.split(" ");
    // Compare the year first
    if (aYear < bYear) {
      return 1;
    } else if (aYear > bYear) {
      return -1;
    } else {
      if (monthArr.indexOf(aMonth) < monthArr.indexOf(bMonth)) {
        return 1;
      } else if (monthArr.indexOf(aMonth) > monthArr.indexOf(bMonth)) {
        return -1;
      } else {
        return 0;
      }
    }
  });
  res.send({
    status: constant.SUCCESS,
    message: "Record Fetch Successfully",
    Record,
  });
});



module.exports = {
    getBrideDashboard,
    getBrideMonthlyAnalytics,
  
};
