import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
import { Stack, Typography, Button, Card } from "@mui/material";

import Page from "../components/Page";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";

export default function DisableRole() {
  return (
    <Page title="DisableRole">
      <div>
        <form sx={{ m: 1 }}>
          <Card style={{ alignSelf: "center", width: "90.1%", padding: "5px" }}>
            <Box
              sx={{
                "& .MuiTextField-root": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
                 <Typography>
                DisableRole 
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  required
                  id="Role Display Name"
                  label="Role Display Name"
                  name="roledisplayname"
                ></TextField>

                <Button
                  style={{
                    marginTop: "9px",
                    marginRight: "20px",
                    height: "55px",
                  }}
                  type="Submit"
                  variant="contained"
                >
                  submit
                </Button>
              </Stack>
            </Box>
          </Card>
        </form>
      </div>
    </Page>
  );
}