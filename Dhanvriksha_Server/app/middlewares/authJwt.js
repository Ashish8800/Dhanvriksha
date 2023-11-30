const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.employee;
const Role = db.role;
const Employee = db.employee;

/* This is a middleware function that is used to verify the token and check the user role. */
verifyToken = (allowedRoles) => (req, res, next) => {

  try {
   /* Getting the token from the header. */
    let token = req.headers["authorization"];
   /* This is checking if the token is present in the header. */
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
    /*get employees Roles from here and verify JWT according to roles(Admin, FO and BM)*/
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized! " + err.message + " " + token });
      }
      req.userId = decoded.id;
      User.findById(req.userId).exec((err, user) => {
        if (err || user === null) {
          let mess = err;
          if (user === null) {
            mess = "Please login again.";
          }
          res.status(500).send({ message: mess });
          return;
        }
        Role.find(
          {
            _id: { $in: user.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            for (let i = 0; i < roles.length; i++) {
              if (allowedRoles.includes(roles[i].name)) {
                next();
                return;
              }
            }

            res.status(403).send({ message: "Require either of " + allowedRoles.map((role) => role) + " Roles!" });
            return;
          }
        );
      });
    });
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }
};

/* This is a middleware function that is used to verify the token and check the Admin employees role. */
isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "ADMIN") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

/* This is a middleware function that is used to verify the token and check the BM employees role. */
isBM = (req, res, next) => {
  Employee.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "BM") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require BM Role!" });
        return;
      }
    );
  });
};

/* This is a middleware function that is used to verify the token and check the FO employees role. */
isFO = (req, res, next) => {
  Employee.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "FO") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require FO Role!" });
        return;
      }
    );
  });
};

/* This is exporting the functions to be used in other files. */
const authJwt = {
  verifyToken,
  isAdmin,
  isFO,
  isBM,
};
module.exports = authJwt;
