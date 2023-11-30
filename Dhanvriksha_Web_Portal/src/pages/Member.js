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

// import Page from "../components/Page";
import Page from "../components/Page";

import Scrollbar from "../components/Scrollbar";
// import Iconify from '../components/Iconify';
import SearchNotFound from "../components/SearchNotFound";

import {
  MemberListHead,
  MemberListToolbar,
  MemberMoreMenu,
} from "../sections/@dashboard/Member";
import React, { useEffect, useState } from "react";
import { getDataFromApi } from "../utils/apiCalls";
import Loader from "../components/Loader";
import Label from "../components/Label";
import Iconify from "../components/Iconify";
// ----------------------------------------------------------------------

/* Defining the table head. */
const TABLE_HEAD = [
  { id: "memberId", label: "Member Id", alignRight: false },
  { id: "applicantName", label: "Member Name", alignRight: false },
  { id: "branchName", label: "Branch Name", alignRight: false },
  { id: "fatherName", label: "F/H Name", alignRight: false },
  { id: "kycStatus", label: "KYC Status", alignRight: false },
];

// ----------------------------------------------------------------------

export default function UserRole() {
  /* A state management. */
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("desc");

  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [orderBy, setOrderBy] = useState("memberId");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [members, setMembers] = useState([]);

 /**
  * GetMembersData() is a function that calls getDataFromApi() and then sets the state of members and
  * loading.
  */
  const getMembersData = () => {
    getDataFromApi("member")
      .then((res) => {
        setMembers(res);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

/* A hook that is called when the component is mounted. */
  useEffect(() => {
    getMembersData();
  }, []);

 /**
  * If the orderBy property is the same as the property passed in, and the order is ascending, then set
  * the order to descending, otherwise set the order to ascending.
  * @param event - The event that triggered the sort request.
  * @param property - The property to sort by.
  */
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

 /**
  * If the checkbox is checked, then set the selected array to the members array. If the checkbox is
  * unchecked, then set the selected array to an empty array
  * @param event - The event that triggered the function.
  * @returns The return value of the function is the return value of the last statement in the
  * function.
  */
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = members.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

/**
 * The handleChangePage function is called when the user clicks on a page number in the pagination
 * component. 
  * The function sets the page state to the newPage argument.
 * @param event - The event source of the callback
 * @param newPage - The page number to navigate to.
 */
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
   * If the value of the property of the second object is less than the value of the property of the
   * first object, return -1. If the value of the property of the second object is greater than the
   * value of the property of the first object, return 1. Otherwise, return 0.
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
  * negative, zero, or positive, depending on whether the first row is less than, equal to, or greater
  * than the second row.
  * 
  * If the order is ascending, return a function that compares two rows and returns a number that is
  * negative, zero, or positive, depending on whether the first row is greater than, equal to, or less
  * than the second row.
  * @param order - "asc" or "desc"
  * @param orderBy - The column name that the table is currently sorted by.
  */
  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

/**
 * It sorts the array based on the comparator and then filters the array based on the query
 * @param array - The array to be sorted.
 * @param comparator - (a, b) => {
 * @param query - The search query
 * @returns a new array with the filtered and sorted data.
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
        (member) =>
          member.applicantName.toLowerCase().indexOf(query.toLowerCase()) !==
            -1 ||
          member.memberId.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          member.fatherName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    return stabilizedThis.map((el) => el[0]);
  }


 /**
  * If the status includes "KYC Approved", return "info"; if it includes "Pending", return "warning";
  * if it includes "Approved", return "success"; if it includes "Rejected", return "error".
  * @param status - The status of the KYC.
  * @returns A function that takes a status and returns a color.
  */
  const getColor = (status) => {
    if (status.includes("KYC Approved")) {
      return "info";
    }
    if (status.includes("Pending")) {
      return "warning";
    }
    if (status.includes("Approved")) {
      return "success";
    }
    if (status.includes("Rejected")) {
      return "error";
    }
  };

  /* Checking if the page is greater than 0, if it is, it is calculating the number of empty rows. */
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - members.length) : 0;

/* Filtering the members array based on the order and orderBy parameters. */
  const filteredUsers = applySortFilter(
    members,
    getComparator(order, orderBy),
    filterName
  );
/* Checking if the filteredUsers array is empty. */

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="DhanVriksha | Members">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Members
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/Member/AddNewMember"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add New Member
          </Button>
        </Stack>

        <Card>
          {/* <Typography>{JSON.stringify(allLoan)}</Typography> */}
          <MemberListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <MemberListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={members.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, mId) => {
                      const { memberId, branch } = row;
                      return (
                        <TableRow
                          style={{ height: "10px" }}
                          hover
                          key={mId}
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
                              {row.memberId}
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            {row.applicantName}
                          </TableCell>
                          <TableCell align="left">
                            {branch && branch.branchName}
                          </TableCell>
                          <TableCell align="left">{row.fatherName}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={getColor(row.kycStatus)}
                            >
                              {row.kycStatus}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <MemberMoreMenu
                              memberId={row.memberId}
                              memberData={row}
                            />
                          </TableCell>
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
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
            count={members.length}
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
