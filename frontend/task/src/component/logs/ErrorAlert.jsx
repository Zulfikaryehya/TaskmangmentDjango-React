import React from "react";
import { Alert, AlertTitle, Collapse } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";

export default function ErrorAlert({ error }) {
  return (
    <Collapse in={!!error}>
      <div className="mx-8 mt-6">
        <Alert 
          severity="error" 
          icon={<ErrorIcon />}
          className="rounded-xl border-l-4 border-red-600 shadow-lg"
        >
          <AlertTitle className="font-bold">Error Loading Logs</AlertTitle>
          {error}
        </Alert>
      </div>
    </Collapse>
  );
}
