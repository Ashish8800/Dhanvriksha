const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

/* This is a middleware that is used to allow the client to send a request to the server. */
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  /* A route that is used to sign in a employee. */
  app.post("/api/auth/signin", controller.signin);
};
