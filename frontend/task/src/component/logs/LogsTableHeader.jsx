import React from "react";
import { TableHead, TableRow, TableCell, Box, Typography } from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  FlashOn as FlashOnIcon,
  Label as LabelIcon,
} from "@mui/icons-material";

const HeaderCell = ({ icon: Icon, label }) => (
  <TableCell className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
    <Box className="flex items-center gap-2">
      <Icon className="text-gray-600 text-lg" />
      <Typography variant="caption" className="font-bold text-gray-700 uppercase tracking-wider">
        {label}
      </Typography>
    </Box>
  </TableCell>
);

export default function LogsTableHeader() {
  return (
    <TableHead>
      <TableRow>
        <HeaderCell icon={AccessTimeIcon} label="Timestamp" />
        <HeaderCell icon={PersonIcon} label="User" />
        <HeaderCell icon={FlashOnIcon} label="Action" />
        <HeaderCell icon={LabelIcon} label="Task ID" />
      </TableRow>
    </TableHead>
  );
}
