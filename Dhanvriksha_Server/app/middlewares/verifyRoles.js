const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.employee;
const Role = db.role;

/* Checking if the user has a role. */
ishavingRole = async (req, res, role) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return false;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          return false;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === role) {
            return true;
          }
        }
      }
    );
    return false;
  });
};

/* Checking if the user has the role. */
ishavingRoles = async (req, res, arrRoles) => {
  let result = [];
  arrRoles.map((role) => {
    ishavingRole(req, res, role).then((res1) => {
      result.push(res1);
    });
  });
  let totalResult = false;
  result.map((oneRes) => {
    if (oneRes) {
      totalResult = true;
    }
  });
  if (!totalResult) {
    res.status(200).send({ success: false, message: "Not Authorized" });
  }
};

/* Exporting the function. */
const verifyRoles = {
  ishavingRoles,
};
module.exports = verifyRoles;
