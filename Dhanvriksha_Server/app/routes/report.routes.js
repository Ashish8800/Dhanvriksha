const { authJwt } = require("../middlewares");

const controller = require("../controllers/report.controller");

module.exports = function (app) {
  /* This is a middleware that allows the server to accept requests from other domains. */
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  /* This is a route to get the daily report. */
  app.get(
    "/api/getDailyReport/:collectionDate",
    [authJwt.verifyToken(["ADMIN"])],
    controller.getDailyReport
  );
  /* This is a route to get the weekly report. */
  app.post(
    "/api/getWeeklyReport",
    [authJwt.verifyToken(["ADMIN"])],
    controller.getWeeklyReport
  );
  /* This is a route to get the monthly report. */
  app.post(
    "/api/getMonthlyReport",
    [authJwt.verifyToken(["ADMIN"])],
    controller.getMonthlyReport
  );
};
