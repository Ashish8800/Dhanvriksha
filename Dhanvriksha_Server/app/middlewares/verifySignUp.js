const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

/* Checking if the username or email is already in use. */
checkDuplicateUsernameOrEmail = (req, res, next) => {
  /* Checking if the username is already in use. */
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ sucess: false, message: err });
      return;
    }

    if (user) {
      res.status(400).send({ sucess: false, message: "Failed! Username is already in use!" });
      return;
    }

    
  /* Checking if the email is already in use. */
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ sucess: false, message: err });
        return;
      }

      if (user) {
        res.status(400).send({ sucess: false, message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

/* This is a middleware function that checks if the role is valid. */
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    if (!ROLES.includes(req.body.roles)) {
      res.status(400).send({
        sucess: false,
        message: `Failed! Role ${req.body.roles} does not exist!`,
      });
      return;
    }
  }

  next();
};

/* This is exporting the functions to be used in the authController.js file. */
const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
