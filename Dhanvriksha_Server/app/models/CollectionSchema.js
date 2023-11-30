const mongoose = require("mongoose");

const Collection = mongoose.model(
  "Collection",
  new mongoose.Schema(
    {
      applicationId: {
        type: String,
      },
      collectionDate: {
        type: String,
        // default:Date.now()
      },
      paymentMethod: {
        type: String,
        // enum: ["Cash", "Online"],
      },
      collectionAmount: {
        type: Number,
      },
      branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
      serviceType:{
        type: String,
      }
    },

    { timestamps: true }
  )
);
module.exports = Collection;



