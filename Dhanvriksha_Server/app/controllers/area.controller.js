const { model } = require("mongoose");
const { pad } = require("../../utils/CommonUtils");
const db = require("../models");
const Area = db.area;

/**
 *This is a function that is being exported to be saved new Area in database.
 *@function - createArea
 * @param {obj} req(request) - area data coming from client side.
 * @param {obj} res(response) - area data going to client.
 */
exports.createArea = async (req, res) => {
  try {
    let totalArea = 0;
    let areaAlreadyExists = false;
    await Area.find({
      areaName: req.body.areaName,
      branch: req.body.branch,
    }).then(function (br) {
      if (br.length > 0) {
        areaAlreadyExists = true;
      }
    });
    if (areaAlreadyExists) {
      return res.status(201).json({
        data: [],
        message: `Area with this name already exists`,
        success: false,
      });
    }
    if (!areaAlreadyExists) {
      await Area.find().then(function (br) {
        totalArea = br.length;
      });
      const addArea = new Area({
        areaId: "DNAR" + pad(totalArea + 1, 3),
        areaName: req.body.areaName,
        description: req.body.description,
        activeStatus: req.body.activeStatus,
        branch: req.body.branch,
      });
      let savedArea = await addArea.save();
      return res.status(200).json({
        data: savedArea,
        message: "Area Created Sucessfully",
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Unable to Create Area`,
      success: false,
    });
  }
};

/**
 * This is a function that is being exported to get all the Area from database.
 *@function - getAllArea
 *@param {obj} req(request) - all Area data coming from client side.
 *@param {obj} res(response) -  All Area data content of the response from the client.
 */

exports.getAllArea = async (req, res) => {
  try {
    const getData = await Area.find({})
    //populate the branch schema
      .populate("branch")
      .then((area) => {
        res.json(area);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/**
 * This is a function that is being exported to get all the Area by Ids.
 * @function - getAreaById
 * @param {obj} req -  the function is using area Id to getting from request.
 * @param {obj} res - sending the area details of the given id.
 */
exports.getAreaById = async (req, res) => {
  try {
    await Area.findOne({ areaId: req.params.id })
      .then((area) => {
        res.json(area);
      })
      .catch((err) => {
        res.json(err);
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/**
 * This is a function that is being exported to update Area by Id.
 * @function updateAreaById
 * @param {obj} req - the function is using areaid to updated data from the request.
 * @param {obj} res -sending the updated area details of the given ids.
 */
exports.updateAreaById = async (req, res) => {
  try {
    await Area.findOneAndUpdate(
      { areaId: req.params.areaId },
      { ...req.body },
      { new: true, useFindAndModify: false }
    ).then((newArea, err) => {
      if (err) return res.status(500).send({ success: false, message: err });
      return res.status(200).send({
        data: newArea,
        success: true,
        message: "Area Updated Sucessfully",
      });
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/**
 * This is a function that is being exported to get all the Area which is basis on Branch Id.
 * @function getAreaByBranchId
 * @param {obj} req - Contains all Area data by branchIds. 
 * @param {obj} res - All Area data of the response from the client site. 
 * */
exports.getAreaByBranchId = async (req, res) => {
  try {
    await Area.find({ branch: req.params.branch })

      .then((areawithbranch) => {
        return res.status(200).send({
          data: areawithbranch,
          success: true,
          message: "",
        });
      })
      .catch((err) => {
        res.json(err);
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
