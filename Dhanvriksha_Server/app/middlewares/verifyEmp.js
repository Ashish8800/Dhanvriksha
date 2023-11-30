const db = require("../models");
const ROLES = db.ROLES;
const Employee = db.employee;

/* Checking if the email is already in use. */
checkDuplicateEmpIdOrEmail = (req, res, next) => {
  Employee.findOne({
    email: req.body.email,
  }).exec((err, emp) => {
    if (err) {
      res.status(500).send({ sucess: false, message: err.message });
      return;
    }

    if (emp) {
      res
        .status(201)
        .send({ sucess: false, message: "Failed! Email is already in use!" });
      return;
    }

    next();
  });
};

/* Exporting the function to be used in the routes. */
const verifyEmp = {
  checkDuplicateEmpIdOrEmail,
};
module.exports = verifyEmp;
