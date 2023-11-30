import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
import {
  Typography,
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
import { Icon } from "@iconify/react";
import { LoadingButton } from "@mui/lab";

import { DOC_LINK } from "src/constants/config";
import { customStyles } from "src/components/style";
import SmallLoader from "src/components/SmallLoader";
import Loader from "src/components/Loader";
import { values } from "lodash";
export default function LoanForm() {
  const navigate = useNavigate();

  /* Setting the state of the component. */
  const [branches, setBranches] = useState([]);
  const [area, setArea] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberAllData, setmemberAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formDisable, setDisabled] = useState(false);
  const [employee, setEmployees] = useState(false);
  const [adhaarDoc, setadhaarDoc] = useState("");
  const [KYC2Doc, setKYC2Doc] = useState("");
  const [tLoading, setTLoading] = useState(true);

  /* The above code is getting the token from the session storage. */
  const token = sessionStorage.getItem("token");

  /**
   * GetMember is a function that takes an id as an argument and then sets the loading state to true,
   * sets the formik.values.memberId to the id, and then calls the getDataFromApi function with the id
   * as an argument.
   * The getDataFromApi function returns a promise, and when that promise resolves, the setLoading
   * function is called with false as an argument, and then the formik.setValues function is called with
   * an object as an argument.
   * @param id - the id of the member
   */
  const getMember = (id) => {
    setLoading(true);
    formik.values.memberId = id;
    getDataFromApi(`getMemberbyid/${id.replace("/", "%2F")}`).then((res) => {
      setLoading(false);
      getAreas(res[0].branch._id);
      formik.setValues({ ...formik.values, kycStatus: res[0].kycStatus });
      formik.setFieldValue("branch", res[0].branch ? res[0].branch._id : "");
      formik.setFieldValue("fatherName", res[0].fatherName);
      formik.setFieldValue("age", res[0].age);
      formik.setFieldValue("MartialStatus", res[0].MartialStatus);
      formik.setFieldValue("kyc2", res[0].kyc2);
      formik.setFieldValue("adhaarCard", res[0].adhaarCard);
      formik.setFieldValue("panCard", res[0].panCard);
      formik.setFieldValue("voterId", res[0].voterId);
      formik.setFieldValue("applicantName", res[0].applicantName);
      formik.setFieldValue("loanAmount", res[0].loanAmount);
      formik.setFieldValue("pendingmfic", res[0].pendingmfic);
      formik.setFieldValue("tenure", res[0].tenure);
      formik.setFieldValue("interestRate", res[0].interestRate);
      formik.setFieldValue("kyc1", res[0].kyc1);
      formik.setFieldValue("mobile", res[0].mobile);
      formik.setFieldValue("MaritalStatus", res[0].MaritalStatus);
      formik.setFieldValue("dob", res[0].dob);
      formik.setFieldValue("resident", res[0].resident);
      formik.setFieldValue("referedBy", res[0].referedBy);
      formik.setFieldValue("pendingmficAmount", res[0].pendingmficAmount);
      formik.setFieldValue("familyAnnualIncome", res[0].familyAnnualIncome);
      formik.setFieldValue("adhaarDocument", res[0].uploadAdhaarDocument);
      formik.setFieldValue("kyc2Document", res[0].kyc2DocumentUpload);
      formik.setFieldValue("area", res[0].area ? res[0].area._id : "");
      setDisabled(true);
      setadhaarDoc(res[0].uploadAdhaarDocument);

      setKYC2Doc(res[0].kyc2DocumentUpload);

      setmemberAllData(res);
    });
  };

  /**
   * It gets data from an API, then filters the data to only include active branches, then sets the
   * state of the branches to the filtered data.
   */
  const getBranchData = () => {
    let activeBranch = [];
    getDataFromApi("branch")
      .then((res) => {
        res.map((branch) => {
          if (branch.activeStatus === true) {
            activeBranch.push(branch);
          }
        });
        setBranches(activeBranch);
      })
      .catch((err) => console.log(err));
  };

  /**
   * It gets the areas from the API and sets the state of the areas.
   * @param id - the id of the branch that was selected
   */
  const getAreas = (id) => {
    let activeArea = [];

    getDataFromApi("areabyBranch/" + id).then((res) => {
      res.data.map((area) => {
        if (area.activeStatus === true) {
          activeArea.push(area);
        }
      });

      setArea(activeArea);
    });
  };

  const clearAll = () => {
    formik.resetForm();
    formik.setFieldValue("newMember", "No");
    setDisabled(false);
  };

  /**
   * It takes an array of objects, and returns an array of objects with the same keys, but with different
   * values.
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
   * It gets all employees from the API, then filters them to only include those with the role of FO and
   * status of true, then sets the state of employees to the filtered list.
   */
  const getEmployees = () => {
    // setTLoading(true);
    getDataFromApi(`emp/getAllEmp`)
      .then((res) => {
        setTLoading(false);

        let empList = [];
        res.map((employee) => {
          let tempObj = {};
          if (employee.roles[0].name === "FO" && employee.status === true) {
            tempObj.name = employee.name + "(" + employee.empId + ")";
            tempObj.id = employee.empId;
            empList.push(tempObj);

            return null;
          }
        });
        if (empList.length === 0) {
          swal("There are no employees with FO role for Referred By Field");
        }

        setEmployees(empList);
      })
      .catch((err) => console.log(err));
  };

  /* Calling the functions getBranchData, getMemberData, and getEmployees when the component mounts. */
  useEffect(() => {
    getBranchData();
    getMemberData();
    getEmployees();
  }, []);

  /**
   * If the value is null, set the applicationDate field to an empty string, otherwise set it to the
   * value's date string.
   * @param value - The value of the input.
   */
  const date = (value) => {
    formik.setFieldValue(
      "applicationDate",
      value == null ? "" : value.toDateString()
    );
  };

  /**
   * It takes a date value, calculates the age, and if the age is less than 18, it sets the value to null
   * and sets the error message.
   * @param value - The value of the field.
   */
  const getDob = (value) => {
    let age;
    // const today = new Date();
    const today = new Date(formik.values.applicationDate);

    let day = value;
    age = today.getFullYear() - (value == null ? 0 : day.getFullYear());

    if (age < 18) {
      alert("Age should be greater than 18");
      formik.setFieldValue("dob", "");
    }
    formik.setFieldValue(
      "dob",
      value == null || age < 18 ? "" : value.toDateString()
    );
    formik.setFieldError("dob", "Age should be greater than 18");
  };

  /* A validation schema for a form. */


  const validationObject = {

    applicantName: Yup.string()
      .min(3, "Your name should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        "Name should be in a valid format"
      )
      .required("Name is required"),
    fatherName: Yup.string()
      .min(3, "Father/Husaband name should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        "Father/Husaband should be in a valid format"
      )
      .required("Father/Husaband name is required"),

    dob: Yup.string()
      .typeError("Date of Birth cannot be empty ")
      .required("Date of Birth cannot be empty"),

    loanAmount: Yup.number()
      .required("Loan Amount is required")
      .min(1, "loan amount should be more than 0")
      .typeError("Loan Amount should be a number"),
    tenure: Yup.number()
      .required("Tenure is required")
      .min(1, "tenure should be more than 0"),

    applicationDate: Yup.string()
      .typeError("Application Date cannot be empty ")
      .required("Application Date cannot be empty"),
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
        "Aadhaar Card must be of exact 12 digits",
        (adhaarCard) => String(adhaarCard).length === 12
      )
      .min(0, "It should not contain negative value")
      .integer("Aadhaar Card should not contain decimal value")
      .typeError("Aadhaar Card must be a number"),

    mobile: Yup.string().matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "Mobile Number should be a 10 digit number"
    ),
    pendingmfic: Yup.number()
      .required("pending Loan from MFIs is required")
      .typeError("you must specify a number")
      .min(0),
    familyAnnualIncome: Yup.number()
      .required("Family Annual Income is required")
      .typeError("you must specify a number")
      .min(1, "Family Annual Income must be greater than or equal to 1"),
    totalInterestAmount: Yup.number()
      .required("Total Interest Amount is required")
      .typeError("you must specify a number")
      .min(1, "Total Interest Amount should be more than 0"),
    resident: Yup.string()
      .matches(/^\S/, "Resident should not contain spaces only")
      .min(5, "Resident should be of atleast 5 character")
      .required("Resident is required"),
    pendingmficAmount: Yup.number()
      .required("Pending MFIs Amount is required")
      .typeError("you must specify a number")
      .min(0),
    loanPurpose: Yup.string()
      .matches(/^\S/, "Enter a valid Data")
      .required("Loan Purpose is required"),
    referedBy: Yup.string()
      .required(" Referred By is required")
      .typeError("Referred By is required"),
    applicationDate: Yup.date().required(" applicationDate is required"),
    branch: Yup.string().required(" branch is required"),
    area: Yup.string().required(" area is required"),
    newMember: Yup.string().required(" newmember is required"),
    MaritalStatus: Yup.string().required(" maritalStatus is required"),
  };
  const loanSchema = Yup.object().shape(validationObject);

  /* Creating a new Date object and assigning it to the variable defaultDate. */
  const defaultDate = new Date();

  /* Initializing the formik state with the initial values. */
  const formik = useFormik({
    initialValues: {
      memberId: "",
      newMember: "Yes",
      branch: "",
      applicantName: "",
      fatherName: "",
      MaritalStatus: "",
      kyc2: "Pan Card",
      loanAmount: "",
      pendingmfic: "",
      tenure: "",
      applicationDate: defaultDate,
      panCard: "",
      adhaarCard: "",
      voterId: "",
      mobile: "",
      dob: "",
      familyAnnualIncome: "",
      totalInterestAmount: "",
      pendingmficAmount: "",
      resident: "",
      referedBy: "",
      loanPurpose: "",
      kyc2Document: KYC2Doc,
      adhaarDocument: adhaarDoc,
      kycStatus: "",
      area: "",
    },
    validationSchema: loanSchema,
    validator: () => ({}),
    onSubmit: (values, { resetForm }) => {
      console.log(values);

      /* Creating a form data object and appending all the values to it. */
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
      body.append("memberId", values.memberId);
      body.append("newMember", values.newMember);
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
      body.append("loanPurpose", values.loanPurpose);
      body.append("loanAmount", values.loanAmount);
      body.append("panCard", values.panCard);
      body.append("voterId", values.voterId);
      body.append("applicationDate", values.applicationDate);
      body.append("tenure", values.tenure);
      body.append("totalInterestAmount", values.totalInterestAmount);
      body.append("kyc2", values.kyc2);
      body.append("pendingmfic", values.pendingmfic);
      body.append("processingFee", (formik.values.loanAmount * 1.5) / 100);
      body.append("installments", installments.toFixed(2));
      body.append("loanInsuranceFee", loanInsuranceFee.toFixed(2));
      body.append("balanceAmount", balanceAmount.toFixed(2));

      /* Sending a post request to the api with the body and token. */
      axiosPostDataToApi("loan", body, token)
        .then((res) => {
          swal(
            res.data.success ? "Success!" : "Error!",
            res.data.message,
            res.data.success ? "success" : "error"
          );

          if (res.data.success) {
            //   // swal("Success!", "Application sent Successfully!", "success");
            navigate("/dashboard/Loan", { replace: true });
          }
        })
        .catch((err) => {
          throw err;
        });
    },
  });

  /* Resetting the form when the user selects "Yes" from the dropdown. */
  useEffect(() => {
    if (formik.values.newMember === "Yes") {
      formik.resetForm();
      setDisabled(false);
    }
  }, [formik.values.newMember]);

  const { isSubmitting } = formik;

  /* Calculating the installment amount. */
  const processingFee = (formik.values.loanAmount * 1.5) / 100;
  const loanInsuranceFee = (formik.values.loanAmount * 1.5) / 100;
  const installments =
    (formik.values.loanAmount +
      formik.values.totalInterestAmount -
      processingFee -
      loanInsuranceFee) /
    formik.values.tenure;
  let balanceAmount = installments * formik.values.tenure;

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

  // Components Return
  return (
    <Page title="Loan Application">
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
                    required
                    size="small"
                    fullWidth
                    id="newMember"
                    select
                    name="newMember"
                    label="New Member"
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
                                  // isOptionEqualToValue={}

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
                                      value={formik.values.referedBy}
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
                        select
                        id="center"
                        name="branch"
                        label="Branch"
                        value={formik.values.branch}
                        disabled={formDisable}
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
                        type="number"
                        id="kyc1Num"
                        disabled={formDisable}
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
                    {/* {JSON.stringify(memberAllData.length)} */}
                    {memberAllData.length > 0 && (
                      <Grid item xs={10} sm={8} md={4}>
                        <Grid style={customStyles.openDocumentStyle}>
                          <a
                            href={`${DOC_LINK}/uploads/${adhaarDoc}`}
                            target="_blank"
                            rel="noreferrer"
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
                    {formik.values.newMember === "Yes" && (
                      <Grid item xs={12} sm={8} md={4}>
                        <TextField
                          required
                          fullWidth
                          label="Aadhaar Document Upload"
                          focused
                          inputProps={{ accept: ".pdf,.jpg,.jpeg" }}
                          color="grey"
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
                        label="Father / Husband Name"
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
                              required
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
                          label="DOB "
                          type="Date"
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
                            rel="noreferrer"
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
                    {formik.values.newMember === "Yes" && (
                      <Grid item xs={12} sm={8} md={4}>
                        <TextField
                          required
                          focused
                          inputProps={{ accept: ".pdf,.jpg,.jpeg" }}
                          color="grey"
                          size="small"
                          name="kyc2Document"
                          type="file"
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
                    Loan Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    required
                    size="small"
                    fullWidth
                    id="loanPurpose"
                    name="loanPurpose"
                    label="Loan Purpose"
                    value={formik.values.loanPurpose}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.loanPurpose &&
                      Boolean(formik.errors.loanPurpose)
                    }
                    helperText={
                      formik.touched.loanPurpose && formik.errors.loanPurpose
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    required
                    size="small"
                    fullWidth
                    type="number"
                    id="loanAmount"
                    name="loanAmount"
                    label="Loan Amount(Rs.)"
                    value={formik.values.loanAmount}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.loanAmount &&
                      Boolean(formik.errors.loanAmount)
                    }
                    helperText={
                      formik.touched.loanAmount && formik.errors.loanAmount
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    required
                    size="small"
                    type="number"
                    fullWidth
                    id="totalInterestAmount"
                    name="totalInterestAmount"
                    label="Total Interest Amount(Rs.)"
                    value={formik.values.totalInterestAmount}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.totalInterestAmount &&
                      Boolean(formik.errors.totalInterestAmount)
                    }
                    helperText={
                      formik.touched.totalInterestAmount &&
                      formik.errors.totalInterestAmount
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    required
                    size="small"
                    fullWidth
                    id="tenure"
                    type="number"
                    name="tenure"
                    label="Tenure(Weeks)"
                    value={formik.values.tenure}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.tenure && Boolean(formik.errors.tenure)
                    }
                    helperText={formik.touched.tenure && formik.errors.tenure}
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <Typography sx={{ fontSize: 13, color: "#555555" }}>
                    Weekly Installment Amount(Rs.):{" "}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#555555" }}>
                    {isNaN(installments)
                      ? ""
                      : installments === "Infinity"
                      ? ""
                      : installments.toFixed(2)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={8} md={4}>
                  <Typography sx={{ fontSize: 13, color: "#555555" }}>
                    Processing Fee(Rs.){" "}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#555555" }}>
                    {" "}
                    {isNaN(processingFee) ? "" : processingFee.toFixed(2)}{" "}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <Typography sx={{ fontSize: 13, color: "#555555" }}>
                    Loan Insurance Fee(Rs.){" "}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#555555" }}>
                    {" "}
                    {isNaN(loanInsuranceFee)
                      ? ""
                      : loanInsuranceFee.toFixed(2)}{" "}
                  </Typography>
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
                          navigate("/dashboard/Loan", { replace: true });
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
                        Apply for Loan
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
