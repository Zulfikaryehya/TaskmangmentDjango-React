import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { 
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon 
} from "@mui/icons-material";

export default function LogsPageHeader({ totalLogs }) {
  return (
    <Box className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={3}
        className="relative z-10"
      >
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" className="mb-2">
            <Box className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <AssessmentIcon className="text-white text-3xl" />
            </Box>
            <Typography variant="h3" className="text-white font-bold">
              Activity Logs
            </Typography>
          </Stack>
          <Typography variant="body1" className="text-blue-100 font-medium">
            Track all task activities and changes in real-time
          </Typography>
          <Stack direction="row" spacing={1} className="mt-3">
            <Chip 
              icon={<TrendingUpIcon className="text-white" />}
              label="Live Tracking"
              size="small"
              className="bg-white bg-opacity-25 text-white font-semibold backdrop-blur-sm border border-white border-opacity-30"
            />
          </Stack>
        </Box>

        <Box className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white border-opacity-30 text-center min-w-[140px]">
          <Typography variant="caption" className="text-blue-100 font-semibold uppercase tracking-wider">
            Total Logs
          </Typography>
          <Typography variant="h2" className="text-white font-bold mt-1">
            {totalLogs}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
