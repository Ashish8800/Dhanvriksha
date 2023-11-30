const mongoose = require("mongoose");

/* Define a schema for the "member" model */
const memberSchema = mongoose.Schema({
  memberId: {
    type: String,
  },
  centerName: {
    type: String,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  email: {
    type: String,
  },
  mobile: {
    type: Number,
    required: false,
    unique: false,
  },
  address: {
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

  panCard: {
    type: String,
  },
  adhaarCard: {
    type: Number,
  },
  voterId: {
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
 /* A validation for the kycStatus field. It will only accept the values "Pending" and "Completed". */
  kycStatus: {
    type: "String",
    default: "Pending",
    enum: ["Pending", "Completed"],
  },
  kycComment: {
    type: String,
  },
  kycDoneBy: {
    type: String,
  },
  pendingmfic: {
    type: String,
  },
  dob: {
    type: String,
  },
  resident: {
    type: String,
  },
  familyAnnualIncome: {
    type: Number,
  },
  pendingmficAmount: {
    type: Number,
  },
  referedBy: {
    type: String,
  },
  uploadAdhaarDocument:{
    type:String
  },
  kyc2DocumentUpload:{
    type:String
  },
 /* This is a reference to the Branch model. */
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
 /* This is a reference to the Area model. */
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
  },

});

/* Creating a model named "Member" using the memberSchema. */
const Member = mongoose.model("member", memberSchema);

/* Exporting the Member model so that it can be used in other files. */
module.exports = Member;
