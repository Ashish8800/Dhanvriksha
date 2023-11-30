const { authJwt } = require("../middlewares");

const controller = require("../controllers/collection.controller");

/* This is a route that is employee to create a new collection entry. */
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  /* This is a route that is employee to post collection in collection entry. */
  app.post(
    "/api/collection",
    [authJwt.verifyToken(["ADMIN", "FO"])],
    controller.newCollectionEntry
  );
  /* This is a route that is employee to get a collection by applicationId in collection entry. */
  app.get(
    "/api/getCollection/:applicationId",
    [authJwt.verifyToken(["ADMIN", "FO"])],
    controller.getCollection
  );
  /* This is a route that is employee to get a data about application by applicationId. */
  app.get(
    "/api/dataAboutApplication/:applicationId",
    [authJwt.verifyToken(["ADMIN", "FO"])],
    controller.applicationDataForCollectionEntry
  );

  /* This is a route that is employee to post collection sheet with aggrigaration pipeline. */
  app.post(
    "/api/collectionSheetFunction",
    [authJwt.verifyToken(["ADMIN", "FO"])],
    controller.collectionSheetFunction
  );
};
