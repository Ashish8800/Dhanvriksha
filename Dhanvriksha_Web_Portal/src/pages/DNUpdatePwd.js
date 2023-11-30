import { Link as RouterLink } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import { Card, Link, Container, Typography } from "@mui/material";
// hooks
import useResponsive from "../hooks/useResponsive";
// components
import Page from "../components/Page";
import Logo from "../components/Logo";
// sections
import DNUpdatePwdForm from "../sections/auth/DNUpdatepwd/DNUpdatePwdForm";
import { useLocation } from "react-router-dom";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  // top: 0,
  // zIndex: 9,
  // lineHeight: 0,
  // width: "100%",
  // display: "flex",
  // alignItems: "center",
  // position: "absolute",
  // padding: theme.spacing(3),
  // justifyContent: "center",
  // [theme.breakpoints.up("md")]: {
  //   alignItems: "center",
  //   padding: theme.spacing(7, 5, 0, 7),
  // },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: "100%",
  margin: "auto",
  // marginTop: "50px",
  minHeight: "90vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function DNUpdatePwd(props) {
  const smUp = useResponsive("up", "sm");

  const mdUp = useResponsive("up", "md");
  const location = useLocation();

  console.log("line 24", location.state.data);
  return (
    <Page title="Login">
      <RootStyle>
        
        <Container maxWidth="sm">
          <ContentStyle>
            <center>
            <HeaderStyle>
          <Logo />
        </HeaderStyle>

            </center>
          <Typography
              variant="h6"
              gutterBottom
              textAlign="center"
              sx={{ m: 2 }}
            >
              UPDATE PASSWORD
            </Typography>

            <DNUpdatePwdForm email={location.state.data} />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
