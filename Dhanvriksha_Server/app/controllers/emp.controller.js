const db = require("../models");
const config = require("../config/auth.config");
const Role = db.role;
const Employee = db.employee;
const sendHtmlEmail = require("./passwordEmail.controller");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { generateOTP } = require("../../utils/CommonUtils");

/**
 * It takes a number and a length, and returns the number padded with zeros to the left until it
 * reaches the specified length
 * @param n - The number to be padded.
 * @param length - The length of the string to be returned.
 * @returns a string of zeros that is the length of the difference between the length of the number and
 * the length of the number plus the length of the number.
 */
function pad(n, length) {
  var len = length - ("" + n).length;
  return (len > 0 ? new Array(++len).join("0") : "") + n;
}

/**
 * It creates a string of 6 random characters from the alphabet and numbers
 * @returns A random string of 6 characters
 */
function makePassword() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    const randomVar = Math.random();
    result += characters.charAt(Math.floor(randomVar * charactersLength));
  }

  return result;
}

/**
 * This function is used to add a new employee to the database.
 * @function addEmp
 * @param {obj} req - employees data coming from client side.
 * @param {obj} res - employees data going to client.
 * employee Id created on the length of employees.
 */
exports.addEmp = async (req, res) => {
  let totalEmp = 0;
  await Employee.find().then(function (emp) {
    totalEmp = emp.length;
  });
  /**
   * If the user doesn't provide a password, generate a random one
   * @returns A password.
   */
  const handlePassword = () => {
    var pass = req.body.password;
    if (!pass) {
      return makePassword();
    } else {
      return pass;
    }
  };
  const userPassword = handlePassword();
  var encryptedPass = bcrypt.hashSync(userPassword, 8);
  /* This is creating a new employee object. */
  const newEmp = new Employee({
    name: req.body.name,
    empId: "DNEMP" + pad(totalEmp + 1, 3),
    name: req.body.name,
    password: encryptedPass,
    email: req.body.email,
    mobile: req.body.mobile,
    address: req.body.address,
    reportingPerson: req.body.reportingPerson,
    branch: req.body.branch,
    status: req.body.status,
    area: req.body.area,
  });
  await sendHtmlEmail(
    "password",
    req.body.email,
    "Your password",
    userPassword
  );
  /*new employee saved as per role in database*/
  newEmp.save((err, user) => {
    if (err) {
      res.status(500).send({ success: false, message: err });
      return;
    }

    if (req.body.roles) {
      /* This is used to find the role of the employee. */
      Role.find(
        {
          name: req.body.roles,
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ success: false, message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ success: false, message: err });
              return;
            }

            res.send({
              success: true,
              message: "Employee was added successfully!",
              data: {
                id: user._id,
                empId: user.empId,
                email: user.email,
              },
            });
          });
        }
      );
    } else {
      /* This is used to find the Admin role of the employee. */
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

          res.send({
            data: {
              id: user._id,
              empId: user.empId,
              email: user.email,
              password: user.password,
            },
          });
        });
      });
    }
  });
};

/* This function is used to verify OTP and update the password of the employee. */
exports.verifyOTPUpdatePass = async (req, res) => {
  Employee.findOne({
    $or: [
      {
        email: req.body.email,
      },
      { empId: req.body.email },
    ],
  })
    .populate("roles", "-__v")
    .exec((err, emp) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!emp) {
        return res.status(404).send({ message: "Emp Not found." });
      }
      /* This is checking if the OTP entered by the user is the same as the OTP sent to the user. */
      if (req.body.otp !== emp.otp) {
        return res
          .status(404)
          .send({ success: false, message: "OTP does not match." });
      }
      /* Checking if the new password and the confirm password are the same. */
      if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(404).send({
          success: false,
          message: "Password and Confirm Password does not match.",
        });
      }
      /* Encrypting the password. */
      var encryptedPass = bcrypt.hashSync(req.body.newPassword, 8);
      emp.password = encryptedPass;
      emp.save(function (err) {
        if (err) return res.status(500).send(err);
        return res.status(200).send({
          data: {
            email: emp.email,
          },
          success: true,
          message: "Password updated successfully",
        });
      });
    });
};

/* This function is used to send an OTP to the employee's email address. */
exports.forgotPass = async (req, res) => {
  /* This is used to find the employee by the email or the employee id. */
  Employee.findOne({
    $or: [
      {
        email: req.body.email,
      },
      { empId: req.body.email },
    ],
  })
    /* Used to populate the roles of the employee. */
    .populate("roles", "-__v")
    .exec((err, emp) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      Employee.findOne({ empId: req.params.empId })
        .populate("roles")
        .populate("branch")
        .populate("reportingPerson")
        .then(function (empDetails) {
          res.send(empDetails);
        });
      if (!emp) {
        return res
          .status(200)
          .send({ success: false, message: "Emp Not found." });
      }
      let otp = generateOTP();
      sendHtmlEmail("otp", emp.email, "Your password", otp);
      emp.otp = otp;
      emp.save(function (err) {
        if (err) return res.status(500).send(err);
        return res.status(200).send({
          data: {
            email: emp.email,
          },
          success: true,
          message: "OTP sent successfully to the registered email.",
        });
      });
    });
};

/**
 * This function is used to sign in the employee.
 * @function signin
 * @param {obj} req - employee data {email,empId,password,role) coming from client side.
 * @param {obj} res - all employee data of the response from the client.
 * use JWT token for authentication*/
exports.signin = (req, res) => {
  Employee.findOne({
    $or: [
      {
        email: req.body.email,
      },
      { empId: req.body.email },
    ],
  })
    .populate("roles", "-__v")
    .exec((err, emp) => {
      if (err) {
        res.status(500).send({ success: false, message: err });
        return;
      }
      if (!emp) {
        return res
          .status(201)
          .send({ success: false, message: "Invalid Credentials." });
      }
      if (!emp.status) {
        return res
          .status(201)
          .send({ success: false, message: "Emp status not active." });
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, emp.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Credentials!",
          success: false,
        });
      }

      /* This is used to create a token for the employee. */
      var token = jwt.sign({ id: emp.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      /* This is used to push the roles of the employee to the authorities array. */
      for (let i = 0; i < emp.roles.length; i++) {
        authorities.push("ROLE_" + emp.roles[i].name.toUpperCase());
      }
      /* This is used to send the employee details to the client side. */
      res.status(200).send({
        id: emp._id,
        empId: emp.empId,
        email: emp.email,
        roles: authorities,
        accessToken: token,
        name: emp.name,
        success: true,
        message: "Login successful",
      });
    });
};

/* This is a function that is used to get all the roles from the database. */
exports.getAllRole = async (req, res) => {
  try {
    await Role.find({})
      .then((roles) => {
        res.json(roles);
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* This is a function that is used to get all the employees from the database. */
exports.getAllEmp = async (req, res) => {
  try {
    await Employee.find({})
      //populate the collection of roles, branch, area and reporting person
      .populate("roles")
      .populate("branch")
      .populate("area")
      .populate("reportingPerson", ["name", "empId"])
      .then((user) => {
        res.json(user);
      })

      .catch((err) => {
        throw err;
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
/* This is a function that is used to search all the employees on the basis of roles from the database. */
exports.searchEmp = async (req, res) => {
  try {
    await Employee.find({
      $or: [{ name: { $regex: req.params.key } }],
    })
      .populate("roles")
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
/**
 * This is a function that is used to get all the employees on the basis of Ids from the database.
 * @param {req} "req.params.empId getting empId whose details is to be get".
 * @param {res} sending employees data going to client */
exports.getEmpbyId = async (req, res) => {
  try {
    /*Finding a employee with the empId */
    Employee.findOne({ empId: req.params.empId })
      .populate("roles")
      .populate("branch")
      .populate("reportingPerson")
      .then(function (empDetails) {
        res.send(empDetails);
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/** Finding the employee by the employee id and updating the employee details.
 * @param {req } "req.params.empId getting empId whose details is to be updated
 * @param {req } "req.body emp new details that is to be updated
 * @param {res }    "sending updated employee details"
 * @function updateEmployee
 */
exports.updateEmployee = async (req, response) => {
  try {
    let newEmp = Employee.findOneAndUpdate(
      { empId: req.params.empId },
      { ...req.body },
      { new: true, useFindAndModify: false },
      (err, newemp1) => {
        if (err) return response.json({ success: false, err });
        response.status(200).json({
          data: newemp1,
          success: true,
          message: "Employee Updated Sucessfully",
        });
      }
    );
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
