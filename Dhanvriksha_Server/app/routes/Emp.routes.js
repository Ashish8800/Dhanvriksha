const { authJwt } = require("../middlewares");
const { verifySignUp } = require("../middlewares");
const verifyEmp = require("../middlewares/verifyEmp");
const controller = require("../controllers/emp.controller");
const { application } = require("express");

/* This is a route file for employee. */
module.exports = function (app) {
  app.use(function (req, res, next) {
    /* This is a middleware for allowing the request to be sent from the client side. */
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  /* This is a route for adding employee. */
  app.post(
    "/api/test/addemployee",
    [verifyEmp.checkDuplicateEmpIdOrEmail, verifySignUp.checkRolesExisted],
    [authJwt.verifyToken(["ADMIN", "BM"])],
    controller.addEmp
  );
  /* This is a route for forgot password. */
  app.post("/api/emp/forgotPass", controller.forgotPass);
  /* This is a route for verify OTP. */
  app.post("/api/emp/verifyOTP", controller.verifyOTPUpdatePass);
  /* This is a route for signin. */
  app.post("/api/emp/signin", controller.signin);
  /* This is a route for getting all roles. */
  app.get(
    "/api/role",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAllRole
  );
  /* This is a route for getting all employees. */
  app.get(
    "/api/emp/getAllEmp/",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAllEmp
  );
  /* This is a route for searching employee by key. */
  app.get(
    "/api/emp/search/:key",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.searchEmp
  );
  /* This is a route for getting employee by id. */
  app.get(
    "/api/emp/getEmpbyId/:empId",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getEmpbyId
  );
  /* This is a route for updating employee by id. */
  app.put(
    "/api/emp/updateEmployee/:empId",
    [authJwt.verifyToken(["ADMIN", "BM"])],
    controller.updateEmployee
  );
};
