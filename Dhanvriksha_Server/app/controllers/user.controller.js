/* Exporting the allAccess function. */
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

/* Exporting the userBoard function. */
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

/* Exporting the adminBoard function. */
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

/* Exporting the hrBoard function. */
exports.hrBoard = (req, res) => {
  res.status(200).send("Hr Content.");
};

/* Exporting the managerBoard function. */
exports.managerBoard = (req, res) => {
  res.status(200).send("mangaer Content.");
};
