
import { Card, Link, Container, Typography, Stack } from "@mui/material";
// hooks

import React, { useState, useEffect } from "react";
// components
import Page from "../components/Page";

// sections
import AddMembForm from "../sections/auth/AddNewMember/AddMembform";

// ----------------------------------------------------------------------


export default function AddNewMember() {


  return (
    <Page title="New Member Application">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom align="center">
            Add New Member
          </Typography>
        </Stack>
     
        <AddMembForm />
      </Container>
    </Page>
  );
}
