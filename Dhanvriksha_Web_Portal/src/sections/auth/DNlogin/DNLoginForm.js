import * as Yup from "yup";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Link,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Iconify from "../../../components/Iconify";
import swal from "sweetalert";
//Axios Function
import { postDataToApi } from "../../../utils/apiCalls";

//Form Validation by Yup
const LoginSchema = Yup.object({
  email: Yup.string("Enter your email").required("Email/Emp Id is required"),
  password: Yup.string("Enter your password")
    .min(5, "Password should be of minimum 6 characters length")
    .required("Password is required"),
});

export default function LoginForm() {
  //React States
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //Function to hide/show password
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      /**
       * Posting Data to database
       * * @param {apiName } emp/signin
       * @function postDataToApi
       */
      postDataToApi(`emp/signin`, JSON.stringify(values)).then((res) => {
        swal(
          res.success ? "Sucess!" : "Error!",
          res.message,
          res.success ? "success" : "error"
        );
        if (res.success) {
          /* If data is successfully saved in database it will store the following things in session storage from response received*/
          sessionStorage.setItem("emp", JSON.stringify(res));
          sessionStorage.setItem("role", res.roles);
          sessionStorage.setItem("name", res.name);
          sessionStorage.setItem("token", res.accessToken);
          navigate(
            "/dashboard/app",
            {
              state: {
                afterLogin: true,
                role: res.roles,
                token: res.accessToken,
              },
            },
            { replace: true }
          );
        }
        return res.accessToken;
      });
    },
  });

  // Components Return
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            size="small"
            id="email"
            name="email"
            label="Email/Emp Id"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            required
            fullWidth
            size="small"
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            fullWidth
            size="medium"
            type="submit"
            variant="contained"
          >
            Login
          </LoadingButton>
        </Stack>
        <Stack direction="row" justifyContent="right" sx={{ my: 2 }}>
          <Link
            component={RouterLink}
            variant="subtitle2"
            to="/DNforgotpwd"
            underline="hover"
            textAlign="right"
          >
            Forgot/Change Password?
          </Link>
        </Stack>
      </form>
    </div>
  );
}
