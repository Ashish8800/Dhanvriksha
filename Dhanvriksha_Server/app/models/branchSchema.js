const mongoose = require("mongoose");
/* Define a schema for the "Branch" model */
const Branch = mongoose.model(
  "Branch",
  new mongoose.Schema({
    branchId: String,
    branchName: String,
    description: String,
    activeStatus: Boolean, 
  })
);
/* Exporting the Branch model so that it can be used in other files. */
module.exports = Branch;
