// @mui
import { Container, Typography, Stack } from "@mui/material";
import Page from "../components/Page";
import AddEmpForm from "../sections/auth/AddNewEmployee/AddEmpform";
import { useLocation } from "react-router-dom";

export default function AddNewEmp(props) {
  const location = useLocation();
  // console.log(props, " props");
  // console.log(location, " useLocation Hook");
  const data = location.state?.data;
  return (
    <Page title="Add New Employee">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom align="center">
            Add New Employee
          </Typography>
        </Stack>
        <AddEmpForm objEmployees={data} />
      </Container>
    </Page>
  );
}
