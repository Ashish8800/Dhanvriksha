import * as Yup from "yup";
// import * as React from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  TextField,
  CardContent,
  Grid,
  ButtonGroup,
  Autocomplete,
} from "@mui/material";

import { useFormik } from "formik";

import Page from "./Page";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { BASE_URL } from "../constants/config";

import swal from "sweetalert";
import { getDataFromApi } from "../utils/apiCalls";

import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// ----------------------------------------------------------------------

export default function MemberData() {
  const [branches, setBranches] = useState([]);
  const [formDisable, setDisabled] = useState(false);
  const [members, setMembers] = useState([]);
  const [employee, setEmployees] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const AddMemberSchema = Yup.object().shape({
    applicantName: Yup.string()
      // .name("name must be a valid ")
      .min(3, "Your name should be of atleast 3 character")
      .matches(/^[a-z,A-Z\s]+$/, "Name should be a string")
      .required("Name is required"),
    dob: Yup.string()
      // .typeError("Date of Birth cannot be empty ")
      .required("Date of Birth  cannot be empty"),
    // age: Yup.number().min(18, "Age should be more than 18").max(70, "Age should be less than 70"),
    fatherName: Yup.string()
      .min(3, "Father name should be of atleast 3 character")
      .matches(/^[a-z,A-Z\s]+$/, "Name should be a string")
      .required("Father name is required"),
    // applicationDate: Yup.string()
    //   .typeError("Application Date cannot be empty ")
    //   .required("Application Date cannot be empty"),
    pendingmfic: Yup.number()
      .required("pending Loan from MFIc is required")
      .typeError("you must specify a number"),
    panCard: Yup.string()
      .matches(
        /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
        "Pan Card Number should be in proper format"
      )
      .min(10, "Pan Card Number should be of 10 digits")
      .max(10, "Pan Card Number should be of 10 digits"),
    familyAnnualIncome: Yup.number()
      .required("Family Annual Income is required")
      .typeError("you must specify a number"),
    adhaarCard: Yup.number()
      .test(
        "maxDigits",
        "Adhaar Card must be of exact 12 digits",
        (adhaarCard) => String(adhaarCard).length === 12
      )
      .typeError("Aadhaar Card must be a number"),
    resident: Yup.string()
      .min(5, "Resident should be of atleast 5 character")
      .required("Resident is required"),
    pendingmficAmount: Yup.number()
      .required("Pending MFIs Amount is required")
      .typeError("you must specify a number"),
    voterId: Yup.string().matches(
      /([a-zA-Z]){3}([0-9]){7}/,
      "Enter Valid Voter Id number"
    ),
    mobile: Yup.number()
      // .mobile("Mobile must be a digit")
      .min(1111111111, "Mobile should be of 10 digits")
      .max(9999999999, "Mobile should be of 10 digits"),
  });
  const getBranchData = () => {
    getDataFromApi("branch")
      .then((res) => setBranches(res))
      .catch((err) => console.log(err));
  };
  const getDob = (value) => {
    let day = value;
    formik.setFieldValue(
      "dob",
      value == null
        ? ""
        : ("0" + (day.getMonth() + 1)).slice(-2) +
            "/" +
            ("0" + day.getDate()).slice(-2) +
            "/" +
            day.getFullYear()
    );
  };

  const formik = useFormik({
    initialValues: {
      branch: "",
      applicantName: "",
      fatherName: "",
      // age: "",
      MaritalStatus: "",

      kyc1: "",
      kyc2: "",
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
      kyc2Document: {},
      adhaarDocument: {},
    },
    validationSchema: AddMemberSchema,

    onSubmit: (values) => {
      console.log("Inside add Member");
      // console.log("Member", values);
      const body = new FormData();
      body.append("images", values["kyc2Document"]);
      body.append("images", values["adhaarDocument"]);
      body.append(
        "adhaarDocument",
        values["adhaarDocument"].name.toLowerCase().split(" ").join("-")
      );
      body.append(
        "kyc2Document",
        values["kyc2Document"].name.toLowerCase().split(" ").join("-")
      );

      body.append("branch", values.branch);
      body.append("applicantName", values.applicantName);
      body.append("fatherName", values.fatherName);
      body.append("MaritalStatus", values.MaritalStatus);
      body.append("adhaarCard", values.adhaarCard);
      body.append("mobile", values.mobile);
      body.append("dob", values.dob);
      body.append("familyAnnualIncome", values.familyAnnualIncome);
      body.append("pendingmficAmount", values.pendingmficAmount);
      body.append("resident", values.resident);
      //   body.append("referedBy", values.referedBy);

      body.append("panCard", values.panCard);
      body.append("voterId", values.voterId);
      body.append("applicationDate", values.applicationDate);
      body.append("tenure", values.tenure);
      body.append("totalInterestAmount", values.totalInterestAmount);
      body.append("pendingmfic", values.pendingmfic);
      // body.append("branchId", values.branch.branchId);
      body.append("processingFee", (formik.values.loanAmount * 1.5) / 100);
      body.append(
        "installments",
        (formik.values.loanAmount + formik.values.totalInterestAmount) /
          formik.values.tenure
      );
      axios
        .post(
          `${BASE_URL}/addNewMemberReg`,
          values,

          {
            headers: {
              Authorization: token,
            },
          }
        )

        .then((res) => {
          swal("Sucess!", "User Registered SucessFully!", "success");
          console.log("line 193", res);

          if (res) {
            navigate("/dashboard/Member", { replace: true });
          }
        });
    },
  });
  const getEmployees = () => {
    getDataFromApi(`emp/getAllEmp`)
      .then((res) => {
        // console.log("emp", employee);
        // console.log("Emp Data",res[0].roles[0].name)
        let empList = [];
        res.map((employee) => {
          // console.log("95",employee.roles[0].name)
          let tempObj = {};
          if (employee.roles[0].name == "FO") {
            tempObj.name = employee.name + "(" + employee.empId + ")";
            tempObj.id = employee.empId;
            empList.push(tempObj);
            // console.log("101", empList);
            return null;
          }
        });

        setEmployees(empList);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getBranchData();
    getEmployees();
  }, []);
  const { isSubmitting } = formik;
  return (
    <Page title="Member Data">
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
                  <div>
                    {employee.length > 0 && (
                      <Autocomplete
                        required
                        size="small"
                        fullWidth
                        options={employee}
                        getOptionLabel={(option) => option.name}
                        //onClear={clearAll}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            getEmployees(newValue.id);
                            formik.setValues({
                              ...formik.values,
                              referedBy: newValue.name,
                              // name:newValue.name
                            });
                            console.log("Line 359 ", newValue);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Referred by FO"
                            name="referedBy"
                          />
                        )}
                      />
                    )}
                  </div>
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
                    onChange={formik.handleChange}
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
                    fullWidth
                    required
                    size="small"
                    type="number"
                    id="familyAnnualIncome"
                    name="familyAnnualIncome"
                    label="Family Annual Income"
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
                    fullWidth
                    label="Aadhar Document Upload"
                    focused
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
                      formik.touched.resident && Boolean(formik.errors.resident)
                    }
                    helperText={
                      formik.touched.resident && formik.errors.resident
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    id="kyc2"
                    select
                    name="kyc2"
                    label="KYC ID"
                    value={formik.values.kyc2}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Pan Card">Pan Card</MenuItem>
                    <MenuItem value="Voter ID">Voter ID </MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={8} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      id="dob"
                      onChange={getDob}
                      // format="MM/dd/yyyy"
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
                    disabled={formDisable}
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
                  {formik.values.kyc2 === "Pan Card" && (
                    <TextField
                      required
                      fullWidth
                      size="small"
                      id="kyc2Num"
                      name="panCard"
                      label="KYC 2 Number"
                      value={formik.values.panCard}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.panCard && Boolean(formik.errors.panCard)
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
                      label="KYC 2 Number"
                      value={formik.values.voterId}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.voterId && Boolean(formik.errors.voterId)
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
                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    focused
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

                <Grid item xs={12} sm={8} md={4}>
                  <TextField
                    required
                    fullWidth
                    size="small"
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
                {/* <Grid item xs={12}>
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
                        Apply for New Member
                      </LoadingButton>
                    </ButtonGroup>
                  </Box>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </form>
      </div>
    </Page>
  );
}
