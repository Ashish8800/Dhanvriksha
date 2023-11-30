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

import DNforgotform from "../sections/auth/DNforgot/DNforgotform";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
 
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '50%',
  maxHeight: '95vh',
  // maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
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

export default function DNforgotpwd() {
  const smUp = useResponsive("up", "sm");

  const mdUp = useResponsive("up", "md");

  return (
    <Page title="Login">
      <RootStyle>
      {mdUp && (
          <SectionStyle>
            <img src="/static/illustrations/Dhanvriksha_Logo_bg.png" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            {/* <Typography variant="h4" gutterBottom align="center">
              Dhanvriksha Nidhi Ltd
            </Typography> */}
<center>
<HeaderStyle>
          <Logo />
        </HeaderStyle>
</center>
            <Typography
              variant="h6"
              gutterBottom
              textAlign="center"
               sx={{ m: 4 }}
            >
              FORGOT PASSWORD
            </Typography>

            <DNforgotform />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
