const Member = require("../models/memberSchema");
const FixedDeposit = require("../models/fixedDeposit");
const Loan = require("../models/loanSchema");
const RD = require("../models/rdSchema");

const sendHtmlEmail = require("../utils/passwordEmail");

/**
 * It takes a number and a length, and returns the number padded with zeros to the left until it
 * reaches the specified length
 * @param n - The number to be padded.
 * @param length - The length of the string to be returned.
 * @returns a string of zeros that is the length of the difference between the length of the number and
 * the length of the number plus the length of the number.
 */
function pad(n, length) {
  var len = length - ("" + n).length;
  return (len > 0 ? new Array(++len).join("0") : "") + n;
}

/**
 * It takes a request and a response object, and returns a JSON object with a message and a success
 * property
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const addNewMemberReg = async (req, res) => {
  let totalMember = 0;
  await Member.find().then(function (member) {
    totalMember = member.length;
  });
  try {
    let MemberDetails = req.body;
    const password = parseInt(Math.random() * 0xfffff * 10000).toString(16);
    await sendHtmlEmail(MemberDetails.email, "Your password", password);
    const newMember = new Member({
      ...MemberDetails,
      memberId: "DM" + pad(totalMember + 1, 3),
    });

    let savedMember = await newMember.save();
    return res.status(201).json({
      data: savedMember,
      message: `Successfully save The Member`,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to save the Member`,
      success: false,
    });
  }
};
/**
 * It finds all the members in the database and sends them back to the client
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getAllMember = async (req, res) => {
  Member.find().then(function (member) {
    res.send(member);
  });
};
/**
 * This function is used to get the member details by member id
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getMemberbyid = async (req, res) => {
  Member.find({ memberId: req.params.memberId }).then(function (MemberDetails) {
    res.send(MemberDetails);
  });
};
/**
 * It updates the KYC status of a member
 * @param req - The request object.
 * @param res - The response object.
 */
const kycUpdate = async (req, res) => {
  let updatekyc = {};
  const member = await Member.findOne({
    memberId: req.body.memberId,
  });

  if (req.body.kycStatus) {
    updatekyc = await Member.findOneAndUpdate(
      { memberId: req.params.memberId },
      { kycStatus: req.body.kycStatus, kycComment: req.body.kycComment }
    );
  }
  const loan = await Loan.findOneAndUpdate(
    { memberId: req.params.memberId },
    { loanStatus: req.body.kycStatus }
  );
  const fd = await FixedDeposit.findOneAndUpdate(
    { memberId: req.params.memberId },
    { fdStatus: req.body.kycStatus }
  );
  const rd = await RD.findOneAndUpdate(
    { memberId: req.params.memberId },
    { rdStatus: req.body.kycStatus }
  );
  res.status(200).json({
    data: updatekyc,
    message: `Kyc updated successfully`,
    success: true,
  });
};

/**
 * It fetches all the applications of a member from the database and sends it to the frontend
 * @param req - The request object. This object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getMemberbyApplication = async (req, res) => {
  const temparr = [];
  const applications = {};
  FixedDeposit.find({ fdStatus: "Applied" }).then(function (arrAllFds) {
    temparr.push(arrAllFds);
    applications.arrAllFds = arrAllFds;
  });
  Loan.find({ loanStatus: "Applied" }).then(function (arrAllLoan) {
    temparr.push(arrAllLoan);
    applications.arrAllLoan = arrAllLoan;
  });
  RD.find({ rdStatus: "Applied" }).then(function (arrAllRds) {
    temparr.push(arrAllRds);
    applications.arrAllRds = arrAllRds;
    res.send(applications);
  });
};

/* Exporting the functions defined in the file. */
module.exports = {
  addNewMemberReg,
  getAllMember,
  getMemberbyid,
  kycUpdate,
  getMemberbyApplication,
};
