const { boolean } = require("joi");
const mongoose = require("mongoose");

/* Define a schema for the "employee" model */
const Employee = mongoose.model(
  "Employee",
  mongoose.Schema({
    empId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: false,
      unique: false,
    },
    address: {
      type: String,
    },
  /* This is used to store the token generated for the user. */
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  /* This is a reference to the Employee model. */
    reportingPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    status: {
      type: Boolean,
    },
 /* A reference to the Branch model. */
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    newPassword: {
      type: String,
    },
    confirmPassword: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
  /* Used to set the time limit for the password reset link. */
    resetPasswordExpire: {
      type: Date,
      default: "",
    },
  /* A reference to the Role model. */
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
   /* A reference to the Area model. */
    area: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      },
    ],
  })
);

module.exports = Employee;
