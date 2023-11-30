import { filter } from "lodash";

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

import {
  FixedDepositListHead,
  FixedDepositListToolbar,
  FixedDepositMoreMenu,
} from "../sections/@dashboard/FixedDeposit";
import { getDataFromApi } from "../utils/apiCalls";

import React, { useEffect, useState } from "react";
import Label from "../components/Label";
import Iconify from "../components/Iconify";

// ----------------------------------------------------------------------

/* Defining the table head. */
const TABLE_HEAD = [
  { id: "applicationId", label: "FD ID" },
  { id: "applicantName", label: "Member Name" },
  { id: "fatherName", label: "Father Name" },
  // { id: "company", label: "KYC Status", alignRight: false },
  { id: "applicationDate", label: "Start Date", alignRight: false },
  { id: "isVerified", label: "FD Amount(Rs.)", alignRight: false },
  { id: "company", label: "Tenure(Months) ", alignRight: false },
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

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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
      // _user.applicationDate.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DNFixedDeposit() {
/* Setting the state of the component. */
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("applicationId");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fd, setFd] = useState([]);
  const [loading, setLoading] = React.useState(true);

/**
 * GetDataFromApi("fixedDeposit") returns a promise, which is then resolved by the .then() function,
 * which sets the state of the fd variable to the resolved value of the promise.
 * 
 * The .catch() function is used to catch any errors that may occur during the execution of the
 * promise.
 */
  const getAllFDData = () => {
    getDataFromApi("fixedDeposit")
      .then((res) => {
        setFd(res);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };


/* Calling the getAllFDData() function when the component is mounted. */
  useEffect(() => {
    getAllFDData();
  }, []);


/**
 * If the orderBy property is the same as the property passed in, and the order is ascending, then set
 * the order to descending, otherwise set the order to ascending.
 * @param event - The event that triggered the function
 * @param property - The property of the data that we want to sort by.
 */

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = fd.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fd.length) : 0;

  const filteredUsers = applySortFilter(fd, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="DhanVriksha | Fixed Deposit">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Fixed Deposit
          </Typography>

          <Button variant="contained" to="/dashboard/DNFixedDeposit/DNNewFD" component={RouterLink} startIcon={<Iconify icon="eva:plus-fill" />}>
            New FD Application
          </Button>
        </Stack>

        <Card>
          <FixedDepositListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <FixedDepositListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={fd.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const { applicantName } = row;

                    return (
                      <TableRow style={{ height: "10px" }} hover key={index} tabIndex={-1} role="checkbox">
                        <TableCell></TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2} style={{ marginLeft: 15 }}>
                            {row.applicationId}
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{applicantName}</TableCell>
                        <TableCell align="left">{row.fatherName}</TableCell>
                        {/* <TableCell align="left">{row.kycStatus}</TableCell> */}
                        <TableCell align="left">{row.applicationDate.substring(0,16)}</TableCell>
                        <TableCell align="left">{row.fdAmount}</TableCell>
                        <TableCell align="left">{row.tenure}</TableCell>
                        <TableCell align="left"><Label variant="ghost" color={getColor(row.fdStatus)}>
                            {row.fdStatus}
                          </Label></TableCell>
{/* 
                        <TableCell align="right">
                          <FixedDepositMoreMenu />
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
            count={fd.length}
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
