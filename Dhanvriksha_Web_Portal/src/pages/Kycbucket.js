import { Container, Stack, Typography } from "@mui/material";
import Page from "../components/Page";

import React from "react";

import KycApprovalList from "./KycApprovaList";
export default function DNLoan() {
  return (
    <Page title="">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            KYC Approval Bucket
          </Typography>
        </Stack>
        <KycApprovalList />
      </Container>
    </Page>
  );
}
