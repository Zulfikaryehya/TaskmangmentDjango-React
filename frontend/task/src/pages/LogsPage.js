import React from "react";
import { Box, CircularProgress, Container, Paper } from "@mui/material";
import Header from "../component/Header";
import useLogs from "../hooks/useLogs";
import LogsPageHeader from "../component/logs/LogsPageHeader";
import ErrorAlert from "../component/logs/ErrorAlert";
import EmptyLogsState from "../component/logs/EmptyLogsState";
import LogsTable from "../component/logs/LogsTable";

export default function LogsPage() {
  const { logs, error, loading } = useLogs();

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />

      <Container maxWidth="xl" className="py-8">
        <Paper 
          elevation={8} 
          className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
        >
          {/* Header Section */}
          <LogsPageHeader totalLogs={logs.length} />

          {/* Error Message */}
          <ErrorAlert error={error} />

          {/* Table Section */}
          <Box className="p-8">
            {loading ? (
              <Box className="flex flex-col justify-center items-center py-20">
                <CircularProgress size={70} thickness={4} className="mb-4" />
                <p className="text-gray-600 text-lg font-semibold">Loading activity logs...</p>
              </Box>
            ) : logs.length === 0 && !error ? (
              <EmptyLogsState />
            ) : (
              <LogsTable logs={logs} />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}