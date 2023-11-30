const router = require("express").Router();

const { addNewEmpReg,getAllEmp } = require("../utils/emp");


/* employee Registration Route, this is a route that is used to add a new employee to the database. */
router.post("/addNewEmpReg", async (req, res) => {
  await addNewEmpReg(req,res);
});

/* This is a route that is used to get all the employees from the database. */
router.get("/getAllEmp", async (req, res) => {
  await getAllEmp(req, res);
});

/* This is a way to export the router object so that it can be used in other files. */
module.exports = router;
