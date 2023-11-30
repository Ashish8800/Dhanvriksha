import * as Yup from "yup";
// import * as React from "react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  TextField,
  Container,
  CardContent,
  Grid,
  ButtonGroup,
  Autocomplete,
} from "@mui/material";
import { useFormik } from "formik";

import Page from "../../../components/Page";
import SmallLoader from "src/components/SmallLoader";
import axios from "axios";
import { BASE_URL } from "../../../constants/config";
import swal from "sweetalert";
import { getDataFromApi, axiosPostDataToApi } from "../../../utils/apiCalls";
import { LoadingButton } from "@mui/lab";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Icon } from "@iconify/react";
import { DOC_LINK } from "src/constants/config";
import { customStyles } from "src/components/style";
// component

// ----------------------------------------------------------------------

export default function EditMember() {
  /* Creating state variables. */
  const [employee, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tLoading, setTLoading] = useState(true);
  const [adhaarDoc, setadhaarDoc] = useState("");
  const [KYC2Doc, setKYC2Doc] = useState("");
  const [area, setArea] = useState([]);

  /* Using the useNavigate hook to navigate to a different page. */
  const navigate = useNavigate();

  /* The above code is storing the token in the session storage. */
  const token = sessionStorage.getItem("token");

  const location = useLocation();

  const memberId = location.search.split("=")[1];
  const memberData = location.state?.memberData;
  // const [inputValue, setInputValue] = useState(memberData.referedBy);

  /* A validation schema for a form. */

  const validationObject = {

    applicantName: Yup.string()
      .min(3, "Your name should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        "Name should be a string"
      )
      .required("Name is required"),
    dob: Yup.string()
      .typeError("Date of Birth cannot be empty ")
      .required("Date of Birth cannot be empty"),
    fatherName: Yup.string()
      .min(3, "Father name should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        "Name should be a string"
      )
      .required("Father name is required"),

    pendingmfic: Yup.number()
      .required("pending Loan from MFIs is required")
      .typeError("you must specify a number"),
    voterId: Yup.string().when("panCard", {
      is: "",
      then: Yup.string().required("voter Id is required."),
    }),
    panCard: Yup.string()
      .matches(
        /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
        "Pan Card Number should be in proper format"
      )
      .min(10, "Pan Card Number should be of 10 digits")
      .max(10, "Pan Card Number should be of 10 digits"),
    adhaarCard: Yup.number()
      .test(
        "maxDigits",
        "Adhaar Card must be of exact 12 digits",
        (adhaarCard) => String(adhaarCard).length === 12
      )
      .min(0, "It should not contain negative value")
      .integer("Aadhaar Card should not contain decimal value")
      .typeError("Aadhaar Card must be a number"),

    mobile: Yup.string().matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "Mobile Number should be a 10 digit number"
    ),
    familyAnnualIncome: Yup.number()
      .required("Family Annual Income is required")
      .typeError("you must specify a number")
      .min(1),
    resident: Yup.string()
      .matches(/^\S/, "Resident should not contain spaces only")
      .min(5, "Resident should be of atleast 5 character")
      .required("Resident is required"),
    pendingmficAmount: Yup.number()
      .required("Pending MFIs Amount is required")
      .typeError("you must specify a number"),
    referedBy: Yup.string(),
  };
  const EditMemberSchema = Yup.object().shape(validationObject);

  /**
   * It gets data from an API, then filters the data to only include active branches, then sets the state
   * of the branches to the filtered data.
   */
  const getBranchData = () => {
    let activeBranch = [];
    getDataFromApi("branch")
      .then((res) => {
        res.map((branch) => {
          if (branch.activeStatus == true) {
            activeBranch.push(branch);
          }
        });
        setBranches(activeBranch);
      })
      .catch((err) => console.log(err));
  };

  /**
   * It gets the data from the API and then sets the state of the area.
   * @param id - the id of the branch
   */
  const getAreas = (id) => {
    let activeArea = [];

    getDataFromApi("areabyBranch/" + id).then((res) => {
      res.data.map((area) => {
        if (area.activeStatus == true) {
          activeArea.push(area);
        }
      });

      setArea(activeArea);
    });
  };

  /**
   * It takes a date value, calculates the age, and if the age is less than 18, it sets the value to null
   * and sets the error message.
   * @param value - The value of the field.
   */
  const getDob = (value) => {
    let age;
    const today = new Date();
    let day = value;
    age = today.getFullYear() - (value == null ? 0 : day.getFullYear());

    if (age < 18) {
      alert("Age should be greater than 18");
      formik.setFieldValue("dob", null);
    }
    formik.setFieldValue(
      "dob",
      value == null || age < 18 ? "" : value.toDateString()
    );
    formik.setFieldError("dob", "Age should be greater than 18");
  };

  /**
   * It gets all the employees from the API and then filters them based on their role and status.
   */
  const getEmployees = () => {
    getDataFromApi(`emp/getAllEmp`)
      .then((res) => {
        setTLoading(false);
        let empList = [];
        res.map((employee) => {
          let tempObj = {};
          if (employee.roles[0].name == "FO" && employee.status == true) {
            tempObj.name = employee.name + "(" + employee.empId + ")";
            tempObj.id = employee.empId;
            empList.push(tempObj);

            return null;
          }
        });
        if (empList.length == 0) {
          swal("There are no employees with FO role for Referred By Field");
        }

        setEmployees(empList);
      })
      .catch((err) => console.log(err));
  };

  /* A formik form. */
  const formik = useFormik({
    initialValues: {
      branch: "",
      applicantName: "",
      fatherName: "",
      MaritalStatus: "",
      kyc1Num: "",
      kyc2Num: "",
      kyc1: "",
      kyc2: "Pan Card",
      panCard: "",
      adhaarCard: "",
      voterId: "",
      mobile: "",
      pendingmfic: "",
      dob: "",
      familyAnnualIncome: "",
      pendingmficAmount: "",
      resident: "",
      referedBy: "",
      kyc2Document: KYC2Doc,
      adhaarDocument: adhaarDoc,
      area: "",
    },
    validationSchema: EditMemberSchema,

    onSubmit: (values) => {
      const body = new FormData();
      /* Appending the form data to the body. */
      body.append(
        "images",
        changeDocumentFile(
          values["kyc2Document"],
          values.applicantName,
          "kyc_document"
        )
      );
      body.append(
        "images",
        changeDocumentFile(
          values["adhaarDocument"],
          values.applicantName,
          "adhaar_document"
        )
      );
      body.append(
        "adhaarDocument",
        documentName.adhaar_document ? documentName.adhaar_document : adhaarDoc
      );
      body.append(
        "kyc2Document",
        documentName.kyc_document ? documentName.kyc_document : KYC2Doc
      );
      body.append("branch", values.branch);
      body.append("area", values.area);
      body.append("applicantName", values.applicantName);
      body.append("fatherName", values.fatherName);
      body.append("MaritalStatus", values.MaritalStatus);
      body.append("adhaarCard", values.adhaarCard);
      body.append("mobile", values.mobile);
      body.append("dob", values.dob);
      body.append("familyAnnualIncome", values.familyAnnualIncome);
      body.append("pendingmficAmount", values.pendingmficAmount);
      body.append("resident", values.resident);
      body.append("referedBy", values.referedBy);
      body.append("panCard", values.panCard);
      body.append("voterId", values.voterId);
      body.append("kyc2", values.kyc2);
      body.append("pendingmfic", values.pendingmfic);
      /* A function that is called when the user clicks the submit button. */

      axiosPostDataToApi(
        "memberUpdate/" + memberId.replace("/", "%2F"),
        body,
        token
      )
        .then((res) => {
          swal(
            res.data.success ? "Success!" : "Error!",
            res.data.message,
            res.data.success ? "success" : "error"
          );

          if (res.data.success) {
            navigate("/dashboard/Member", { replace: true });
          }
        })
        .catch((err) => {
          throw err;
        });
    },
  });

  const { isSubmitting } = formik;

  /* Calling the getBranchData, getEmployees, and getAreas functions. */
  useEffect(() => {
    getBranchData();
    getEmployees();
    getAreas(memberData.branch._id);

    /* Setting the values of the formik form. */
    formik.setFieldValue("applicantName", memberData.applicantName);
    formik.setFieldValue("fatherName", memberData.fatherName);
    formik.setFieldValue("age", memberData.age);
    formik.setFieldValue("kyc1", memberData.kyc1);
    formik.setFieldValue("kyc2", memberData.kyc2);
    formik.setFieldValue("MaritalStatus", memberData.MaritalStatus);
    formik.setFieldValue("voterId", memberData.voterId);
    formik.setFieldValue("panCard", memberData.panCard);
    formik.setFieldValue("adhaarCard", memberData.adhaarCard);
    formik.setFieldValue(
      "branch",
      memberData.branch ? memberData.branch._id : ""
    );
    formik.setFieldValue("area", memberData.area ? memberData.area._id : "");
    formik.setFieldValue("pendingmfic", memberData.pendingmfic);
    formik.setFieldValue("mobile", memberData.mobile);
    formik.setFieldValue("dob", memberData.dob ? memberData.dob : "");
    formik.setFieldValue("resident", memberData.resident);
    formik.setFieldValue("referedBy", memberData.referedBy);
    formik.setFieldValue("pendingmficAmount", memberData.pendingmficAmount);
    formik.setFieldValue("familyAnnualIncome", memberData.familyAnnualIncome);

    setadhaarDoc(memberData.uploadAdhaarDocument);
    setKYC2Doc(memberData.kyc2DocumentUpload);
  }, []);

  /* Changing the name of the file. */
  const documentName = {};

  /**
   * It takes a file, a userName, and a type, and returns a new file with a new name.
   * </code>
   * @param file - the file object
   * @param userName - "John Doe"
   * @param type - "image"
   * @returns A new File object with the name changed.
   */
  const changeDocumentFile = (file, userName, type) => {
    try {
      let name =
        userName.split(" ")[0] +
        "_" +
        new Date().getTime() +
        "_" +
        type +
        "." +
        file.name.split(".")[1];

      documentName[type] = name.toLowerCase();
      return new File([file], name.toLowerCase(), { type: file.type });
    } catch (err) {
      return file;
    }
  };

  //Component Return
  return (
    <Page title="Edit Member">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom align="center">
            Edit Member
          </Typography>
        </Stack>
        <div>
          <form onSubmit={formik.handleSubmit} sx={{ m: 1 }}>
            <Card>
              <CardContent noValidate autoComplete="off">
                <Grid container rowSpacing={2} columnSpacing={4}>
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        marginLeft: "10px",
                      }}
                    >
                      Member Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={8} md={4}>
                    {tLoading && <SmallLoader />}
                    {!tLoading && (
                      <div>
                        {employee.length > 0 && (
                          <Grid>
                            <Autocomplete
                              editMode={true}
                              value={formik.values.referedBy}
                              required
                              size="small"
                              fullWidth
                              options={employee}
                              getOptionLabel={(option) => {
                                if (option.hasOwnProperty("name")) {
                                  return option.name;
                                }
                                return option;
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                              }
                              onChange={(event, newValue) => {
                                if (newValue) {
                                  formik.setValues({
                                    ...formik.values,
                                    referedBy: newValue.name,
                                  });
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Referred by FO"
                                  error={
                                    formik.touched.referedBy &&
                                    Boolean(formik.errors.referedBy)
                                  }
                                  helperText={
                                    formik.touched.referedBy &&
                                    formik.errors.referedBy
                                  }
                                />
                              )}
                            />
                          </Grid>
                        )}
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      required
                      size="small"
                      fullWidth
                      id="outlined-select-currency"
                      select
                      name="branch"
                      label="Branch Name"
                      value={formik.values.branch}
                      onChange={(e) => {
                        getAreas(e.target.value);

                        formik.setFieldValue("branch", e.target.value);
                      }}
                      error={
                        formik.touched.branch && Boolean(formik.errors.branch)
                      }
                      helperText={formik.touched.branch && formik.errors.branch}
                    >
                      {branches.map((option, i) => (
                        <MenuItem key={i} value={option._id}>
                          {option.branchName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      required
                      size="small"
                      fullWidth
                      id="applicantName"
                      name="applicantName"
                      label="Member Name"
                      value={formik.values.applicantName}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.applicantName &&
                        Boolean(formik.errors.applicantName)
                      }
                      helperText={
                        formik.touched.applicantName &&
                        formik.errors.applicantName
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      type="number"
                      id="familyAnnualIncome"
                      name="familyAnnualIncome"
                      label="Family Annual Income(Rs.)"
                      value={formik.values.familyAnnualIncome}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.familyAnnualIncome &&
                        Boolean(formik.errors.familyAnnualIncome)
                      }
                      helperText={
                        formik.touched.familyAnnualIncome &&
                        formik.errors.familyAnnualIncome
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      required
                      size="small"
                      fullWidth
                      select
                      id="center"
                      name="area"
                      label="Area"
                      value={formik.values.area}
                      onChange={(e) => {
                        formik.setFieldValue("area", e.target.value);
                      }}
                      error={formik.touched.area && Boolean(formik.errors.area)}
                      helperText={formik.touched.area && formik.errors.area}
                    >
                      {area.map((option, i) => (
                        <MenuItem key={i} value={option._id}>
                          {option.areaName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      id="father"
                      name="fatherName"
                      label="Father/Husband Name"
                      value={formik.values.fatherName}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.fatherName &&
                        Boolean(formik.errors.fatherName)
                      }
                      helperText={
                        formik.touched.fatherName && formik.errors.fatherName
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={8} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        id="dob"
                        onChange={getDob}
                        inputFormat="dd/MM/yyyy"
                        value={formik.values.dob}
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            fullWidth
                            {...params}
                            error={
                              formik.touched.dob && Boolean(formik.errors.dob)
                            }
                            helperText={formik.touched.dob && formik.errors.dob}
                          />
                        )}
                        fullWidth
                        name="dob"
                        label="DOB"
                        type="Input"
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      required
                      size="small"
                      fullWidth
                      id="pendingmfic"
                      name="pendingmfic"
                      label="Pending Loan from MFIs (Count)"
                      value={formik.values.pendingmfic}
                      onChange={formik.handleChange}
                      // disabled={formDisable}
                      error={
                        formik.touched.pendingmfic &&
                        Boolean(formik.errors.pendingmfic)
                      }
                      helperText={
                        formik.touched.pendingmfic && formik.errors.pendingmfic
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      id="outlined-select-currency"
                      select
                      name="MaritalStatus"
                      label="Marital status"
                      value={formik.values.MaritalStatus}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Unmarried">Unmarried</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      required
                      size="small"
                      fullWidth
                      id="pendingmficAmount"
                      name="pendingmficAmount"
                      label="Pending Loan from MFIs (Amount)"
                      value={formik.values.pendingmficAmount}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.pendingmficAmount &&
                        Boolean(formik.errors.pendingmficAmount)
                      }
                      helperText={
                        formik.touched.pendingmficAmount &&
                        formik.errors.pendingmficAmount
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      required
                      size="small"
                      fullWidth
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      id="outlined-required"
                      label="Mobile Number"
                      error={
                        formik.touched.mobile && Boolean(formik.errors.mobile)
                      }
                      helperText={formik.touched.mobile && formik.errors.mobile}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      required
                      size="small"
                      fullWidth
                      id="resident"
                      name="resident"
                      label="Resident"
                      value={formik.values.resident}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.resident &&
                        Boolean(formik.errors.resident)
                      }
                      helperText={
                        formik.touched.resident && formik.errors.resident
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  sx={{
                    borderBottomStyle: "dotted",
                    borderBottomWidth: "1px",
                    marginTop: "30px",
                    marginLeft: "0.2px",
                  }}
                ></Grid>
                <Typography
                  sx={{
                    marginTop: "10px",
                    // marginBottom: "10px",
                    marginLeft: "10px",
                  }}
                >
                  KYC Information
                </Typography>
                <Grid container rowSpacing={2} columnSpacing={4}>
                  <Grid item xs={12} sm={8} md={4} sx={{ marginTop: 5 }}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        marginBottom: 2,
                      }}
                    >
                      <TextField
                        required
                        size="small"
                        fullWidth
                        type="number"
                        id="kyc1Num"
                        name="adhaarCard"
                        label="Aadhaar Number"
                        value={formik.values.adhaarCard}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.adhaarCard &&
                          Boolean(formik.errors.adhaarCard)
                        }
                        helperText={
                          formik.touched.adhaarCard && formik.errors.adhaarCard
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        style={{
                          ...customStyles.openDocumentStyle,
                          marginBottom: 15,
                        }}
                      >
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
                            style={customStyles.documentOpenIcon}
                          />
                          <Typography style={customStyles.documentText}>
                            Open Adhaar Document
                          </Typography>
                        </a>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        // required
                        fullWidth
                        id="file-picker"
                        label="Update Aadhaar Document"
                        focused
                        inputProps={{ accept: ".pdf,.jpg,.jpeg" }}
                        color="grey"
                        size="small"
                        name="adhaarDocument"
                        type="file"
                        onChange={(event) => {
                          formik.setValues({
                            ...formik.values,
                            adhaarDocument: event.currentTarget.files[0],
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                  {/* <Typography alignSelf="self-start">KYC Information</Typography> */}
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={4}
                    sx={{ marginBottom: 1, marginTop: 5 }}
                  >
                    <Grid
                      item
                      xs={12}
                      sx={{
                        marginBottom: 2,
                      }}
                    >
                      <TextField
                        required
                        fullWidth
                        size="small"
                        id="kyc2"
                        select
                        name="kyc2"
                        label="KYC ID"
                        value={formik.values.kyc2}
                        onChange={(e, value) => {
                          console.log("value", e.target.value);
                          if (e.target.value == "Voter ID") {
                            delete validationObject.panCard;
                          } else {
                            delete validationObject.voterId;
                          }
                          console.log(validationObject);
                          formik.handleChange(e, value);
                        }}
                      >
                        <MenuItem value="Pan Card">Pan Card</MenuItem>
                        {/* <MenuItem value="Adhaar Card">Adhaar Card </MenuItem> */}
                        <MenuItem value="Voter ID">Voter ID </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        marginBottom: 2,
                      }}
                    >
                      {formik.values.kyc2 === "Pan Card" && (
                        <TextField
                          required
                          fullWidth
                          size="small"
                          id="kyc2Num"
                          name="panCard"
                          label="KYC ID Number"
                          value={formik.values.panCard}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.panCard &&
                            Boolean(formik.errors.panCard)
                          }
                          helperText={
                            formik.touched.panCard && formik.errors.panCard
                          }
                        />
                      )}
                      {formik.values.kyc2 === "Voter ID" && (
                        <TextField
                          required
                          fullWidth
                          size="small"
                          id="kyc2Num"
                          name="voterId"
                          label="KYC ID Number"
                          value={formik.values.voterId}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.voterId &&
                            Boolean(formik.errors.voterId)
                          }
                          helperText={
                            formik.touched.voterId && formik.errors.voterId
                          }
                        />
                      )}
                    </Grid>

                    {/* <Grid item xs={12} sm={8} md={4}> */}
                    <Grid
                      item
                      xs={12}
                      sx={{
                        marginBottom: 2,
                      }}
                    >
                      <Grid
                        style={{
                          ...customStyles.openDocumentStyle,
                          marginBottom: 15,
                        }}
                      >
                        <a
                          href={`${DOC_LINK}/uploads/${KYC2Doc}`}
                          target="_blank"
                          style={customStyles.anchorTag}
                        >
                          <Icon
                            icon="fluent:tab-arrow-left-20-filled"
                            width={40}
                            height={22}
                            style={customStyles.documentOpenIcon}
                          />
                          <Typography style={customStyles.documentText}>
                            Open KYC ID
                          </Typography>
                        </a>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          // required
                          focused
                          color="grey"
                          size="small"
                          inputProps={{ accept: ".pdf,.jpg,.jpeg" }}
                          name="kyc2Document"
                          type="file"
                          label=" Update KYC ID Document"
                          onChange={(event) => {
                            formik.setFieldValue(
                              "kyc2Document",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
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
                          color="warning"
                          onClick={() => {
                            navigate("/dashboard/Member", { replace: true });
                          }}
                          variant="contained"
                        >
                          Cancel
                        </LoadingButton>
                        <LoadingButton
                          type="submit"
                          variant="contained"
                          loading={isSubmitting}
                        >
                          Update Member
                        </LoadingButton>
                      </ButtonGroup>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </div>
      </Container>
    </Page>
  );
}
