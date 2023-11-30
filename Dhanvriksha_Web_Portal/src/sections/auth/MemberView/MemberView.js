import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Card, CardHeader } from "@mui/material";
import Page from "../../../components/Page";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Grid, Paper, Tab } from "@mui/material";
import { TabPanel, TabContext, TabList, LoadingButton } from "@mui/lab";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getDataFromApi } from "../../../utils/apiCalls";
import SmallLoader from "src/components/SmallLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  Button,
} from "@mui/material";
import Container from "@mui/material/Container";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Scrollbar from "../../../components/Scrollbar";
import Loader from "../../../components/Loader";
import { defaultTheme } from "react-search-autocomplete/dist/config/config";
import { DOC_LINK } from "src/constants/config";
import { customStyles } from "src/components/style";
import { Icon } from "@iconify/react";
import { downloadFileFromURL } from "src/utils/common.util";
export default function MemberView() {
  const [expanded, setExpanded] = React.useState("panel1");

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

  /* Creating a styled component that is a wrapper around the MuiAccordionSummary component. */
  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeExpended = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  /* Using the useLocation hook to get the current location. */
  const location = useLocation();

  /* Setting the state of the component. */
  const [member, setMember] = useState([]);

  const [fd, setFd] = useState([]);
  const [rd, setRd] = useState([]);
  const [loan, setLoan] = useState([]);
  const [collectionTable, setcollectionTable] = useState({});
  const [loading, setLoading] = useState(true);
  const [adhaarDoc, setadhaarDoc] = useState("");
  const [KYC2Doc, setKYC2Doc] = useState("");
  const [totalCollection, setTotalCollection] = useState([]);
  const [tLoading, setTLoading] = useState(false);

  /* Getting the memberId from the state and then using it to get the member data from the API. */
  const getMember = () => {
    getDataFromApi(
      `getMemberbyid/${location.state.memberId.replace("/", "%2F")}`
    ).then((res) => {
      setMember(res);
      setLoading(false);
      setadhaarDoc(res[0].uploadAdhaarDocument);
      setKYC2Doc(res[0].kyc2DocumentUpload);
    });
  };

  const getFDDetailsByMember = (applicationId) => {
    getDataFromApi(
      `download-fd/${encodeURIComponent(
        location.state.memberId
      )}/${applicationId}`
    ).then((res) => {
      console.log(res);
    });
  };

  /* Calling the getDataFromApi function and passing in the memberId. */
  const getApplicationbyMemberId = () => {
    getDataFromApi(
      `appbyMemberId/${location.state.memberId.replace("/", "%2F")}`
    ).then((res) => {
      /*  */
      setFd(res.fd);
      setRd(res.rd);
      setLoan(res.loan);

      /* Iterating over the response object and calling the getCollectionTable function with the
      applicationId. */
      res.loan.map((loanDetails) => {
        getCollectionTable(loanDetails.applicationId);
      });
      res.rd.map((rdDetails) => {
        getCollectionTable(rdDetails.applicationId);
      });
      res.fd.map((fdDetails) => {
        getCollectionTable(fdDetails.applicationId);
      });
    });
  };

  /* Fetching data from the API and storing it in the state. */
  let arrAmount = [];
  let sumObj = {};
  let tempObj = {};
  let add = 0;
  const getCollectionTable = (applicationId) => {
    getDataFromApi(`getCollection/${applicationId}`).then((res) => {
      res.map((collectionA) => {
        arrAmount.push(collectionA.collectionAmount);
        if (applicationId in sumObj) {
          add = sumObj[applicationId];
          sumObj[applicationId] = add + collectionA.collectionAmount;
        } else {
          sumObj[applicationId] = collectionA.collectionAmount;
        }
      });

      setTotalCollection(sumObj);

      tempObj[applicationId] = res;
      setcollectionTable(tempObj);
    });
  };

  /* Calling the getMember() and getApplicationbyMemberId() functions when the component is mounted. */
  useEffect(() => {
    getMember();
    getApplicationbyMemberId();
    getFDDetailsByMember();
    return () => {};
  }, []);

  /**
   * It opens a new window, copies the head and body of the current window into the new window, then
   * copies the contents of the element with the id "fdCollection" into the new window's body, then
   * prints the new window, then closes the new window.
   * called on FD Accordian
   */
  async function print_details(applicationId) {
    setTLoading(true);
    getDataFromApi(
      `download-fd/${encodeURIComponent(
        location.state.memberId
      )}/${applicationId}`
    ).then((res) => {
      if (res.success) downloadFileFromURL(res.data.pdfUrl);
      setTLoading(false);
    });
  }

  return (
    <Page title="Member View">
      <Container maxWidth="lg">
        <div>
          <CardHeader
            title="Member Detail View"
            style={{ paddingBottom: "20px" }}
          />

          {loading && <Loader />}
          {!loading && (
            <Card
              sx={{
                "& > *": {
                  m: 2,
                },
              }}
            >
              <CardHeader title="Member Details" />
              {member &&
                member.length > 0 &&
                member.map((data, o) => (
                  <div key={o}>
                    <Card
                      sx={{
                        alignItems: "center",
                        "& > *": {
                          m: 1,
                        },
                        marginBottom: 2,
                        paddingBottom: 2,
                      }}
                    >
                      <Box sx={{ width: "100%", m: 3 }}>
                        <Grid
                          container
                          rowSpacing={1}
                          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>Member ID: </b>
                              {data.memberId}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>Member Name:</b> {data.applicantName}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>DOB:</b> {data.age ? data.age : data.dob}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>F/H Name:</b> {data.fatherName}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>Branch:</b> {data.branch.branchName}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>Area:</b> {data.area ? data.area.areaName : ""}
                            </div>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <div>
                              {" "}
                              <b> Referred By FO:</b> {data.referedBy}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              {" "}
                              <b>Marital Status:</b> {data.MaritalStatus}
                            </div>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <div>
                              {" "}
                              <b>Family Annual Income(Rs.):</b>{" "}
                              {data.familyAnnualIncome}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              {" "}
                              <b>Resident:</b> {data.resident}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>Mobile:</b> {data.mobile}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>Pending Loan from MFIs(Count):</b>{" "}
                              {data.pendingmfic}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>Pending Loan from MFIs(Amount):</b>{" "}
                              {data.pendingmficAmount}
                            </div>
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                    <CardHeader title="KYC Details" />
                    <Card
                      sx={{
                        alignItems: "center",
                        "& > *": {
                          m: 1,
                        },
                        marginBottom: 2,
                        paddingBottom: 2,
                      }}
                    >
                      <Box sx={{ width: "100%", m: 3 }}>
                        <Grid
                          container
                          rowSpacing={1}
                          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>KYC Doc 1: </b> Aadhaar Card
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>KYC Doc 2:</b> {data.kyc2}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>KYC ID 1: </b>
                              {data.adhaarCard}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <b>KYC ID 2: </b>
                              {""}
                              {data.kyc2 == "Pan Card"
                                ? data.panCard
                                : data.kyc2 == "Adhaar Card"
                                ? data.adhaarCard
                                : data.voterId}
                            </div>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{ marginLeft: "-12px" }}
                          >
                            <div>
                              <a
                                href={`${DOC_LINK}/uploads/${adhaarDoc}`}
                                target="_blank"
                                style={customStyles.anchorTag}
                              >
                                <Icon
                                  icon="fluent:tab-arrow-left-20-filled"
                                  hFlip={true}
                                  width={40}
                                  height={22}
                                  // style={customStyles.documentOpenIcon}
                                />
                                <Typography
                                  sx={{ marginTop: -3.5, marginLeft: 5 }}
                                >
                                  Open Aadhaar Document
                                </Typography>
                              </a>
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div>
                              <a
                                href={`${DOC_LINK}/uploads/${KYC2Doc}`}
                                target="_blank"
                                style={customStyles.anchorTag}
                              >
                                <Icon
                                  icon="fluent:tab-arrow-left-20-filled"
                                  hFlip={true}
                                  width={40}
                                  height={22}
                                />
                                <Typography
                                  sx={{ marginTop: -3.5, marginLeft: 5 }}
                                >
                                  Open KYC ID 2
                                </Typography>
                              </a>
                            </div>
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  </div>
                  // </Card>
                ))}

              <Card
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  "& > *": {
                    m: 2,
                  },
                }}
              >
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab label="FD" value="1" />
                        <Tab label="RD" value="2" />
                        <Tab label="Loan" value="3" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      {fd &&
                        fd.length > 0 &&
                        fd.map((fddata, i) => (
                          <div key={i}>
                            <Accordion
                              onChange={handleChangeExpended("panel1")}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography sx={{ width: "50%" }}>
                                  {fddata.applicationId}
                                </Typography>
                                <Typography
                                  sx={{
                                    width: "50%",
                                    display: "flex",
                                    alignSelf: "flex-end",
                                  }}
                                >
                                  Status: {fddata.fdStatus}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box sx={{ width: "100%" }} id="fdCollection">
                                  <Grid
                                    container
                                    rowSpacing={1}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                  >
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Application Date: </b>
                                        {fddata.applicationDate.substring(
                                          0,
                                          16
                                        )}{" "}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Tenure(Months): </b>
                                        {fddata.tenure}{" "}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>FD Amount(Rs.): </b>
                                        {fddata.fdAmount}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Interest Rate: </b>
                                        {fddata.interestRate}%
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Maturity Date: </b>{" "}
                                        {fddata.maturityDate}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Maturity Amount(Rs.): </b>{" "}
                                        {fddata.maturityAmount}
                                      </div>
                                    </Grid>
                                  </Grid>
                                </Box>
                                <Card
                                  style={{
                                    alignSelf: "center",
                                    padding: "10px",
                                    marginLeft: "30px",
                                    margin: "10px",
                                  }}
                                >
                                  {Object.keys(collectionTable)?.length > 0 && (
                                    <div>
                                      <CardHeader
                                        title="Collection Status"
                                        style={{ paddingBottom: "20px" }}
                                      />
                                      <Container>
                                        <TableContainer component={Paper}>
                                          <Table
                                            sx={{ minWidth: 650 }}
                                            aria-label="simple table"
                                          >
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>
                                                  Collection Date
                                                </TableCell>
                                                <TableCell>
                                                  Collected Amount(Rs.)
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                            {collectionTable[
                                              fddata.applicationId
                                            ]?.map((data, id) => (
                                              <TableBody key={id}>
                                                <TableRow
                                                  sx={{
                                                    "&:last-child td, &:last-child th":
                                                      {
                                                        border: 0,
                                                      },
                                                  }}
                                                >
                                                  <TableCell
                                                    component="th"
                                                    scope="row"
                                                  >
                                                    {data.collectionDate.substring(
                                                      0,
                                                      16
                                                    )}
                                                  </TableCell>
                                                  <TableCell>
                                                    {data.collectionAmount}
                                                  </TableCell>
                                                </TableRow>
                                              </TableBody>
                                            ))}
                                          </Table>
                                        </TableContainer>
                                      </Container>
                                    </div>
                                  )}
                                </Card>

                                <div id="printbutton">
                                  <Stack
                                    direction="row"
                                    justifyContent="right"
                                    mt={2}
                                    mb={1}
                                    position="relative"
                                  >
                                    {tLoading && <SmallLoader />}
                                    {!tLoading && (
                                      <LoadingButton
                                        sx={{ my: 1, mx: 3 }}
                                        size="small"
                                        variant="contained"
                                        onClick={() => {
                                          print_details(fddata.applicationId);
                                        }}
                                      >
                                        Download
                                      </LoadingButton>
                                    )}
                                  </Stack>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        ))}
                    </TabPanel>
                    <TabPanel value="2">
                      {rd &&
                        rd.length > 0 &&
                        rd.map((rddata, j) => (
                          <div key={j}>
                            <Accordion
                              onChange={handleChangeExpended("panel1")}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography sx={{ width: "50%" }}>
                                  {rddata.applicationId}
                                </Typography>
                                <Typography
                                  sx={{
                                    width: "50%",
                                    display: "flex",
                                    alignSelf: "flex-end",
                                  }}
                                >
                                  Status: {rddata.rdStatus}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box sx={{ width: "100%" }}>
                                  <Grid
                                    container
                                    rowSpacing={1}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                  >
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Application Date: </b>
                                        {rddata.applicationDate.substring(
                                          0,
                                          16
                                        )}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Tenure Duration: </b>{" "}
                                        {rddata.tenure
                                          ? rddata.tenure
                                          : rddata.dailyTenure}
                                        {rddata.rdTenure == "Monthly"
                                          ? " Month"
                                          : " Days"}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>RD Amount(Rs.): </b>
                                        {rddata.rdAmount}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Interest Rate: </b>
                                        {rddata.interestRate}%
                                      </div>
                                    </Grid>
                                  </Grid>
                                </Box>
                                <Card
                                  style={{
                                    alignSelf: "center",
                                    padding: "10px",
                                    marginLeft: "30px",
                                    margin: "10px",
                                  }}
                                >
                                  {Object.keys(collectionTable)?.length > 0 && (
                                    <div>
                                      <CardHeader
                                        title="Collection Status"
                                        style={{ paddingBottom: "20px" }}
                                      />
                                      <Container>
                                        <TableContainer component={Paper}>
                                          <Table
                                            sx={{ minWidth: 650 }}
                                            aria-label="simple table"
                                          >
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>
                                                  Collection Date
                                                </TableCell>
                                                <TableCell>
                                                  Collected Amount(Rs.)
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                            {collectionTable[
                                              rddata.applicationId
                                            ]?.map((data, id) => (
                                              <TableBody>
                                                <TableRow
                                                  sx={{
                                                    "&:last-child td, &:last-child th":
                                                      {
                                                        border: 0,
                                                      },
                                                  }}
                                                >
                                                  <TableCell
                                                    component="th"
                                                    scope="row"
                                                  >
                                                    {data.collectionDate.substring(
                                                      0,
                                                      16
                                                    )}
                                                  </TableCell>
                                                  <TableCell>
                                                    {data.collectionAmount}
                                                  </TableCell>
                                                </TableRow>
                                              </TableBody>
                                            ))}
                                          </Table>
                                        </TableContainer>
                                      </Container>
                                    </div>
                                  )}
                                </Card>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        ))}
                    </TabPanel>

                    <TabPanel value="3">
                      {loan &&
                        loan.length > 0 &&
                        loan.map((loandata, k) => (
                          <div key={k}>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography sx={{ width: "50%" }}>
                                  {loandata.applicationId}
                                </Typography>
                                <Typography
                                  sx={{
                                    width: "50%",
                                    display: "flex",
                                    alignSelf: "flex-end",
                                  }}
                                >
                                  Status: {loandata.loanStatus}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Container sx={{ width: "100%" }}>
                                  <Grid
                                    container
                                    rowSpacing={1}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                  >
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Application Date: </b>
                                        {loandata.applicationDate.substring(
                                          0,
                                          16
                                        )}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Tenure(Weeks): </b>
                                        {loandata.tenure}{" "}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Loan Amount(Rs.): </b>
                                        {loandata.loanAmount}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Total Interest Amount(Rs.): </b>
                                        {loandata.totalInterestAmount}
                                      </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Disbursed Amount(Rs.): </b>
                                        {loandata.disbursedAmount
                                          ? loandata.disbursedAmount
                                          : 0}
                                      </div>
                                    </Grid>
                                  </Grid>
                                </Container>
                                {Object.keys(collectionTable).length > 0 && (
                                  <Card
                                    style={{
                                      alignSelf: "center",
                                      padding: "10px",
                                      marginLeft: "30px",
                                      margin: "10px",
                                    }}
                                  >
                                    <div>
                                      <CardHeader
                                        title="Collection Status"
                                        style={{ paddingBottom: "20px" }}
                                      />
                                      <Scrollbar>
                                        <Container>
                                          <TableContainer component={Paper}>
                                            <Table
                                              sx={{ minWidth: 650 }}
                                              aria-label="simple table"
                                            >
                                              <TableHead>
                                                <TableRow>
                                                  <TableCell>
                                                    Collection Date
                                                  </TableCell>
                                                  <TableCell>
                                                    Collected Amount(Rs.)
                                                  </TableCell>
                                                </TableRow>
                                              </TableHead>
                                              {collectionTable[
                                                loandata.applicationId
                                              ]?.map((data, id) => (
                                                <TableBody key={id}>
                                                  <TableRow
                                                    sx={{
                                                      "&:last-child td, &:last-child th":
                                                        {
                                                          border: 0,
                                                        },
                                                    }}
                                                  >
                                                    <TableCell
                                                      component="th"
                                                      scope="row"
                                                    >
                                                      {data.collectionDate.substring(
                                                        0,
                                                        16
                                                      )}
                                                    </TableCell>
                                                    <TableCell>
                                                      {data.collectionAmount}
                                                    </TableCell>
                                                  </TableRow>
                                                </TableBody>
                                              ))}
                                            </Table>
                                          </TableContainer>
                                        </Container>
                                      </Scrollbar>
                                    </div>
                                  </Card>
                                )}
                                <Container sx={{ width: "100%" }}>
                                  <Grid
                                    container
                                    rowSpacing={1}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                  >
                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Due Amount(Rs.): </b>
                                        {loandata.loanAmount -
                                        totalCollection[loandata.applicationId]
                                          ? loandata.loanAmount -
                                            totalCollection[
                                              loandata.applicationId
                                            ]
                                          : 0}
                                      </div>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                      <div>
                                        <b>Total Collected Amount(Rs.): </b>
                                        {totalCollection[loandata.applicationId]
                                          ? totalCollection[
                                              loandata.applicationId
                                            ]
                                          : 0}
                                      </div>
                                    </Grid>
                                  </Grid>
                                </Container>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        ))}
                    </TabPanel>
                  </TabContext>
                </Box>
              </Card>
            </Card>
          )}
        </div>
      </Container>
    </Page>
  );
}
