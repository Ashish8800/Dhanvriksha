const router = require("express").Router();

const {
  addEmpRole,
  getAllEmpRole,
  updateEmpRole,
} = require("../utils/empRole");

//employee Registration Route

/* This is a route for adding a new role to the employee. */
router.post("/addEmpRole", async (req, res) => {
  await addEmpRole(req, res);
});

/* This is a route for getting all the roles of the employees. */
router.get("/getAllEmpRole", async (req, res) => {
  await getAllEmpRole(req, res);
});

/* This is a route for updating the role of an employee. */
router.post("/updateEmpRole/:roleId", async (req, res) => {
  await updateEmpRole(req, res);
});

/* This is a way to export the router object so that it can be used in other files. */
module.exports = router;
