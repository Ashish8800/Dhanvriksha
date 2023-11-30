import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import { Link, Button, Stack, TextField, IconButton, InputAdornment, Typography, Container } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// component
import Iconify from "../../../components/Iconify";
import { postDataToApi } from "../../../utils/apiCalls";
import swal from "sweetalert";
// ----------------------------------------------------------------------

export default function DNUpdatePwdForm({ email }) {
  const navigate = useNavigate();
  const [shownewPassword, setShownewPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string(),
    newPassword: Yup.string()
      .required("Password is required")
      // .min(6, "Password should be of minimum 5 characters length")
      .matches(
        /^(?=.*[A-Z])(?=.*?[a-z])(?=.*\d)(?=.*[@$#])[A-Za-z\d@$!*#?&]{6,}$/,
        "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),

    confirmPassword: Yup.string()
      .required("Password is required")
      // .min(6, "Password should be of minimum 5 characters length")
      .matches(
        /^(?=.*[A-Z])(?=.*?[a-z])(?=.*\d)(?=.*[@$#])[A-Za-z\d@$!*#?&]{6,}$/,
        "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
  });

  const formik = useFormik({
    initialValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
      remember: true,
      email: email,
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      postDataToApi("emp/verifyOTP", JSON.stringify(values))
        .then((res) => {
        
          if (!res.success) {
            swal("Error !", res.message, "error");
            navigate("/DNforgotpwd", { replace: true });
          } else {
            if (res.success) {
              swal("Success !", res.message, "success");
              navigate("/login", { replace: true });
            }
          }
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
      // console.log("Reset Password Page");
      // axios.post(`${BASE_URL}/login/resetpwd`, values).then((res) => {
      //   if (res.data.success === true) {
      //     alert(res.data.message)
      //     // sessionStorage.setItem("data", res.data.values);
      //     navigate("/login", { replace: true });
      //   } else {
      //     alert(res.data.message);
      //     navigate("/DNforgotpwd", { replace: true });
      //   }
      // });
    },
  });
  // console.log("line 44",email);
  const { isSubmitting } = formik;

  const handleShownewPassword = () => {
    setShownewPassword((show) => !show);
  };
  const handleShowconfirmPassword = () => {
    setShowconfirmPassword((show) => !show);
  };

  return (
    <Container>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <TextField
          size="small"
            fullWidth
            name="otp"
            label="OTP received"
            value={formik.values.otp}
            onChange={formik.handleChange}
          />

          <TextField
            fullWidth
            size="small"
            id="newPassword"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            autoComplete="new-password"
            type={shownewPassword ? "text" : "password"}
            label="New Password"
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            // {...getFieldProps("newPassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShownewPassword} edge="end">
                    <Iconify icon={shownewPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            id="confirmPassword"
            size="small"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            autoComplete="confirm-password"
            type={showconfirmPassword ? "text" : "password"}
            label="Confirm Password"
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            // {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowconfirmPassword} edge="end">
                    <Iconify icon={showconfirmPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Button fullWidth size="medium" type="submit" variant="contained" sx={{ my: 2 }}>
          Update Password
        </Button>
 
        <Link component={RouterLink} variant="subtitle3" to="/login" underline="hover" textAlign="right">
            Cancel
          </Link>
 
      </form>
    </Container>
  );
}
