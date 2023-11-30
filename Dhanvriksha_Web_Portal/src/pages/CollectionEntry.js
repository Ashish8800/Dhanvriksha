import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Box, Button, CardHeader, CardContent } from "@mui/material";
import {
  TextField,
  Card,
  Stack,
  Typography,
  Container,
  Autocomplete,
  Grid,
  ButtonGroup,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Page from "../components/Page";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getDataFromApi, postDataToApi } from "../utils/apiCalls";
import { useFormik } from "formik";
import Loader from "../components/Loader";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export default function CollectionEntry() {
  //React States
  const navigate = useNavigate();
  const [member, setMember] = useState([]);
  const [application, setApplication] = useState([]);
  const [service, setService] = useState([]);
  const [appData, setAppData] = useState([]);
  const [branch, setBranch] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingCard, setLoadingCard] = useState(false);

  //Form Validation by Yup
  const ApplicationSchema = Yup.object().shape({
    applicationId: Yup.string()
      .typeError("Account Number cannot be empty ")
      .required("Account Number cannot be empty"),
    collectionDate: Yup.string()
      .typeError("Collection Date cannot be empty ")
      .required("Collection Date cannot be empty"),

    paymentMethod: Yup.string()
      .typeError("payment Method cannot be empty ")
      .required("payment Method cannot be empty"),
    collectionAmount: Yup.number()
      .typeError("Collection Amount Should be a number ")
      .required("Collection Amount is required")
      .min(1, "Collection amount should be more than 0"),
  });

  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      applicationId: "",
      collectionDate: Date.now(),
      paymentMethod: "",
      collectionAmount: "",
    },
    validationSchema: ApplicationSchema,

    onSubmit: (values) => {
      setLoading(true);
      values.branch = branch;

  /**
   * Posting Data to database
   * * @param {apiName } collection   
   * @function postDataToApi
   */
      postDataToApi("collection", JSON.stringify(values))
        .then((res) => {
          if (res.success) {
            setLoading(false);
            swal(
              res.success ? "Success!" : "Error!",
              res.message,
              res.success ? "success" : "error"
            );
            navigate("/dashboard/CollectionEntry", { replace: true });

            setMember([]);
            formik.resetForm();
            // setLoadingCard(true)
            setAppData([])
          }
        })
        .catch((err) => {
          throw err;
        });
    },
  });

  // Functions Starts

  /**
   * Get the data of particular application from Database.
   * @function getAppData
   * @param {string} applicationId - applicationId used to get the information of the particular application.
   */
  const getAppData = (applicationId) => {
    getDataFromApi(`dataAboutApplication/${applicationId}`).then((res) => {
      console.log("121", res.data[0].branchData.branchName);
      setBranch(res.data[0].branchData._id);
      setLoadingCard(true);

      try {
        let dataArr = [];

        if (res) {
          dataArr.push(res.data[0]);
          setAppData(dataArr);
          
        }
        setLoading(false);
        setLoadingCard(false);
        // if (res.data.length == 0) {
        //   setAppData([]);
        // }
      } catch (error) {
        console.log(error);
      }

     
    });
  };

  /**
   * Setting Date into collectionDate variable
   * @function setCollectionDate
   * @param {Date Object} value - Setting date chosen in Date Picker into date variable
   */
  const setCollectionDate = (value) => {
    formik.setFieldValue("collectionDate", value);
  };

  /**
   * Get All the Active RD Applications from Database.
   * Get All the Approved FD Applications from Database.
   *  Get All the Active Loan Applications from Database.
   * Adding applicationId and memberId in an object.
   * @function getApplicationData
  
   */
  const getApplicationData = () => {
    getDataFromApi("getActiveApplication")
      .then((res) => {
        let applicationList = [];

        if (res.data.approvedRd) {
          res.data.approvedRd.map((app) => {
            let tempObj = {};
            tempObj.name = app.applicationId;
            tempObj.id = app.memberId;
            tempObj.memberId = app.memberId;
            applicationList.push(tempObj);
            return null;
          });
        }
        if (res.data.activeRd) {
          res.data.activeRd.map((app) => {
            let tempObj = {};
            tempObj.name = app.applicationId;
            tempObj.id = app.memberId;
            tempObj.memberId = app.memberId;
            applicationList.push(tempObj);
            return null;
          });
        }
        if (res.data.approvedFd) {
          res.data.approvedFd.map((app) => {
            let tempObj = {};
            tempObj.name = app.applicationId;
            tempObj.id = app.memberId;
            tempObj.memberId = app.memberId;
            applicationList.push(tempObj);
            return null;
          });
        }
        if (res.data.activeLoan) {
          res.data.activeLoan.map((app) => {
            let tempObj = {};
            tempObj.name = app.applicationId;
            tempObj.id = app.memberId;
            tempObj.memberId = app.memberId;

            applicationList.push(tempObj);
            return null;
          });
        }
        setApplication(applicationList);
        setLoading(false);
         setLoadingCard(false);
      })
      .catch((err) => console.log(err));
  };


  //Global Varible
  const { isSubmitting } = formik;

  // React Effects
  useEffect(() => {
    getApplicationData();
     setLoading(false);
      setLoadingCard(false);
  }, []);

  // Components Return
  return (
    <Page title="DhanVriksha | Collection Entry">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Collection Entry
          </Typography>
        </Stack>
        {loading && <Loader />}
        {!loading && (
          <form
            onSubmit={formik.handleSubmit}
            sx={{ m: 1 }}
            method="get"
            id="form1"
          >
            <Card
              sx={{
                "& > *": {
                  m: 5,
                },
              }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Grid container rowSpacing={2} columnSpacing={2} xs={12} md={5}>
                  <Grid item xs={12}>
                    <div>
                      {application.length > 0 && (
                        <Autocomplete
                          // required
                          name="accountNumber"
                          options={application}
                          size="small"
                          fullWidth
                          getOptionLabel={(option) => option.name}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              formik.setValues({
                                ...formik.values,
                                applicationId: newValue.name,
                              });

                              // getMember(newValue.memberId);
                              getAppData(newValue.name);
                              if (newValue.name.charAt(0) === "L") {
                                setService("Loan");
                              } else if (newValue.name.charAt(0) === "R") {
                                setService("Recurring Deposit");
                              } else if (newValue.name.charAt(0) === "F") {
                                setService("Fixed Deposit");
                              }
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              //  required
                              {...params}
                              label="Account Number"
                              error={
                                formik.touched.applicationId &&
                                Boolean(formik.errors.applicationId)
                              }
                              helperText={
                                formik.touched.applicationId &&
                                formik.errors.applicationId
                              }
                            />
                          )}
                        />
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        inputFormat="dd/MM/yyyy"
                        // required
                        fullWidth
                        label="Collection Date*"
                        value={formik.values.collectionDate}
                        onChange={setCollectionDate}
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            fullWidth
                            {...params}
                            error={
                              formik.touched.collectionDate &&
                              Boolean(formik.errors.collectionDate)
                            }
                            helperText={
                              formik.touched.collectionDate &&
                              formik.errors.collectionDate
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      size="small"
                      fullWidth
                      // required
                      id="paymentMethod"
                      name="paymentMethod"
                      select
                      label="Payment Method*"
                      value={formik.values.paymentMethod}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.paymentMethod &&
                        Boolean(formik.errors.paymentMethod)
                      }
                      helperText={
                        formik.touched.paymentMethod &&
                        formik.errors.paymentMethod
                      }
                    >
                      <MenuItem value="Online">Online</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      // required
                      type="number"
                      size="small"
                      fullWidth
                      id="collectionAmount"
                      name="collectionAmount"
                      label="Collected Amount(Rs.)"
                      value={formik.values.collectionAmount}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.collectionAmount &&
                        Boolean(formik.errors.collectionAmount)
                      }
                      helperText={
                        formik.touched.collectionAmount &&
                        formik.errors.collectionAmount
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={2}
                  xs={12}
                  md={10}
                  alignItems="center"
                >
                  <Grid container sx={{ justifyContent: "center" }}>
                    {loadingCard && <Loader />}
                  </Grid>

                  {!loadingCard && (
                    <Grid>
                      {appData.length > 0 && (
                        <Card>
                          {appData.map((option, i) => (
                            <div key={i}>
                              <CardHeader title="Account Info:" />
                              <CardContent>
                                <Grid
                                  container
                                  rowSpacing={1.8}
                                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                >
                                  <Grid item xs={12}>
                                    <div>
                                      <b>Service Type:</b> {service}{" "}
                                    </div>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <div>
                                      <b>Member Name:</b>{" "}
                                      {option.members
                                        ? option.members.applicantName
                                        : ""}
                                    </div>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <div>
                                      <b>F/H Name:</b>{" "}
                                      {option.fatherName
                                        ? option.fatherName
                                        : ""}
                                    </div>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <div>
                                      <b>Branch Name:</b>{" "}
                                      {option.branchData.branchName
                                        ? option.branchData.branchName
                                        : ""}
                                    </div>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <div>
                                      <b>Due Amount(Rs.):</b>{" "}
                                      {service == "Loan"
                                        ? option.loanDueAmount
                                        : service == "Recurring Deposit" &&
                                          option.rdTenure == "Monthly"
                                        ? option.rdDueAmount
                                        : option.rdTenure == "Daily"
                                        ? option.dailydueAmount
                                        : option.fdDueAmount}
                                    </div>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </div>
                          ))}
                        </Card>
                      )}
                    </Grid>
                  )}
                </Grid>
              </Stack>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    "& > *": {
                      m: 2,
                    },
                  }}
                >
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <Button
                      variant="contained"
                      loading={isSubmitting.toString()}
                      type="submit"
                    >
                      Submit Collection
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
            </Card>
          </form>
        )}
      </Container>
    </Page>
  );
}
