const router = require("express").Router();

const {
  userRegistration,
  userLogin,
  userVerification,
  usersList,
  tokensList,
  getUser,
  updateUser,
  updateAdminUser,
  newLoginUser,
  newLoginUserValidate,
} = require("../utils/Auth");

//user Verification
router.get("/verify/:id/:token", async (req, res, next) => {
  await userVerification(req, res);
});

//user Registration Route
router.post("/register-user", async (req, res) => {
  await userRegistration(req.body, req.body.role, res);
});

//admin Registration Route
router.post("/register-admin", async (req, res) => {
  await userRegistration(req.body, "admin", res);
});

//vender Registration Route
router.post("/register-vender", async (req, res) => {
  await userRegistration(req.body, "vendor", res);
});

//deliveryman Registration Route
router.post("/register-deliveryman", async (req, res) => {
  await userRegistration(req.body, "deliveryman", res);
});

//Login

/* This is a route that is used to login the user. */
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, res);
});

/* This is a route that is used to login the admin. */
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, res);
});

/* This is a route that is used to get the list of users. */
router.get("/usersList", function (req, res) {
  usersList(req, res);
});

/* This is a route that is used to get the list of tokens. */
router.get("/tokensList", function (req, res) {
  tokensList(req, res);
});

/* This is a route that is used to post the user's email and password. */
router.post("/getuser/", function (req, res) {
  getUser(req, res);
});

/* This is a route that is used to update the emp's email and password. */
router.post("/updateuser/", function (req, res) {
  updateUser(req, res);
});

/* This is a route that is used to update the admin's email and password. */
router.post("/updateAdminUser/", function (req, res) {
  updateAdminUser(req, res);
});

/* This is a route that is used to validate the emp's email and password. */
router.post("/newLogin", async (req, res) => {
  newLoginUser(req, res);
});

/* This is a route that is used to validate the emp's email and password. */
router.post("/newLoginUserValidate", async (req, res) => {
  newLoginUserValidate(req, res);
});

/* Exporting the router object to be used in the main app.js file. */
module.exports = router;
