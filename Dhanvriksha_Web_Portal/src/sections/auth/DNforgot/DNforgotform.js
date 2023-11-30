import * as Yup from "yup";
import React, { useState } from "react";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import { Link, Stack, Checkbox, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import swal from "sweetalert";
// component
import { postDataToApi } from "../../../utils/apiCalls";
import axios from "axios";
import { BASE_URL } from "../../../constants/config";
// ----------------------------------------------------------------------

export default function DNforgotform() {
 /* A hook that allows you to navigate to a different route. */
  const navigate = useNavigate();
/* A state variable. */
  const [email, setEmail] = useState();

 /* A validation schema for the form. */
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      /* A function that is called when the form is submitted. */
      postDataToApi("emp/forgotPass", JSON.stringify(values))
        .then((res) => {
         
          if (!res.success) {
            swal("Error!", res.message, "error");
          } else {
            if (res.success) {
              swal("Success !", res.message, "success");
              setEmail(res.data.email);
              sessionStorage.setItem("data", res.data.values);
              navigate("/DNUpdatePwd", { state: { data: res.data.email } });
            }
          }
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    },
  });

 /* Destructuring the formik object. */
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;
// Component Return
  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          size="small"
          fullWidth
          autoComplete="username"
          type="email"
          label="Registered Email ID"
          {...getFieldProps("email")}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="medium"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ my: 2 }}
      >
        Send Email
      </LoadingButton>
      <Stack direction="row" justifyContent="right" sx={{ my: 2 }}>
        <Link
          component={RouterLink}
          variant="subtitle2"
          to="/login"
          underline="hover"
          textAlign="right"
        >
          Cancel
        </Link>
      </Stack>
    </form>
  );
}
