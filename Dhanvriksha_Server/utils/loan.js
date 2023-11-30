const Loan = require("../models/loanSchema");
const Member = require("../models/memberSchema");
/**
 * It takes the request body and creates a new member and loan object and saves it to the database
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const newLoan = async (req, res) => {
  let totalMember = 0;
  await Member.find().then(function (member) {
    totalMember = member.length;
  });
  try {
    function pad(n, length) {
      var len = length - ("" + n).length;
      return (len > 0 ? new Array(++len).join("0") : "") + n;
    }
    const newmemberid = "DM" + pad(totalMember + 1, 3);

    let totalLoan = 0;
    await Loan.find().then(function (loandata) {
      totalLoan = loandata.length;
    });
    const newLoanid = "DVLOAN" + pad(totalLoan + 1 + 3);
    const member = {
      centerName: req.body.centerName,
      applicantName: req.body.applicantName,
      fatherName: req.body.fatherName,
      age: req.body.age,
      MaritalStatus: req.body.MaritalStatus,
      panCard: req.body.panCard,
      adhaarCard: req.body.adhaarCard,
      voterId: req.body.voterId,
      kyc1: req.body.kyc1,
      kyc2: req.body.kyc2,
      kycStatus: req.body.kycStatus,
    };

    const loan = {
      tenure: req.body.tenure,
      loanStatus: req.body.loanStatus,
      pendingmfic: req.body.pendingmfic,
      applicationDate: req.body.applicationDate,
      loanAmount: req.body.loanAmount,
      interestRate: req.body.interestRate,
      installments: req.body.installments,
      insuranceFee: req.body.insuranceFee,
      transactional_Details: req.body.transactional_Details,
      applicationId: newLoanid,
    };
    /* Creating a new member object with the memberId as the newmemberid. */
    const newMember = new Member({
      ...member,
      memberId: newmemberid,
    });

    /* Creating a new loan object with the memberId as the newmemberid. */
    const newLoan = new Loan({
      ...loan,
      memberId: newmemberid,
    });

    let savedMember = await newMember.save();
    let savedLoan = await newLoan.save();
    return res.status(201).json({
      data: savedLoan,
      message: "Successfully sent the loan application",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      data: Loan.email,
      message: `Unable to apply for loan`,
      success: false,
    });
  }
};

/**
 * It fetches all the loans from the database and then fetches all the members from the database and
 * then creates a new array of loans with the member's name and father's name
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getAllLoan = async (req, res) => {
  let arrNewAllLoans = [];
  let objAllMembers = {};
  await Member.find().then((res) => {
    res.map((member) => {
      let objTempMember = {
        applicantName: member.applicantName,
        fatherName: member.fatherName,
      };
      objAllMembers[member.memberId] = objTempMember;
    });
  });
  Loan.find().then(function (arrAllLoans) {
    arrAllLoans.map((objLoan) => {
      let objNewLoan = { ...objLoan._doc };
      objNewLoan.applicantName = objAllMembers[objLoan.memberId].applicantName;
      objNewLoan.fatherName = objAllMembers[objLoan.memberId].fatherName;
      arrNewAllLoans.push(objNewLoan);
    });
    res.send(arrNewAllLoans);
  });
};

/**
 * This function is used to get the loan details of a particular member
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getLoanbyid = async (req, res) => {
  Loan.find({ memberId: req.params.memberId }).then(function (loandetails) {
    res.send(loandetails);
  });
};
/* Exporting the functions newLoan, getAllLoan, getLoanbyid so that they can be used in other files. */
module.exports = { newLoan, getAllLoan, getLoanbyid };
