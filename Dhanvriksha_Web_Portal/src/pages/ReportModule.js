import React, { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Box,
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { Grid, Tab } from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Scrollbar from "../components/Scrollbar";
import Loader from "../components/Loader";
import {
  // TextField,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import Page from "../components/Page";
import DailyListHead from "../sections/@dashboard/DailyCollection/DailyListHead";

import { getDataFromApi, postDataToApi } from "../utils/apiCalls";
import { useFormik } from "formik";
import * as Yup from "yup";

/* Creating a table head. */
const TABLE_HEAD = [
  { id: "branchName", label: "Branch Name", alignRight: false },
  { id: "fdCollection", label: "FD Collection", alignRight: false },
  { id: "rdCollection", label: "RD Collection", alignRight: false },
  { id: "loanCollection", label: "Loan Collection", alignRight: false },
  { id: "loanDisbursement", label: "Loan Disbursement", alignRight: false },
];

export default function ReportModule() {
  /* Setting the state of the component. */
  
  const [value, setValue] = React.useState("1");
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingDaily, setLoadingDaily] = React.useState(false);
  const [loadingWeekly, setLoadingWeekly] = React.useState(false);
  const [loadingMothly, setLoadingMonthly] = React.useState(false);
  const [orderBy, setOrderBy] = useState("empId");
  const [branches, setBranches] = useState([]);
  const [dailyReport, setdailyReport] = useState([]);
  const [dailyLoanCollection, setdailyLoanCollection] = useState([]);
  const [dailyFdCollection, setdailyFdCollection] = useState([]);
  const [dailyRdCollection, setdailyRdCollection] = useState([]);
  const [dailyLoanDisbursed, setdailyLoanDisbursed] = useState([]);

  /**
   * I'm using formik to set the value of a date picker and then using that value to make an API call.
   * </code>
   * @param value - the value of the datepicker
   */
  const fnOnChangeDate = (value) => {
    formik.setFieldValue("collectionDate", value);
    setLoadingDaily(true);
    getDataFromApi(`getDailyReport/${value}`).then((res) => {
      let loanCollection = [];
      let fdCollection = [];
      let rdCollection = [];
      let loanDisbursed = [];
      setdailyReport(res.data);
      loanCollection.push(res.data[0].loanCollection);
      fdCollection.push(res.data[0].fdCollection);
      rdCollection.push(res.data[0].rdCollection);
      loanDisbursed.push(res.data[0].loanDisbursed);
      setdailyLoanCollection(loanCollection);
      setdailyFdCollection(fdCollection);
      setdailyRdCollection(rdCollection);
      setdailyLoanDisbursed(loanDisbursed);

      setLoading(false);
      setLoadingDaily(false);
      setLoadingWeekly(false);
      setLoadingMonthly(false);
    });
  };

  /**
   * The handleChange function takes in an event and a newValue, and then sets the value to the
   * newValue.
   * @param event - The event source of the callback
   * @param newValue - The new value of the slider.
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /**
   * When the user selects a date, the function will calculate the date 6 days from the selected date
   * and set the value of the toCollectionDate field to that date.
   * @param values - the date selected by the user
   */
  const calculateWeeklyCollectionDate = (values) => {
    formik.setFieldValue("fromCollection", values.toDateString());

    let collectionDate = new Date(values);

    collectionDate.setDate(collectionDate.getDate() + 6);
    formik.setFieldValue("toCollectionDate", collectionDate.toDateString());
  };

  /**
   * It takes a date, adds 29 days to it, and then sets the value of the "monthlytoCollectionDate" field
   * to the result.
   * @param values - the date selected by the user
   */
  const calculateMothlyCollectionDate = (values) => {
    formik.setFieldValue("monthlyfromCollection", values.toDateString());

    let collectionDate = new Date(values);

    collectionDate.setDate(collectionDate.getDate() + 29);
    formik.setFieldValue(
      "monthlytoCollectionDate",
      collectionDate.toDateString()
    );
  };

  /**
   * If the orderBy property is the same as the property passed in, and the order is ascending, then
   * set the order to descending, otherwise set the order to ascending.
   * @param event - The event that triggered the sort request.
   * @param property - The property to sort by.
   */
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /**
   * If the event target is checked, return. Otherwise, set the selected array to an empty array.
   * @param event - The event that triggered the function.
   * @returns Nothing.
   */
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      return;
    }
    setSelected([]);
  };

  /* A validation schema for the form. */
  const reportSchema = Yup.object().shape({
    toCollectionDate: Yup.string()
      .typeError("Application Date cannot be empty ")
      .required("Application Date cannot be empty"),
    fromDate: Yup.string()
      .typeError("Application Date cannot be empty ")
      .required("Application Date cannot be empty"),
    monthlytoCollectionDate: Yup.string()
      .typeError("Application Date cannot be empty ")
      .required("Application Date cannot be empty"),
    monthlyfromCollection: Yup.string()
      .typeError("Application Date cannot be empty ")
      .required("Application Date cannot be empty"),
  });

  const formik = useFormik({
    initialValues: {
      // collectionDate: "",
      fromCollection: Date.now(),
      toCollectionDate: null,
      monthlyfromCollection: Date.now(),
      monthlytoCollectionDate: null,
      // mCollectionDate: Date.now(),
    },
    validationSchema: reportSchema,
    onSubmit: (values) => {
      setLoadingWeekly(true);
      setLoadingMonthly(true);

      /* Fetching data from the API and setting the state of the component. */
      postDataToApi("getWeeklyReport", JSON.stringify(values))
        .then((res) => {
          let loanCollection = [];
          let fdCollection = [];
          let rdCollection = [];
          let loanDisbursed = [];
          setdailyReport(res.data);
          loanCollection.push(res.data[0].loanCollection);
          fdCollection.push(res.data[0].fdCollection);
          rdCollection.push(res.data[0].rdCollection);
          loanDisbursed.push(res.data[0].loanDisbursed);
          setdailyLoanCollection(loanCollection);
          setdailyFdCollection(fdCollection);
          setdailyRdCollection(rdCollection);
          setdailyLoanDisbursed(loanDisbursed);         
          setLoadingDaily(true);
          setLoadingWeekly(false);
          setLoadingMonthly(false);
         
        })

        .catch((err) => {
          throw err;
        });
    },
  });
  const { isSubmitting } = formik;

  /**
   * If the value of the property of the first object is less than the value of the property of the
   * second object, return -1. If the value of the property of the first object is greater than the
   * value of the property of the second object, return 1. Otherwise, return 0.
   * @param a - The first item to compare.
   * @param b - the second item in the array
   * @param orderBy - The name of the property to sort by.
   */
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

 

  /**
   * It gets data from an API, then it filters the data to only include the active branches, then it sets
   * the state of the branches to the filtered data, then it sets the loading state to false.
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
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBranchData();
  }, []);

  // Component Return
  return (
    <Page title="DhanVriksha | Reports">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>
        </Stack>
        {loading && <Loader />}
        {!loading && (
          <Card
            sx={{
              flexDirection: "column",
              alignItems: "center",
              "& > *": {
                m: 2,
              },
            }}
          >
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Daily" value="1" />
                    <Tab label="Weekly" value="2" />
                    <Tab label="Monthly" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <div>
                    <Typography sx={{ marginBottom: "20px" }}>
                      Daily Reports
                    </Typography>

                    <Box sx={{ width: "100%" }}>
                      <Grid
                        container
                        // rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        {/* <Grid container rowSpacing={2} columnSpacing={4}> */}
                        <Grid item xs={12} md={6}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              inputFormat="dd/MM/yyyy"
                              fullWidth
                              name="collectionDate"
                              label="Collection Date"
                              type="Input"
                              id="collectionDate"
                              onChange={fnOnChangeDate}
                              value={formik.values.collectionDate}
                              renderInput={(params) => (
                                <TextField required size="small" {...params} />
                              )}
                            />
                          </LocalizationProvider>
                          {/* </Grid> */}
                        </Grid>
                      </Grid>

                      <Container sx={{ marginTop: 5 }}>
                        {loadingDaily && <Loader />}
                        {!loadingDaily && (
                          <Card>
                            {dailyReport?.length > 0 && (
                              <Scrollbar>
                                <TableContainer
                                // sx={{ minWidth: 800 }}
                                >
                                  <Table>
                                    <DailyListHead
                                      order={order}
                                      orderBy={orderBy}
                                      headLabel={TABLE_HEAD}
                                      // rowCount={members.length}
                                      numSelected={selected.length}
                                      onRequestSort={handleRequestSort}
                                      onSelectAllClick={handleSelectAllClick}
                                    />

                                    <TableBody>
                                      {branches.map((branch, i) => (
                                        <TableRow
                                          hover
                                          tabIndex={-1}
                                          role="checkbox"
                                        >
                                          <TableCell></TableCell>

                                          <TableCell
                                            component="th"
                                            scope="row"
                                            padding="none"
                                            sx={{ py: 2 }}
                                          >
                                            <Stack
                                              direction="row"
                                              alignItems="center"
                                              spacing={2}
                                              style={{ marginLeft: 15 }}
                                            >
                                              {branch.branchName
                                                ? branch.branchName
                                                : ""}
                                            </Stack>
                                          </TableCell>

                                          {dailyFdCollection.map(
                                            (collection, j) => (
                                              <TableCell align="left">
                                                {branch.branchName in collection
                                                  ? collection[
                                                      branch.branchName
                                                    ].toFixed(2)
                                                  : 0}
                                              </TableCell>
                                            )
                                          )}

                                          {dailyRdCollection.map(
                                            (collection, j) => (
                                              <TableCell>
                                                {branch.branchName in collection
                                                  ? collection[
                                                      branch.branchName
                                                    ].toFixed(2)
                                                  : 0}
                                              </TableCell>
                                            )
                                          )}

                                          {dailyLoanCollection.map(
                                            (collection, j) => (
                                              <TableCell>
                                                {branch.branchName in collection
                                                  ? collection[
                                                      branch.branchName
                                                    ].toFixed(2)
                                                  : 0}
                                              </TableCell>
                                            )
                                          )}
                                          {dailyLoanDisbursed.map(
                                            (collection, j) => (
                                              <TableCell>
                                                {branch.branchName in collection
                                                  ? collection[
                                                      branch.branchName
                                                    ].toFixed(2)
                                                  : 0}
                                              </TableCell>
                                            )
                                          )}

                                          <TableCell align="right"></TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell
                                          align="center"
                                          colSpan={6}
                                          sx={{ py: 3 }}
                                        >
                                          {/* <Loader /> */}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Scrollbar>
                            )}
                          </Card>
                        )}
                      </Container>
                    </Box>
                  </div>
                </TabPanel>
                <TabPanel value="2">
                  <form onSubmit={formik.handleSubmit} sx={{ m: 1 }}>
                    <div>
                      <Typography sx={{ marginBottom: "30px" }}>
                        Weekly Reports
                      </Typography>

                      <Box sx={{ width: "100%" }}>
                        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                          <Grid item xs={12} sm={8} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                fullWidth
                                name="fromCollection"
                                label="From Collection Date"
                                type="Input"
                                id="fromCollection"
                                onChange={calculateWeeklyCollectionDate}
                                inputFormat="dd/MM/yyyy"
                                value={formik.values.fromCollection}
                                renderInput={(params) => (
                                  <TextField
                                    size="small"
                                    required
                                    {...params}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid xs={12} sm={8} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                fullWidth
                                name="toCollectionDate"
                                label="To Collection Date"
                                type="Input"
                                id="toCollectionDate"
                                disabled
                                onChange={formik.handleChange}
                                inputFormat="dd/MM/yyyy"
                                value={formik.values.toCollectionDate}
                                renderInput={(params) => (
                                  <TextField size="small" {...params} />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <Button
                              variant="contained"
                              type="submit"
                              loading={isSubmitting}
                            >
                              Submit
                            </Button>
                          </Grid>
                          {/* </Grid> */}
                        </Grid>

                        <Container sx={{ marginTop: 5 }}>
                          {loadingWeekly && <Loader />}
                          {!loadingWeekly && (
                            <Card>
                              {dailyReport?.length > 0 && (
                                <Scrollbar>
                                  <TableContainer
                                  // sx={{ minWidth: 800 }}
                                  >
                                    <Table>
                                      {/* {loading && <Loader />} */}
                                      <DailyListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        // rowCount={members.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleRequestSort}
                                        onSelectAllClick={handleSelectAllClick}
                                      />
                                      <TableBody>
                                        {branches.map((branch, i) => (
                                          <TableRow
                                            // style={{ height: "10px" }}
                                            hover
                                            tabIndex={-1}
                                            role="checkbox"
                                          >
                                            <TableCell></TableCell>

                                            <TableCell
                                              component="th"
                                              scope="row"
                                              padding="none"
                                              sx={{ py: 2 }}
                                            >
                                              <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={2}
                                                style={{ marginLeft: 15 }}
                                              >
                                                {branch.branchName
                                                  ? branch.branchName
                                                  : ""}
                                              </Stack>
                                            </TableCell>

                                            {dailyFdCollection.map(
                                              (collection, j) => (
                                                <TableCell align="left">
                                                  {branch.branchName in
                                                  collection
                                                    ? collection[
                                                        branch.branchName
                                                      ].toFixed(2)
                                                    : 0}
                                                </TableCell>
                                              )
                                            )}

                                            {dailyRdCollection.map(
                                              (collection, j) => (
                                                <TableCell>
                                                  {branch.branchName in
                                                  collection
                                                    ? collection[
                                                        branch.branchName
                                                      ].toFixed(2)
                                                    : 0}
                                                </TableCell>
                                              )
                                            )}

                                            {dailyLoanCollection.map(
                                              (collection, j) => (
                                                <TableCell>
                                                  {branch.branchName in
                                                  collection
                                                    ? collection[
                                                        branch.branchName
                                                      ].toFixed(2)
                                                    : 0}
                                                </TableCell>
                                              )
                                            )}
                                            {dailyLoanDisbursed.map(
                                              (collection, j) => (
                                                <TableCell>
                                                  {branch.branchName in
                                                  collection
                                                    ? collection[
                                                        branch.branchName
                                                      ].toFixed(2)
                                                    : 0}
                                                </TableCell>
                                              )
                                            )}

                                            <TableCell align="right"></TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell
                                            align="center"
                                            colSpan={6}
                                            sx={{ py: 3 }}
                                          >
                                            {/* <Loader /> */}
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                    {/* )} */}
                                  </TableContainer>
                                </Scrollbar>
                              )}
                            </Card>
                          )}
                        </Container>
                      </Box>
                    </div>
                  </form>
                </TabPanel>
                <TabPanel value="3">
                  <form onSubmit={formik.handleSubmit} sx={{ m: 1 }}>
                    <div>
                      <Typography sx={{ marginBottom: "30px" }}>
                        Monthly Reports
                      </Typography>

                      <Box sx={{ width: "100%" }}>
                        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                          <Grid item xs={12} sm={8} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                fullWidth
                                name="monthlyfromCollection"
                                label="From Collection Date"
                                type="Input"
                                id="monthlyfromCollection"
                                onChange={calculateMothlyCollectionDate}
                                inputFormat="dd/MM/yyyy"
                                value={formik.values.monthlyfromCollection}
                                renderInput={(params) => (
                                  <TextField
                                    size="small"
                                    required
                                    {...params}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid xs={12} sm={8} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                fullWidth
                                name="monthlytoCollectionDate"
                                label="To Collection Date"
                                type="Input"
                                id="monthlytoCollectionDate"
                                disabled
                                onChange={formik.handleChange}
                                inputFormat="dd/MM/yyyy"
                                value={formik.values.monthlytoCollectionDate}
                                renderInput={(params) => (
                                  <TextField size="small" {...params} />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <Button
                              variant="contained"
                              type="submit"
                              loading={isSubmitting}
                            >
                              Submit
                            </Button>
                          </Grid>
                          {/* </Grid> */}
                        </Grid>

                        <Container sx={{ marginTop: 5 }}>
                          {loadingMothly && <Loader />}
                          {!loadingMothly && (
                            <Card>
                              {dailyReport?.length > 0 && (
                                <Scrollbar>
                                  <TableContainer
                                  // sx={{ minWidth: 800 }}
                                  >
                                    <Table>
                                      {loading && <Loader />}
                                      <DailyListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        // rowCount={members.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleRequestSort}
                                        onSelectAllClick={handleSelectAllClick}
                                      />
                                      <TableBody>
                                        {branches.map((branch, i) => (
                                          <TableRow
                                            // style={{ height: "10px" }}
                                            hover
                                            tabIndex={-1}
                                            role="checkbox"
                                          >
                                            <TableCell></TableCell>

                                            <TableCell
                                              component="th"
                                              scope="row"
                                              padding="none"
                                              sx={{ py: 2 }}
                                            >
                                              <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={2}
                                                style={{ marginLeft: 15 }}
                                              >
                                                {branch.branchName
                                                  ? branch.branchName
                                                  : ""}
                                              </Stack>
                                            </TableCell>

                                            {dailyFdCollection.map(
                                              (collection, j) => (
                                                <TableCell align="left">
                                                  {branch.branchName in
                                                  collection
                                                    ? collection[
                                                        branch.branchName
                                                      ].toFixed(2)
                                                    : 0}
                                                </TableCell>
                                              )
                                            )}

                                            {dailyRdCollection.map(
                                              (collection, j) => (
                                                <TableCell>
                                                  {branch.branchName in
                                                  collection
                                                    ? collection[
                                                        branch.branchName
                                                      ].toFixed(2)
                                                    : 0}
                                                </TableCell>
                                              )
                                            )}

                                            {dailyLoanCollection.map(
                                              (collection, j) => (
                                                <TableCell>
                                                  {branch.branchName in
                                                  collection
                                                    ? collection[
                                                        branch.branchName
                                                      ].toFixed(2)
                                                    : 0}
                                                </TableCell>
                                              )
                                            )}
                                            {dailyLoanDisbursed.map(
                                              (collection, j) => (
                                                <TableCell>
                                                  {branch.branchName in
                                                  collection
                                                    ? collection[
                                                        branch.branchName
                                                      ].toFixed(2)
                                                    : 0}
                                                </TableCell>
                                              )
                                            )}

                                            <TableCell align="right"></TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell
                                            align="center"
                                            colSpan={6}
                                            sx={{ py: 3 }}
                                          >
                                            {/* <Loader /> */}
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                    {/* )} */}
                                  </TableContainer>
                                </Scrollbar>
                              )}
                            </Card>
                          )}
                        </Container>
                      </Box>
                    </div>
                  </form>
                </TabPanel>
              </TabContext>
            </Box>
          </Card>
        )}
      </Container>
    </Page>
  );
}
