const Member = require("../models/memberSchema");
const FixedDeposit = require("../models/fixedDeposit");
const Loan = require("../models/loanSchema");
const RD = require("../models/rdSchema");

/**
 * It fetches all the applications that are approved by the KYC department and sends them to the
 * frontend
 * @param req - The request object.
 * @param res - The response object.
 */
const getKycApprovedApplication = async (req, res) => {
  const kycApproveArr = [];
  const kycApprovedApplications = {};
  /* Fetching all the fixed deposit applications that are approved by the KYC department. */
  FixedDeposit.find({ fdStatus: "KYC Approved" }).then(function (approvedFd) {
    kycApproveArr.push(approvedFd);
    kycApprovedApplications.approvedFd = approvedFd;
  });
  /* Fetching all the loan applications that are approved by the KYC department. */
  Loan.find({ loanStatus: "KYC Approved" }).then(function (approvedLoan) {
    kycApproveArr.push(approvedLoan);
    kycApprovedApplications.approvedLoan = approvedLoan;
  });
  /* Fetching all the RD applications that are approved by the KYC department. */
  RD.find({ rdStatus: "KYC Approved" }).then(function (approvedRd) {
    kycApproveArr.push(approvedRd);
    kycApprovedApplications.approvedRd = approvedRd;
    res.send(kycApprovedApplications);
  });
};

/**
 * It updates the application status of a member
 * @param req - The request object from client side.
 * @param res - The response object going to client.
 */
const applicationUpdate = async (req, res) => {
  let updateApplication = {};
  const member = await Member.findOne({
    memberId: req.body.memberId,
  });

 /* Updating the application status and application comment of a member. */
  if (req.body.applicationStatus) {
    updateApplication = await Member.findOneAndUpdate({
      memberId: req.params.memberId,
      applicationComment: req.body.applicationComment,
    });
  }
  /* Updating the loan status and application comment of a member. */
  const loan = await Loan.findOneAndUpdate(
    { memberId: req.params.memberId },
    {
      loanStatus: req.body.applicationStatus,
      applicationComment: req.body.applicationComment,
    }
  );
  /* Updating the fixed deposit status and application comment of a member. */
  const fd = await FixedDeposit.findOneAndUpdate(
    { memberId: req.params.memberId },
    {
      fdStatus: req.body.applicationStatus,
      applicationComment: req.body.applicationComment,
    }
  );
  /* Updating the RD status and application comment of a member. */
  const rd = await RD.findOneAndUpdate(
    { memberId: req.params.memberId },
    {
      rdStatus: req.body.applicationStatus,
      applicationComment: req.body.applicationComment,
    }
  );
  res.status(200).json({
    data: updateApplication,
    loan,
    fd,
    rd,
    message: `Application updated successfully`,
    success: true,
  });
};

/* Exporting all the functions in the file. */
module.exports = {
  addNewMemberReg,
  getAllMember,
  getMemberbyid,
  kycUpdate,
  getMemberbyApplication,
  getKycApprovedApplication,
  applicationUpdate,
};
