const router = require("express").Router();

const { newLoan, getAllLoan, getLoanbyid } = require("../utils/loan");

//New loan route

/* This is a route that is used to create a new loan. */
router.post("/newLoan", async (req, res) => {
  await newLoan(req, res);
});

/* This is a route that is used to get all the loans. */
router.get("/getAllLoan", async (req, res) => {
  await getAllLoan(req, res);
});

/* This is a route that is used to get a loan by the memberID. */
router.get("/getLoanbyid/:memberID", async (req, res) => {
  await getLoanbyid(req, res);
});

/* Exporting the router to be used in the app.js file. */
module.exports = router;
