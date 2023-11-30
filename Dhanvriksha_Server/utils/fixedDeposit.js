const FixedDeposit = require("../models/fixedDeposit");
const Member = require("../models/memberSchema");

/**
 * It creates a new member and a new FD
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const createFD = async (req, res) => {
  try {
    function pad(n, length) {
      var len = length - ("" + n).length;
      return (len > 0 ? new Array(++len).join("0") : "") + n;
    }
    const newmemberid = "DM" + pad(totalMember + 1, 3);
    let totalfd = 0;
    await FixedDeposit.find().then(function (fddata) {
      totalfd = fddata.length;
    });
    const newfdid = "DVFD" + pad(totalfd + 1 + 3);

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

    const fixedDeposit = {
      fdAmount: req.body.fdAmount,
      tenure: req.body.tenure,
      maturityAmount: req.body.maturityAmount,
      maturityDate: req.body.maturityDate,
      interestRate: req.body.interestRate,
      applicationDate: req.body.applicationDate,
      pendingmfic: req.body.pendingmfic,
      fdStatus: req.body.fdStatus,
      applicationId: newfdid,
    };
    const newMember = new Member({
      ...member,
      memberId: newmemberid,
    });
    const newFD = new FixedDeposit({
      ...fixedDeposit,
      memberID: "FD" + Math.floor(1000 + Math.random() * 9000),
    });
    let savedMember = await newMember.save();

    let savedFD = await newFD.save();
    return res.status(201).json({
      data: savedFD,
      message: "Successfully sent The application",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to apply for new FD`,
      success: false,
    });
  }
};
/**
 * It fetches all the fixed deposits from the database and adds the applicant name and father name to
 * each fixed deposit
 * @param req - The request object.
 * @param res - The response object.
 */
const getAllFD = async (req, res) => {
  let arrNewAllFDs = [];
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
  FixedDeposit.find().then(function (arrAllFDs) {
    arrAllFDs.map((objFD) => {
      let objNewFD = { ...objFD._doc };
      objNewFD.applicantName = objAllMembers[objFD.memberId].applicantName;
      objNewFD.fatherName = objAllMembers[objFD.memberId].fatherName;
      arrNewAllFDs.push(objNewFD);
    });
    res.send(arrNewAllFDs);
  });
};

/**
 * It finds all the fixed deposit details of a member with the given memberID
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getFDbyId = async (req, res) => {
  FixedDeposit.find({ memberID: req.params.memberID }).then(function (fddetails) {
    res.send(fddetails);
  });
};
/* Exporting the functions to be used in other files. */
module.exports = { createFD, getAllFD, getFDbyId };
