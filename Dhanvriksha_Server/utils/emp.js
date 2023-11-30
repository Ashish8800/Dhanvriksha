const Employee = require("../models/empSchema");
const jwt = require("jsonwebtoken");
// const Schema=mongoose.Schema;
var bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendHtmlEmail = require("../utils/passwordEmail");

/**
 * It takes a number and a length, and returns the number padded with zeros to the left until it
 * reaches the specified length
 * @param n - The number to be padded.
 * @param length - The length of the string to be returned.
 * @returns a string of zeros that is the length of the difference between the length of the number and
 * the length of the number plus the length of the string.
 */
function pad(n, length) {
  var len = length - ("" + n).length;
  return (len > 0 ? new Array(++len).join("0") : "") + n;
}

/**
 * It takes the details of the employee that is being added, creates a new employee object with the
 * details, saves the employee object and returns a response
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const addNewEmpReg = async (req, res) => {
  let totalEmp = 0;
  await Employee.find().then(function (emp) {
    totalEmp = emp.length;
  });
  try {
    let EmpDetails = req.body;
    const password = parseInt(Math.random() * 0xfffff * 10000).toString(16);
    await sendHtmlEmail(EmpDetails.email, "Your password", password);
    /* Creating a new employee object with the details of the employee that is being added. */
    const newEmp = new Employee({
      ...EmpDetails,
      empId: "DN" + pad(totalEmp + 1, 3),
      password: await bcrypt.hash(password, 12),
    });

    let savedEmp = await newEmp.save();
    return res.status(201).json({
      data: savedEmp,
      message: `Successfully save The Employee`,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to save the Employee`,
      success: false,
    });
  }
};
/**
 * It's a function that takes in a request and a response, and then it finds all the employees in the
 * database and sends them back to the client
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getAllEmp = async (req, res) => {
  Employee.find().then(function (emp) {
    res.send(emp);
  });
};
/* Exporting the functions `addNewEmpReg` and `getAllEmp` so that they can be used in other files. */
module.exports = { addNewEmpReg, getAllEmp };
