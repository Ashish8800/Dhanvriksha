const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

// import dependency
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/**
 *This is the signup function. It is creating a new Employees and saving it to the database.
 * Employees saved in database on the basis of Roles (Admin, Branch Manager, Feild Officer).
 * @function signup
 * @param {obj} req - Contains key-value pairs of signup data (username, email, password) which is coming from client.
 * @param {obj} res - All signup content of the response from the client site.
 */
exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
     /* This is a Role.findOne function. It is finding the role by name. */
      Role.findOne({ name: "ADMIN" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

/**
 * This is the signin function. It is finding the employees by email and password.
 * @function signin
 * @param {obj} req - this parameter is used to employees can login using their registered Email ID/Employee ID and Password.
 * @param {obj} res - all signin content of the response from the client site.
 * implementing a JWT-based authentication for web authentication
 * */
exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

     /* This is a JWT token. */
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      /* This is a for loop. It is used to iterate over the user roles. */
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
exports.updateProfile = (req, res) => {};
