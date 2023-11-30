const { getId } = require("../../utils/CommonUtils");
const { loan } = require("../models");
const db = require("../models");
const Member = db.member;
const Branch = db.branch;
const Loan = db.loan;
const Collection = require("../models/CollectionSchema");
/**
 *This is a function that is being exported to be create new loan.
 @function createLoan
 @param {obj} req - loan data coming from client side.
 @param {obj} res - loan data going to client */
exports.createLoan = async (req, res) => {
  let branchId = "";
  /* Finding the branchId from the branch collection. */
  await Branch.findOne({ _id: req.body.branch }).then(function (br) {
    branchId = br.branchId;
  });
  try {
    let newmemberid = req.body.memberId ? req.body.memberId : "";
    if (req.body.newMember === "Yes") {
      newmemberid = await getId("MEMBER", req.body.branch, branchId);
    }
    let totalLoan = 0;
    /* Finding all the loans and then setting the totalLoan to the length of the loans. */
    await Loan.find().then(function (loanData) {
      totalLoan = loanData.length;
    });
    let newloanid = "";
    /* Getting the LoanId from the getId function. */
    getId("LOAN", "01").then((id) => {
      newloanid = id;

      let member = {};
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
          // kyc1: req.body.kyc1,
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
      const loan = {
        loanAmount: req.body.loanAmount,
        tenure: req.body.tenure,
        installments: req.body.installments,
        interestRate: req.body.interestRate,
        applicationDate: req.body.applicationDate,
        loanStatus: req.body.loanStatus,
        applicationId: newloanid,
        memberId: newmemberid,
        balance: req.body.balanceAmount,
        processingFee: req.body.processingFee,
        installments: req.body.installments,
        totalInterestAmount: req.body.totalInterestAmount,
        loanPurpose: req.body.loanPurpose,
        totalDisbursementAmount: req.body.totalDisbursementAmount,
        loanInsuranceFee: req.body.loanInsuranceFee,
        transactional_Details: req.body.transactional_Details,
        dueAmount: req.body.dueAmount,
        area: req.body.area,
        branch: req.body.branch,
      };

      if (req.body.newMember === "No") {
        if (req.body.kycStatus !== "Pending") {
          loan.loanStatus = req.body.kycStatus;
        } else {
          loan.loanStatus = req.body.loanStatus;
        }
      }

      if (req.body.newMember === "Yes") {
        const newMember = new Member({
          ...member,
          memberId: newmemberid,
        });
        let savedMember = newMember.save();
      }
      const newLoan = new Loan({
        ...loan,
        memberId: newmemberid,
      });

      let savedLoan = newLoan.save();
      return res.status(201).json({
        data: savedLoan,
        message: "Successfully Applied For Loan",
        success: true,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to apply for new Loan`,
      success: false,
    });
  }
};
/* This function is used to get all the loans. */
exports.getAllLoan = async (req, res) => {
  try {
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
    Loan.find().then(function (lo) {
      let arrAllLoas = [];
      lo.map((oneLoan) => {
        let memberId = oneLoan.memberId;
        oneLoan.applicantName = allMembers[memberId].applicantName
          ? allMembers[memberId].applicantName
          : "";
        oneLoan.fatherName = allMembers[memberId].fatherName
          ? allMembers[memberId].fatherName
          : "";
        arrAllLoas.push(oneLoan);
      });
      res.send(arrAllLoas);
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/**
 *  This function is used to get the loan details by memberId.
 * @function getLoanbyId
 * @param {obj} req - req.params.memberId getting memberId
 */
exports.getLoanbyId = async (req, res) => {
  try {
    Loan.find({ memberId: req.params.memberId }).then(function (loandetails) {
      res.send(loandetails);
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* This function is used to get all the approved loan applications. */
exports.getLoanApprovedApplication = async (req, res) => {
  try {
    const ApprovedApplications = {};

    Loan.find({ loanStatus: "Approved" }).then(function (approvedLoan) {
      ApprovedApplications.approvedLoan = approvedLoan;
      res.send(ApprovedApplications);
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* This function is used to save the loan disbursement application. */
exports.loanDisbursementApplication = async (req, res) => {
  try {
    /* Finding the loan with the applicationId that is coming from the client side. */
    const loan = await Loan.findOne({ applicationId: req.body.applicationId });
    newEntry.save().then((savedEntry) => {
      return res.status(201).json({
        data: savedEntry,
        message: "Successfully saved the Loan Disbursement application",
        success: true,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to save the Loan Disbursement application`,
      success: false,
    });
  }
};

/* This function is used to update the loan status to active and also update the disbursedAmount,
disbursementDate, dueAmount, branch, transactional_Details. */
exports.postloanDisbursementApplication = async (req, res) => {
  try {
    const loan = await Loan.findOneAndUpdate(
      { applicationId: req.body.applicationId },
      {
        loanStatus: "Active",
        disbursedAmount: req.body.disbursedAmount,
        disbursementDate: req.body.disbursementDate,
        dueAmount: req.body.dueAmount,
        branch: req.body.branch,
        transactional_Details: req.body.transactional_Details,
      },
      { new: true, useFindAndModify: false }
    ).then((newLoan, err) => {
      if (err) return res.status(500).send({ success: false, message: err });
      return res.status(200).send({
        data: newLoan,
        success: true,
        message: "Loan Disbursement Sucessfully",
      });
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
