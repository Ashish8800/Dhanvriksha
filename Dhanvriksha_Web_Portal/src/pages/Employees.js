import React from "react";
import { filter } from "lodash";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Loader from "../components/Loader";
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
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import axios from "axios";
import { BASE_URL, roleNames } from "../constants/config";
import { EmployeeListHead, EmployeeListToolbar, EmployeeMoreMenu } from "../sections/@dashboard/Employee";
import Iconify from "../components/Iconify";
// mock
// import EMPLOYEELIST from "../_mock/user";

// ----------------------------------------------------------------------

/* Defining the table headings. */
const TABLE_HEAD = [
  { id: "empId", label: "Employee ID", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "branch", label: "Branch", alignRight: false },
  { id: "area", label: "Area", alignRight: false },
  { id: "reporting", label: "Reporting Person", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
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

/**
 * It sorts the array based on the comparator and then filters the array based on the query
 * @param array - The array of objects to be sorted.
 * @param comparator - (a, b) => {
 * @param query - The search query
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
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.empId.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Employees() {
 /* Setting the state of the component. */
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("empId");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [employee, setEmployee] = useState([]);
  const [objEmployees, setObjEmployees] = useState([]);
  const [loading, setLoading] = React.useState(true);

  const token = sessionStorage.getItem("token");
  
/**
 * It gets all the employees from the database and sets the state of the employees.
 * @returns An array of objects.
 */
  const getEmpData = () => {
    axios
      .get(`${BASE_URL}/emp/getAllEmp`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
      
        setEmployee(response.data);
        setLoading(false);
        let arrtemp = [];
        let areaArr= [];
        response.data.map((emp) => {
          
          let objTemp = {
            _id: emp._id,
            id: emp._id,
            empId: emp.empId,
            name: emp.name + "(" + emp.empId + ")",
          };
          arrtemp.push(objTemp);
          areaArr.push(emp.area)
        });
        setObjEmployees(arrtemp);
        // setArea(areaArr)
      });
    return () => {
      setEmployee(" ");
    };
  };

 /* A react hook that is used for data fetching, setting up a subscription, or manually changing the
 DOM in React components. */
  useEffect(() => {
    getEmpData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = employee.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employee.length) : 0;

  const filteredUsers = applySortFilter(employee, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="DhanVriksha | Employees">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Employees
          </Typography>
          <Button
            disabled={loading}
            variant="contained"
            component={RouterLink}
            state={{ data: objEmployees }}
            to="/dashboard/Employee/AddNewEmp"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add New Employee
          </Button>
        </Stack>
        <Card>
          <EmployeeListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <EmployeeListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={employee.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, Id) => {
                    const { empId } = row;
                    return (
                      <TableRow style={{ height: "10px" }} hover key={Id} tabIndex={-1} role="checkbox">
                        <TableCell padding="checkbox">
                         
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap style={{ marginLeft: 15 }}>
                              {empId}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.roles[0] ? roleNames[row.roles[0].name] : ""}</TableCell>
                        <TableCell align="left">{row.branch ? row.branch.branchName : ""}</TableCell>
                        {/* <TableCell align="left">{row.area ? row.area.areaName : ""}</TableCell> */}
                        <TableCell align="left">{row.area ? row.area.map((areaName)=>
                         areaName.areaName+", "
                        ):""}</TableCell>
                        <TableCell align="left">{row.reportingPerson ? row.reportingPerson.name : ""}</TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color={row.status === true ? "success" : "error"}>
                            {row.status === true ? "Active" : "Inactive"}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          <EmployeeMoreMenu objEmployees={objEmployees} thisEmp={row} empId={row.empId} />
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
            count={employee.length}
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
