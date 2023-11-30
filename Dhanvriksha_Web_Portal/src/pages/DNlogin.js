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
import { DNLoginForm } from "../sections/auth/DNlogin";


// ----------------------------------------------------------------------

//Mui Default Styling
const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
  backgroundImage: "linear-gradient(to left, #e6f1ff 0%, #ffffff 100%)",
}));

const HeaderStyle = styled("header")(({ theme }) => ({}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "50%",
  maxHeight: "95vh",
    display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: "100%",
  margin: "auto",
   minHeight: "90vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function DNlogin() {
  const smUp = useResponsive("up", "sm");

  const mdUp = useResponsive("up", "md");

  // Components Return
  return (
    <Page title="Login">
      <RootStyle>
        {mdUp && (
          <SectionStyle>
            <img
              src="/static/illustrations/Dhanvriksha_Logo_bg.png"
              alt="login"
            />
          </SectionStyle>
        )}
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
              LOGIN
            </Typography>

            <DNLoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
