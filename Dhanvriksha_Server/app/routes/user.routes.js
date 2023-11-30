const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  /* This is a middleware that is used to allow the API to be accessed from any domain. */
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /* This is a route that is all to test the API. */
  app.get("/api/test/all", controller.allAccess);

  /* This is a route that is used to test the API. */
  app.get("/api/test/user", controller.userBoard);
  /* This is a route that is used to test the API. */
  app.get("/api/test/admin", controller.adminBoard);
};
