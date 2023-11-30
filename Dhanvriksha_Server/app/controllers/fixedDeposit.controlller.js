const { model } = require("mongoose");
const { pad, getId } = require("../../utils/CommonUtils");

const db = require("../models");
const Loan = db.loan;
const FixedDeposit = db.fixedDeposit;
const RecurringDeposit = db.rd;
const Branch = db.branch;
const Member = db.member;

/**
 *this is a function that is being exported to be Creating a new Fixed Deposit(FD).
 * @function - createFD
 * @param {obj} req - FD details coming from client side.
 * @param {obj} res - FD details going to client*/
exports.createFD = async (req, res) => {
  let branchId = "";
  /* Finding the branchId from the branch collection. */
  await Branch.findOne({ _id: req.body.branch }).then(function (br) {
    branchId = br.branchId;
  });
  try {
    let newmemberid = req.body.memberId ? req.body.memberId : "";
    if (req.body.newMember === "Yes") {
      /* Getting the new member id from the database. */
      newmemberid = await getId("MEMBER", req.body.branch, branchId);
    }
    let totalfd = 0;
    /* Finding the total number of FDs in the database. */
    await FixedDeposit.find().then(function (fddata) {
      totalfd = fddata.length;
    });
    let newfdid = "";
    getId("FD", "01").then((id) => {
      newfdid = id;
      let member = {};
      /* The below code is creating a new member of the FixedDeposit and saving it to the database. */
      if (req.body.newMember === "Yes") {
        member = {
          branch: req.body.branch,
          applicantName: req.body.applicantName,
          fatherName: req.body.fatherName,
          dob: req.body.dob,
          MaritalStatus: req.body.MaritalStatus,
          panCard: req.body.panCard,
          adhaarCard: req.body.adhaarCard,
          voterId: req.body.voterId,
          kyc1: req.body.kyc1,
          kyc2: req.body.kyc2,
          kycStatus: req.body.kycStatus,
          memberId: newmemberid,
          pendingmfic: req.body.pendingmfic,
          mobile: req.body.mobile,
          pendingmficAmount: req.body.pendingmficAmount,
          resident: req.body.resident,
          referedBy: req.body.referedBy,
          familyAnnualIncome: req.body.familyAnnualIncome,
          uploadAdhaarDocument: req.body.adhaarDocument,
          kyc2DocumentUpload: req.body.kyc2Document,
          area: req.body.area,
        };
      }
      const fixedDeposit = {
        fdAmount: req.body.fdAmount,
        tenure: req.body.tenure,
        maturityAmount: req.body.maturityAmount,
        maturityDate: req.body.maturityDate,
        interestRate: req.body.yearlyInterestRate,
        applicationDate: req.body.applicationDate,
        fdStatus: req.body.fdStatus,
        applicationId: newfdid,
        memberId: newmemberid,
        balance: req.body.fdAmount,
        area: req.body.area,
        branch: req.body.branch,
      };
      if (req.body.newMember === "No") {
        if (req.body.kycStatus !== "Pending") {
          fixedDeposit.fdStatus = req.body.kycStatus;
        } else {
          fixedDeposit.fdStatus = req.body.fdStatus;
        }
      }
      if (req.body.newMember === "Yes") {
        const newMember = new Member({
          ...member,
          memberId: newmemberid,
        });
        let savedMember = newMember.save();
      }
      const newFD = new FixedDeposit({
        ...fixedDeposit,
        memberId: newmemberid,
      });

      let savedFD = newFD.save();
      return res.status(201).json({
        data: savedFD,
        message: "Successfully Applied For FD",
        success: true,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to apply for new FD`,
      success: false,
    });
  }
};

/**
 * It finds all the fixed deposits whose maturity date is today's date and updates their status to
 * "Closed"
 */
const closeFD = () => {
  const todaysDate = new Date().toDateString();
  FixedDeposit.find().then(function (fd) {
    fd.map(async (oneFd) => {
      await FixedDeposit.findOneAndUpdate(
        { maturityDate: todaysDate },
        { fdStatus: "Closed" },
        { new: true, useFindAndModify: false },
        (err, newemp1) => {}
      );
    });
  });
};
/**
 * this is a function that is being exported to be getting all FD details
 *  Finding all the members and populating the branch details.
 * @function getAllFD */
exports.getAllFD = async (req, res) => {
  try {
    closeFD();
    let allMembers = {};

    await Member.find()
      .populate("branch")
      .then(function (members) {
        members.map((member) => {
          allMembers[member.memberId] = {
            applicantName: member.applicantName,
            fatherName: member.fatherName,
          };
        });
      });
    /* Finding all the fixed deposits and then mapping them to get the applicant name and father name. */
    FixedDeposit.find().then(function (fd) {
      let arrAllFDs = [];
      fd.map((oneFd) => {
        let memberId = oneFd.memberId;
        oneFd.applicantName = allMembers[memberId].applicantName
          ? allMembers[memberId].applicantName
          : "";
        oneFd.fatherName = allMembers[memberId].fatherName
          ? allMembers[memberId].fatherName
          : "";
        arrAllFDs.push(oneFd);
      });
      res.send(arrAllFDs);
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
/**
 * Finding the fixed deposit by the member id.
 * @function getFDbyId
 * @param {obj} req - req.params.memberID getting memberId*/
exports.getFDbyId = async (req, res) => {
  try {
    FixedDeposit.find({ memberID: req.params.memberID }).then(function (
      fddetails
    ) {
      res.send(fddetails);
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
