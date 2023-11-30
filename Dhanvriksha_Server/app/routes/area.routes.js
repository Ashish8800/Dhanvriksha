const { authJwt } = require("../middlewares");
const { verifySignUp } = require("../middlewares");
const verifyEmp = require("../middlewares/verifyEmp");
const controller = require("../controllers/area.controller.js");
const { application } = require("express");
/* This is a function that is exporting the routes for the area. */
module.exports = function (app) {
  /* This is a middleware that is allowing the application to accept the authorization header. */
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  /* This is a route that is creating an area. */
  app.post(
    "/api/area",
    [authJwt.verifyToken(["ADMIN"])],
    controller.createArea
  );
  /* This is a route that is getting all the areas. */
  app.get(
    "/api/area/",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAllArea
  );
  /* This is a route that is getting the area by area id. */
  app.get(
    "/api/area/:id",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAreaById
  );
  /* This is a route that is updating the area by area id. */
  app.put(
    "/api/area/:areaId",
    [authJwt.verifyToken(["ADMIN"])],
    controller.updateAreaById
  );
  /* This is a route that is getting the area by branch id. */
  app.get(
    "/api/areabyBranch/:branch",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAreaByBranchId
  );
};
