import React, { useState, useEffect } from "react";
//import Page from 'src/components/Page'
// import Page from 'src/components/Page'

import { Link as RouterLink } from "react-router-dom";
import { Box, Button } from "@mui/material";
import {
  TextField,
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
import Switch from "react-switch";
import { BASE_URL } from "../constants/config";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { filter } from "lodash";
import SearchNotFound from "../components/SearchNotFound";
import Label from "../components/Label";
import {
  AreaListHead,
  AreaListToolbar,
  AreaMoreMenu,
} from "../sections/@dashboard/area";
import Scrollbar from "../components/Scrollbar";
import { getDataFromApi, postDataToApi } from "../utils/apiCalls";
import MenuItem from "@mui/material/MenuItem";
import Page from "../components/Page";
import Loader from "../components/Loader";
import * as Yup from "yup";
import Iconify from "../components/Iconify";
import AreaDialog from "../components/AreaDialog";
// ----------------------------------------------------------------------

//Table header
const TABLE_HEAD = [
  { id: "areaId", label: "Area Id", alignRight: false },
  { id: "areaName", label: "Area Name", alignRight: false },
  { id: "bname", label: "Branch Name", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
];

// ----------------------------------------------------------------------

export default function DNArea() {
  const navigate = useNavigate();


  //React States
  const [addArea, setAddArea] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [check, setCheck] = React.useState(false);
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("desc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("areaId");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [areas, setAreas] = useState([]);
  const [branches, setBranches] = useState([]);
  const token = sessionStorage.getItem("token");


  //Functions

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

 /**
  * GetAreaData is a function that takes an id as an argument and returns a promise that resolves to an
  * array of objects.
  * @param _id - the id of the area that was clicked on
  */
    const getAreaData = (_id) => {
    getDataFromApi("area")
      .then((response) => {
      setAreas(response);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Line 104 ", err);
      });
  };


 /**
  * It fetches data from an API and sets the state of the component.
  * @function getBranches
*/
  const getBranches = () => {
    axios
      .get(`${BASE_URL}/branch/`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        let branchesData = [];
        response.data.map((objAreaes) => {
          let tempObj = {};
          tempObj.branchName = objAreaes.branchName;
          tempObj.branchId = objAreaes.branchId;
          branchesData.push(tempObj);
        });
        setBranches(branchesData);
      })
      .catch((err) => {
        console.log("Line 104 ", err);
      });
    return () => {
      setBranches(" ");
    };
  };

  //React Effects
 /* A react hook that is called when the component is mounted. */
  useEffect(() => {
    getAreaData();
    getBranches();
  }, []);

  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = areas.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - areas.length) : 0;

  const filteredUsers = applySortFilter(
    areas,
    getComparator(order, orderBy),
    filterName
  );
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  const isAreaNotFound = filteredUsers.length === 0;
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
        (_area) =>
          _area.areaName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
          _area.areaId.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    return stabilizedThis.map((el) => el[0]);
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function addNewArea() {
    setAddArea(true);
  }
  function handleClose() {
    setAddArea(false);
  }

  return (
    <Page title="DhanVriksha | Area">
      <Container>
        {addArea && (
          <AreaDialog
            addMode={true}
            setLoading={setLoading}
            handleClose={handleClose}
            getAreaData={getAreaData}
            openDialog={addArea}
          />
        )}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Area
          </Typography>
          <Button
            component={RouterLink}
            onClick={addNewArea}
            // sx={{ m: 1, width: "3in" }}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            variant="contained"
          >
            Add Area
          </Button>
        </Stack>

        <Card>
          <AreaListToolbar
            numSelected={selected.length}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <AreaListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={areas.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {areas.length > 0 && filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, id) => {
                      const { areaName, areaId } = row;
                      return (
                        <TableRow
                          style={{ height: "10px" }}
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                        >
                         
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography
                                variant="subtitle2"
                                noWrap
                                style={{ marginLeft: 15 }}
                              >
                                {/* {row._id} */}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{row.areaId}</TableCell>
                          <TableCell align="left">{row.areaName}</TableCell>
                          <TableCell align="left">{row.branch?row.branch.branchName:""}</TableCell>

                          <TableCell align="left">{row.description}</TableCell>

                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={
                                row.activeStatus === true ? "success" : "error"
                              }
                            >
                              {row.activeStatus ? "Active" : "Inactive"}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <AreaMoreMenu
                              setLoading={setLoading}
                              getAreaData={getAreaData}
                              data={row}
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
                {!loading && isAreaNotFound && (
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
            count={areas.length}
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
