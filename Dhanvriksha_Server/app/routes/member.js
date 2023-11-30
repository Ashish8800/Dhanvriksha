const router = require("express").Router();
const Loan = require("../models/loanSchema");
const {
  addNewMemberReg,
  getAllMember,
  getMemberbyid,
  kycUpdate,
  getMemberbyApplication,
} = require("../utils/member");

//user Registration Route

/* This is a route that is used to add a new member. */
router.post("/addNewMemberReg", async (req, res) => {
  await addNewMemberReg(req, res);
});

/* This is a route that is used to get all the members. */
router.get("/getAllMember", async (req, res) => {
  await getAllMember(req, res);
});
/* This is a route that is used to get the member by id. */
router.get("/getMemberbyid/:memberId", async (req, res) => {
  await getMemberbyid(req, res);
});
/* This is a route that is used to update the KYC of a member. */
router.post("/kycUpdate/:memberId", async (req, res) => {
  await kycUpdate(req, res);
});
/* This is a route that is used to update the KYC of a member. */
router.post("/kycUpdate/:memberId", async (req, res) => {
  await kycUpdate(req, res);
});
/* This is a route that is used to get the member by application. */
router.get("/getMemberbyApplication/", async (req, res) => {
  await getMemberbyApplication(req, res);
});

/* Exporting the router object. */
module.exports = router;
