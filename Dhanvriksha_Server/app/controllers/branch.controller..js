const { model } = require("mongoose");
const { pad } = require("../../utils/CommonUtils");
const db = require("../models");
const Branch = db.branch;
const Area = db.area;

/**
 * This is a function that is being exported to be saved new branch in database.
 * @function createBranch
 * @param {obj} req - branch data coming from client side.
 * @param {obj} res - sending branch data to client
 */

exports.createBranch = async (req, res) => {
  try {
    let totalBranch = 0;
    let branchAlreadyExists = false;
    await Branch.find({ branchName: req.body.branchName }).then(function (br) {
      if (br.length > 0) branchAlreadyExists = true;
    });
    if (branchAlreadyExists) {
      return res.status(201).json({
        data: [],
        message: `Branch with this name already exists`,
        success: false,
      });
    }
    await Branch.find().then(function (br) {
      totalBranch = br.length;
    });
    const addBranch = new Branch({
      branchId: "DNBR" + pad(totalBranch + 1, 3),
      branchName: req.body.branchName,
      description: req.body.description,
      activeStatus: req.body.activeStatus,
    });
    let savedBranch = await addBranch.save();
    return res.status(201).json({
      data: savedBranch,
      message: "Branch Created Sucessfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Unable to Create Branch`,
      success: false,
    });
  }
};

/*Getting the all branch data from the database. */
exports.getAllBranch = async (req, res) => {
  try {
    const getData = await Branch.find({})
      .then((branch) => {
        res.json(branch);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* Fetching all the branches and then for each branch it is fetching all the areas. */
exports.getBranchAreas = async (req, res) => {
  try {
    let finalRes = [];
    await Branch.find({})
      // .populate("branch", ["id", "branchName"])
      .then((branch) => {
        branch.map((br) => {
          let objBr = {};
          let arrAreas = [];
          Area.find({ branchId: br._id }).then((areas) => {
            areas.map((ar) => {
              let objTemp = {};
              objTemp._id = ar._id;
              objTemp.name = ar.name;
              arrAreas.push(objTemp);
            });
          });
          objBr.areas = arrAreas;
          finalRes.push(objBr);
        });
        res.json(finalRes);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/**
 * this is a function that is being exported to get all the branch by Ids.
 * @function - getBranchById
 * @param {obj} req - the function is using branch Id to getting from request.
 * @param {obj} res - sending the branch details of the given Ids.
 */
exports.getBranchById = async (req, res) => {
  try {
    await Branch.findOne({ branchId: req.params.id })
      .then((branch) => {
        res.json(branch);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* This is a function that is being exported to update the branch by Id. */
exports.updateBranchById = async (req, res) => {
  /* The below code is updating the branch details. */
  try {
    /*Finding and updating a branch with the branchId that is passed in the request body.*/ 
    await Branch.findOneAndUpdate(
      { branchId: req.params.branchId },
      { ...req.body },
      { new: true, useFindAndModify: false }
    ).then((newBranch, err) => {
      if (err) return res.status(500).send({ success: false, message: err });
      return res.status(200).send({
        data: newBranch,
        success: true,
        message: "Branch Updated Sucessfully",
      });
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
