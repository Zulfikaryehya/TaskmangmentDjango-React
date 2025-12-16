import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { 
  Description as DescriptionIcon,
  InfoOutlined as InfoIcon 
} from "@mui/icons-material";

export default function EmptyLogsState() {
  return (
    <Box className="flex items-center justify-center py-16">
      <Paper 
        elevation={0}
        className="max-w-md p-8 text-center border-2 border-dashed border-gray-300 rounded-3xl bg-gradient-to-br from-gray-50 to-white"
      >
        <Box className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
          <DescriptionIcon className="text-blue-600 text-6xl" />
        </Box>
        
        <Typography variant="h5" className="font-bold text-gray-800 mb-2">
          No Activity Logs Yet
        </Typography>
        
        <Typography variant="body1" className="text-gray-600 mb-4 leading-relaxed">
          Activity logs will appear here as tasks are created, updated, or deleted.
        </Typography>

        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          justifyContent="center"
          className="bg-blue-50 rounded-xl px-4 py-3 mt-4"
        >
          <InfoIcon className="text-blue-600 text-xl" />
          <Typography variant="body2" className="text-blue-700 font-medium">
            Start managing tasks to see logs here
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
