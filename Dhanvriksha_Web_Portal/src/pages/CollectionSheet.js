import React from "react";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useFormik } from "formik";

//mui
import { Box, Button, Container } from "@mui/material";
import {
  TextField,
  Card,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  Grid,
  TableBody,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MenuItem from "@mui/material/MenuItem";
//Axios Function
import { getDataFromApi, postDataToApi } from "../utils/apiCalls";
//components
import Page from "../components/Page";
import Loader from "../components/Loader";

export default function CollectionSheet() {
  //React States
  const [branches, setBranches] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [branchName, setbranchName] = useState("");
  const [area, setArea] = useState([]);
  const [areaName, setAreaName] = useState("");
  const [loading, setLoading] = React.useState(true);
  const [loadingTable, setLoadingTable] = React.useState(true);

  //Form Validation by Yup
  const CollectionSchema = Yup.object().shape({
    branch: Yup.string()
      .typeError("branch cannot be empty ")
      .required("branch cannot be required"),
    serviceType: Yup.string()
      .typeError("service Type cannot be empty ")
      .required("service Type is required"),
  });

  //Functions

  /**
   * Get All the Branches from Database.
   * Pick only Active Branches
   * @function getBranches
   */

  const getBranches = () => {
    let activeBranch = [];
    //fetching data from Branch table from database
    getDataFromApi("branch")
      .then((res) => {
        res.map((branch) => {
          //Filtering only Active Branches
          if (branch.activeStatus === true) {
            activeBranch.push(branch);
          }
        });
        setBranches(activeBranch);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

 
 /**
  * It gets the areas from the API on the basis of selected branch
  *  Pick only Active Areas
  * sets the state of the areas.
  *  @function getAreas
  * @param {string} id - the id of the branch
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

  /**
   * Setting date chosen in Date Picker into date variable.
   * * converting date object into string using toDateString()
   * * @param {Date Object } value 
   
   * @function fnOnChangeDate
   */
  const fnOnChangeDate = (value) => {
    formik.setFieldValue("date", value.toDateString());
  };

  // React Effects
  useEffect(() => {
    getBranches();
  }, []);

  //formik
  const formik = useFormik({
    initialValues: {
      branch: "",
      serviceType: "",
      date: null,
      area: "",
    },
    validationSchema: CollectionSchema,

    onSubmit: (values) => {
      setLoadingTable(true);
      document.getElementById("collectionreport").style.display = "block";
      document.getElementById("printbutton").style.display = "block";

      /** Calling a function called postDataToApi and passing in two parameters. The first parameter is a
    string called "collectionSheetFunction" and the second parameter is a stringified version of the
    values object.
      * @param {apiName } collectionSheetFunction
      * @function postDataToApi */
      postDataToApi("collectionSheetFunction", JSON.stringify(values))
        .then((res) => {
          if (res) {
            setCollectionData(res);
          }
          setLoadingTable(false);
          console.log("103 res", res);
          setAreaName(res[0].areaName);
          setbranchName(res[0].branchData.branchName);
        })
        .catch((err) => {
          throw err;
        });
    },
  });
  //Global variable
  const { isSubmitting } = formik;

  let emptyTable = true;
  //Functions

  /**
   * Printing Collection Sheet
   * @function print_table
   */
  async function print_table() {
    let pWindow = window.open("", "", "height=600,width=900");
    pWindow.document.head.innerHTML = document.head.innerHTML;
    pWindow.document.body.innerHTML = document.body.innerHTML;
    pWindow.document.body.innerHTML =
      document.getElementById("collectionreport").innerHTML;
    pWindow.document.close();
    await pWindow.print();
    pWindow.close();
  }

  // Components Return
  return (
    <Page title="DhanVriksha | Collection Sheet">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <h2>Collection Sheet</h2>
        </Stack>
        {loading && <Loader />}
        {!loading && (
          <form onSubmit={formik.handleSubmit} sx={{ m: 1 }} method="get">
            <Card
              sx={{
                alignContent: "center",
              }}
            >
              <Box noValidate autoComplete="off">
                <Container
                  sx={{
                    width: "100%",
                    "& .MuiTextField-root": { m: 2, width: "48%" },
                    alignSelf: "center",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignSelf="center"
                  >
                    <TextField
                      size="small"
                      required
                      fullWidth
                      id="branch"
                      select
                      name="branch"
                      label="Branch"
                      value={formik.values.branch}
                      onChange={(e) => {
                        getAreas(e.target.value);
                        console.log(e.target);
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

                    <TextField
                      size="small"
                      required
                      fullWidth
                      id="outlined-select-currency"
                      select
                      name="serviceType"
                      label="Service Type "
                      value={formik.values.serviceType}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="Recurring Deposit">
                        Recurring Deposit
                      </MenuItem>
                      <MenuItem value="Loan">Loan</MenuItem>
                    </TextField>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        required
                        inputFormat="dd/MM/yyyy"
                        name="date"
                        label="Date"
                        id="date"
                        onChange={fnOnChangeDate}
                        value={formik.values.date}
                        renderInput={(params) => (
                          <TextField required size="small" {...params} />
                        )}
                        fullWidth
                      />
                    </LocalizationProvider>
                    <Stack direction="row" justifyContent="right">
                      <Button
                        sx={{ my: 2, mx: 0 }}
                        type="submit"
                        variant="contained"
                        loading={isSubmitting.toString()}
                      >
                        Submit
                      </Button>
                    </Stack>
                  </Stack>
                </Container>

                <Container id="collectionreport" style={{ display: "none" }}>
                  {loadingTable && <Loader />}
                  {!loadingTable && (
                    <Box sx={{ width: "99%", m: 1 }}>
                      <div>
                        <Container>
                          <Grid
                            sx={{ marginBottom: 2 }}
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                          >
                            <Grid item xs={12} sm={8} md={3}>
                              <div>
                                <b>Branch:</b> {}
                                {branchName}
                              </div>
                            </Grid>
                            <Grid item xs={12} sm={8} md={3}>
                              <div>
                                <b>Area:</b> {}
                                {areaName}
                              </div>
                            </Grid>

                            <Grid item xs={12} sm={8} md={3}>
                              <div>
                                <b>Service:</b> {formik.values.serviceType}
                              </div>
                            </Grid>
                            <Grid item xs={12} sm={8} md={3}>
                              <div>
                                <b>Date:</b> {formik.values.date}
                              </div>
                            </Grid>
                          </Grid>
                        </Container>
                      </div>
                      {/* {loading && <Loader />} */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TableContainer component={Paper}>
                          {formik.values.serviceType === "Loan" &&
                            collectionData.length > 0 && (
                              <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                              >
                                {/* {JSON.stringify(collectionData)} */}
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Sr No.</TableCell>
                                    <TableCell>Application Id</TableCell>
                                    <TableCell> Member Name</TableCell>
                                    <TableCell>F/H Name</TableCell>
                                    <TableCell>Disbursement Date</TableCell>
                                    <TableCell>
                                      Disbursement Amount(Rs.)
                                    </TableCell>
                                    <TableCell>Due Week</TableCell>
                                    <TableCell>Due Amount(Rs.)</TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {collectionData.map((data, i) => (
                                    <>
                                      <TableRow key={i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>
                                          {data.result.applicationId}
                                        </TableCell>
                                        <TableCell>
                                          {data.applicantName}
                                        </TableCell>
                                        <TableCell>{data.fatherName}</TableCell>
                                        <TableCell>
                                          {data.disbursementDate}
                                        </TableCell>
                                        <TableCell>
                                          {data.disbursedAmount}
                                        </TableCell>
                                        <TableCell>{data.dueWeek} </TableCell>
                                        <TableCell>
                                          {data.dueAmount?.toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  ))}
                                </TableBody>
                              </Table>
                            )}

                          {formik.values.serviceType === "Recurring Deposit" &&
                            collectionData.length > 0 && (
                              <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Sr No.</TableCell>
                                    <TableCell>Application Id</TableCell>
                                    <TableCell> Member Name</TableCell>
                                    <TableCell>F/H Name</TableCell>
                                    <TableCell>RD Amount(Rs.)</TableCell>
                                    <TableCell>Active Date</TableCell>
                                    <TableCell>Due Duration</TableCell>
                                    <TableCell>Due Amount(Rs.)</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {collectionData.map((data, i) => (
                                    <>
                                      <TableRow key={i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>
                                          {data.result.applicationId}
                                        </TableCell>
                                        {/* <TableCell>{data.memberId}</TableCell> */}
                                        <TableCell>
                                          {data.applicantName}
                                        </TableCell>
                                        <TableCell>{data.fatherName}</TableCell>
                                        <TableCell>{data.rdAmount}</TableCell>
                                        <TableCell>
                                          {data.activeDate?.substring(0, 16)}
                                        </TableCell>
                                        <TableCell>
                                          {data.dueMonth
                                            ? data.dueMonth
                                            : data.dueDays}
                                          {data.rdTenure == "Monthly"
                                            ? " Month"
                                            : " Days"}
                                        </TableCell>

                                        <TableCell>
                                          {data.dueAmount?.toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  ))}
                                  {/* {emptyTable && (
                                    <TableRow>
                                      <TableCell
                                        align="center"
                                        colSpan={8}
                                        sx={{ py: 3 }}
                                      >
                                        <b>Data Not Found</b>
                                      </TableCell>
                                    </TableRow>
                                  )} */}
                                </TableBody>
                              </Table>
                            )}
                          {collectionData.length <= 0 && (
                            <Table>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  colSpan={8}
                                  sx={{ py: 3 }}
                                >
                                  <b>Data Not Found</b>
                                </TableCell>
                              </TableRow>
                            </Table>
                          )}
                        </TableContainer>
                      </Stack>
                    </Box>
                  )}
                </Container>

                <div id="printbutton" style={{ display: "none" }}>
                  <Stack
                    direction="row"
                    justifyContent="right"
                    mt={2}
                    mb={1}
                    position="relative"
                  >
                    <Button
                      sx={{ my: 1, mx: 3 }}
                      size="small"
                      variant="contained"
                      onClick={() => {
                        print_table();
                      }}
                    >
                      Print
                    </Button>
                  </Stack>
                </div>
              </Box>
            </Card>
          </form>
        )}
      </Container>
    </Page>
  );
}
