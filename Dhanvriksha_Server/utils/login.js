const Employee = require("../models/empSchema");
const sendEmail = require("../utils/email");
const sendHtmlEmail = require("../utils/verificationemail");
const EmailToken = require("../models/tokenSchema");
const Token = require("../models/tokenSchema");
const bcrypt = require("bcryptjs");
const cors = require("cors");

/**
 * It takes in an email and password, checks if the email exists in the database, and if it does, it
 * checks if the password is correct. If both of those checks pass, it returns a success message
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //  validation
  if (!email || !password) {
    return res.send("Plz filled all the field properly");
  }
  const employee = await Employee.findOne({ email: email });

  if (employee) {
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(201).json({
        error: true,
        message: "Invalid credentials",
        success: false,
      });
    } else {
      return res.status(200).json({
        data: { role: employee.role, email: email ,name:employee.name},
        message: "Login Successfull",
        success: true,
      });
    }
  } else {
    return res.status(201).json({
      error: true,
      message: "Invalid credentials",

      success: false,
    });
  }
};

// -----Forgot Password-------

const forgetpwd = async (req, res) => {
  try {
    const user = await Employee.findOne({ email: req.body.email });
    if (!user) {
      const newEmp = new Employee({
        email: req.body.email,
      });
      let savedUser = await newEmp.save();
    }
    let token;

    if (!token) {
      token = await new Token({
        userId: req.body.email,
        token: Math.floor(1000 + Math.random() * 9000),
      }).save();
    }
    await sendHtmlEmail(user.email, "Forgot Passsword Code", token.token);

    res.status(200).json({
      success: true,
      message: "An OTP has been sent to your email account",
      otp: token.token,
      data: user.email,
    });
  } catch (error) {
    success: false, res.status(201).json({ message: "An error occured" });
  }
};

//Reset Password

const resetpwd = async (req, res) => {
  try {
    const { resetPasswordToken, newPassword, confirmPassword } = req.body;
    if (!resetPasswordToken || !newPassword || !confirmPassword) {
      return res
        .status(201)
        .json({ error: true, message: "Please fill all the field correctly" });
    }

    const code = await Token.findOne({ token: resetPasswordToken });
    if (!code) {
      return res.status(201).json({ error: true, message: "Code is invalid" });
    }
    if (code == resetPasswordToken) {
      return res.status(200).json({ error: false, message: "Code is valid" });
    }
    if (code.token !== resetPasswordToken) {
      return res.status(201).json({
        error: true,
        message: "Code is Invalid",
        success: false,
        data: resetPasswordToken,
      });
    }
    const emp = await Employee.findOne({
      email: code.userId,
    });
    if (newPassword !== confirmPassword) {
      return res
        .status(201)
        .json({ message: "Password is not matching", success: false });
    }
    newhashedPassword = await bcrypt.hash(newPassword, 12);
    emp.password = newhashedPassword;
    await emp.save();
    return res.status(201).json({
      data: newPassword,
      error: false,
      message: "Your password is changed successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

/* Exporting the functions to be used in other files. */
module.exports = { loginUser, forgetpwd, resetpwd };
