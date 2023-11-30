import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
import { Stack, Typography, Button, Card } from "@mui/material";
import { useFormik } from "formik";
import Page from "../../../components/Page";
import { TextField } from "@mui/material";
import * as Yup from "yup";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../constants/config";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

export default function DisableRoleForm(props) {
  const navigate = useNavigate();

  // const params = useParams();
  // console.log("15 param", params);

  const location = useLocation();
  console.log("19 param", location.search.split("=")[2]);
  console.log("20 param", location.search.split("=")[1]);
  let roleId = location.search.split("=")[1];
  let roleDisplayName = location.search.split("=")[2];
  roleDisplayName = roleDisplayName.replace("%20", " ");
  // console.log("21 props", props);
  // const roleSchema = Yup.object().shape({
  //   roleDisplayName: Yup.string()
  //     // .name("name must be a valid ")
  //     .min(3, "Your name should be of atleast 3 character")
  //     .matches(/^[a-z,A-Z\s]+$/, "Name should be a string")
  //     .required("Name is required"),
  // });

  const formik = useFormik({
    initialValues: {
      // roleID: "",
      // roleName: "",
      disabled: "",
    },
    // validationSchema: roleSchema,
    onSubmit: (values) => {
      console.log("Disable Role Form");
      axios
        .post(`${BASE_URL}/empRole/updateEmpRole/${roleId}`, values)

        .then((res) => {
          // console.log(res);

          if (res.data.success === true) {
            navigate("/dashboard/UserRole", { replace: true });
          }
        });

    },
  });

  const { isSubmitting } = formik;
  return (
    <Page title="DisableRoleForm">
      <Typography variant="h4" gutterBottom>
        Disable Role
      </Typography>
      <div>
        <form onSubmit={formik.handleSubmit} sx={{ m: 1 }}>
          <Card style={{ alignSelf: "center", width: "90.1%", padding: "5px" }}>
            <Box
              sx={{
                "& .MuiTextField-root": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <Stack
                direction={{ xs: "row", sm: "row" }}
                spacing={2}
                justifyContent="center"
              >
                <TextField

                  disabled
                  fullWidth
                  required
                  id="Role Display Name"
                  label="Role Display Name"
                  name="roleDisplayName"
                  defaultValue={roleDisplayName}
                  // value={formik.values.roleDisplayName}
                  onChange={formik.handleChange}

                ></TextField>
                <TextField
                  select
                  required
                  id="disabled"
                  label="Disable"
                  name="disabled"
                  value={formik.values.disabled}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
                <Button
                  style={{
                    marginTop: "9px",
                    marginRight: "20px",
                    height: "55px",
                  }}
                  type="Submit"
                  variant="contained"
                  loading={isSubmitting.toString()}
                >
                  submit
                </Button>
              </Stack>
            </Box>
          </Card>
        </form>
      </div>
    </Page>
  );
}
