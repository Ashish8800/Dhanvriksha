import { filter, rest } from "lodash";

import { Link as RouterLink } from "react-router-dom";
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@mui/material";
import Loader from "../components/Loader";

import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import { getDataFromApi } from "../utils/apiCalls";
import {
  RecurringDepositListHead,
  RecurringDepositListToolbar,
} from "../sections/@dashboard/RD";

import React, { useEffect, useState } from "react";
import Label from "../components/Label";
import Iconify from "../components/Iconify";
// ----------------------------------------------------------------------

/* Creating table head*/
const TABLE_HEAD = [
  { id: "applicationId", label: "RD ID" },
  { id: "applicantName", label: "Member Name" },
  { id: "fname", label: "F/H Name" },

  { id: "startDate", label: "Start Date", alignRight: false },
  { id: "interestRate", label: "Interest Rate(%)", alignRight: false },
  { id: "rdAmount", label: "RD Amount(Rs.)", alignRight: false },
  { id: "rdStatus", label: "Status", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

/**
 * If the value of the property in the second object is less than the value of the property in the
 * first object, return -1. If the value of the property in the second object is greater than the value
 * of the property in the first object, return 1. Otherwise, return 0.
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
 * If the order is descending, return a function that compares two rows and returns a number that is
 * positive if the first row is greater than the second row, negative if the first row is less than the
 * second row, and zero if the two rows are equal. If the order is ascending, return a function that
 * does the same thing, but with the rows reversed.
 * @param order - "asc" or "desc"
 * @param orderBy - the column name
 * @returns A function that takes two arguments (a, b) and returns a value.
 */
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * It takes an array, a comparator function, and a query string, and returns a filtered and sorted array.
 * The comparator function is used to sort the array. The query string is used to filter
 * @param array - The array of objects to be sorted.
 * @param comparator - (a, b) => {
 * @param query - the search query
 * @returns The return value is an array of objects.
 */
function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.applicantName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.applicationId.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function RecurringDeposit() {
  /* Setting the state of the component. */
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("desc");

  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [orderBy, setOrderBy] = useState("applicationId");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allrd, setallRd] = useState([]);

  /**
 * GetDataFromApi("rdeposit") returns a promise, which is then resolved by the .then() function, which
 * sets the state of allRd to the resolved value of the promise.
 * The .then() function returns a promise, which is then resolved by the .catch() function, which logs
 * the error to the console.
 */
  const getAllRDData = () => {
    getDataFromApi("rdeposit")
      .then((res) => {
        setallRd(res);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  /* A hook that is used for data fetching, setting up a subscription, and manually changing the DOM in
 React components. */
  useEffect(() => {
    getAllRDData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allrd.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  /**
   * If the status includes the word "Applied", return "warning". If the status includes the word
   * "Approved", return "info". If the status includes the word "Rejected", return "error". If the
   * status includes the word "Active", return "success".
   * @param status - The status of the application.
   * @returns A function that takes a status and returns a color.
   */
  const getColor = (status) => {
    if (status.includes("Applied")) {
      return "warning";
    }
    if (status.includes("Approved")) {
      return "info";
    }
    if (status.includes("Rejected")) {
      return "error";
    }
    if (status.includes("Active")) {
      return "success";
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allrd.length) : 0;

  const filteredUsers = applySortFilter(
    allrd,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="DhanVriksha | Recurring Deposit">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Recurring Deposit
          </Typography>

          <Button
            variant="contained"
            to="/dashboard/RecurringDeposit/DNRecurringDeposit"
            component={RouterLink}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New RD Application
          </Button>
        </Stack>

        <Card>
          <RecurringDepositListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <RecurringDepositListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={allrd.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const {
                        applicantName,
                        fatherName,
                        applicationDate,
                        interestRate,
                        rdAmount,
                        rdStatus,
                      } = row;

                      return (
                        <TableRow
                          style={{ height: "10px" }}
                          hover
                          key={index}
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell></TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              totalInterestAmount
                              alignItems="center"
                              spacing={2}
                              style={{ marginLeft: 15 }}
                            >
                              {row.applicationId}
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{applicantName}</TableCell>
                          <TableCell align="left">{fatherName}</TableCell>
                          {/* <TableCell align="left">{row.kycStatus}</TableCell> */}
                          <TableCell align="left">
                            {applicationDate.substring(0, 16)}
                          </TableCell>
                          <TableCell align="left">{interestRate}</TableCell>
                          <TableCell align="left">{rdAmount}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={getColor(row.rdStatus)}
                            >
                              {row.rdStatus}
                            </Label>
                          </TableCell>
                          {/* 
                          <TableCell align="right">
                            <RecurringDepositMoreMenu />
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {loading && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Loader />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {!loading && isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allrd.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
