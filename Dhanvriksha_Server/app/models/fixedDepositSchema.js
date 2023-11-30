const mongoose = require("mongoose");

/* Define a schema for the "fixed deposit" model */
const fixedDepositSchema = mongoose.Schema(
  {
    newMember: {
      type: String,
    },
    memberId: {
      type: String,
    },
    centerName: {
      type: String,
    },
    applicantName: {
      type: String,
    },
    applicationId: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    age: {
      type: Number,
    },
    MaritalStatus: {
      type: String,
    },
    kyc1Num: {
      type: String,
    },
    applicationDate: {
      type: String,
    },
    tenure: {
      type: String,
    },
    kyc1: {
      type: String,
    },
    kyc2: {
      type: String,
    },

     /* Defining the possible values for the field `fdStatus` */
    fdStatus: {
      type: "String",
      default: "Applied",
      enum: ["Applied", "KYC Approved", "Approved", "Paid", "Active", "Closed", "KYC Rejected", " Rejected"],
    },
    pendingmfic: {
      type: String,
    },
    fdAmount: {
      type: Number,
    },
    interestRate: {
      type: Number,
    },
    maturityAmount: {
      type: Number,
    },
    maturityDate: {
      type: String,
      // default: Date.now,
    },
    applicationComment: {
      type: String,
    },
    balance: {
      type: Number,
    },
  /* This is a reference to the `Area` model. */
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
   /* This is a reference to the `Branch` model. */
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
   
  },
  { timestamps: true }
);
/* Creating a model for the `fixedDeposit` collection in the database. */
const FixedDeposit = mongoose.model("fixedDeposit", fixedDepositSchema);

/* Exporting the `FixedDeposit` model so that it can be used in other files. */
module.exports = FixedDeposit;
