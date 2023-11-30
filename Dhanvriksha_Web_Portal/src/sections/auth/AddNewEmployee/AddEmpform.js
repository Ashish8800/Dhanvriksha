import * as Yup from "yup";
// import * as React from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
//mui
import {
  TextField,
  Card,
  CardContent,
  Box,
  Grid,
  ButtonGroup,
  Autocomplete,
  OutlinedInput,
  Button,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { LoadingButton } from "@mui/lab";
import Page from "../../../components/Page";
import axios from "axios";
//constants saved in config.js file
import { BASE_URL, status, roleValues } from "../../../constants/config";
import swal from "sweetalert";
import { getDataFromApi } from "../../../utils/apiCalls";


export default function AddEmpForm(props) {
  /* Declaring a state variable and a function to update the state variable. */
  const [branches, setBranches] = useState([]);
  const [area, setArea] = useState([]);
  const [selected, setselected] = useState([]);
  const [reportingPerson, setreportingPerson] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

//Form Validation by Yup
  const AddEmpSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),

    mobile: Yup.string()
      .matches(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        "Mobile Number should be a 10 digit number"
      )
      .typeError("Mobile Number cannot be empty ")
      .required("Mobile Number should be required"),
    roles: Yup.string()
      .typeError("Role cannot be empty ")
      .required("Role cannot be empty"),

    reportingPerson: Yup.string()
      .typeError("Reporting Person cannot be empty ")
      .required("Reporting Person cannot be empty"),

    branch: Yup.string()
      .typeError("Branch Name cannot be empty ")
      .required("Branch Name cannot be empty"),

    status: Yup.string()
      .typeError("Status cannot be empty ")
      .required("Status cannot be empty"),

    name: Yup.string()
      // .name("name must be a valid ")
      .min(3, "Your name should be of atleast 3 character")
      .matches(/^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/, "Employee Name should be in a valid format")
      .required("Name is required"),
  });

  //Functions
 /**
  * It gets data from an API, then filters the data to only include active branches, then sets the
  * state of the branches to the filtered data.
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
  * It takes an id as an argument, makes a call to an API, and then sets the state of the component.
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
 * It gets all the employees from the database, and then filters out the ones that are not active, and
 * then sets the state of the reportingPerson variable to the filtered list.
 */
  const getReportingPerson = () => {
    let activeEmployee = [];
    getDataFromApi("emp/getAllEmp")
      .then((res) => {
       
        res.map((emp) => {
          
          let tempObj = {};
          if (emp.status == true) {
            tempObj.name = emp.name + "(" + emp.empId + ")";
            tempObj.id = emp._id;
            tempObj._id = emp._id;
            activeEmployee.push(tempObj);
          }
          return null;
        });
      
        setreportingPerson(activeEmployee);
      })
      .catch((err) => console.log(err));
  };

 /**
  * When the user selects an option from the dropdown, set the value of the area field to the value of
  * the selected option, and set the value of the selected state to the value of the selected option.
  * @param event - The event object
  */
  const setAreaFunction = (event) => {
    formik.setFieldValue("area", event.target.value);
    setselected(event.target.value);
   
  };
  
 /* A formik form. */
  const formik = useFormik({
    initialValues: {
      email: "",
      reportingPerson: "",
      branch: "",
      roles: "",
      name: "",
      empId: "",
      mobile: "",
            status: "",
      area: [],
    },
    validationSchema: AddEmpSchema,
    onSubmit: (values) => {
     
      values.area = selected;
      axios
        .post(`${BASE_URL}/test/addemployee`, values, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          swal(
            res.data.success ? "Sucess!" : "!Error",
            res.data.message,
            res.data.success ? "success" : "error"
          );
          if (res.data.success) {
            navigate("/dashboard/Employee", { replace: true });
          } else {
            formik.setSubmitting(false);
            swal(
              res.data.success ? "Sucess!" : "!Error",
              res.data.message,
              res.data.success ? "success" : "error"
            );
          }
        });
    },
  });

  
  const { isSubmitting } = formik;

 /* Calling the getBranchData() and getReportingPerson() functions when the component is mounted. */
  useEffect(() => {
    getBranchData();
    getReportingPerson();
  }, []);
 
  return (
    <Page title="Add Employee">
      <div>
        <form onSubmit={formik.handleSubmit} sx={{ m: 1 }}>
          <Card>
            <CardContent noValidate autoComplete="off">
              <Grid container rowSpacing={2} columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <TextField
                    // required
                    value={formik.values.name}
                    size="small"
                    onChange={formik.handleChange}
                    name="name"
                    fullWidth
                    id="outlined-required"
                    label="Employee Name"
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    // required
                    fullWidth
                    size="small"
                    type="email"
                    name="email"
                    label="Email ID"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  
                  <Autocomplete
                    required
                    name="reportingPerson"
                    options={reportingPerson}
                    size="small"
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        formik.setValues({
                          ...formik.values,
                          reportingPerson: newValue.id,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        // required
                        {...params}
                        label="Reporting Person"
                        error={
                          formik.touched.reportingPerson &&
                          Boolean(formik.errors.reportingPerson)
                        }
                        helperText={
                          formik.touched.reportingPerson &&
                          formik.errors.reportingPerson
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    // required
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
                <Grid item xs={12} md={6}>
                  <TextField
                    // required
                    size="small"
                    fullWidth
                    id="outlined-select-currency"
                    select
                    name="roles"
                    label="Role"
                    value={formik.values.roles}
                    onChange={formik.handleChange}
                    error={formik.touched.roles && Boolean(formik.errors.roles)}
                    helperText={formik.touched.roles && formik.errors.roles}
                  >
                    {roleValues.map((option, i) => (
                      <MenuItem key={i} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    // required
                    id="outlined-select-currency"
                    select
                    name="branch"
                    label="Branch Name"
                    value={formik.values.branch}
                    onChange={(e) => {
                      getAreas(e.target.value);
                      // console.log(e.target.value);
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    // required
                    id="outlined-select-currency"
                    select
                    name="status"
                    label="Status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.status && Boolean(formik.errors.status)
                    }
                    helperText={formik.touched.status && formik.errors.status}
                  >
                    {status.map((option, l) => (
                      <MenuItem key={l} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {formik.values.roles === "FO" && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      size="small"
                       required
                      fullWidth
                      label="Area"
                      select
                      id="demo-multiple-name"
                      labelId="demo-multiple-name-label"
                      multiple={true}
                      input={<OutlinedInput label="Area" />}
                      name="area"
                      value={selected}
                      onChange={setAreaFunction}
                      error={formik.touched.area && Boolean(formik.errors.area)}
                      helperText={formik.touched.area && formik.errors.area}
                      SelectProps={{
                        multiple: true,
                      }}
                    >
                      {area.map((option, i) => (
                        <MenuItem key={i} value={option._id}>
                          {option.areaName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

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
                          navigate("/dashboard/Employee", { replace: true });
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
                        Add Employee
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
