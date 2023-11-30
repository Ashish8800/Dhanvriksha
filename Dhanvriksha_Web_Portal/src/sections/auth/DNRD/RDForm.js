import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  ButtonGroup,
  Autocomplete,
} from "@mui/material";
import Page from "../../../components/Page";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";

import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getDataFromApi, axiosPostDataToApi } from "../../../utils/apiCalls";

import swal from "sweetalert";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import { DOC_LINK } from "src/constants/config";
import { customStyles } from "src/components/style";
import SmallLoader from "src/components/SmallLoader";

import Loader from "src/components/Loader";
export default function RDForm() {
  /* Using the useNavigate hook to navigate to a different page. */
  const navigate = useNavigate();

  /* Declaring the state variables. */
  const [employee, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [members, setMembers] = useState([]);
  const [formDisable, setDisabled] = useState(false);
  const [memberAllData, setmemberAllData] = useState([]);
  const [adhaarDoc, setadhaarDoc] = useState("");
  const [KYC2Doc, setKYC2Doc] = useState("");
  const [tLoading, setTLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState([]);

  /* The above code is getting the token from the session storage. */
  const token = sessionStorage.getItem("token");

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
   * When the user clicks the clear button, reset the form and set the value of the newMember field to
   * No.
   */
  const clearAll = () => {
    formik.resetForm();
    formik.setFieldValue("newMember", "No");
    setDisabled(false);
  };

  /**
   * It gets all the employees from the database and then filters them based on their role and status.
   */
  const getEmployees = () => {
    // setTLoading(true);
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

  /**
   * It takes an array of objects, and returns an array of objects with a new key/value pair.
   */
  const getMemberData = () => {
    getDataFromApi("member")
      .then((res) => {
        let membersList = [];
        res.map((member) => {
          let tempObj = {};
          tempObj.name = member.applicantName + "(" + member.memberId + ")";
          tempObj.id = member.memberId;
          membersList.push(tempObj);
          return null;
        });
        setMembers(membersList);
      })
      .catch((err) => console.log(err));
  };

  /**
   * It takes an id, makes a call to an API, and then sets the state of the component.
   * @param id - the id of the branch that was selected
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

  /* Calling the functions getBranchData, getMemberData, and getEmployees when the component mounts. */
  useEffect(() => {
    getBranchData();
    getMemberData();
    getEmployees();
  }, []);

  /**
   * It gets data from an API, then sets the values of the formik form.
   * @param id - The id of the member
   */
  const getMember = (id) => {
    setLoading(true);
    getDataFromApi(`getMemberbyid/${id.replace("/", "%2F")}`).then((res) => {
      setLoading(false);

      getAreas(res[0].branch._id);
      formik.setValues({ ...formik.values, kycStatus: res[0].kycStatus });
      formik.setFieldValue("memberId", res[0].memberId);
      formik.setFieldValue("branch", res[0].branch ? res[0].branch._id : "");
      formik.setFieldValue("fatherName", res[0].fatherName);
      formik.setFieldValue("MartialStatus", res[0].MartialStatus);
      formik.setFieldValue("kyc2", res[0].kyc2);
      formik.setFieldValue("kyc2Num", res[0].kyc2Num);
      formik.setFieldValue("applicantName", res[0].applicantName);
      formik.setFieldValue("pendingmfic", res[0].pendingmfic);
      formik.setFieldValue("kyc1", res[0].kyc1);
      formik.setFieldValue("adhaarCard", res[0].adhaarCard);
      formik.setFieldValue("panCard", res[0].panCard);
      formik.setFieldValue("voterId", res[0].voterId);
      formik.setFieldValue("mobile", res[0].mobile);
      formik.setFieldValue("MaritalStatus", res[0].MaritalStatus);
      formik.setFieldValue("dob", res[0].dob);
      formik.setFieldValue("rdAmount", res[0].rdAmount);
      formik.setFieldValue("resident", res[0].resident);
      formik.setFieldValue("pendingmficAmount", res[0].pendingmficAmount);
      formik.setFieldValue("familyAnnualIncome", res[0].familyAnnualIncome);
      formik.setFieldValue("referedBy", res[0].referedBy);
      formik.setFieldValue("area", res[0].area ? res[0].area._id : "");
      setDisabled(true);
      setadhaarDoc(res[0].uploadAdhaarDocument);
      setKYC2Doc(res[0].kyc2DocumentUpload);
      setmemberAllData(res);
    });
  };

  /**
   * If the value is null, set the field value to an empty string, otherwise set the field value to the
   * date string.
   * @param value - The value of the input.
   */
  const date = (value) => {
    formik.setFieldValue(
      "applicationDate",
      value == null ? "" : value.toDateString()
    );
  };

  /**
   * If the age is less than 18, then set the value of the dob field to null and set the error message
   * to "Age should be greater than 18".
   * @param value - The value of the field.
   */
  const getDob = (value) => {
    let age;
    // const today = new Date();
    const today = new Date(formik.values.applicationDate);

    const todayYear = today.getFullYear();

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

  /* A validation schema for the form. */

  /* Creating a new Date object and assigning it to the variable defaultDate. */
  const validationObject = {
    applicantName: Yup.string()
      .min(3, "Your name should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        "Name should be in a valid format"
      )
      .required("Name is required"),
    dob: Yup.string()
      .typeError("Date of Birth cannot be empty ")
      .required("Date of Birth cannot be empty"),
    fatherName: Yup.string()
      .min(3, "Father/Husband name should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        "Father/Husaband Name should be in a valid format"
      )
      .required("Father name is required"),
    rdAmount: Yup.number()
      .typeError("RD Amount must be a number")
      .required("RD Amount is required")
      .min(1, "Amount should be more than 0"),
    applicationDate: Yup.string()
      .typeError("Application Date cannot be empty ")
      .required("Application Date cannot be empty"),
    tenure: Yup.number().min(1, "tenure should be more than 0"),
    // .max(100, "tenure should be less than 100"),
    pendingmfic: Yup.number()
      .required("pending Loan from MFIs is required")
      .typeError("you must specify a number")
      .min(0),
    voterId: Yup.string().when("panCard", {
      is: "",
      then: Yup.string().required("voter Id is required."),
    }),
    panCard: Yup.string()
      .matches(
        /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
        "Pan Card Number must have both numbers and alphabets"
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
      .typeError("you must specify a number")
      .min(0),
    yearlyInterestRate: Yup.number()
      .typeError("Interest Rate should be a number")
      .required("Interest Rate is required")
      .min(1, "interest Rate should be more than 0")
      .max(100, "interest Rate should be less than 100"),
    referedBy: Yup.string()
      .required("Referred By is required")
      .typeError("Referred By is required"),
    dailyTenure: Yup.number().min(1, "tenure should be more than 0"),
  };
  const rdSchema = Yup.object().shape(validationObject);

  const defaultDate = new Date();

  /* Initializing the formik form with default values. */
  const formik = useFormik({
    initialValues: {
      newMember: "Yes",
      applicantName: "",
      fatherName: "",
      dob: "",
      MaritalStatus: "",
      kyc1: "",
      rdAmount: "",
      tenure: "",
      yearlyInterestRate: "",
      applicationDate: defaultDate,
      kyc2: "Pan Card",
      panCard: "",
      adhaarCard: "",
      voterId: "",
      pendingmfic: "",
      mobile: "",
      branch: "",
      familyAnnualIncome: "",
      pendingmficAmount: "",
      resident: "",
      referedBy: "",
      kyc2Document: KYC2Doc,
      adhaarDocument: adhaarDoc,
      area: "",
      rdTenure: "Monthly",
      dailyTenure: "",
    },

    validationSchema: rdSchema,
    onSubmit: (values, { resetForm }) => {
      const body = new FormData();
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
      body.append("newMember", values.newMember);
      body.append("memberId", values.memberId);
      body.append("branch", values.branch);
      body.append("area", values.area);
      body.append("kycStatus", values.kycStatus ? values.kycStatus : "Pending");
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
      body.append("applicationDate", values.applicationDate);
      body.append("tenure", values.tenure);
      body.append("yearlyInterestRate", values.yearlyInterestRate);
      body.append("kyc2", values.kyc2);
      body.append("pendingmfic", values.pendingmfic);
      body.append("rdAmount", values.rdAmount);
      body.append("rdTenure", values.rdTenure);
      body.append("dailyTenure", values.dailyTenure);

      /* Making an API call to the server. */
      axiosPostDataToApi("rdeposit", body, token)
        .then((res) => {
          swal(
            res.data.success ? "Success!" : "Error!",
            res.data.message,
            res.data.success ? "success" : "error"
          );

          if (res.data.success) {
            navigate("/dashboard/RecurringDeposit", { replace: true });
          }
        })
        .catch((err) => {
          throw err;
        });
    },
  });
  const { isSubmitting } = formik;

  /* Changing the name of the file. */
  const documentName = {};

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

  /* Resetting the form when the user selects "Yes" from the dropdown. */
  useEffect(() => {
    if (formik.values.newMember === "Yes") {
      formik.resetForm();
      setDisabled(false);
    }
  }, [formik.values.newMember]);

  //Components Return
  return (
    <Page title="RD Application">
      <div>
        <form onSubmit={formik.handleSubmit} sx={{ m: 1 }}>
          <Card>
            <CardContent noValidate autoComplete="off">
              <Grid container rowSpacing={2} columnSpacing={4}>
                <Grid item xs={12} sm={8} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      fullWidth
                      name="applicationDate"
                      label="Application Date"
                      type="Input"
                      id="applicationDate"
                      onChange={date}
                      value={formik.values.applicationDate}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          fullWidth
                          {...params}
                          error={
                            formik.touched.applicationDate &&
                            Boolean(formik.errors.applicationDate)
                          }
                          helperText={
                            formik.touched.applicationDate &&
                            formik.errors.applicationDate
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    required
                    id="newMember"
                    select
                    label="New Member"
                    name="newMember"
                    value={formik.values.newMember}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  {formik.values.newMember === "No" && (
                    <div>
                      {members.length > 0 && (
                        <Autocomplete
                          size="small"
                          fullWidth
                          options={members}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          onClear={clearAll}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              getMember(newValue.id);
                              formik.setValues({
                                ...formik.values,
                                memberId: newValue.id,
                              });
                            }
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Search Member" />
                          )}
                        />
                      )}
                    </div>
                  )}
                </Grid>

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

                <Grid container sx={{ justifyContent: "center" }}>
                  {" "}
                  {loading && <Loader />}
                </Grid>
                {!loading && (
                  <>
                    <Grid item xs={12} sm={8} md={4}>
                      {tLoading && <SmallLoader />}
                      {!tLoading && (
                        <div>
                          {employee.length > 0 && (
                            <Grid>
                              {formik.values.newMember === "Yes" && (
                                <Autocomplete
                                  required
                                  name="referedBy"
                                  size="small"
                                  fullWidth
                                  disabled={formDisable}
                                  options={employee}
                                  getOptionLabel={(option) => option.name}
                                  isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                  }
                                  onChange={(event, newValue) => {
                                    if (newValue) {
                                      getEmployees(newValue.id);
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
                                      name="referedBy"
                                      required
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
                              )}
                              {formik.values.newMember === "No" && (
                                <Autocomplete
                                  required
                                  name="referedBy"
                                  size="small"
                                  fullWidth
                                  disabled={formDisable}
                                  options={employee}
                                  getOptionLabel={(option) => option.name}
                                  isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                  }
                                  inputValue={formik.values.referedBy}
                                  onChange={(event, newValue) => {
                                    if (newValue) {
                                      getEmployees(newValue.id);
                                      formik.setValues({
                                        ...formik.values,
                                        referedBy: newValue.name,
                                        // name:newValue.name
                                      });
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Referred by FO"
                                      name="referedBy"
                                      required
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
                              )}
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
                        disabled={formDisable}
                        value={formik.values.branch}
                        onChange={(e) => {
                          getAreas(e.target.value);

                          formik.setFieldValue("branch", e.target.value);
                        }}
                        error={
                          formik.touched.branch && Boolean(formik.errors.branch)
                        }
                        helperText={
                          formik.touched.branch && formik.errors.branch
                        }
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
                        id="kyc1Num"
                        disabled={formDisable}
                        name="adhaarCard"
                        label="Aadhaar Number"
                        type="number"
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
                    <Grid item xs={12} sm={8} md={4}>
                      <TextField
                        required
                        size="small"
                        fullWidth
                        id="applicantName"
                        name="applicantName"
                        label="Member Name"
                        disabled={formDisable}
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
                        required
                        size="small"
                        fullWidth
                        select
                        id="center"
                        name="area"
                        label="Area"
                        value={formik.values.area}
                        disabled={formDisable}
                        onChange={(e) => {
                          formik.setFieldValue("area", e.target.value);
                        }}
                        error={
                          formik.touched.area && Boolean(formik.errors.area)
                        }
                        helperText={formik.touched.area && formik.errors.area}
                      >
                        {area.map((option, i) => (
                          <MenuItem key={i} value={option._id}>
                            {option.areaName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    {memberAllData.length > 0 && (
                      <Grid item xs={10} sm={8} md={4}>
                        <Grid style={customStyles.openDocumentStyle}>
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
                              Open Aadhaar Document
                            </Typography>
                          </a>
                        </Grid>
                      </Grid>
                    )}
                    {formik.values.newMember == "Yes" && (
                      <Grid item xs={12} sm={8} md={4}>
                        <TextField
                          required
                          fullWidth
                          label="Aadhaar Document Upload"
                          focused
                          color="grey"
                          inputProps={{ accept: ".pdf,.jpg,.jpeg" }}
                          size="small"
                          name="adhaarDocument"
                          type="file"
                          // onClick={fileUpload}
                          onChange={(event) => {
                            formik.setValues({
                              ...formik.values,
                              adhaarDocument: event.currentTarget.files[0],
                            });
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={8} md={4}>
                      <TextField
                        fullWidth
                        required
                        size="small"
                        id="father"
                        name="fatherName"
                        label="Father/Husband Name"
                        disabled={formDisable}
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
                      <TextField
                        fullWidth
                        required
                        size="small"
                        type="number"
                        id="familyAnnualIncome"
                        name="familyAnnualIncome"
                        label="Family Annual Income(Rs.)"
                        disabled={formDisable}
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
                        id="kyc2"
                        select
                        label="KYC ID"
                        name="kyc2"
                        disabled={formDisable}
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
                        <MenuItem value="Voter ID">Voter ID </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          id="dob"
                          inputFormat="dd/MM/yyyy"
                          onChange={getDob}
                          disabled={formDisable}
                          value={formik.values.dob}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              fullWidth
                              {...params}
                              error={
                                formik.touched.dob && Boolean(formik.errors.dob)
                              }
                              helperText={
                                formik.touched.dob && formik.errors.dob
                              }
                            />
                          )}
                          fullWidth
                          name="dob"
                          label="DOB *"
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
                        disabled={formDisable}
                        error={
                          formik.touched.pendingmfic &&
                          Boolean(formik.errors.pendingmfic)
                        }
                        helperText={
                          formik.touched.pendingmfic &&
                          formik.errors.pendingmfic
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={8} md={4}>
                      {formik.values.kyc2 === "Pan Card" && (
                        <TextField
                          required
                          size="small"
                          fullWidth
                          id="kyc2Num"
                          name="panCard"
                          label="KYC ID Number"
                          value={formik.values.panCard}
                          disabled={formDisable}
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
                          size="small"
                          fullWidth
                          id="kyc2Num"
                          name="voterId"
                          label="KYC ID Number"
                          value={formik.values.voterId}
                          disabled={formDisable}
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
                    <Grid item xs={12} sm={8} md={4}>
                      <TextField
                        required
                        size="small"
                        fullWidth
                        id="MaritalStatus"
                        select
                        name="MaritalStatus"
                        label="Marital Status"
                        value={formik.values.MaritalStatus}
                        onChange={formik.handleChange}
                        disabled={formDisable}
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
                        disabled={formDisable}
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
                    {memberAllData.length > 0 && (
                      <Grid item xs={12} sm={8} md={4}>
                        <Grid style={customStyles.openDocumentStyle}>
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
                              style={customStyles.documentOpenIcon}
                            />
                            <Typography style={customStyles.documentText}>
                              Open KYC ID 2
                            </Typography>
                          </a>
                        </Grid>
                      </Grid>
                    )}
                    {formik.values.newMember == "Yes" && (
                      <Grid item xs={12} sm={8} md={4}>
                        <TextField
                          required
                          focused
                          color="grey"
                          size="small"
                          name="kyc2Document"
                          type="file"
                          inputProps={{ accept: ".pdf,.jpg,.jpeg" }}
                          label="KYC Document Upload"
                          onChange={(event) => {
                            formik.setFieldValue(
                              "kyc2Document",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={8} md={4}>
                      <TextField
                        required
                        size="small"
                        fullWidth
                        name="mobile"
                        disabled={formDisable}
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        id="outlined-required"
                        label="Mobile Number"
                        error={
                          formik.touched.mobile && Boolean(formik.errors.mobile)
                        }
                        helperText={
                          formik.touched.mobile && formik.errors.mobile
                        }
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
                        disabled={formDisable}
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
                  </>
                )}
                <Grid item xs={12}>
                  <Typography
                    style={{
                      marginTop: "20px",
                      marginBottom: "20px",
                      marginLeft: "10px",
                    }}
                  >
                    RD Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    id="RD Amount"
                    name="rdAmount"
                    label="RD Amount(Rs.)"
                    value={formik.values.rdAmount}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.rdAmount && Boolean(formik.errors.rdAmount)
                    }
                    helperText={
                      formik.touched.rdAmount && formik.errors.rdAmount
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    required
                    size="small"
                    fullWidth
                    id="rdTenure"
                    select
                    name="rdTenure"
                    label="RD Tenure"
                    value={formik.values.rdTenure}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                  </TextField>
                </Grid>

                {formik.values.rdTenure == "Monthly" && (
                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="tenure"
                      name="tenure"
                      type="number"
                      label="Tenure(Months)"
                      value={formik.values.tenure}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.tenure && Boolean(formik.errors.tenure)
                      }
                      helperText={formik.touched.tenure && formik.errors.tenure}
                    />
                  </Grid>
                )}
                {formik.values.rdTenure == "Daily" && (
                  <Grid item xs={12} sm={8} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      required
                      id="dailyTenure"
                      name="dailyTenure"
                      type="number"
                      label="Tenure(daily)"
                      value={formik.values.dailyTenure}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.dailyTenure &&
                        Boolean(formik.errors.dailyTenure)
                      }
                      helperText={
                        formik.touched.dailyTenure && formik.errors.dailyTenure
                      }
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    id="yearlyInterestRate"
                    name="yearlyInterestRate"
                    label="Yearly Interest Rate(%)"
                    value={formik.values.yearlyInterestRate}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.yearlyInterestRate &&
                      Boolean(formik.errors.yearlyInterestRate)
                    }
                    helperText={
                      formik.touched.yearlyInterestRate &&
                      formik.errors.yearlyInterestRate
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
                        color="warning"
                        onClick={() => {
                          navigate("/dashboard/RecurringDeposit", {
                            replace: true,
                          });
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
                        Apply for RD
                      </LoadingButton>
                    </ButtonGroup>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </div>
    </Page>
  );
}
