const mongoose = require("mongoose");

/* Define a schema for the "Loan" model */
const LoanSchema = mongoose.model(
  "loan",
  mongoose.Schema(
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
      applicationId: {
        type: String,
      },
      applicantName: {
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

      kyc2Num: {
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
      /* Defining the status of the loan. */
      loanStatus: {
        type: "String",
        default: "Applied",
        enum: [
          "Applied",
          "KYC Approved",
          "Approved",
          "Paid",
          "Active",
          "Closed",
          "KYC Rejected",
          " Rejected",
        ],
      },
      pendingmfic: {
        type: String,
      },
      loanAmount: {
        type: Number,
      },
      interestRate: {
        type: String,
      },
      installments: {
        type: Number,
      },
      images: {
        type: String,
      },
      applicationComment: {
        type: String,
      },
      balance: {
        type: Number,
      },

      loanPurpose: {
        type: String,
      },
      processingFee: {
        type: Number,
      },

      totalDisbursementAmount: {
        type: Number,
      },
      disbursedAmount: {
        type: Number,
      },
      disbursementDate: {
        type: String,
      },
      totalInterestAmount: {
        type: Number,
      },
      dueAmount: {
        type: Number,
      },
      /* A reference to the branch model. */
      branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
      loanInsuranceFee: {
        type: Number,
      },
      /* A reference to the Area model. */
      area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      },
      transactional_Details: {
        type: String,
      },
    },
    { timestamps: true }
  )
);

/* Exporting the LoanSchema model. */
module.exports = LoanSchema;
