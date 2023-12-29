const generalService = require("../services/generalOperation");
const mongoose = require("mongoose");

const autoIncrement = async (table, fieldName, condition = {}) => {
  try {
    const aggregateArr = [
      { $match: condition },
      { $sort: { [fieldName]: -1 } },
      { $limit: 1 },
    ];
    const record = await generalService.getRecordAggregate(table, aggregateArr);
 
    //console.log("===== record =====", JSON.stringify(record));
    if (record.length >= 1) {
      let count = parseInt(record[0][fieldName]);
      count += 1;
      return count;
    } else {
      return 1;
    }
  } catch (error) {
    console.log(error);
  }
};

const getDetailsById = async (_id) => {
  const aggregateArray = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(_id),
        status: {
          $ne: "delete",
        },
      },
    },
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
        _id: 1,
        fullName: 1,
        email: 1,
        phoneNumber: 1,
        personalInformation: 1,
        birthday: 1,
        age:1,
        address:1,
        gender: 1,
        role: 1,
        status: 1,
        bio: 1,
        mahr:1,
        profileImageUrl:1,
        verification: 1,
        relationStatus: 1,
        wifeName: 1,
       
        countryName: { $arrayElemAt: ["$countryDetails.countryName", 0] },
      },
    },
  ];
  return await generalService.getRecordAggregate("User", aggregateArray);
};

const fetchTableDataListAndCard = async (
  tableDataCondition,
  cardsCondition,
  paginationCondition,
  role
) => {
  let limit = paginationCondition.limit || 10; // The Number Of Records Want To Fetch
  let skipPage = paginationCondition.skipPage || 0; // The Number Of Page Want To Skip
  const aggregateArray = [
    {
      $match: {
        role: "user",
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
              fullName: 1,
              userId: 1,

              email: 1,
              phoneNumber: 1,

              address: 1,
              birthday: 1,

              gender: 1,
              role: 1,
              emergencyContact: 1,
              personalInformation: 1,
              salaryInformation: 1,
              experienceInformation: 1,
              educationInformation: 1,
              status: 1,
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
  return await generalService.getRecordAggregate("User", aggregateArray);
};

module.exports = {
  autoIncrement,
  getDetailsById,
  fetchTableDataListAndCard,
};
