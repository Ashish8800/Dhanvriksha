import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Drawer, Stack } from "@mui/material";
// mock
// hooks
import useResponsive from "../../hooks/useResponsive";
// components
import Logo from "../../components/Logo";
import Scrollbar from "../../components/Scrollbar";
import NavSection from "../../components/NavSection";
//
// import navConfig from './NavConfig';
// import DNNavConfig from "./DNNavConfig";
import DNNavConfigAdmin from "./DNNavCofigAdmin";
import DNNavConfigFO from "./DNNavConfigFO";
import DNNavConfigBM from "./DNNavConfigBM";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

// ----------------------------------------------------------------------

DNDashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DNDashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const navigate=useNavigate()
  const { pathname } = useLocation();

  const isDesktop = useResponsive("up", "lg");
  const [role, setRole] = useState([]);
  const [name, setName] = useState("");
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }

    var emp = JSON.parse(sessionStorage.getItem("emp"));
    var name = sessionStorage.getItem("name");
    setName(name);
    try{
      if(emp.roles){
    setRole(emp.roles);
    }
   
  }
    catch{
      navigate('/login')

    }

  }, [pathname]);

  const renderContent = (
    <>
      <Box
        sx={{ p: 1.4, display: "inline-flex" }}
        style={{
          backgroundColor: "#ffffff",
          boxShadow:
            "0px 2px 4px -1px rgb(145 158 171 / 20%), 0px 4px 5px 0px rgb(145 158 171 / 14%), 0px 1px 10px 0px rgb(145 158 171 / 12%)",
          zIndex: "inherit",
        }}
      >
        <Logo />
      </Box>

      <Scrollbar
        sx={{
          height: 1,
          "& .simplebar-content": {
            height: 1,
            display: "flex",
            flexDirection: "column",
          },
          paddingTop: "1rem",
          background: "#103994",
        }}
      >
        {role.includes("ROLE_ADMIN") && (
          <NavSection navConfig={DNNavConfigAdmin} />
        )}
        {role.includes("ROLE_FO") && <NavSection navConfig={DNNavConfigFO} />}
        {role.includes("ROLE_BM") && <NavSection navConfig={DNNavConfigBM} />}
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
          <Stack
            alignItems="center"
            spacing={3}
            sx={{ pt: 5, borderRadius: 2, position: "relative" }}
          ></Stack>
        </Box>
      </Scrollbar>
      <Box
        sx={{ p: 1.4, display: "inline-flex" }}
        style={{
          fontSize: "12px",
          backgroundColor: "rgba(249, 250, 251, 0.72)",
        }}
      >
        Developed By&nbsp;{" "}
        <a href="https://inevitableinfotech.com/" target="_blank">
          {" "}
          Inevitable Infotech{" "}
        </a>
      </Box>
    </>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
