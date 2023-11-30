import { Container, Stack, Typography } from "@mui/material";
import Page from "../components/Page";
import React from "react";
import { LoanForm } from "../sections/auth/NewLoan";

export default function DNLoan() {
  return (
    <Page title="New Loan Application">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Loan Application
          </Typography>
        </Stack>
        <LoanForm />
      </Container>
    </Page>
  );
}
