const { authJwt } = require("../middlewares");
const { verifySignUp } = require("../middlewares");
const verifyEmp = require("../middlewares/verifyEmp");
const controller = require("../controllers/rd.controller");
const { application } = require("express");
const upload = require("../middlewares/upload");
module.exports = function (app) {
  /* This is a middleware function that is used to set the header of the response. */
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  /* This is a route for creating RD. */
  app.post(
    "/api/rdeposit",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    upload.send,
    controller.createRd
  );
  /* This is a route for getting all RD. */
  app.get(
    "/api/rdeposit",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAllRD
  );
  /* This is a route for getting RD by memberID. */
  app.get(
    "/api/rdeposit/:memberID",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getRdbyid
  );
};
