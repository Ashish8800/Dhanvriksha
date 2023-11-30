import * as Yup from "yup";
// import * as React from "react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormikContext, useFormik } from "formik";
import {
  Box,
  Container,
  Typography,
  Stack,
  Autocomplete,
  OutlinedInput,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Page from "../../../components/Page";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { BASE_URL, status, roleNames } from "../../../constants/config";
import { TextField, CardContent, Card, Grid, ButtonGroup } from "@mui/material";
import swal from "sweetalert";
import { getDataFromApi } from "../../../utils/apiCalls";
import MenuItem from "@mui/material/MenuItem";
import Search from "../../../components/Search";
// import AutoComplete from "../../../components/AutoComplete";
// import AutoComplete from "../../../components/AutoComplete";

// component

// ----------------------------------------------------------------------

export default function EditEmployee(props) {
  /* Setting the state of the component. */
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [emps, setEmps] = useState([]);
  const [area, setArea] = useState([]);
  const [selected, setselected] = useState([]);

  /* Using the useNavigate hook to navigate to a different page. */
  const navigate = useNavigate();

  /* The above code is getting the token from the session storage. */
  const token = sessionStorage.getItem("token");

  /* Using the useLocation hook to get the current location. */
  const location = useLocation();
  const empId = location.search.split("=")[1];
  const data = location.state?.data;

  /* Checking if the location.state object has a property called thisEmp. If it does, it will assign the
value of that property to the variable thisEmp. */
  const thisEmp = location.state?.thisEmp;

  /* A validation schema for the form. */
  const EditEmpSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),

    mobile: Yup.string().matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "Mobile Number should be a 10 digit number"
    ),

    name: Yup.string()
      .min(3, "Your name should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        "Employee Name should be in valid format"
      )
      .required("Name is required"),
    branch: Yup.string().required("Select Branch").typeError("Required"),
  });

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
   * GetRoleData() is a function that calls getDataFromApi() with the argument "role" and then sets the
   * state of roles to the response from the API.
   */
  const getRoleData = () => {
    getDataFromApi("role")
      .then((res) => setRoles(res))
      .catch((err) => console.log(err));
  };

  /**
   * It fetches data from an API and then sets the state of the component.
   */
  const getAllEmpData = () => {
    getDataFromApi("emp/getAllEmp/")
      .then((res) => {
        let empList = [];
        res.map((emp) => {
          let tempObj = {};
          if (emp.status == true) {
            tempObj.name = emp.name + "(" + emp.empId + ")";
            tempObj.id = emp._id;
            tempObj._id = emp._id;
            empList.push(tempObj);
          }
          return null;
        });
        setEmps(empList);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    let areaArr = [];
    let areaObj = {};
    let areaNameArr = [];
    areaArr.push(thisEmp.area);

    /* Mapping through the areaArr and pushing the _id of each object into the areaNameArr. */
    areaArr.map((areaN) => {
      areaN.map((data) => {
        areaNameArr.push(data._id);
      });

      setselected(areaNameArr);
    });

    /* Setting the values of the formik form. */
    formik.setFieldValue("empId", thisEmp.empId);
    formik.setFieldValue("name", thisEmp.name);
    formik.setFieldValue("email", thisEmp.email);
    formik.setFieldValue(
      "reportingPerson",
      thisEmp.reportingPerson ? thisEmp.reportingPerson : ""
    );
    formik.setFieldValue("mobile", thisEmp.mobile);
    formik.setFieldValue("roles", thisEmp.roles[0]._id);
    formik.setFieldValue("status", thisEmp.status);
    formik.setFieldValue("branch", thisEmp.branch ? thisEmp.branch._id : "");
    formik.setFieldValue("area", thisEmp.area ? thisEmp.area._id : selected);

    /* Calling the functions getBranchData(), getRoleData() and getAllEmpData() */
    getBranchData();
    getRoleData();
    getAllEmpData();

    /* Calling the getAreas function and passing the branch id of the current employee. */
    getAreas(thisEmp.branch._id);
  }, [empId]);

  const formik = useFormik({
    initialValues: {
      email: "",
      reportingPerson: "",
      branch: "",
      roles: [],
      name: "",
      empId: "",
      mobile: "",
      tenure: "",
      status: "",
      area: [],

      remember: true,
    },
    validationSchema: EditEmpSchema,

    onSubmit: (values) => {
      let arrRoles = [values.roles];
      values.roles = [...arrRoles];
      values.area = [...selected];
      axios
        .put(`${BASE_URL}/emp/updateEmployee/` + empId, values, {
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
          }
        });
    },
  });

  const { isSubmitting } = formik;
  /**
   * "When the user selects an option from the dropdown menu, the value of the selected option is stored
   * in the state variable 'selected'".
   * @param event - The event object is a JavaScript event that is sent to an element when an event
   * occurs.
   */
  const setAreaFunction = (event) => {
    setselected(event.target.value);
  };
  return (
    <Page title="Edit Employee">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom align="center">
            Edit Employee
          </Typography>
        </Stack>
        <div>
          <form onSubmit={formik.handleSubmit} sx={{ m: 1 }}>
            <Card>
              <CardContent noValidate autoComplete="off">
                <Grid container rowSpacing={2} columnSpacing={4}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      disabled
                      size="small"
                      value={formik.values.empId}
                      onChange={formik.handleChange}
                      name="empId"
                      fullWidth
                      id="outlined-required"
                      label="Employee Id"
                      error={
                        formik.touched.empId && Boolean(formik.errors.empId)
                      }
                      helperText={formik.touched.empId && formik.errors.empId}
                      // hidden
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      size="small"
                      value={formik.values.name}
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
                      required
                      fullWidth
                      type="email"
                      size="small"
                      name="email"
                      label="Email ID"
                      disabled
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {emps && emps.length > 0 && (
                      <Autocomplete
                        editMode={true}
                        size="small"
                        //editValue={thisEmp.reportingPerson.name + "(" + thisEmp.reportingPerson.empId + ")"}
                        value={thisEmp.reportingPerson}
                        options={emps}
                        getOptionLabel={(option) => option.name} // label={formik.values.reportingPerson}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        onChange={(event, newValue) => {
                          if (newValue) {
                            formik.setValues({
                              ...formik.values,
                              reportingPerson: newValue.id,
                            });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Reporting Person" />
                        )}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      // required
                      disabled
                      fullWidth
                      size="small"
                      id="outlined-select-currency"
                      select
                      name="roles"
                      label="Role"
                      value={formik.values.roles}
                      onChange={formik.handleChange}
                    >
                      {roles.map((option, i) => (
                        <MenuItem key={option._id} value={option._id}>
                          {roleNames[option.name]}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      id="branch"
                      select
                      name="branch"
                      label="Branch Name"
                      value={formik.values.branch}
                      // onChange={formik.handleChange}
                      error={
                        formik.touched.branch && Boolean(formik.errors.branch)
                      }
                      helperText={formik.touched.branch && formik.errors.branch}
                      onChange={(e) => {
                        getAreas(e.target.value);

                        formik.setFieldValue("branch", e.target.value);
                      }}
                    >
                      {branches.map((option, i) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.branchName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}></Stack> */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      id="outlined-select-currency"
                      select
                      name="status"
                      label="Status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                    >
                      {status.map((option, l) => (
                        <MenuItem key={l} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {thisEmp.roles[0].name == "FO" && (
                    <Grid item xs={12} md={6}>
                      {/* {JSON.stringify(selected)} */}
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
                        // defaultValue={selected._id}
                        onChange={setAreaFunction}
                        SelectProps={{
                          multiple: true,
                        }}
                        renderValue={(location) => location.join(", ")}
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
                          // loading={isSubmitting}
                        >
                          Update Employee
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
