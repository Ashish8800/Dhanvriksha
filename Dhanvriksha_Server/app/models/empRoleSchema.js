const mongoose = require("mongoose");
/* Define a schema for the "employee roles" model */
const empRoleSchema = mongoose.Schema({
  roleId:{
    type: String,
  },
  roleName: {
    type: String,
  },
  roleDisplayName: {
    type: String,
  },
  disabled:{
    type:String,
    default:"No"
  }
    
});

const EmpRoleSchema = mongoose.model("Role", empRoleSchema);

/* Exporting the model so that it can be used in other files. */
module.exports = EmpRoleSchema;
