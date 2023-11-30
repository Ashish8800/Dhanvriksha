import { filter } from "lodash";

import { Link as RouterLink } from "react-router-dom";
// mui
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

import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import Loader from "../components/Loader";
import {
  LoanListHead,
  LoanListToolbar,
  LoanMoreMenu,
} from "../sections/@dashboard/Loan";

import { BASE_URL } from "../constants/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Label from "../components/Label";
import Iconify from "../components/Iconify";

// ----------------------------------------------------------------------

/* Creating table head*/
const TABLE_HEAD = [
  { id: "applicationId", label: "Loan ID" },
  { id: "applicantName", label: "Member Name" },
  { id: "fatherName", label: "Father Name" },
  { id: "startDate", label: "Start Date", alignRight: false },
  { id: "interestAmount", label: "Total Interest Amount(Rs.)", alignRight: false },
  { id: "loanAmount", label: "Loan Amount(Rs.)", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

/**
 * If the value of the property of the second object is less than the value of the property of the
 * first object, return -1. If the value of the property of the second object is greater than the value
 * of the property of the first object, return 1. Otherwise, return 0.
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
 * second row, and zero if the two rows are equal.
 * 
 * If the order is ascending, return a function that compares two rows and returns a number that is
 * negative if the first row is greater than the second row, positive if the first row is less than the
 * second row, and zero if the two rows are equal.
 * @param order - "asc" or "desc"
 * @param orderBy - The column name that the table is currently sorted by.
 * @returns A function that takes two arguments, a and b, and returns a value.
 */
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  // console.log("comparator :>> ", comparator);
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
        _user.applicationId.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.applicantName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Loan() {
/* Setting the state of the component. */
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("applicationId");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allLoan, setallLoan] = useState([]);
   const [loading, setLoading] = React.useState(true);

  /* Getting the token from the session storage. */
   const token = sessionStorage.getItem("token");
 /* Fetching data from the server. */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/loan`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
              setallLoan(res.data);
        setLoading(false);
      });
  }, []);


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    // console.log("property :>> ", property);
    setOrderBy(property);
  };


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allLoan.map((n) => n.name);
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
 * "Approved", return "info". If the status includes the word "Rejected", return "error". If the status
 * includes the word "Active", return "success".
 * @param status - the status of the application
 * @returns the color of the status.
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allLoan.length) : 0;

  const filteredUsers = applySortFilter(
    allLoan,
    getComparator(order, orderBy),
    filterName
  );
  const isUserNotFound = filteredUsers.length === 0;
  return (
    <Page title="DhanVriksha | Loan">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Loan
          </Typography>
          <Button
            variant="contained"
            to="/dashboard/Loan/DNLoan"
            component={RouterLink}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Loan Application
          </Button>
        </Stack>
        <Card>
          
          <LoanListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <LoanListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={allLoan.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, id) => {
                      const { applicationId, applicantName } = row;
                      return (
                        <TableRow
                          style={{ height: "10px" }}
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell></TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                              style={{ marginLeft: 15 }}
                            >
                              {applicationId}
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{row.applicantName}</TableCell>
                          <TableCell align="left">{row.fatherName}</TableCell>
                          {/* <TableCell align="left">{row.kycStatus}</TableCell> */}
                          <TableCell align="left">
                          {row.applicationDate.substring(0,16)}
                          </TableCell>
                          <TableCell align="left">
                            {row.totalInterestAmount}
                          </TableCell>
                          <TableCell align="left">{row.loanAmount}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={getColor(row.loanStatus)}
                            >
                              {row.loanStatus}
                            </Label>
                          </TableCell>
                          {/* <TableCell align="right">
                            <LoanMoreMenu />
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
            count={allLoan.length}
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
