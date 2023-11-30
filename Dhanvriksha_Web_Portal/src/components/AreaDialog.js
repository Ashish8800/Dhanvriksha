import React, { useEffect } from "react";
import { useFormik } from "formik";
//mui
import {
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
  Grid,
  Box,
  ButtonGroup,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { LoadingButton } from "@mui/lab";
import Switch from "react-switch";
import swal from "sweetalert";
import * as Yup from "yup";
import { postDataToApi, getDataFromApi } from "../utils/apiCalls";

// ----------------------------------------------------------------------
//Validation using Yup
const AreaSchema = Yup.object().shape({
  areaName: Yup.string()
    .min(3, "Your Area Name should be of atleast 3 character")
    .matches(/^\S(?!^\d+$)[a-zA-Z\d\s]+$/, "Enter a valid Area Name")
    .required("Area Name is required"),
});

// Component Start
export default function AreaDialog(props) {
  //React States
  const [check, setCheck] = React.useState(
    props.data ? props.data.activeStatus : false
  );
  const [branches, setBranches] = React.useState([]);

  // Functions

  /**
   * Sets Switch state to true/false
   * @function handleCheck
   * @param {boolean} check - defines the state as true/false
   */
  const handleCheck = (check) => {
    setCheck(check);
    formik.values.activeStatus = check;
  };

  /**
   * Get All the Branches from Database.
   * Pick only Active Branches
   * @function getBranchData
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
      })
      .catch((err) => console.log(err));
  };

  //formik
  const formik = useFormik({
    initialValues: {
      areaName: "",
      branch: "",
      description: "",
      activeStatus: false,
    },
    validationSchema: AreaSchema,
    onSubmit: (values) => {
      /**
       * Saves Area Data to database
       * * @param {apiName } area
       * @function postDataToApi
       */
      postDataToApi(
        props.editMode ? "area/" + props.data.areaId : "area/",
        JSON.stringify(values),
        props.editMode && "PUT"
      )
        .then((res) => {
          swal(
            res.success ? "Sucess!" : "!Error",
            res.message,
            res.success ? "success" : "error"
          );
          if (res.success) {
            props.getAreaData();
            props.handleClose();
            // props.setLoading(true);
            formik.values.areaName = "";
            formik.values.branch = "";
            formik.values.description = "";
            formik.values.activeStatus = false;
          } else {
            props.handleClose();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  //React Effects
  useEffect(() => {
    if (props.data) {
      formik.setValues({ ...props.data });
      formik.setFieldValue("branch", props.data.branch._id);
    }
    getBranchData();
  }, []);

  //Component's Return
  return (
    <Dialog
      open={props.openDialog}
      onClose={props.handleClose}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItem: "center",
      }}
    >
      <DialogContent style={{ width: "100%", height: "100%" }}>
        <DialogTitle style={{ textAlign: "center" }}>
          {props.addMode ? "Add Area" : "Edit Area"}
          {JSON.stringify(props.row)}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={2} columnSpacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                size="small"
                fullWidth
                id="areaName"
                name="areaName"
                label="Area name"
                onChange={formik.handleChange}
                value={formik.values.areaName}
                error={
                  formik.touched.areaName && Boolean(formik.errors.areaName)
                }
                helperText={formik.touched.areaName && formik.errors.areaName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                size="small"
                fullWidth
                id="outlined-select-currency"
                select
                name="branch"
                label="Branch Name"
                value={formik.values.branch}
                onChange={formik.handleChange}
              >
                {branches.map((option, i) => (
                  <MenuItem key={i} value={option._id}>
                    {option.branchName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                size="small"
                fullWidth
                multiline
                label="Description"
                name="description"
                InputProps={{
                  inputComponent: TextareaAutosize,
                  rows: 3,
                }}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                marginLeft: 25,
                "& > *": {
                  m: 1,
                },
              }}
            >
              <span>Status</span>
              <Switch
                onChange={handleCheck}
                checked={check}
                value={formik.values.activeStatus}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  "& > *": {
                    m: 1,
                  },
                }}
              >
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  <LoadingButton
                    color="warning"
                    onClick={props.handleClose}
                    variant="contained"
                  >
                    Cancel
                  </LoadingButton>
                  <LoadingButton type="submit" variant="contained">
                    {props.addMode ? "Add Area" : "Update Area"}
                  </LoadingButton>
                </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}
