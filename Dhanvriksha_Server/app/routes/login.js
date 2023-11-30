const router = require("express").Router();

const { loginUser, resetpwd, forgetpwd } = require("../utils/login");

//user Registration Route

/* This is a route that is used to login the employee. */
router.post("/loginUser", async (req, res) => {
  await loginUser(req, res);
});
/* This is a route that is used to forget the password of the employee. */
router.post("/forgetpwd", async (req, res) => {
  await forgetpwd(req, res);
});

/* This is a route that is used to reset the password of the employee. */
router.post("/resetpwd", async (req, res) => {
  await resetpwd(req, res);
});

/* Exporting the router object. */
module.exports = router;
