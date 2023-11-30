import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
import { Stack, Typography, Button, Card } from "@mui/material";
import { useFormik } from "formik";
import Page from "../../../components/Page";
import { TextField } from "@mui/material";
import * as Yup from "yup";
import {
  Link as RouterLink,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { BASE_URL } from "../../../constants/config";
import axios from "axios";

export default function EditRoleForm(props) {
  const navigate = useNavigate();
  const params = useParams();
  // console.log("15 param", params);

  const location = useLocation();
  console.log("19 param roleDisplayName", location.search.split("=")[2]);
  console.log("20 param", location.search.split("=")[1]);
  let roleId = location.search.split("=")[1];
  let roleDisplayName = location.search.split("=")[2];
  roleDisplayName = roleDisplayName.replace("%20", " ");
  // console.log("21 props", props);
  const roleSchema = Yup.object().shape({
    roleDisplayName: Yup.string()
      // .name("name must be a valid ")
      .min(3, "Your name should be of atleast 3 character")
      .matches(/^[a-z,A-Z\s]+$/, "Name should be a string")
      .required("Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      // roleID: "",
      // roleName: "",
      roleDisplayName: "",
    },
    validationSchema: roleSchema,
    onSubmit: (values) => {
      console.log("Edit Role Form");

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
    <Page title="EditRoleForm">
      <Typography variant="h4" gutterBottom>
        Edit Role
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
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
              >
                {/* <TextField
                  fullWidth
                  required
                  id="Role Name"
                  label="Role Name"
                  name="rolename"
                  value={formik.values.roleName}
                  onChange={formik.handleChange}
                ></TextField> */}
                <TextField
                  fullWidth
                  required
                  id="Role Display Name"
                  label="Role Display Name"
                  name="roleDisplayName"
                  defaultValue={roleDisplayName}
                  // value={formik.values.roleDisplayName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.roleDisplayName &&
                    Boolean(formik.errors.roleDisplayName)
                  }
                  helperText={
                    formik.touched.roleDisplayName &&
                    formik.errors.roleDisplayName
                  }
                ></TextField>

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
              {/* <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  required
                  id="Role ID"
                  label="Role Id"
                  name="roleid"
                  value={formik.values.roleID}
                  onChange={formik.handleChange}
                ></TextField>
              </Stack> */}
            </Box>
          </Card>
        </form>
      </div>
    </Page>
  );
}
