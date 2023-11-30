const mongoose = require("mongoose");

/* A function that validates the email address. */
var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

/* Define a schema for the "user" model */
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    /* Validating the email address. */
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: String,
    /* Creating a relationship between the user and the role. */
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

/* Exporting the User model. */
module.exports = User;
