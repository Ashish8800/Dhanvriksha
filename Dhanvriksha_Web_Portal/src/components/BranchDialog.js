import React, { useEffect } from "react";
import { useFormik } from "formik";
//mui
import {
  TextField,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
  Grid,
  Box,
  ButtonGroup,
} from "@mui/material";
import { postDataToApi } from "../utils/apiCalls";
import Switch from "react-switch";
import * as Yup from "yup";
import swal from "sweetalert";
import { LoadingButton } from "@mui/lab";

// Validation by Yup
const BranchSchema = Yup.object().shape({
  branchName: Yup.string()
    .min(3, "Your Branch Name should be of atleast 3 character")
    .matches(/^\S(?!^\d+$)[a-zA-Z\d\s]+$/, "Enter a valid Branch Name")
    .required("Branch Name is required"),
});

//Component Start
export default function BranchDialog(props) {
  //React States
  const [check, setCheck] = React.useState(
    props.data ? props.data.activeStatus : false
  );

  /**
   * Sets Switch state to true/false
   * @function handleCheck
   * @param {boolean} check - defines the state as true/false
   */
  const handleCheck = (check) => {
    setCheck(check);
    formik.values.activeStatus = check;
  };

  //formik
  const formik = useFormik({
    initialValues: {
      branchName: "",
      description: "",
      activeStatus: false,
    },
    validationSchema: BranchSchema,
    onSubmit: (values) => {
      /**
       * Saves Branch Data to database
       * *@param {apiName } branch
       * @function postDataToApi
       */
      postDataToApi(
        props.editMode ? "branch/" + props.data.branchId : "branch/",
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
            props.getBranchData();
            props.handleClose();
            // props.setLoading(true);
            formik.values.branchName = "";
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
      props.setLoading(false);
    }
  }, []);

  // Components Return
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
          {props.addMode ? "Add Branch" : "Edit Branch"}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={2} columnSpacing={4}>
            <Grid item xs={12}>
              <TextField
                required
                size="small"
                fullWidth
                id="branchName"
                name="branchName"
                label="Branch name"
                onChange={formik.handleChange}
                value={formik.values.branchName}
                error={
                  formik.touched.branchName && Boolean(formik.errors.branchName)
                }
                helperText={
                  formik.touched.branchName && formik.errors.branchName
                }
              />
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
              <span>Active</span>
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
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={formik.isSubmitting}
                  >
                    {props.addMode ? "Add Branch" : "Update Branch"}
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
