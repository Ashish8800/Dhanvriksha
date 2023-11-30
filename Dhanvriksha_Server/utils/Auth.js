const { User } = require("../models/userSchema");
const { validate } = require("../models/userSchema");
const EmailToken = require("../models/tokenSchema");
const bcrypt = require("bcryptjs");
const crypto = import("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const sendHtmlEmail = require("../utils/verificationemail");

const Joi = require("joi");
const Token = require("../models/tokenSchema");
/**
 * @DESC To register the user (admin, user, vender, deliveryman)
 */

const userRegistration = async (userData, role, res) => {
  try {
    //validate user name

    let usernameNotTaken = await validateUserName(userData.name);

    if (!usernameNotTaken) {
      return res.status(200).json({
        message: `This username is already registered with us`,
        success: false,
      });
    }

    //validate user email
    let useremailNotTaken = await validateUserEmail(userData.email);

    if (!useremailNotTaken) {
      return res.status(200).json({
        message: `This email address is already registered with us`,
        success: false,
      });
    }
    let usermobileNotTaken = await validateUserMobile(userData.mobile);

    if (!usermobileNotTaken) {
      return res.status(200).json({
        message: `This mobile number is already registered with us.`,
        success: false,
      });
    }
    //get hashed password
    //const password = await bcrypt.hash(userData.password, 12);
    //create new user
    const newUser = new User({
      ...userData,
      password,
      role,
    });

    let savedUser = await newUser.save();

    let emailtoken = await new EmailToken({
      userId: newUser._id,
      token: (await crypto).randomBytes(32).toString("hex"),
    }).save();

    if (role == "admin") {
      return res.status(201).json({
        message: `Admin successfully registered`,
        success: true,
      });
    }
    if (role == "vendor" || role == "deliveryman") {
      const message = `${process.env.BASE_URL}/api/users/verify/${newUser._id}/${emailtoken.token}`;
      {
        /*await sendEmail(newUser.email, "Verify Email", message);*/
      }
      await sendHtmlEmail(newUser.email, "Verification Email", message);
      return res.status(201).json({
        message: `An Email sent to admin for approval, Please verify your email by clicking on the link in your email.`,
        success: true,
      });
    } else {
      const message = `${process.env.BASE_URL}/api/users/verify/${newUser._id}/${emailtoken.token}`;
      await sendHtmlEmail(newUser.email, "Verification Email", message);
      return res.status(201).json({
        message: `A verfication link has been sent to you email address. Please click on it to verify your email.`,
        success: true,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: `Unable to register`,
      success: false,
    });
  }
};

/**
 * It checks if the user exists, if the token exists, if the user is a customer, and if the user is a
 * customer, it updates the user's status to active
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that is called when the middleware is complete.
 * @returns The user is being returned.
 */
const userVerification = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).send("Invalid link");
    const token = await EmailToken.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(500).json({
        message: `Invalid link`,
      });
    if (user.role == "customer") {
      await User.updateOne({ _id: user._id }, { status: "active" });
    }
    await EmailToken.findByIdAndRemove(token._id);
    return res.status(201).send("Your Email id is successfully verified");
  } catch (error) {
    res.send("An error occured");
  }
};

/**
 * It finds all users in the database that are not admins and sends them back to the client
 * @param req - The request object. This object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const usersList = async (req, res) => {
  User.find({ role: { $ne: "admin" } }).then(function (users) {
    res.status(200).send(users);
  });
};

/**
 * It finds all the users in the database whose role is equal to deliveryman and sends them back to the
 * client
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getAlldeliveryman = async (req, res) => {
  User.find({ role: { $eq: "deliveryman" } }).then(function (users) {
    res.send(users);
  });
};

/**
 * This function takes in a request and a response object, and if the request body contains an ID, it
 * will find the user with that ID and send it back in the response
 * @param req - The request object and it is coming from client side.
 * @param res - The response object.
 */
const getUser = async (req, res) => {
  if (req.body._id != "") {
    User.findOne({ _id: req.body._id }).then(function (user) {
      res.send(user);
    });
  } else {
    res.send({ message: "No ID received" });
  }
};

/**
 * It updates the user's details
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 * @returns a promise.
 */
const updateUser = async (req, res) => {
  try {
    let user = await User.find({ _id: req.body._id });

    let toUpdateUser = {};
    const _id = req.body._id;
    if (req.body.name) {
      toUpdateUser = { ...toUpdateUser, name: req.body.name };
    }
    if (req.body.email) {
      toUpdateUser = { ...toUpdateUser, email: req.body.email };
    }
    if (req.body.mobile) {
      toUpdateUser = { ...toUpdateUser, mobile: req.body.mobile };
    }
    if (req.body.address) {
      toUpdateUser = { ...toUpdateUser, address: req.body.address };
    }
    if (req.body.currentLocation) {
      toUpdateUser = {
        ...toUpdateUser,
        currentLocation: req.body.currentLocation,
      };
    }

    let password;
    if (req.body.password) {
      password = req.body.password;
    }
    let status;
    if (req.body.status) {
      status = req.body.status;
    }

    let newPassword;
    if (password) {
      newPassword = await bcrypt.hash(password, 12);
    }
    if (!user) {
      return res.status(404).json({
        message: `User not found.`,
        success: false,
      });
    }

    if (password) {
      if (status) {
        await User.updateOne(
          { _id },
          { ...toUpdateUser, password: newPassword }
        );
      } else {
        await User.updateOne(
          { _id },
          { ...toUpdateUser, password: newPassword }
        );
      }
    } else {
      if (status) {
        await User.updateOne({ _id }, { status, ...toUpdateUser });
      } else {
        await User.updateOne({ _id }, { ...toUpdateUser });
      }
    }
    let newuser = await User.findOne({ _id });

    return res.status(200).json({
      message: `User updated successfully`,
      success: true,
      data: newuser,
    });
  } catch (err) {
    return res.status(201).json({
      message: `Unable to update`,
      success: false,
    });
  }
};

/**
 * It updates the admin user details
 * @param req - The request object.
 * @param res - The response object.
 * @returns a json object with a message and a success property.
 */
const updateAdminUser = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.body._id });

    if (!user) {
      return res.status(404).json({
        message: `User not found.`,
        success: false,
      });
    }
    const _id = req.body._id;
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    let password;
    let newpassword;
    if (req.body.password) {
      password = req.body.password;
      newpassword = req.body.newpassword;
    }
    let newHashpassword;
    if (req.body.password) {
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(200).json({
          message: `Incorrect old Password.`,
          success: false,
        });
      }

      if (req.body.password) {
        newHashpassword = await bcrypt.hash(newpassword, 12);
      }
    }
    if (req.body.password) {
      await User.updateOne(
        { _id },
        { name, email, mobile, password: newHashpassword }
      );
    } else {
      await User.updateOne({ _id }, { name, email, mobile });
    }
    /* Finding a user by their id. */
    let newuser = await User.findOne({ _id });

    return res.status(200).json({
      message: `Admin updated successfully`,
      success: true,
      user: newuser,
    });
  } catch (err) {
    return res.status(201).json({
      message: `Unable to update`,
      success: false,
    });
  }
};

/**
 * It takes the code from the user, checks if the code is valid and if it is, it deletes the code from
 * the database and returns a token to the user
 * @param req - The request object.
 * @param res - The response object.
 * @returns The user is being returned.
 */
const newLoginUserValidate = async (req, res) => {
  try {
    let code = req.body.code;
    const tokenFound = await Token.findOne({
      token: code,
      userId: req.body.email,
    });
    if (!tokenFound)
      return res
        .status(400)
        .json({ message: "Invalid code or expired", success: false });

    await tokenFound.delete();

    if (tokenFound) {
      const user = await User.findOne({ email: req.body.email });
      let token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          username: user.name,
          email: user.email,
        },
        process.env.SECRETE_KEY,
        { expiresIn: "7 days" }
      );
      let result = {
        username: user.name,
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        currentLocation: user.currentLocation,
        token: `Bearer ${token}`,
        expiresIn: 168,
      };
      res.json({
        user: result,
        message: "Code verified.",
        success: true,
      });
    }
  } catch (error) {
    res.json({ message: "An error occured", success: false });
  }
};

/**
 * It takes in an email address, checks if it exists in the database, if it does, it generates a random
 * 4 digit number and sends it to the email address
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const newLoginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const newUser = new User({
        email: req.body.email,
        role: req.body.role,
      });
      let savedUser = await newUser.save();
    }
    let token;

    if (!token) {
      token = await new Token({
        userId: req.body.email,
        token: Math.floor(1000 + Math.random() * 9000),
      }).save();
    }
    await sendHtmlEmail(user.email, "Login Code", token.token);

    res.status(200).json({
      success: true,
      message: "An OTP has been sent to your email account",
      otp: token.token,
    });
  } catch (error) {
    success: false, res.status(201).json({ message: "An error occured" });
  }
};

/**
 * It takes in user credentials, checks if the user is in the database, checks if the user is active,
 * checks if the user has the right role, checks if the password is correct, and if all of that is
 * true, it signs a token and returns it to the user
 * @param userCredentials - This is the object that contains the user's email and password.
 * @param res - The response object.
 */
const userLogin = async (userCredentials, res) => {
  let { email, password, role } = userCredentials;

  //first check user is in database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      message: `Invalid Credentials.`,
      success: false,
    });
  }

  if (user.status != "active") {
    let replyMessage = "";
    user.role == "customer"
      ? (replyMessage = "Please verify your Email Address before login.")
      : (replyMessage =
          "Please wait for Admin to approve your registration request.");
    return res.status(200).json({
      message: replyMessage,
      success: false,
    });
  }
  if (user) {
  }
  if (role && role.includes("+")) {
    let roleArray = role.split("+");

    if (!roleArray.includes(user.role)) {
      return res.status(200).json({
        message: `You are not allowed to login into this application`,
        success: false,
      });
    }
  }
  //check role
  if (!role.includes("+")) {
    if (user.role != role) {
      return res.status(200).json({
        message: `You are not allowed to login into this application`,
        success: false,
      });
    }
  }

  //check password
  let isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    //sign in the token and issue it to the user
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.name,
        email: user.email,
      },
      process.env.SECRETE_KEY,
      { expiresIn: "7 days" }
    );
    let result = {
      username: user.name,
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };
    return res.status(200).json({
      user: result,
      message: `Login Successful`,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: `Invalid credentials`,
      success: false,
    });
  }
};

/**
 * If a user is found with the given name, return false, otherwise return true.
 * @param name - The name of the user.
 * @returns A boolean value.
 */
const validateUserName = async (name) => {
  let user = await User.findOne({ name });
  return user ? false : true;
};

/**
 * It takes an email address as an argument, searches the database for a user with that email address,
 * and returns true if no user is found, and false if a user is found
 * @param email - The email address to validate.
 * @returns A boolean value.
 */
const validateUserEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

/**
 * It returns true if the mobile number is not found in the database, else it returns false
 * @param mobile - The mobile number of the user.
 * @returns A boolean value.
 */
const validateUserMobile = async (mobile) => {
  let user = await User.findOne({ mobile });
  return user ? false : true;
};

/* The below code is exporting the functions from the user.controller.js file. */
module.exports = {
  userLogin,
  userRegistration,
  userVerification,
  usersList,
  getUser,
  updateUser,
  updateAdminUser,
  newLoginUser,
  newLoginUserValidate,
};
