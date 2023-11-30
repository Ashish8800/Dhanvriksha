const { authJwt } = require("../middlewares");
const controller = require("../controllers/fixedDeposit.controlller");
const upload = require("../middlewares/upload");

//Fixed deposit registration
module.exports = function (app) {
  /* This is a middleware that is used to allow the request to be sent from the frontend to the backend. */
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  /* This is a route that is used to create a fixed deposit. */
  app.post(
    "/api/fixedDeposit",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    upload.send,
    controller.createFD
  );
  /* This is a route that is used to get all the fixed deposit details. */
  app.get(
    "/api/fixedDeposit",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getAllFD
  );
  /* This is a route that is used to get the fixed deposit details of a particular memberId. */
  app.get(
    "/api/fixedDeposit/:memberID",
    [authJwt.verifyToken(["ADMIN", "BM", "FO"])],
    controller.getFDbyId
  );
};
