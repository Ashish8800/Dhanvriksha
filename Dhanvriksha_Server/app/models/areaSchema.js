const mongoose = require("mongoose");
/* Define a schema for the "Area" model */
const Area = mongoose.model(
  "Area",
  new mongoose.Schema({
    areaId: String,
    areaName: String,
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    description: String,
    activeStatus: Boolean,
  })
);
/* Exporting the Area model to be used in other files. */
module.exports = Area;
