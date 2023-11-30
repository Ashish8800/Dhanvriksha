// import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container, Stack, Typography, Button, Card } from "@mui/material";
import Page from "../components/Page";
import { Link as RouterLink } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import { BASE_URL } from "../constants/config";
import axios, { Axios } from "axios";
import React, { useEffect, useState } from "react";

import RDForm from "../sections/auth/DNRD/RDForm";
export default function DNRecurringDeposit() {

  return (
    <Page title="Recurring Application">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            RD Application
          </Typography>
        </Stack>
        <RDForm />
      </Container>
    </Page>
  );
}
