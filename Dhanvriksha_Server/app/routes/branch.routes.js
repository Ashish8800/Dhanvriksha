const { authJwt } = require("../middlewares");
const { verifySignUp } = require("../middlewares");
const verifyEmp = require("../middlewares/verifyEmp");
const controller = require("../controllers/branch.controller.");
const { application } = require("express");

/* This is the router for the branch. */
module.exports = function (app) {
  /* This is a middleware that allows the server to accept requests from other domains. */
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  /* This is a route that allows the employee to create a branch. */
  app.post(
    "/api/branch",
    [authJwt.verifyToken(["ADMIN"])],
    controller.createBranch
  );
  /* This is a route that allows the employee to get all the branches. */
  app.get(
    "/api/branch/",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAllBranch
  );
  /* This is a route that allows the employee to get all the branch areas. */
  app.get(
    "/api/branchAreas/",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getBranchAreas
  );
  /* This is a route that allows the employee to get all the branches. */
  app.get(
    "/api/branch/:id",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getBranchById
  );
  /* This is a route that allows the employee to update a branch. */
  app.put(
    "/api/branch/:branchId",
    [authJwt.verifyToken(["ADMIN"])],
    controller.updateBranchById
  );
};
