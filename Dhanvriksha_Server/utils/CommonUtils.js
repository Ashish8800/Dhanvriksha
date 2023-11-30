/**
 * It takes a number and a length, and returns the number padded with zeros to the left until it
 * reaches the desired length.
 * @param n - The number to be padded
 * @param length - The length of the string you want to return.
 * @returns A function that takes two arguments, n and length.
 */
const pad = (n, length) => {
  var len = length - ("" + n).length;
  return (len > 0 ? new Array(++len).join("0") : "") + n;
};

/* Importing the models from the app/models folder. */
const db = require("../app/models");

/**
 * This function is generation memberId, loanId, fdId, rdId
 * @param item - MEMBER/RD/Loan/FD
 * @param branch - "BR001"
 * @param branchId - BR001
 */
const getId = async (item, branch, branchId) => {
  let total = 0;
  let id = "";
  switch (item) {
    case "MEMBER":
      const Member = db.member;
      const Branch = db.branch;

      await Member.find({ branch: branch })
        .populate("branch")
        .then(function (members) {
          if (members.length > 0) {
            total = members.length;
          }
        });
      id = "DN:" + branchId.split("BR")[1] + "/" + pad(total + 1, 3);
      break;
    case "RD":
      const RD = db.rd;
      await RD.find().then(function (totalRDs) {
        total = totalRDs.length;
      });
      id = "R36219" + pad(total + 1, 4);
      break;
    case "LOAN":
      const loan = db.loan;
      await loan.find().then(function (totalLoans) {
        total = totalLoans.length;
      });
      id = "L36219" + pad(total + 1, 4);
      break;

    case "FD":
      const fixedDeposit = db.fixedDeposit;
      await fixedDeposit.find().then(function (totalFDs) {
        total = totalFDs.length;
      });
      id = "F36219" + pad(total + 1, 4);
      break;

    default:
      break;
  }
  return id;
};

/**
 * It generates a random number of length 4
 * @function generateOTP
 * @returns A string of 4 random digits.
 */
function generateOTP() {
  var digits = "0123456789";
  var otpLength = 4;
  var otp = "";
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }
  return otp;
}

function convertSpecialChars(inputString, replacementChar) {
  // Define the regular expression to match special characters
  const specialCharsRegex = /[^a-zA-Z0-9-_]/g;

  // Use the replace method with the regex to replace special characters with the given replacementChar
  const convertedString = inputString.replace(
    specialCharsRegex,
    replacementChar
  );

  return convertedString;
}
function formatDate(dateString) {
  const date = new Date(dateString);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear().toString().slice(-2);
  // Add leading zeros if necessary
  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;
  // Reconstruct the date in the desired format
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

/* Exporting the functions `pad`, `getId` and `generateOTP` so that they can be used in other files. */
module.exports = { pad, getId, generateOTP, convertSpecialChars, formatDate };
