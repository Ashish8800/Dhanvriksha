const multer = require("multer");
const db = require("../models");
const Member = db.member;
const Branch = db.branch;

let id = "";
let total = 0;

/* Creating a directory called uploads in the root of the project. */
const DIR = "./uploads/";

let name = "";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },

    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),

 /* Checking the file type. */
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, .mp4 and .jpeg format allowed!"));
    }
  },
});

/* This is a function that is being exported. */
exports.send = (req, res, next) => {
  return upload.array("images")(req, res, () => {
    next();
  });
};
