const { model } = require("mongoose");
const { pad, getId } = require("../../utils/CommonUtils");
const db = require("../models");
const RDeposit = db.rd;
const Branch = db.branch;
const Member = db.member;

/**
 * This is function that is being exported to be created new rd.
 * @function createRd
 * @param {obj} req - recurring deposit data coming from client side.
 * @param {obj} res - recurring deposit data going to client*/
exports.createRd = async (req, res) => {
  let branchId = "";
  /* Finding the branchId from the branch collection. */
  await Branch.findOne({ _id: req.body.branch }).then(function (br) {
    branchId = br.branchId;
  });
  try {
    let newmemberid = req.body.memberId ? req.body.memberId : "";
    if (req.body.newMember === "Yes") {
      newmemberid = await getId("MEMBER", req.body.branch, branchId);
    }
    let totalrd = 0;
    /* Finding the total number of RD in the database. */
    await RDeposit.find().then(function (rddata) {
      totalrd = rddata.length;
    });
    let newrdid = "";
    getId("RD", "01").then((id) => {
      newrdid = id;
      let member = {};
      if (req.body.newMember === "Yes") {
        member = {
          branch: req.body.branch,
          applicantName: req.body.applicantName,
          fatherName: req.body.fatherName,
          dob: req.body.dob,
          MaritalStatus: req.body.MaritalStatus,
          panCard: req.body.panCard,
          adhaarCard: req.body.adhaarCard,
          voterId: req.body.voterId,
          kyc1: req.body.kyc1,
          kyc2: req.body.kyc2,
          kycStatus: req.body.kycStatus,
          memberId: newmemberid,
          pendingmfic: req.body.pendingmfic,
          mobile: req.body.mobile,
          pendingmficAmount: req.body.pendingmficAmount,
          resident: req.body.resident,
          referedBy: req.body.referedBy,
          familyAnnualIncome: req.body.familyAnnualIncome,
          uploadAdhaarDocument: req.body.adhaarDocument,
          kyc2DocumentUpload: req.body.kyc2Document,
          area: req.body.area,
        };
      }
      const rDeposit = {
        rdAmount: req.body.rdAmount,
        tenure: req.body.tenure,
        applicationDate: req.body.applicationDate,
        rdStatus: req.body.rdStatus,
        applicationId: newrdid,
        interestRate: req.body.yearlyInterestRate,
        memberId: newmemberid,
        balance: req.body.rdAmount,
        area: req.body.area,
        rdTenure: req.body.rdTenure,
        dailyTenure: req.body.dailyTenure,
        branch: req.body.branch,
      };
      if (req.body.newMember === "No") {
        if (req.body.kycStatus !== "Pending") {
          rDeposit.rdStatus = req.body.kycStatus;
        } else {
          rDeposit.rdStatus = req.body.rdStatus;
        }
      }
      if (req.body.newMember === "Yes") {
        const newMember = new Member({
          ...member,
          memberId: newmemberid,
        });
        let savedMember = newMember.save();
      }
      const RecurDeposit = new RDeposit({
        ...rDeposit,
        memberId: newmemberid,
      });

      let savedRD = RecurDeposit.save();
      return res.status(201).json({
        data: savedRD,
        message: "Successfully Applied For RD",
        success: true,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to apply for new RD`,
      success: false,
    });
  }
};

/**
 * It finds all the active RD's and checks if the tenure is over, if it is, it updates the status to
 * closed
 */
const closeRD = () => {
  const todaysDate = new Date().setHours(0, 0, 0, 0);
  let totalDays = 0;

  RDeposit.find({ rdStatus: "Active" })
    .then(function (rd) {
      rd.map(async (oneRd) => {
        let activeDate = new Date(oneRd.activeDate).setHours(0, 0, 0, 0);
        totalDays = (todaysDate - activeDate) / (1000 * 3600 * 24);

        /* Checking if the tenure is daily, then it is calculating the tenure and if it is equal to
              the tenure, then it is updating the status to closed. */
        if (oneRd.rdTenure == "Daily") {
          if (totalDays == oneRd.dailyTenure) {
            RDeposit.findByIdAndUpdate(
              oneRd._id,
              {
                rdStatus: "Closed",
              },
              (err, res) => {}
            );
          }
        }
        /* Checking if the tenure is monthly, then it is calculating the tenure and if it is equal to
       the tenure, then it is updating the status to closed. */
        if (oneRd.rdTenure == "Monthly") {
          let startDate = new Date();
          let endDate = new Date(oneRd.activeDate);
          let monthlytenure =
            startDate.getMonth() -
            endDate.getMonth() +
            12 * (startDate.getFullYear() - endDate.getFullYear());

          if (monthlytenure == oneRd.tenure) {
            RDeposit.findByIdAndUpdate(
              oneRd._id,
              {
                rdStatus: "Closed",
              },
              (err, res) => {}
            );
          }
        }
      });
    })
    .catch(function (error) {
    });
};

/* Getting all the RD's from the database and sending it to the client side. */
exports.getAllRD = async (req, res) => {
  try {
    let allMembers = {};
    closeRD();
    /* Populating the branch data in the member collection. */
    await Member.find()
      .populate("branch")
      .then(function (members) {
        members.map((member) => {
          allMembers[member.memberId] = {
            applicantName: member.applicantName,
            fatherName: member.fatherName,
          };
        });
      });
    RDeposit.find().then(function (fd) {
      let arrAllFDs = [];
      fd.map((oneFd) => {
        let newoneFd = { ...oneFd._doc };
        let memberId = oneFd.memberId;
        newoneFd.applicantName = allMembers[memberId].applicantName
          ? allMembers[memberId].applicantName
          : "";
        newoneFd.fatherName = allMembers[memberId].fatherName
          ? allMembers[memberId].fatherName
          : "";
        arrAllFDs.push(newoneFd);
      });
      res.send(arrAllFDs);
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* Getting the RD details by memberID. */
exports.getRdbyid = async (req, res) => {
  try {
    RDeposit.find({ memberID: req.params.memberID }).then(function (rddetails) {
      res.send(rddetails);
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};
