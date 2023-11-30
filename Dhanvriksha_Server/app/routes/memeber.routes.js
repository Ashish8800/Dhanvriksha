const { authJwt } = require("../middlewares");
const controller = require("../controllers/member.controller");
const { application } = require("express");
const upload = require("../middlewares/upload");
module.exports = function (app) {
  /* This is a middleware function that is used to set the header for the response. */
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  /* This is a route for adding a new member registration. */
  app.post(
    "/api/addNewMemberReg",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    upload.send,
    controller.addNewMemberReg
  );
  /* This is a route for getting all the members. */
  app.get(
    "/api/member",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAllMember
  );
  /* This is a route for getting the member details by memberId. */
  app.get(
    "/api/getMemberbyid/:memberId",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getMemberbyid
  );
  /* This is a route for getting all the applied applications. */
  app.get(
    "/api/appliedApplications",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.appliedApplications
  );
  /* This is a route for updating the kyc details. */
  app.post(
    "/api/kycUpdate/:applicationId",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.kycUpdate
  );
  /* This is a route for getting all the approved applications. */
  app.get(
    "/api/kycApprovedApplications",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getKycApprovedApplication
  );
  /* This is a route for getting all the approved applications. */
  app.get(
    "/api/approvedApplications",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getApprovedApplication
  );
  /* This is a route for updating the application details. */
  app.post(
    "/api/applicationUpdate/:applicationId",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.applicationUpdate
  );
  /* This is a route for updating the member details. */
  app.post(
    "/api/memberUpdate/:memberId",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    upload.send,
    controller.updateMember
  );
  /* This is a route for getting all the applications by memberId. */
  app.get(
    "/api/appbyMemberId/:memberId",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getApplicationbyMemberId
  );
  /* This is a route for getting all the active applications. */
  app.get(
    "/api/getActiveApplication",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getActiveApplication
  );

  app.get(
    "/api/download-fd/:memberId/:fdId",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.downloadFDPDF
  );
};
