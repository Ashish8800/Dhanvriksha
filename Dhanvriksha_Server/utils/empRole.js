const EmpRoleSchema = require("../models/empRoleSchema");

/**
 * It saves the new role to the database
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const addEmpRole = async (req, res) => {

  try {
    newRole = {};

    /* This is checking if the roleDisplayName is Admin or admin and if it is, it is creating a new role
  with the roleId of 1, roleName of Admin, and roleDisplayName of whatever the user entered. */
    if (
      req.body.roleDisplayName == "Admin" ||
      req.body.roleDisplayName == "admin"
    ) {
      newRole = new EmpRoleSchema({
        roleId: 1,
        roleName: "Admin",
        roleDisplayName: req.body.roleDisplayName,
      });
    } /* This is checking if the roleDisplayName is Field Officer or field officer and if it is, it is
    creating a new role with the roleId of 2, roleName of FO, and roleDisplayName of whatever the user entered. */ 
      else if (
      req.body.roleDisplayName == "Field Officer" ||
      req.body.roleDisplayName == "field officer" ||
      req.body.roleDisplayName == "Field Manager" ||
      req.body.roleDisplayName == "field manager"
    ) {
      newRole = new EmpRoleSchema({
        roleId: 2,
        roleName: "FO",
        roleDisplayName: req.body.roleDisplayName,
      });
    } /* This is checking if the roleDisplayName is Branch Manager or branch manager and if it is, it is
    creating a new role with the roleId of 3, roleName of BM, and roleDisplayName of whatever the user entered. */ 
    else if (
      req.body.roleDisplayName == "Branch Manager" ||
      req.body.roleDisplayName == "branch manager"
    ) {
      newRole = new EmpRoleSchema({
        roleId: 3,
        roleName: "BM",
        roleDisplayName: req.body.roleDisplayName,
      });
    }

    let savedRole = await newRole.save();

    return res.status(201).json({
      data: savedRole,
      message: `Successfully saved the Role`,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to save the Role`,
      success: false,
    });
  }
};

/**
 * This function is used to get all the employee roles from the database
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getAllEmpRole = async (req, res) => {
  EmpRoleSchema.find().then(function (role) {
    res.send(role);
  });
};

/**
 * It updates the role of an employee
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 * @returns a status code of 200, a message, a success boolean, and the data.
 */
const updateEmpRole = async (req, res) => {
  try {
    let role = await EmpRoleSchema.find({ roleId: req.body.roleId });
    if (!role) {
      return res.status(404).json({
        message: `User not found.`,
        success: false,
      });
    }

    /* Updating the role of an employee. */
    const roleId = req.params.roleId;
    if (req.body.roleDisplayName) {
      await EmpRoleSchema.updateOne(
        { roleId },
        {
          roleDisplayName: req.body.roleDisplayName,
          disabled: req.body.disabled,
        }
      );
    }
    if (req.body.disabled) {
      await EmpRoleSchema.updateOne(
        { roleId },
        { disabled: req.body.disabled }
      );
    }
    let newrole = await EmpRoleSchema.findOne({ roleId });

    return res.status(200).json({
      message: `Role updated successfully`,
      success: true,
      data: newrole,
    });
  } catch (err) {
    return res.status(201).json({
      message: `Unable to update`,
      success: false,
    });
  }
};
/* Exporting the functions to be used in other files. */
module.exports = { addEmpRole, getAllEmpRole, updateEmpRole };
