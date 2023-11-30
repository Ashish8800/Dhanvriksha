const db = require("../models");
const Branch = require("../models/branchSchema");
const Collection = require("../models/CollectionSchema");
const Member = require("../models/memberSchema");
const Loan = db.loan;
const FixedDeposit = db.fixedDeposit;
const RecurringDeposit = db.rd;

/* The below code is used to get the daily report of the collection and disbursement of the loan, fixed
deposit and recurring deposit. */
exports.getDailyReport = async (req, res) => {
  let loanObjLoanCollection = {};
  let ObjFdCollection = {};
  let ObjRdCollection = {};
  let objLoanDisbursed = {};
  const allCollection = [];

  const bodyCollection = new Date(req.params.collectionDate);
  const clientCollectionDate =
    bodyCollection.getDate() +
    "-" +
    (bodyCollection.getMonth() + 1) +
    "-" +
    bodyCollection.getFullYear();
  try {
    const collectionData = await Collection.find({}).populate("branch");
    collectionData.map((data) => {
      let databaseDate = new Date(data.collectionDate);
      let databaseCollectionDate =
        databaseDate.getDate() +
        "-" +
        (databaseDate.getMonth() + 1) +
        "-" +
        databaseDate.getFullYear();
      /* The below code is used to calculate the collection amount of the loan, fd and rd. */
      if (clientCollectionDate == databaseCollectionDate) {
        if (data.applicationId.charAt(0) == "L") {
          /* Adding the collection amount to the branch name in the loanObjLoanCollection object. */
          if (data.branch.branchName in loanObjLoanCollection) {
            let collectionAmount =
              loanObjLoanCollection[data.branch.branchName];
            loanObjLoanCollection[data.branch.branchName] =
              collectionAmount + data.collectionAmount;
          } else {
            loanObjLoanCollection[data.branch.branchName] =
              data.collectionAmount;
          }
        }
        if (data.applicationId.charAt(0) == "F") {
          if (data.branch.branchName in ObjFdCollection) {
            let collectionAmount = ObjFdCollection[data.branch.branchName];
            ObjFdCollection[data.branch.branchName] =
              collectionAmount + data.collectionAmount;
          } else {
            ObjFdCollection[data.branch.branchName] = data.collectionAmount;
          }
        }
        if (data.applicationId.charAt(0) == "R") {
          if (data.branch.branchName in ObjRdCollection) {
            let collectionAmount = ObjRdCollection[data.branch.branchName];
            ObjRdCollection[data.branch.branchName] =
              collectionAmount + data.collectionAmount;
          } else {
            ObjRdCollection[data.branch.branchName] = data.collectionAmount;
          }
        }
      }
    });

    const disbursedLoan = await Loan.find({}).populate("branch");
    /* The below code is mapping through the disbursedLoan array and checking if the disbursementDate is
   equal to the clientCollectionDate. If it is equal, it will add the disbursedAmount to the
   objLoanDisbursed object. */
    disbursedLoan.map((disbursed) => {
      let loanDisbursedDate = new Date(disbursed.disbursementDate);
      let databaseDisbursementDate =
        loanDisbursedDate.getDate() +
        "-" +
        (loanDisbursedDate.getMonth() + 1) +
        "-" +
        loanDisbursedDate.getFullYear();
      if (databaseDisbursementDate == clientCollectionDate) {
        if (disbursed.branch.branchName in objLoanDisbursed) {
          let disbursedAmount = objLoanDisbursed[disbursed.branch.branchName];
          objLoanDisbursed[disbursed.branch.branchName] =
            disbursedAmount + disbursed.disbursedAmount;
        } else {
          objLoanDisbursed[disbursed.branch.branchName] =
            disbursed.disbursedAmount;
        }
      }
    });
    /* The below code is creating an object called AllDataObj and assigning the values of the objects
loanObjLoanCollection, ObjFdCollection, ObjRdCollection and objLoanDisbursed to the properties
loanCollection, fdCollection, rdCollection and loanDisbursed respectively. */

    let AllDataObj = {
      loanCollection: loanObjLoanCollection,
      fdCollection: ObjFdCollection,
      rdCollection: ObjRdCollection,
      loanDisbursed: objLoanDisbursed,
    };

    allCollection.push(AllDataObj);
    return res.status(201).send({ success: true, data: allCollection });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* The below code is used to get the weekly report of the collection and disbursement of the loan,
fixed deposit and recurring deposit. */
exports.getWeeklyReport = async (req, res) => {
  let toCollectionDate = new Date(req.body.toCollectionDate.substring(0, 18));
  const fromCollectionDate = new Date(req.body.fromCollection.substring(0, 18));
  let loanObjLoanCollection = {};
  let ObjFdCollection = {};
  let ObjRdCollection = {};
  let objLoanDisbursed = {};
  let objBalance = {};
  const allCollection = [];
  try {
    /* The below code is getting the collection data from the database and populating the branch data. */
    const collectionData = await Collection.find({}).populate("branch");
    collectionData.map((data) => {
      let databaseCollectionDate = new Date(
        data.collectionDate.substring(0, 18)
      );
      if (
        databaseCollectionDate >= fromCollectionDate &&
        databaseCollectionDate <= toCollectionDate
      ) {
        if (data.applicationId.charAt(0) == "L") {
          if (data.branch.branchName in loanObjLoanCollection) {
            let collectionAmount =
              loanObjLoanCollection[data.branch.branchName];
            loanObjLoanCollection[data.branch.branchName] =
              collectionAmount + data.collectionAmount;
          } else {
            loanObjLoanCollection[data.branch.branchName] =
              data.collectionAmount;
          }
        }
        if (data.applicationId.charAt(0) == "F") {
          if (data.branch.branchName in ObjFdCollection) {
            let collectionAmount = ObjFdCollection[data.branch.branchName];
            ObjFdCollection[data.branch.branchName] =
              collectionAmount + data.collectionAmount;
          } else {
            ObjFdCollection[data.branch.branchName] = data.collectionAmount;
          }
        }
        if (data.applicationId.charAt(0) == "R") {
          if (data.branch.branchName in ObjRdCollection) {
            let collectionAmount = ObjRdCollection[data.branch.branchName];
            ObjRdCollection[data.branch.branchName] =
              collectionAmount + data.collectionAmount;
          } else {
            ObjRdCollection[data.branch.branchName] = data.collectionAmount;
          }
        }
      }
    });

    const disbursedLoan = await Loan.find({}).populate("branch");
    /* The below code is mapping through the disbursedLoan array and checking if the disbursementDate is
present. If it is present, it is converting the date to a date object and then checking if the date
is between the fromCollectionDate and toCollectionDate. If it is, it is checking if the branchName
is present in the objLoanDisbursed object. If it is present, it is adding the disbursedAmount to the
existing amount. If it is not present, it is adding the branchName and the disbursedAmount to the
object. */
    disbursedLoan.map((disbursed) => {
      if (disbursed.disbursementDate) {
        let databaseDisbursementDate = new Date(
          disbursed.disbursementDate.substring(0, 18)
        );
        if (
          databaseDisbursementDate >= fromCollectionDate &&
          databaseDisbursementDate <= toCollectionDate
        ) {
          if (disbursed.branch.branchName in objLoanDisbursed) {
            let disbursedAmount = objLoanDisbursed[disbursed.branch.branchName];
            objLoanDisbursed[disbursed.branch.branchName] =
              disbursedAmount + disbursed.disbursedAmount;
          } else {
            objLoanDisbursed[disbursed.branch.branchName] =
              disbursed.disbursedAmount;
          }
        }
      }
    });
    let AllDataObj = {
      loanCollection: loanObjLoanCollection,
      fdCollection: ObjFdCollection,
      rdCollection: ObjRdCollection,
      loanDisbursed: objLoanDisbursed,
    };
    allCollection.push(AllDataObj);
    return res.status(201).send({ success: true, data: allCollection });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* The below code is used to get the monthly report of the collection and disbursement of the loan,
fixed deposit and recurring deposit. */
exports.getMonthlyReport = async (req, res) => {
  /* Getting the date from the request body and converting it into a date object. */
  let monthlytoCollectionDate = new Date(
    req.body.monthlytoCollectionDate.substring(0, 18)
  );

  const monthlyfromCollection = new Date(
    req.body.monthlyfromCollection.substring(0, 18)
  );
  let loanObjLoanCollection = {};
  let ObjFdCollection = {};
  let ObjRdCollection = {};
  let objLoanDisbursed = {};
  let objBalance = {};
  const allCollection = [];
  try {
    const collectionData = await Collection.find({}).populate("branch");
    collectionData.map((data) => {
      let databaseCollectionDate = new Date(
        data.collectionDate.substring(0, 18)
      );
      /* The below code is checking the date of the collection and then checking the applicationId of the
    collection and then adding the collection amount to the respective branch. */
      /* Checking if the date of the collection is between the from and to date. */
      if (
        databaseCollectionDate >= monthlyfromCollection &&
        databaseCollectionDate <= monthlytoCollectionDate
      ) {
        if (data.applicationId.charAt(0) == "L") {
          if (data.branch.branchName in loanObjLoanCollection) {
            let collectionAmount =
              loanObjLoanCollection[data.branch.branchName];
            loanObjLoanCollection[data.branch.branchName] =
              collectionAmount + data.collectionAmount;
          } else {
            loanObjLoanCollection[data.branch.branchName] =
              data.collectionAmount;
          }
        }
        /* This is checking if the applicationId starts with F and then adding the collection amount to
       the respective branch. */
        if (data.applicationId.charAt(0) == "F") {
          if (data.branch.branchName in ObjFdCollection) {
            let collectionAmount = ObjFdCollection[data.branch.branchName];
            ObjFdCollection[data.branch.branchName] =
              collectionAmount + data.collectionAmount;
          } else {
            ObjFdCollection[data.branch.branchName] = data.collectionAmount;
          }
        }
        if (data.applicationId.charAt(0) == "R") {
          /* This is checking if the branchName is in the ObjRdCollection object. If it is, it will add
         the collectionAmount to the existing collectionAmount. If it is not, it will add the
         collectionAmount to the ObjRdCollection object. */
          if (data.branch.branchName in ObjRdCollection) {
            let collectionAmount = ObjRdCollection[data.branch.branchName];
            ObjRdCollection[data.branch.branchName] =
              collectionAmount + data.collectionAmount;
          } else {
            ObjRdCollection[data.branch.branchName] = data.collectionAmount;
          }
        }
      }
    });

    /* The below code is finding all the loans that have been disbursed and populating the branch
   details. */
    const disbursedLoan = await Loan.find({}).populate("branch");
    /* The below code is mapping through the disbursedLoan array and checking if the disbursementDate is
   greater than or equal to the monthlyfromCollection and less than or equal to the
   monthlytoCollectionDate. If the condition is true, it will check if the branchName is in the
   objLoanDisbursed object. If it is, it will add the disbursedAmount to the existing value. If it
   is not, it will add the branchName and the disbursedAmount to the object. */
    disbursedLoan.map((disbursed) => {
      if (disbursed.disbursementDate) {
        let databaseDisbursementDate = new Date(
          disbursed.disbursementDate.substring(0, 18)
        );
        if (
          databaseDisbursementDate >= monthlyfromCollection &&
          databaseDisbursementDate <= monthlytoCollectionDate
        ) {
          if (disbursed.branch.branchName in objLoanDisbursed) {
            let disbursedAmount = objLoanDisbursed[disbursed.branch.branchName];
            objLoanDisbursed[disbursed.branch.branchName] =
              disbursedAmount + disbursed.disbursedAmount;
          } else {
            objLoanDisbursed[disbursed.branch.branchName] =
              disbursed.disbursedAmount;
          }
        }
      }
    });
    let AllDataObj = {
      loanCollection: loanObjLoanCollection,
      fdCollection: ObjFdCollection,
      rdCollection: ObjRdCollection,
      loanDisbursed: objLoanDisbursed,
    };
    allCollection.push(AllDataObj);
    return res.status(201).send({ success: true, data: allCollection });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
