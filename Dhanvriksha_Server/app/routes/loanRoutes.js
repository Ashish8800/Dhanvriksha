const { authJwt } = require("../middlewares");
const { verifySignUp } = require("../middlewares");
const verifyEmp = require("../middlewares/verifyEmp");
const upload = require("../middlewares/upload");
const controller = require("../controllers/loan.controller");
const { application } = require("express");

/* This is the route for the loan application. */
module.exports = function (app) {
  /* This is a middleware function that is used to set the header of the response. */
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  /* This is the route for post the loan application. */
  app.post(
    "/api/loan",
    authJwt.verifyToken(["ADMIN", "BM", "FO"]),
    upload.send,
    controller.createLoan
  );
  /* This is the route for get the loan application. */
  app.get(
    "/api/loan",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAllLoan
  );
  /* This is the route for get the loan application by memberID. */
  app.get(
    "/api/loan/:memberID",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getLoanbyId
  );
  /* This is the route for get the Approved loan application. */
  app.get(
    "/api/getLoanApprovedApplication",
    controller.getLoanApprovedApplication
  );
  /* This is the route for post the loan disbursement application. */
  app.post(
    "/api/postloanDisbursementApplication",
    authJwt.verifyToken(["ADMIN", "BM", "FO"]),
    controller.postloanDisbursementApplication
  );
};
