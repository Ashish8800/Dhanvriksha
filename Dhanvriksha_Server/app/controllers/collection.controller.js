const mongoose = require("mongoose");
/* Importing the models from the models folder. */
const db = require("../models");
const Branch = require("../models/branchSchema");
const Area = require("../models/areaSchema");
const Collection = require("../models/CollectionSchema");
const Member = db.member;
const Loan = db.loan;
const FixedDeposit = db.fixedDeposit;
const RecurringDeposit = db.rd;

/* The below code is creating a new collection entry. */
exports.newCollectionEntry = async (req, res) => {
  try {
    let date = new Date(req.body.collectionDate);

    const collectionEntry = req.body;

    /* Creating a new instance of the Collection model and passing in the collectionEntry object. */
    const newEntry = new Collection({
      ...collectionEntry,
      collectionDate: new Date(req.body.collectionDate),
    });

    if (req.body.applicationId.charAt(0) == "L") {
      /* Finding a loan with the applicationId that is passed in the request body. */
      const loan = await Loan.findOne({
        applicationId: req.body.applicationId,
      });

      /* Updating the balance of the loan. */
      balance = await Loan.findOneAndUpdate(
        { applicationId: req.body.applicationId },
        {
          balance: loan.balance - req.body.collectionAmount,
          branch: req.body.branch,
          loanStatus:
            loan.balance - req.body.collectionAmount == 0
              ? "Closed"
              : loan.loanStatus,
        },
        { new: true, useFindAndModify: false }
      );
    }
    /*checking if application Id start with F, then it is fixed deposit*/
    if (req.body.applicationId.charAt(0) == "F") {
      const fd = await FixedDeposit.findOne({
        applicationId: req.body.applicationId,
      });

      /* The below code is updating the status of the fixed deposit to active if the status is approved. */
      if (fd.fdStatus == "Approved") {
        await FixedDeposit.findOneAndUpdate(
          { applicationId: req.body.applicationId },
          { fdStatus: "Active" },
          { new: true, useFindAndModify: false }
        );
      }
      /* Updating the balance of the fixed deposit account. */
      balance = await FixedDeposit.findOneAndUpdate(
        { applicationId: req.body.applicationId },
        {
          balance: fd.balance - req.body.collectionAmount,
          branch: req.body.branch,
        },
        { new: true, useFindAndModify: false }
      );
    }
    /* Checking if the applicationId starts with R, then it is a Recurring Deposit. */
    if (req.body.applicationId.charAt(0) == "R") {
      const rd = await RecurringDeposit.findOne({
        applicationId: req.body.applicationId,
      });
      /* Updating the balance of the recurring deposit account. */
      balance = await RecurringDeposit.findOneAndUpdate(
        { applicationId: req.body.applicationId },
        {
          balance: rd.balance - req.body.collectionAmount,
          branch: req.body.branch,
        },
        { new: true, useFindAndModify: false }
      );
    }
    newEntry.save().then((savedEntry) => {
      return res.status(201).json({
        data: savedEntry,
        message: "Successfully saved the Collection Entry",
        success: true,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to save the Collection Entry`,
      success: false,
    });
  }
};

/* Getting the collection from the database. */
exports.getCollection = async (req, res) => {
  try {
    Collection.find({ applicationId: req.params.applicationId }).then(function (
      collection
    ) {
      res.send(collection);
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/**
 * New Code For  Collection Sheet It takes an array of objects and returns the sum of the collectionAmount property of each object
 * @param collectionAmount - This is the array of objects that contains the collection amount.
 * @returns The total amount of the collection.
 */
const calculateCollectionAmount = (collectionAmount) => {
  var return_collection_amount = 0;
  if (collectionAmount) {
    collectionAmount.map(function (collection) {
      return_collection_amount += collection.collectionAmount;
    });
  }
  return return_collection_amount;
};

//Using Aggregation Pipeline for collecting data from multiple database collection.

exports.collectionSheetFunction = async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  /* The below code is a mongoDB aggregation pipeline. */
  const pipeline = [
    {
      $match: {
        _id: ObjectId(req.body.area),
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branchData",
      },
    },
    {
      $unwind: {
        path: "$branchData",
      },
    },

    {
      $lookup: {
        from: req.body.serviceType == "Loan" ? "loans" : "rds",
        localField: "_id",
        foreignField: "area",
        as: "result",
      },
    },

    {
      $unwind: {
        path: "$result",
      },
    },
    {
      $lookup: {
        from: "collections",
        localField: "result.applicationId",
        foreignField: "applicationId",
        as: "applicationCollections",
      },
    },
    {
      $lookup: {
        from: "members",
        localField: "result.memberId",
        foreignField: "memberId",
        as: "members",
      },
    },
    {
      $unwind: {
        path: "$members",
      },
    },
  ];
  try {
    let requiredDataObj = {};
    let arr = [];
    const aggCursor = await Area.aggregate(pipeline);
    let ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
    let todaysDate = new Date(req.body.date).setHours(0, 0, 0, 0);

    const ReturnResult = [];

    /* The below code is calculating the due amount of the loan and recurring deposit. */
    aggCursor.map((allData) => {
      let collectionAmount = calculateCollectionAmount(
        allData.applicationCollections
      );
      /* The below code is checking if the service type is loan and the loan status is active. If both
  conditions are true, then it is calculating the difference between the disbursement date and
  today's date. If the difference is greater than 0, then it is pushing the data into the
  ReturnResult array. */
      if (
        req.body.serviceType == "Loan" &&
        allData.result.loanStatus === "Active"
      ) {
        let disbursementDate = new Date(
          allData.result.disbursementDate
        ).setHours(0, 0, 0, 0);

        var difference_ms = todaysDate - disbursementDate;

        if (Math.floor(difference_ms / ONE_WEEK) > 0) {
          allData.applicantName = allData.members.applicantName;
          allData.fatherName = allData.members.fatherName;
          allData.loanStatus = allData.result.loanStatus;
          allData.disbursementDate = allData.result.disbursementDate;
          allData.disbursedAmount = allData.result.disbursedAmount;

          allData.dueWeek = Math.floor(difference_ms / ONE_WEEK);

          allData.dueAmount =
            allData.result.installments * Math.floor(difference_ms / ONE_WEEK) -
            collectionAmount;
          ReturnResult.push(allData);
        }
      }

      /* The below code is checking if the service type is RD and the RD status is active. If both 
     conditions are true, then it is calculating the tenure on the basis of Daily
     and Monthly. */
      if (
        req.body.serviceType == "Recurring Deposit" &&
        allData.result.rdStatus == "Active"
      ) {
        let dailyTenure = 0;
        let activeDate = new Date(allData.result.activeDate).setHours(
          0,
          0,
          0,
          0
        );

        /* Calculating the daily tenure of the RD. */
        if (allData.result.rdTenure == "Daily") {
          var Difference_In_Time = todaysDate - activeDate;
          dailyTenure = Math.round(Difference_In_Time / (1000 * 3600 * 24));
          if (dailyTenure > 0) {
            allData.applicantName = allData.members.applicantName;
            allData.fatherName = allData.members.fatherName;
            allData.rdTenure = allData.result.rdTenure;
            allData.rdAmount = allData.result.rdAmount;
            allData.activeDate = allData.result.activeDate;
            allData.dueDays = dailyTenure;
            allData.dueAmount =
              allData.result.rdAmount * dailyTenure - collectionAmount;
            ReturnResult.push(allData);
          }
        }
        /* Calculating the Monthly tenure of the RD. */
        if (allData.result.rdTenure == "Monthly") {
          let startDate = new Date(todaysDate).getMonth() + 1;
          let endDate = new Date(activeDate).getMonth() + 1;
          let monthlyTenure =
            startDate -
            endDate +
            12 *
              (new Date(todaysDate).getFullYear() -
                new Date(activeDate).getFullYear());
          if (monthlyTenure > 0) {
            allData.rdTenure = allData.result.rdTenure;
            allData.applicantName = allData.members.applicantName;
            allData.fatherName = allData.members.fatherName;
            allData.rdAmount = allData.result.rdAmount;
            allData.activeDate = allData.result.activeDate;
            allData.dueMonth =
              startDate -
              endDate +
              12 *
                (new Date(todaysDate).getFullYear() -
                  new Date(activeDate).getFullYear());
            allData.dueAmount =
              allData.result.rdAmount * allData.dueMonth - collectionAmount;
            ReturnResult.push(allData);
          }
        }
      }
    });

    res.send(ReturnResult);
  } catch (error) {}
};

//Collection Entry using Aggregation
exports.applicationDataForCollectionEntry = async (req, res) => {
  /* The below code is a MongoDB aggregation pipeline. */
  const pipeline = [
    {
      $match: {
        applicationId: req.params.applicationId,
      },
    },

    {
      $lookup: {
        from: "fixeddeposits",
        localField: "applicationId",
        foreignField: "applicationId",
        as: "result",
      },
    },

    {
      $unwind: {
        path: "$result",
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branchData",
      },
    },
    {
      $unwind: {
        path: "$branchData",
      },
    },
    {
      $lookup: {
        from: "collections",
        localField: "result.applicationId",
        foreignField: "applicationId",
        as: "applicationCollections",
      },
    },
    {
      $lookup: {
        from: "members",
        localField: "result.memberId",
        foreignField: "memberId",
        as: "members",
      },
    },
    {
      $unwind: {
        path: "$members",
      },
    },
  ];
  /* The below code is used to calculate the due amount of the loan, recurring deposit and fixed
  deposit. */
  try {
    const ReturnResult = [];
    const todaysDate = new Date().setHours(0, 0, 0, 0);
    const ServiceType = req.params.applicationId.charAt(0);

    /* The below code is check when service type is FD,RD and loan then it is
     creating a new pipeline stage that will perform a lookup on the FDs, RDs and loans
     collection and push all collections in aggcursor array. */
    let aggCursor = [];

    if (ServiceType == "L") {
      pipeline[1]["$lookup"].from = "loans";
      aggCursor = await Loan.aggregate(pipeline);
    } else if (ServiceType == "R") {
      pipeline[1]["$lookup"].from = "rds";
      aggCursor = await RecurringDeposit.aggregate(pipeline);
    } else if (ServiceType == "F") {
      aggCursor = await FixedDeposit.aggregate(pipeline);
    }

    aggCursor.map((allData) => {
      let collectionAmount = calculateCollectionAmount(
        allData.applicationCollections
      );
      /* Checking if the applicationId starts with L. If it is, then it is
    adding the applicantName, fatherName, loanStatus, disbursementDate, 
    disbursedAmount, dueWeek and loanDueAmount to the ReturnResult array. */
      if (req.params.applicationId.charAt(0) == "L") {
        let ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
        const disbursementDate = new Date(
          allData.result.disbursementDate
        ).setHours(0, 0, 0, 0);
        var difference_ms = todaysDate - disbursementDate;
        allData.applicantName = allData.members.applicantName;
        allData.fatherName = allData.members.fatherName;
        allData.loanStatus = allData.result.loanStatus;
        allData.disbursementDate = allData.result.disbursementDate;
        allData.disbursedAmount = allData.result.disbursedAmount;

        allData.dueWeek = Math.floor(difference_ms / ONE_WEEK);

        allData.loanDueAmount = (
          allData.result.installments * Math.floor(difference_ms / ONE_WEEK) -
          collectionAmount
        ).toFixed(2);
        ReturnResult.push(allData);
      }
      /* Checking if the applicationId starts with F and the fdStatus is Approved. If it is, then it is
    adding the applicantName, fatherName, fdAmount and fdDueAmount to the ReturnResult array. */
      if (
        req.params.applicationId.charAt(0) == "F" &&
        allData.result.fdStatus == "Approved"
      ) {
        allData.applicantName = allData.members.applicantName;
        allData.fatherName = allData.members.fatherName;
        allData.fdAmount = allData.result.fdAmount;
        allData.fdDueAmount = allData.result.fdAmount;
        ReturnResult.push(allData);
      }

      /* Checking if the applicationId starts with R and the rdStatus is Active. If it is, then it is
    adding the applicantName, fatherName, rdAmount, rdTenure and activeDate.
     * dueDays, dueMonth, dailydueAmount  and  rdDueAmount calculate on the basis of Daily and monthly and then all data push in to the ReturnResult array. */
      if (
        req.params.applicationId.charAt(0) == "R" &&
        allData.result.rdStatus == "Active"
      ) {
        let dailyTenure = 0;
        let activeDate = new Date(allData.result.activeDate).setHours(
          0,
          0,
          0,
          0
        );

        if (allData.result.rdTenure == "Daily") {
          var Difference_In_Time = todaysDate - activeDate;
          dailyTenure = Math.round(Difference_In_Time / (1000 * 3600 * 24));

          allData.applicantName = allData.members.applicantName;
          allData.fatherName = allData.members.fatherName;
          allData.rdTenure = allData.result.rdTenure;
          allData.rdAmount = allData.result.rdAmount;
          allData.activeDate = allData.result.activeDate;
          allData.dueDays = dailyTenure;
          allData.dailydueAmount = (
            allData.result.rdAmount * dailyTenure -
            collectionAmount
          ).toFixed(2);
        }
        if (allData.result.rdTenure == "Monthly") {
          let startDate = new Date(todaysDate).getMonth() + 1;
          let endDate = new Date(activeDate).getMonth() + 1;
          let monthlyTenure =
            startDate -
            endDate +
            12 *
              (new Date(todaysDate).getFullYear() -
                new Date(activeDate).getFullYear());
          allData.rdTenure = allData.result.rdTenure;
          allData.applicantName = allData.members.applicantName;
          allData.fatherName = allData.members.fatherName;
          allData.rdAmount = allData.result.rdAmount;
          allData.activeDate = allData.result.activeDate;
          let dueMonth =
            startDate -
            endDate +
            12 *
              (new Date(todaysDate).getFullYear() -
                new Date(activeDate).getFullYear());
          allData.rdDueAmount = (
            allData.result.rdAmount * dueMonth -
            collectionAmount
          ).toFixed(2);
        }

        ReturnResult.push(allData);
      }
    });
    res.send({ success: true, data: ReturnResult });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error });
  }
};
