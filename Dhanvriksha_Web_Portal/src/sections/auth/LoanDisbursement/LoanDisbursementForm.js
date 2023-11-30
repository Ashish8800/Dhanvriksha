import React, { useState, useEffect } from "react";

//mui
import {
  Stack,
  Typography,
  Button,
  Card,
  Grid,
  Container,
  ButtonGroup,
  Box,
  TextField,
} from "@mui/material";
import Page from "../../../components/Page";
import { useNavigate, useLocation } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getDataFromApi, postDataToApi } from "../../../utils/apiCalls";
import CardHeader from "@mui/material/CardHeader";
import swal from "sweetalert";
import Loader from "../../../components/Loader";

export default function LoanDisbursementForm() {
  //Global Variables
  const navigate = useNavigate();
  const { state } = useLocation();
  const memberId = state.memberId;
  const applicationId = state.applicationId;

  // React States
  const [member, setMember] = useState([]);
  const [name, setName] = useState("");
  const [branch, setBranch] = useState();
  const [loading, setLoading] = useState(true);

  //React Effects
  useEffect(() => {
    getMemberId(state.memberId);
    setName(sessionStorage.getItem("name"));
  }, []);

  /**
   * Getting Member Details from Database
   * @function getMemberId
   * @param {string} id - getting details of the passed memberId
   */

  const getMemberId = (id) => {
    getDataFromApi("getMemberbyid/" + id.replace("/", "%2F")).then(
      (response) => {
        setMember(response);
        setLoading(false);
        response.map((data) => {
          setBranch(data.branch._id);
        });
        // setBranch(response.branch)
      }
    );
  };

  //Yup Validation
  const LoanDisbursementSchema = Yup.object().shape({
    disbursedAmount: Yup.number()
      .typeError("Disbursement Amount should be a number")
      .required("Disbursement Amount is required")
      .min(0, "Disbursement amount should be more than 0"),
    disbursementDate: Yup.string()
      .typeError("disbursement Date cannot be empty ")
      .required("disbursement Date cannot be empty"),

    transactional_Details: Yup.string()
      .min(4, "your Comment should be of atleast 4 character")
      .matches(
        /^[a-z,A-Z\s,%,,&,*,@, .]+$/,
        "Transactional Details should be a string"
      )
      .required("Transactional Details is required"),
  });
  const formik = useFormik({
    initialValues: {
      applicationId: state.applicationId,
      memberId: state.memberId,
      disbursedAmount: "",
      disbursementDate: "",
      dueAmount: "",
      transactional_Details: "",
    },
    validationSchema: LoanDisbursementSchema,
    onSubmit: (values) => {
      values.branch = branch;

      postDataToApi(
        "postloanDisbursementApplication",
        JSON.stringify(values)
      ).then((res) => {
        swal(
          res.success ? "Success!" : "Error!",
          res.message,
          res.success ? "success" : "error"
        );
        if (res.success) {
          navigate("/dashboard/Loan", { replace: true });
        }
      });
    },
  });
  const { isSubmitting } = formik;

  const totalDisbursementAmount =
    state.loanAmount +
    state.totalInterestAmount -
    state.processingFee -
    state.loanInsuranceFee;

  // Components Return

  return (
    <Page title={"Loan Disbursement (" + applicationId + ")"}>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Loan Disbursement ({applicationId})
          </Typography>
        </Stack>

        <form onSubmit={formik.handleSubmit} sx={{ margin: 1 }}>
          {loading && <Loader />}
          <Card
            sx={{
              // display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > *": {
                m: 2,
              },
            }}
          >
            {member.map((data, i) => (
              <div key={i}>
                <Card
                  sx={{
                    marginBottom: 2,
                    paddingBottom: 2,
                  }}
                >
                  <CardHeader title="Loan Details" sx={{ p: 2 }}></CardHeader>
                  <Container>
                    <Grid
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Member ID:</b> {memberId}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Application Date:</b>{" "}
                          {state.applicationDate
                            ? state.applicationDate.substring(0, 16)
                            : ""}{" "}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Member Name:</b> {data.applicantName}{" "}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Referred by FO:</b> {data.referedBy}{" "}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Branch Name:</b> {data.branch.branchName}{" "}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Loan Purpose:</b> {state.loanPurpose}{" "}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Loan Amount(Rs.):</b> {state.loanAmount}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Processing Fee (Rs.):</b> {state.processingFee}
                        </div>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <div>
                          <b> Total Disbursement Amount(Rs.): </b>{" "}
                          {totalDisbursementAmount}
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div>
                          <b>Loan Insurance Fee (Rs.):</b>{" "}
                          {state.loanInsuranceFee}
                        </div>
                      </Grid>
                    </Grid>
                  </Container>
                </Card>

                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12} md={6}>
                    <TextField
                      // required
                      size="small"
                      fullWidth
                      id="disbursedAmount"
                      name="disbursedAmount"
                      label="Disbursed Amount"
                      value={formik.values.disbursedAmount}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.disbursedAmount &&
                        Boolean(formik.errors.disbursedAmount)
                      }
                      helperText={
                        formik.touched.disbursedAmount &&
                        formik.errors.disbursedAmount
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        // required
                        inputFormat="dd/MM/yyyy"
                        fullWidth
                        label="Disbursement Date*"
                        value={formik.values.disbursementDate}
                        onChange={(value) =>
                          formik.setFieldValue(
                            "disbursementDate",
                            value.toDateString()
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            fullWidth
                            {...params}
                            error={
                              formik.touched.disbursementDate &&
                              Boolean(formik.errors.disbursementDate)
                            }
                            helperText={
                              formik.touched.disbursementDate &&
                              formik.errors.disbursementDate
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  {/*================================================ Add TransactionDetails In the Loan Disbursment Box ================================= */}
                  <Grid item xs={12} md={12} sm={12}>
                    <TextField
                      label="Transaction Details"
                      fullWidth
                      required
                      id="transactional_Details"
                      size="small"
                      name="transactional_Details"
                      value={formik.values.transactional_Details}
                      onChange={formik.handleChange}
                      multiline={4}
                      error={
                        formik.touched.transactional_Details &&
                        Boolean(formik.errors.transactional_Details)
                      }
                      helperText={
                        formik.touched.transactional_Details &&
                        formik.errors.transactional_Details
                      }
                    />

                    {/* ============================================================================================================================================= */}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      "& > *": {
                        m: 1,
                      },
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      aria-label="outlined button group"
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        loading={isSubmitting.toString()}
                      >
                        Loan Disburse
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Grid>
              </div>
            ))}
          </Card>
        </form>
      </Container>
    </Page>
  );
}
