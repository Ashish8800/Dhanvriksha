const { model } = require("mongoose");
const db = require("../models");
const Member = db.member;
const FixedDeposit = db.fixedDeposit;
const Loan = db.loan;
const RD = db.rd;
const Branch = db.branch;
const {
  getId,
  convertSpecialChars,
  formatDate,
} = require("../../utils/CommonUtils");
const { generatePdf } = require("../../utils/PDFGenerate");
/**
 * This is a function that is being exported to add new member registration.
 * @function addNewMemberReg
 * @param {obj} req - all member data coming from client side.
 * @param {obj} res - sending all member details to client.
 */

exports.addNewMemberReg = async (req, res) => {
  let memberId;
  let branchId = "";
  /* Getting the branchId from the branch collection. */
  await Branch.findOne({ _id: req.body.branch }).then(function (br) {
    branchId = br.branchId;
  });
  try {
    let MemberDetails = req.body;
    getId("MEMBER", req.body.branch, branchId).then((resp) => {
      memberId = resp;
      const newMember = new Member({
        ...MemberDetails,
        memberId: memberId,
        uploadAdhaarDocument: req.body.adhaarDocument,
        kyc2DocumentUpload: req.body.kyc2Document,
      });
      newMember.save().then((savedMember) => {
        return res.status(200).json({
          data: savedMember,
          message: `Successfully save The Member`,
          success: true,
        });
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to save the Member`,
      success: false,
    });
  }
};

/* This is a function that is being exported to get all member details. */
exports.getAllMember = async (req, res) => {
  try {
    /* Populating the branch and area fields in the member collection. */
    Member.find()
      .populate("branch")
      .populate("area")
      .then(function (member) {
        res.send(member);
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* This is a function that is being exported to finding the members by the memberId. */
exports.getMemberbyid = async (req, res) => {
  try {
    Member.find({ memberId: req.params.memberId })
      /* Populating the branch and area fields in the member collection. */
      .populate("branch")
      .populate("area")
      .then(function (MemberDetails) {
        res.send(MemberDetails);
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* This is a function that is being exported to get all applied applications. */
exports.appliedApplications = async (req, res) => {
  try {
    const temparr = [];
    const applications = {};
    await FixedDeposit.find({ fdStatus: "Applied" }).then(function (arrAllFds) {
      temparr.push(arrAllFds);
      applications.arrAllFds = arrAllFds;
    });
    /* Finding all the loans with the status of applied and then pushing it into the temparr array and
    then pushing it into the applications object. */
    Loan.find({ loanStatus: "Applied" })
      .then(function (arrAllLoan) {
        temparr.push(arrAllLoan);
        applications.arrAllLoan = arrAllLoan;
      })
      .then(() => {
        RD.find({ rdStatus: "Applied" }).then(function (arrAllRds) {
          temparr.push(arrAllRds);
          applications.arrAllRds = arrAllRds;
          res.json(applications);
        });
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* This is a function that is being exported to finding the FD, RD and loan applications by the memberId. */
exports.getApplicationbyMemberId = async (req, res) => {
  console.log(req, "req");
  try {
    const allapplicationsArr = [];
    const applicationsbyMemberIdObj = {};
    await FixedDeposit.find({ memberId: req.params.memberId }).then(function (
      fd
    ) {
      allapplicationsArr.push(fd);
      applicationsbyMemberIdObj.fd = fd;
    });
    console.log(applicationsbyMemberIdObj, "applicationsbyMemberIdObj");
    /* Finding all the loans with the memberId and then pushing it into the allapplicationsArr array and
   then pushing it into the applicationsbyMemberIdObj object. */
    Loan.find({ memberId: req.params.memberId })
      .then(function (loan) {
        allapplicationsArr.push(loan);
        applicationsbyMemberIdObj.loan = loan;
      })
      .then(() => {
        RD.find({ memberId: req.params.memberId }).then(function (rd) {
          allapplicationsArr.push(rd);
          applicationsbyMemberIdObj.rd = rd;
          res.json(applicationsbyMemberIdObj);
        });
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* Updating the kyc status of the member. */
exports.kycUpdate = async (req, res) => {
  try {
    let updatekyc = {};
    /* Finding the member by the memberId. */
    const member = await Member.findOne({
      memberId: req.body.memberId,
    });
    /* This is checking if the kycStatus is not equal to KYC Approved then it will update the kycStatus,
   kycComment and kycDoneBy. */
    if (member.kycStatus != "KYC Approved") {
      if (req.body.kycStatus) {
        updatekyc = await Member.findOneAndUpdate(
          { memberId: req.body.memberId },
          {
            kycStatus: req.body.kycStatus,
            kycComment: req.body.kycComment,
            kycDoneBy: req.body.kycDoneBy,
          },
          { new: true, useFindAndModify: false }
        );
      }
    }
    /* This is updating the loan status and kyc status. */
    const loan = await Loan.findOneAndUpdate(
      { applicationId: req.params.applicationId },
      { loanStatus: req.body.kycStatus, kycStatus: req.body.kycStatus },
      { new: true, useFindAndModify: false }
    );
    /* This is updating the fdStatus and kycStatus. */
    const fd = await FixedDeposit.findOneAndUpdate(
      { applicationId: req.params.applicationId },
      { fdStatus: req.body.kycStatus, kycStatus: req.body.kycStatus },
      { new: true, useFindAndModify: false }
    );
    /* This is updating the rdStatus and kycStatus. */
    const rd = await RD.findOneAndUpdate(
      { applicationId: req.params.applicationId },
      { rdStatus: req.body.kycStatus, kycStatus: req.body.kycStatus },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json({
      data: loan,
      fd,
      rd,
      loan,
      fd,
      rd,
      message: `Kyc updated successfully`,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* The below code is fetching all the applications which are approved by the KYC department. */
exports.getKycApprovedApplication = async (req, res) => {
  try {
    const kycApproveArr = [];
    const kycApprovedApplications = {};
    /* This is finding all the FD applications with the status of KYC Approved and then pushing
    it into the kycApproveArr array and
       then pushing it into the kycApprovedApplications object. */
    await FixedDeposit.find({ fdStatus: "KYC Approved" }).then(function (
      approvedFd
    ) {
      kycApproveArr.push(approvedFd);
      kycApprovedApplications.approvedFd = approvedFd;
    });
    /* Finding all the loans with the status of KYC Approved and then pushing it into the kycApproveArr
   array and
   then pushing it into the kycApprovedApplications object. */
    Loan.find({ loanStatus: "KYC Approved" })
      .then(function (approvedLoan) {
        kycApproveArr.push(approvedLoan);
        kycApprovedApplications.approvedLoan = approvedLoan;
      })
      .then(() => {
        /* This is finding all the RD applications with the status of KYC Approved and then pushing it
       into the kycApproveArr array and
          then pushing it into the kycApprovedApplications object. */
        RD.find({ rdStatus: "KYC Approved" }).then(function (approvedRd) {
          kycApproveArr.push(approvedRd);
          kycApprovedApplications.approvedRd = approvedRd;
          res.json(kycApprovedApplications);
        });
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/**
 * The below code is fetching all the approved applications from the database. 
 * @function getApprovedApplication
 * Finding all the FD, RD and loans with the status of Application Approved and then pushing it into the ApproveArr
   array and
   then pushing it into the ApprovedApplications object. */
exports.getApprovedApplication = async (req, res) => {
  try {
    const ApproveArr = [];
    const ApprovedApplications = {};
    await FixedDeposit.find({ fdStatus: "Approved" }).then(function (
      approvedFd
    ) {
      ApproveArr.push(approvedFd);
      ApprovedApplications.approvedFd = approvedFd;
    });
    Loan.find({ loanStatus: "Approved" })
      .then(function (approvedLoan) {
        ApproveArr.push(approvedLoan);
        ApprovedApplications.approvedLoan = approvedLoan;
      })
      .then(() => {
        RD.find({ rdStatus: "Approved" }).then(function (approvedRd) {
          ApproveArr.push(approvedRd);
          ApprovedApplications.approvedRd = approvedRd;
          res.status(200).send({ success: true, data: ApprovedApplications });
        });
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* Updating the application status and comment in FD, RD and Loan Application. */
exports.applicationUpdate = async (req, res) => {
  try {
    let updateApplication = {};

    const loan = await Loan.findOneAndUpdate(
      { applicationId: req.params.applicationId },
      {
        loanStatus: req.body.applicationStatus,
        applicationComment: req.body.applicationComment,
      },
      { new: true, useFindAndModify: false }
    );
    const fd = await FixedDeposit.findOneAndUpdate(
      { applicationId: req.params.applicationId },
      {
        fdStatus: req.body.applicationStatus,
        applicationComment: req.body.applicationComment,
      },
      { new: true, useFindAndModify: false }
    );
    /* Updating the RD status to Active and adding the applicationComment and activeDate to the RD. */
    const rd = await RD.findOneAndUpdate(
      { applicationId: req.params.applicationId },
      {
        rdStatus: "Active",
        applicationComment: req.body.applicationComment,
        activeDate: new Date(),
      },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json({
      data: updateApplication,
      loan,
      fd,
      rd,
      message: `Application updated successfully`,
      success: true,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* Updating the member details. */
exports.updateMember = async (req, res) => {
  try {
    let newMember = Member.findOneAndUpdate(
      { memberId: req.params.memberId },
      {
        ...req.body,
        uploadAdhaarDocument: req.body.adhaarDocument,
        kyc2DocumentUpload: req.body.kyc2Document,
      },
      { new: true, useFindAndModify: false },
      (err, newMember) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
          data: newMember,
          success: true,
          message: "Member Updated Sucessfully",
        });
      }
    ).catch((err) => {
      res.json(err);
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

/* The below code is fetching all the active applications(FD, RD and Loan) from the database. */
exports.getActiveApplication = async (req, res) => {
  try {
    const ActiveArr = [];
    const ActiveApplications = {};

    await FixedDeposit.find({ fdStatus: "Approved" }).then(function (
      approvedFd
    ) {
      ActiveApplications.approvedFd = approvedFd;
    });
    await Loan.find({ loanStatus: "Active" }).then(function (activeLoan) {
      ActiveApplications.activeLoan = activeLoan;
    });
    await RD.find({ rdStatus: "Approved" })
      .then(function (approvedRd) {
        ActiveApplications.approvedRd = approvedRd;
      })
      .then(async () => {
        await RD.find({ rdStatus: "Active" }).then(function (activeRd) {
          ActiveApplications.activeRd = activeRd;
          res.status(200).send({ success: true, data: ActiveApplications });
        });
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

exports.downloadFDPDF = async (req, res) => {
  try {
    let member = null,
      fixedDeposit = null;

    member = await Member.findOne({ memberId: req.params.memberId });

    const branch = await Branch.findOne({ ObjectId: req.params.branch });

    fixedDeposit = await FixedDeposit.findOne({
      applicationId: req.params.fdId,
    });

    if (!member || !fixedDeposit)
      return res.status(500).send({
        success: false,
        message: "Something went wrong with member or fd details",
      });

    const pdf = `storage/fd/FD_${convertSpecialChars(member.memberId, "-")}_${
        fixedDeposit.applicationId
      }_${new Date().getTime()}`,
      pdfUrl = `${process.env.APP_URL}/${pdf}.pdf`;

    const pdfRes = await generatePdf("HBS/FDBond", pdf, {
      ...member,
      ...fixedDeposit,
      name: member.applicantName,
      memberId: member.memberId,
      fatherName: member.fatherName,
      branch: branch.branchName,
      applicationId: fixedDeposit.applicationId,
      interestRate: fixedDeposit.interestRate,
      maturityDate: formatDate(fixedDeposit.maturityDate),
      maturityAmount: fixedDeposit.maturityAmount,
      startDate: formatDate(fixedDeposit.createdAt),
      fdAmount: fixedDeposit.fdAmount,
      tenure: fixedDeposit.tenure,
    });

    if (pdfRes) {
      return res.status(200).send({
        success: true,
        message: "PDF generated successfully",
        data: {
          pdfUrl: pdfUrl,
          pdfBase64: pdfRes.base64,
        },
      });
    } else {
    }
    return res.status(500).send({
      success: false,
      message: "Something went wrong with member or fd details",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong with member or fd details",
    });
  }
};
