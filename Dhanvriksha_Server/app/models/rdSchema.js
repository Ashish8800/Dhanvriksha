const mongoose = require("mongoose");

/* Define a schema for the "recurring deposit" model */
const rdSchema = mongoose.Schema(
  {
    newMember: {
      type: String,
    },
    memberId: {
      type: String,
    },
    applicantName: {
      type: String,
    },
    applicationDate: {
      type: String,
    },
    tenure: {
      type: Number,
    },
   /* Defining the status of the RD. */
    rdStatus: {
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
        "Rejected",
      ],
    },
    pendingmfic: {
      type: String,
    },
    rdAmount: {
      type: Number,
    },
    interestRate: {
      type: String,
    },
    installments: {
      type: Number,
    },
    applicationComment: {
      type: String,
    },
    applicationId: {
      type: String,
    },
    balance: {
      type: Number,
    },
    activeDate: {
      type: String,
    },
    dueAmount: {
      type: Number,
    },
  /* This is a reference to the branch model. */
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
   /* This is a reference to the area model. */
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    rdTenure: {
      type: String,
    },
    dailyTenure: {
      type: Number,
    },
  },
  { timestamps: true }
);
/* Creating a model for the RD schema. */
const RD = mongoose.model("rd", rdSchema);

/* Exporting the RD model. */
module.exports = RD;
