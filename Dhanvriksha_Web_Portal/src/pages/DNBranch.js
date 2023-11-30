import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "../components/Iconify";
import {
  Card,
  Stack,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  Container,
  Typography,
  TableBody,
  TablePagination,
} from "@mui/material";

import { BASE_URL } from "../constants/config";
import { getDataFromApi, postDataToApi } from "../utils/apiCalls";

import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { filter } from "lodash";
import SearchNotFound from "../components/SearchNotFound";
import Label from "../components/Label";
import { BranchListHead, BranchListToolbar, BranchMoreMenu } from "../sections/@dashboard/Branch";
import Scrollbar from "../components/Scrollbar";
import Page from "../components/Page";

import BranchDialog from "../components/BranchDialog";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "branchId", label: "Branch Id", alignRight: false },
  { id: "branchName", label: "Name", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
];

// ----------------------------------------------------------------------

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
        _user.branchName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.branchId.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DNBranch() {
  const navigate = useNavigate();
  const [addBranch, setAddBranch] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("desc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("branchId");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [branch, setBranch] = useState([]);
  const token = sessionStorage.getItem("token");

  const getBranchData = () => {
    getDataFromApi("branch")
      .then((res) => {
        setBranch(res);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBranchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = branch.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - branch.length) : 0;

  const filteredUsers = applySortFilter(branch, getComparator(order, orderBy), filterName);

  const isBranchNotFound = filteredUsers.length === 0;

  function addNewBranch() {
    setAddBranch(true);
  }
  function handleClose() {
    setAddBranch(false);
  }

  return (
    <Page title="DhanVriksha | Branch">
      <Container>
        {addBranch && (
          <BranchDialog
            addMode={true}
            setLoading={setLoading}
            handleClose={handleClose}
            getBranchData={getBranchData}
            openDialog={addBranch}
          />
        )}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Branch
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            onClick={addNewBranch}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add Branch
          </Button>
        </Stack>

        <Card>
          <BranchListToolbar numSelected={selected.length} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <BranchListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={branch.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {branch.length > 0 &&
                    filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, id) => {
                      const { branchName, branchId } = row;
                      return (
                        <TableRow style={{ height: "10px" }} hover key={id} tabIndex={-1} role="checkbox">
                          <TableCell padding="checkbox">
                           
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2} style={{ marginLeft: 15 }}>
                              {branchId}
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{branchName}</TableCell>

                          <TableCell align="left">{row.description}</TableCell>

                          <TableCell align="left">
                            <Label variant="ghost" color={row.activeStatus === true ? "success" : "error"}>
                              {row.activeStatus === true ? "Active" : "Inactive"}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <BranchMoreMenu setLoading={setLoading} getBranchData={getBranchData} data={row} />
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
                {!loading && isBranchNotFound && (
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
            count={branch.length}
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
