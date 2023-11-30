import React, { useState, useEffect } from "react";
//mui
import {
  Stack,
  Typography,
  Card,
  CardHeader,
  Container,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import { AppWidgetSummary } from "../sections/@dashboard/app";
import Page from "../components/Page";
import { useNavigate } from "react-router-dom";
import { getDataFromApi } from "../utils/apiCalls";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader";

export default function DNDashboardApp() {
  // Global Variable
  const location = useLocation();
  const navigate = useNavigate();

  //React States
  const [username, setUserName] = useState("");
  const [emp, setEmp] = useState([]);
  const [mem, setMem] = useState([]);
  const [totalLoan, setTotalLoan] = useState([]);
  const [totalFD, settotalFD] = useState([]);
  const [totalRD, settotalRD] = useState([]);
  const [fd, setFd] = useState([]);
  const [rd, setRd] = useState([]);
  const [loan, setLoan] = useState([]);
  const [role, setRole] = useState("");
  const [loanDisbApproved, setloanDisbApproved] = useState([]);
  const [kycArrovedFd, setkycArrovedFd] = useState([]);
  const [kycArrovedRd, setkycArrovedRd] = useState([]);
  const [kycArrovedLoan, setkycArrovedLoan] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [kycLoading, setKYCLoading] = useState(true);
  const [disbursementLoading, setDisbursementLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // React Effects
  useEffect(() => {
    setUserName(sessionStorage.getItem("name"));
    if (location.state && location.state.afterLogin) {
      setRole(location.state.role[0]);
    } else {
      const roless = sessionStorage.getItem("role");
      setRole(roless);
    }
    dashboardApplications();
    totalEmp();
    totalMem();
    totalloan();
    totalfd();
    totalrd();
  }, []);

  //Functions

  /**
   * Get All the Employees from Database.
   * @function totalEmp
   */

  const totalEmp = () => {
    getDataFromApi("emp/getAllEmp")
      .then((res) => {
        setEmp(res);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Get All the Members from Database.
   * @function totalMem
   */
  const totalMem = () => {
    getDataFromApi("member")
      .then((res) => {
        setMem(res);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Get All the Loan Applications from Database.
   * @function totalloan
   */
  const totalloan = () => {
    getDataFromApi("loan")
      .then((res) => {
        setTotalLoan(res);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Get All the FDs from Database.
   * @function totalfd
   */
  const totalfd = () => {
    getDataFromApi("fixedDeposit")
      .then((res) => {
        settotalFD(res);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Get All the RDs from Database.
   * @function totalrd
   */
  const totalrd = () => {
    getDataFromApi("rdeposit")
      .then((res) => {
        settotalRD(res);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Getting  Applications with "Applied" status from Database for KYC Approval Bucket
   * Getting "KYC Approved" application for Application Approval Bucket.
   * Getting "Approved" Loan Applications for Loan Disbursement Bucket.
   * @function dashboardApplications
   */

  const dashboardApplications = () => {
    // Fetching Applied Applications
    getDataFromApi(
      "appliedApplications",
      location.state && location.state.token
    ).then((response) => {
      response.arrAllFds.length && setFd(response.arrAllFds);
      response.arrAllRds && setRd(response.arrAllRds);
      response.arrAllLoan && setLoan(response.arrAllLoan);

      if (!kycLoading) {
        setDashboardLoading(false);
      }
      // Fetching KYC Approved Applications
      getDataFromApi(
        "kycApprovedApplications",
        location.state && location.state.token
      ).then((response) => {
        setkycArrovedFd(response.approvedFd);
        setkycArrovedRd(response.approvedRd);
        setkycArrovedLoan(response.approvedLoan);
        setKYCLoading(false);
        if (!appLoading) {
          setDashboardLoading(false);
        }
        setAppLoading(false);
        setDashboardLoading(false);
        // Fetching Approved Loan Applications for Loan Disbursement Bucket
        getDataFromApi(
          "getLoanApprovedApplication",
          location.state && location.state.token
        ).then((response) => {
          setloanDisbApproved(response.approvedLoan);

          if (!disbursementLoading) {
            setDashboardLoading(false);
          }
        });
      });
    });
  };

  // Components Return
  return (
    <Page title="DhanVriksha | Dashboard">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Hi, {username}!
          </Typography>
        </Stack>
        {/* Tiles displaying Total Members, Loans,FDs and RDs */}
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Members"
              total={mem.length}
              color="primary"
              icon={"eva:people-fill"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Loans"
              total={totalLoan.length}
              color="info"
              icon={"fa-solid:hand-holding-usd"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Fixed Deposits"
              total={totalFD.length}
              color="warning"
              icon={"healthicons:money-bag"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Recurring Deposits"
              total={totalRD.length}
              color="error"
              icon={"fa6-solid:money-bills"}
            />
          </Grid>
        </Grid>
        {/* KYC Approval Request Bucket*/}
        {dashboardLoading && <Loader />}
        <Grid container spacing={2}>
          {(role === "ROLE_FO" || role === "ROLE_ADMIN") && (
            <Grid item xs={12} md={6}>
              <div>
                {!appLoading && (
                  <Grid>
                    {((fd && fd.length > 0) ||
                      (rd && rd.length > 0) ||
                      (loan && loan.length > 0)) && (
                      <Card>
                        <CardHeader
                          title="KYC Approval Request"
                          style={{
                            backgroundColor: "#d1e9fc",
                            paddingBottom: "15px",
                          }}
                        />
                        <List style={{ overflow: "auto", maxHeight: 300 }}>
                          {fd &&
                            fd.map((fdData, m) => (
                              <div
                                key={m}
                                onClick={() =>
                                  navigate("/dashboard/app/KycApprovalForm", {
                                    state: {
                                      memberId: fdData.memberId,
                                      applicationId: fdData.applicationId,
                                      fdData: fdData,
                                    },
                                  })
                                }
                              >
                                <ListItem button divider>
                                  <ListItemText
                                    primary={"FD: " + fdData.applicationId}
                                    secondary={
                                      fdData.applicationDate
                                        ? fdData.applicationDate.substring(
                                            0,
                                            16
                                          )
                                        : ""
                                    }
                                  />
                                </ListItem>
                              </div>
                            ))}
                          {rd &&
                            rd.map((rdData, n) => (
                              <div
                                key={n}
                                onClick={() =>
                                  navigate("/dashboard/app/KycApprovalForm", {
                                    state: {
                                      memberId: rdData.memberId,
                                      applicationId: rdData.applicationId,
                                      rdDetails: rdData,
                                    },
                                  })
                                }
                              >
                                <ListItem button divider>
                                  <ListItemText
                                    primary={"RD: " + rdData.applicationId}
                                    secondary={
                                      rdData.applicationDate
                                        ? rdData.applicationDate.substring(
                                            0,
                                            16
                                          )
                                        : ""
                                    }
                                  />
                                </ListItem>
                              </div>
                            ))}
                          {loan &&
                            loan.map((loanData, o) => (
                              <div
                                key={o}
                                onClick={() =>
                                  navigate("/dashboard/app/KycApprovalForm", {
                                    state: {
                                      loanDetails: loanData,
                                      memberId: loanData.memberId,
                                      applicationId: loanData.applicationId,
                                    },
                                  })
                                }
                              >
                                <ListItem button divider>
                                  <ListItemText
                                    primary={"Loan: " + loanData.applicationId}
                                    secondary={
                                      loanData.applicationDate
                                        ? loanData.applicationDate.substring(
                                            0,
                                            16
                                          )
                                        : ""
                                    }
                                  />
                                </ListItem>
                              </div>
                            ))}
                        </List>
                      </Card>
                    )}
                  </Grid>
                )}
              </div>
            </Grid>
          )}

          {/* Application Approval Request  Bucket*/}
          {(role === "ROLE_BM" || role === "ROLE_ADMIN") && (
            <Grid item xs={12} md={6}>
              <div>
                {/* {kycLoading && <Loader />} */}
                {((kycArrovedFd && kycArrovedFd.length > 0) ||
                  (kycArrovedRd && kycArrovedRd.length > 0) ||
                  (kycArrovedLoan && kycArrovedLoan.length > 0)) && (
                  <Card>
                    <CardHeader
                      title="Application Approval Request"
                      style={{
                        backgroundColor: "#fff7cd",
                        paddingBottom: "15px",
                      }}
                    />
                    <List
                      style={{
                        bgcolor: "background.paper",
                        overflow: "auto",
                        maxHeight: 300,
                      }}
                    >
                      {kycArrovedFd &&
                        kycArrovedFd.map((fdData, i) => (
                          <div
                            key={i}
                            onClick={() =>
                              navigate(
                                "/dashboard/app/ApplicationApprovalForm",
                                {
                                  state: {
                                    memberId: fdData.memberId,
                                    applicationId: fdData.applicationId,
                                    fdData: fdData,
                                  },
                                }
                              )
                            }
                          >
                            <ListItem button divider>
                              <ListItemText
                                primary={"FD: " + fdData.applicationId}
                                secondary={
                                  fdData.applicationDate
                                    ? fdData.applicationDate.substring(0, 16)
                                    : ""
                                }
                              />
                            </ListItem>
                          </div>
                        ))}
                      {kycArrovedRd &&
                        kycArrovedRd.map((rdData, j) => (
                          <div
                            key={j}
                            onClick={() =>
                              navigate(
                                "/dashboard/app/ApplicationApprovalForm",
                                {
                                  state: {
                                    memberId: rdData.memberId,
                                    applicationId: rdData.applicationId,
                                    rdDetails: rdData,
                                  },
                                }
                              )
                            }
                          >
                            <ListItem button divider>
                              <ListItemText
                                primary={"RD: " + rdData.applicationId}
                                secondary={
                                  rdData.applicationDate
                                    ? rdData.applicationDate.substring(0, 16)
                                    : ""
                                }
                              />
                            </ListItem>
                          </div>
                        ))}
                      {kycArrovedLoan &&
                        kycArrovedLoan.map((loanData, k) => (
                          <div
                            key={k}
                            onClick={() =>
                              navigate(
                                "/dashboard/app/ApplicationApprovalForm",
                                {
                                  state: {
                                    memberId: loanData.memberId,
                                    applicationId: loanData.applicationId,
                                    loanDetails: loanData,
                                  },
                                }
                              )
                            }
                          >
                            <ListItem button divider>
                              <ListItemText
                                primary={"Loan: " + loanData.applicationId}
                                secondary={
                                  loanData.applicationDate
                                    ? loanData.applicationDate.substring(0, 16)
                                    : ""
                                }
                              />
                            </ListItem>
                          </div>
                        ))}
                    </List>
                  </Card>
                )}
              </div>
            </Grid>
          )}

          {/* Loan Disbursement Bucket */}
          {(role === "ROLE_BM" || role === "ROLE_ADMIN") && (
            <Grid item xs={12} md={6}>
              <div>
                {/* {kycLoading && <Loader />} */}
                {loanDisbApproved && loanDisbApproved.length > 0 && (
                  <Card>
                    <CardHeader
                      title="Loan Disbursement Bucket"
                      style={{
                        backgroundColor: "#e1bee7",
                        paddingBottom: "15px",
                      }}
                    />
                    <List
                      style={{
                        bgcolor: "background.paper",
                        overflow: "auto",
                        maxHeight: 300,
                      }}
                    >
                      {loanDisbApproved &&
                        loanDisbApproved.map((loanData, m) => (
                          <div
                            key={m}
                            onClick={() =>
                              navigate("/dashboard/app/LoanDisbursementForm", {
                                state: {
                                  memberId: loanData.memberId,
                                  applicationId: loanData.applicationId,
                                  applicationDate: loanData.applicationDate,
                                  loanAmount: loanData.loanAmount,
                                  processingFee: loanData.processingFee,
                                  branchName: loanData.branchName,
                                  loanPurpose: loanData.loanPurpose,
                                  totalDisbursementAmount:
                                    loanData.totalDisbursementAmount,
                                  totalInterestAmount:
                                    loanData.totalInterestAmount,
                                  dueAmount: loanData.dueAmount,
                                  loanInsuranceFee: loanData.loanInsuranceFee,
                                  tenure: loanData.tenure,
                                },
                              })
                            }
                          >
                            <ListItem button divider>
                              <ListItemText
                                primary={"Loan: " + loanData.applicationId}
                                secondary={
                                  loanData.applicationDate
                                    ? loanData.applicationDate.substring(0, 16)
                                    : ""
                                }
                              />
                            </ListItem>
                          </div>
                        ))}
                    </List>
                  </Card>
                )}
              </div>
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
