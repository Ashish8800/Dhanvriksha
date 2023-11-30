const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* Define a schema for the "token" model */
const tokenSchema = new Schema({
  /* This is a reference to the user model. */
  userId: {
    type: String,
    ref: "user",
    required: true,
  },
  /* Creating a field called "token" in the database. The type of the field is "String" and it is
 required. */
  token: {
    type: String,
    required: true,
  },
  /* Setting the default value of the createdAt field to the current date and time. It is also setting
 the expiration time of the token to 3600 seconds (1 hour). */
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

/* Creating a model called "token" using the schema "tokenSchema" */
const Token = mongoose.model("token", tokenSchema);

/* Exporting the Token model so that it can be used in other files. */
module.exports = Token;
