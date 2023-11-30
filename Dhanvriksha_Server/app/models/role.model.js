const mongoose = require("mongoose");

/* Creating a new model called Role. */
const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    name: String,
  })
);
/* Exporting the Role model. */
module.exports = Role;
