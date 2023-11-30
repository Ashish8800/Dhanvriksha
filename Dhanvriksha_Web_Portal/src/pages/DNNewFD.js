import { Container, Stack, Typography } from "@mui/material";
import Page from "../components/Page";

import React from "react";

import NewFDForm from "../sections/auth/NewFD/NewFDForm";
export default function DNNewFD() {
  return (
    <Page title="New FD Application">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            FD Application
          </Typography>
        </Stack>
        <NewFDForm />
      </Container>
    </Page>
  );
}
