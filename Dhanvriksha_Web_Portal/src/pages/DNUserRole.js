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
import  AddRoleForm from "../sections/auth/DNRole/AddRoleForm";
export default function DNLoan() {
  return (
    <Page title="User Role">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
           <Typography variant="h4" gutterBottom>
            Add Role
          </Typography>
        </Stack>
        <AddRoleForm />
      </Container>
    </Page>
  );
}
