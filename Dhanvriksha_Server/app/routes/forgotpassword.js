const { User } = require("../models/userSchema");
const Token = require("../models/tokenSchema");
const sendEmail = require("../utils/email");
const sendHtmlEmail = require("../utils/htmlemail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

/* This is the first step in the password reset process. It is triggered when the user clicks on the
"Forgot Password" link on the login page. The user is then prompted to enter their email address.
This email address is then validated using Joi. If the email address is valid, the user is then
searched for in the database. If the user is found, a token is generated and sent to the user's
email address. */
router.post("/", async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "Error validating email." });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(201).json({
        success: false,
        message: "The email address entered doesnt exists in our database.",
      });

    let token;
    /* This is checking if the token is already generated. If it is not, it generates a new token and
   saves it to the database. */
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: Math.floor(1000 + Math.random() * 9000),
      }).save();
    }
    /* This is sending an email to the user's email address. */
    await sendHtmlEmail(user.email, "Verification Code", token.token);

    res.status(200).json({
      success: true,
      message: "A verification code has been sent to your email account",
    });
  } catch (error) {
    success: false, res.status(201).json({ message: "An error occured" });
  }
});

/* This is the second step in the password reset process. It is triggered when the user enters the
verification code sent to their email address. The code is then validated using Joi. If the code is
valid, the token is then searched for in the database. If the token is found, it is then deleted
from
the database. The user's id is then sent to the frontend. */
router.post("/verifycode", async (req, res) => {
  try {
    /* This is validating the code entered by the user. If the code is valid, it is then searched for
    in the database. */
    const schema = Joi.object({ code: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    let code = req.body.code;
    const tokenFound = await Token.findOne({
      token: code,
    });
    if (!tokenFound)
      return res.status(400).json({ message: "Invalid code or expired" });

    await tokenFound.delete();

    res.json({
      userId: tokenFound.userId,
      message: "Code verified.",
      success: true,
    });
  } catch (error) {
    res.json({ message: "An error occured" });
  }
});

/* This is the third step in the password reset process. It is triggered when the user enters the
new password. The password is then hashed using bcrypt. The user's password is then updated in the
database. */
router.post("/newpassword", async (req, res) => {
  try {
    let userId = req.body.id;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "User not found" });
    let newPassword = await bcrypt.hash(req.body.password, 12);
    await User.updateOne({ _id: userId }, { password: newPassword });

    res.json({
      userId: userId,
      message: "Successfully resetted password.",
      success: true,
    });
  } catch (error) {
    res.json({ message: "An error occured" });
  }
});

/* This is exporting the router to be used in the app.js file. */
module.exports = router;
