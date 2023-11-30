import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Stack, Typography, Button, Card } from "@mui/material";
import Page from "../components/Page";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { BASE_URL } from "../constants/config";
import axios from "axios";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";

export default function KycApprovaList() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const location = useLocation();

  const navigate = useNavigate();
  const [fdData, setfdData] = useState([]);
  const [rdData, setrdData] = useState([]);
  const [loanData, setloanData] = useState([]);
  const getFdData = () => {
    let fddata = [];
    axios.get(`${BASE_URL}/fixedDeposit`).then((res) => {
      
      res.data.map((status) => {
        if (status.fdStatus == "Applied") fddata.push(status);
      });
      setfdData(fddata);
    });
  };
  const getRdData = () => {
    let rddata = [];
    axios.get(`${BASE_URL}/recurringDeposit/getAllRD`).then((res) => {
      
      res.data.map((status) => {
        if (status.rdStatus == "Applied") rddata.push(status);
      });
      setrdData(rddata);
    });
  };
  const getLoanData = () => {
    let loandata = [];
    axios.get(`${BASE_URL}/loan/getAllLoan`).then((res) => {
    
      res.data.map((status) => {
        if (status.loanStatus == "Applied") loandata.push(status);
      });
      setloanData(loandata);
    });
  };
  useEffect(() => {
    getFdData();
    getRdData();
    getLoanData();
  }, []);

  return (
    <Page title="Kyc Approval List">
      <div>
        <Card style={{ alignSelf: "center", width: "90.1%", padding: "5px" }}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}></Stack>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Fixed Deposit" value="1" />
                  <Tab label="Loan" value="2" />
                  <Tab label="Recurring Deposit" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {fdData.map((data, i) => (
                  <div style={{ marginBottom: 10 }} onClick={() => navigate("/dashboard/KycApprovalForm")} key={i}>
                    <Typography style={{ fontSize: 17, fontWeight: "700" }}>{data.applicationDate}</Typography>
                    <Typography>{data.applicantName}</Typography>
                  </div>
                ))}
              </TabPanel>
              <TabPanel value="2">
                {loanData.map((data, j) => (
                  <div style={{ marginBottom: 10 }} onClick={() => navigate("/dashboard/KycApprovalForm")} key={j}>
                    <Typography style={{ fontSize: 17, fontWeight: "700" }}>{data.applicationDate}</Typography>
                    <Typography>{data.applicantName}</Typography>
                  </div>
                ))}
              </TabPanel>
              <TabPanel value="3">
                {rdData.map((data, k) => (
                  <div style={{ marginBottom: 10 }} onClick={() => navigate("/dashboard/KycApprovalForm")} key={k}>
                    <Typography style={{ fontSize: 17, fontWeight: "700" }}>{data.applicationDate}</Typography>
                    <Typography>{data.applicantName}</Typography>
                  </div>
                ))}
              </TabPanel>
            </TabContext>
          </Box>
        </Card>
      </div>
    </Page>
  );
}
