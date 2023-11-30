const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

/* Importing the user model from the user.model.js file. */
db.user = require("./user.model");
/* Importing the role model from the role.model.js file. */
db.role = require("./role.model");
/* Importing the employee model from the empSchema.js file. */
db.employee = require("./empSchema");
/* Importing the loanSchema.js file. */
db.loan = require("./loanSchema");
/* Importing the branchSchema.js file. */
db.branch = require("./branchSchema");
/* Importing the areaSchema.js file. */
db.area = require("./areaSchema");
/* Importing the fixedDepositSchema.js file. */
db.fixedDeposit = require("./fixedDepositSchema");
/* Importing the memberSchema.js file. */
db.member = require("./memberSchema");
/* Importing the rdSchema.js file. */
db.rd = require("./rdSchema");
/* Defining the roles that can be assigned to a user. */
db.ROLES = ["BM", "ADMIN", "FO"];

/* Exporting the db object. */
module.exports = db;
