import React, { useState, useEffect } from "react";

//mui
import {
  Stack,
  Typography,
  Button,
  Card,
  Grid,
  Container,
  ButtonGroup,
  Box,
} from "@mui/material";
import Page from "../../../components/Page";
import { useNavigate, useLocation } from "react-router-dom";

import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getDataFromApi, postDataToApi } from "../../../utils/apiCalls";
import CardHeader from "@mui/material/CardHeader";
import swal from "sweetalert";
import Loader from "../../../components/Loader";
import { DOC_LINK } from "src/constants/config";
import { customStyles } from "src/components/style";
import { Icon } from "@iconify/react";
import { LoadingButton } from "@mui/lab";

export default function ApplicationApprovalForm() {
  //Global Variables
  const navigate = useNavigate();
  const { state } = useLocation();

  const memberId = state.memberId;

  const applicationId = state.applicationId;

  //React States
  const [member, setMember] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [adhaarDoc, setadhaarDoc] = useState("");
  const [KYC2Doc, setKYC2Doc] = useState("");

  //React Effects
  useEffect(() => {
    getMemberId(state.memberId);
    setName(sessionStorage.getItem("name"));
  }, []);

  /**
   * GetDataFromApi is a function that returns a promise.
    * The response is an array of objects.
     * The first object in the array is assigned to the variable member.
     * The first object in the array has a property called uploadAdhaarDocument.
     * The value of uploadAdhaarDocument is assigned to the variable adhaarDoc.
     * The first object in the array has a property called kyc2DocumentUpload.
     * The value of kyc2DocumentUpload is assigned to the variable kyc2Doc.
     * The function getMemberId is called with the parameter id.
     * The parameter id is a string.
     * The string is replaced with the string "%2F".
   * @param {string}id - the id of the member
   */
  
  const getMemberId = (id) => {
    getDataFromApi("getMemberbyid/" + id.replace("/", "%2F")).then(
      (response) => {
        setMember(response);
        setLoading(false);
        setadhaarDoc(response[0].uploadAdhaarDocument);
        setKYC2Doc(response[0].kyc2DocumentUpload);
      }
    );
  };

  /* A validation schema for a form. */
  const ApplicationApprovalSchema = Yup.object().shape({
    applicationComment: Yup.string()
      .min(3, "Your comment should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-]*)?$/,
        "Application Approval/Rejection Comment should be in valid format"
      )
      .required("Application Approval/Rejection Comment is required"),
  });

/* Using the useFormik hook to create a formik object. */
  const formik = useFormik({
    initialValues: {
      applicationComment: "",
    },
    validationSchema: ApplicationApprovalSchema,
    onSubmit: (values) => {
      postDataToApi(
        `applicationUpdate/${applicationId}`,
        JSON.stringify(values)
      ).then((res) => {
        swal(
          res.success ? "Success!" : "Error!",
          res.message,
          res.success ? "success" : "error"
        );
        if (res.success) {
          navigate("/dashboard/app", { replace: true });
        }
      });
    },
  });

  //Components Return
  return (
    <Page title={"Application Approval Form (" + applicationId + ")"}>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Application Approval Form ({applicationId})
          </Typography>
        </Stack>

        <form onSubmit={formik.handleSubmit} sx={{ margin: 1 }}>
          {loading && <Loader />}
          <Card
            sx={{
              // display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > *": {
                m: 2,
              },
            }}
          >
            {member.map((data, i) => (
              <div key={i}>
                <Card
                  sx={{
                    marginBottom: 2,
                    paddingBottom: 2,
                  }}
                >
                  <CardHeader
                    title="Member Information"
                    sx={{ paddingBottom: 1 }}
                  />
                  <Container>
                    <Grid
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      sx={{ fontSize: 15 }}
                    >
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Member ID:</b> {memberId}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Member Name:</b> {data.applicantName}{" "}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>DOB:</b> {data.dob ? data.dob : data.age}{" "}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>F/H Name:</b> {data.fatherName}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Branch:</b> {data.branch.branchName}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Area: </b>
                          {data.area ? data.area.areaName : ""}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          {" "}
                          <b> Referred By FO:</b> {data.referedBy}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          {" "}
                          <b>Marital Status:</b> {data.MaritalStatus}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          {" "}
                          <b>Family Annual Income(Rs.):</b>{" "}
                          {data.familyAnnualIncome}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          {" "}
                          <b>Resident:</b> {data.resident}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Mobile:</b> {data.mobile}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Pending Loan from MFIs(Count):</b>{" "}
                          {data.pendingmfic}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Pending Loan from MFIs(Amount):</b>{" "}
                          {data.pendingmficAmount}
                        </div>
                      </Grid>
                    </Grid>
                  </Container>
                </Card>
                <Card
                  sx={{
                    marginBottom: 2,
                    paddingBottom: 2,
                  }}
                >
                  <CardHeader title="KYC Details" sx={{ paddingBottom: 1 }} />
                  <Container>
                    <Grid
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      sx={{ fontSize: 15 }}
                    >
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>KYC Doc 1:</b> Aadhaar Card
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>KYC Doc 2:</b> {data.kyc2}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>KYC ID 1: </b>
                          {data.adhaarCard}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>KYC ID 2:</b> {""}
                          {data.kyc2 === "Pan Card"
                            ? data.panCard
                            : data.kyc2 === "Adhaar Card"
                            ? data.adhaarCard
                            : data.voterId}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} sx={{ marginLeft: "-12px" }}>
                        <div>
                          <a
                            href={`${DOC_LINK}/uploads/${adhaarDoc}`}
                            target="_blank"
                            style={customStyles.anchorTag}
                          >
                            <Icon
                              icon="fluent:tab-arrow-left-20-filled"
                              hFlip={true}
                              width={40}
                              height={22}
                              // style={customStyles.documentOpenIcon}
                            />
                            <Typography sx={{ marginTop: -3.5, marginLeft: 5 }}>
                              Open Aadhaar Document
                            </Typography>
                          </a>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <a
                            href={`${DOC_LINK}/uploads/${KYC2Doc}`}
                            target="_blank"
                            style={customStyles.anchorTag}
                          >
                            <Icon
                              icon="fluent:tab-arrow-left-20-filled"
                              hFlip={true}
                              width={40}
                              height={22}
                            />
                            <Typography sx={{ marginTop: -3.5, marginLeft: 5 }}>
                              Open KYC ID 2
                            </Typography>
                          </a>
                        </div>
                      </Grid>
                    </Grid>
                  </Container>
                </Card>
                <Card
                  sx={{
                    marginBottom: 2,
                    paddingBottom: 2,
                  }}
                >
                  <CardHeader
                    title="Application Detail"
                    sx={{ paddingBottom: 1 }}
                  />
                  <Container>
                    {applicationId.charAt(0) === "L" && (
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        sx={{ fontSize: 15 }}
                      >
                        <Grid item xs={12} md={6}>
                          <div>
                            <b>Application Date:</b>{" "}
                            {state.loanDetails.applicationDate
                              ? state.loanDetails.applicationDate.substring(
                                  0,
                                  16
                                )
                              : ""}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b>Loan Purpose:</b> {state.loanDetails.loanPurpose}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b>Installments (Weekly):</b>{" "}
                            {state.loanDetails.installments} Rs.
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b> Loan Amount(Rs.): </b>
                            {state.loanDetails.loanAmount}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b> Total Interest Amount(Rs.) :</b>{" "}
                            {state.loanDetails.totalInterestAmount}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b> Tenure(Weeks) :</b> {state.loanDetails.tenure}
                          </div>
                        </Grid>
                      </Grid>
                    )}
                    {applicationId.charAt(0) === "F" && (
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        sx={{ fontSize: 15 }}
                      >
                        <Grid item xs={12} md={6}>
                          <div>
                            <b>Application Date:</b>{" "}
                            {state.fdData.applicationDate
                              ? state.fdData.applicationDate.substring(0, 16)
                              : ""}
                          </div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <div>
                            <b>Tenure(Months):</b> {state.fdData.tenure}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b> FD Amount(Rs.): </b>
                            {state.fdData.fdAmount}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b> Yearly Interest Rate(%):</b>{" "}
                            {state.fdData.interestRate}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b> Maturity Amount(Rs.):</b>{" "}
                            {state.fdData.maturityAmount}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b> Maturity Date:</b> {state.fdData.maturityDate}
                          </div>
                        </Grid>
                      </Grid>
                    )}
                    {applicationId.charAt(0) === "R" && (
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        sx={{ fontSize: 15 }}
                      >
                        <Grid item xs={12} md={6}>
                          <div>
                            <b>Application Date:</b>{" "}
                            {state.rdDetails.applicationDate
                              ? state.rdDetails.applicationDate.substring(0, 16)
                              : ""}
                          </div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <div>
                            <b>Tenure Duration:</b>{" "}
                            {state.rdDetails.tenure
                              ? state.rdDetails.tenure
                              : state.rdDetails.dailyTenure}
                            {state.rdDetails.rdTenure == "Monthly"
                              ? " Month"
                              : " Days"}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b> RD Amount(Rs.): </b>
                            {state.rdDetails.rdAmount}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <div>
                            <b> Yearly Interest Rate(%):</b>{" "}
                            {state.rdDetails.interestRate}
                          </div>
                        </Grid>
                      </Grid>
                    )}
                  </Container>
                </Card>
                <Card
                  sx={{
                    marginBottom: 2,
                    paddingBottom: 2,
                  }}
                >
                  <CardHeader title="KYC Comment" sx={{ paddingBottom: 1 }} />
                  <Container>
                    <Grid
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      sx={{ fontSize: 15 }}
                    >
                      <Grid item xs={12} md={6}>
                        <div>{data.kycComment}</div>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <div style={{ marginLeft: "70%" }}>
                          <Typography
                            sx={{
                              color: "text.secondary",
                              mb: 5,
                              fontSize: 15,
                            }}
                          >
                            Approved By: {data.kycDoneBy}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Container>
                </Card>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    id="applicationComment"
                    label="Application Approval Comment"
                    name="applicationComment"
                    value={formik.values.applicationComment}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.applicationComment &&
                      Boolean(formik.errors.applicationComment)
                    }
                    helperText={
                      formik.touched.applicationComment &&
                      formik.errors.applicationComment
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      "& > *": {
                        m: 1,
                      },
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      aria-label="outlined button group"
                    >
                      <LoadingButton
                        color="error"
                        type="submit"
                        variant="contained"
                        onClick={() => {
                          formik.setFieldValue("applicationStatus", "Rejected");
                        }}
                      >
                        Application Reject
                      </LoadingButton>
                      <LoadingButton
                        color="info"
                        type="submit"
                        variant="contained"
                        onClick={() => {
                          formik.setFieldValue("applicationStatus", "Approved");
                        }}
                      >
                        Application Approve
                      </LoadingButton>
                    </ButtonGroup>
                  </Box>
                </Grid>
              </div>
            ))}
          </Card>
        </form>
      </Container>
    </Page>
  );
}
