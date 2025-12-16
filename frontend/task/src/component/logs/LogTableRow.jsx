import React from "react";
import { TableRow, TableCell, Avatar, Chip, Typography, Stack } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const getActionConfig = (action) => {
  if (action.includes("created")) {
    return {
      color: "success",
      className: "bg-green-100 text-green-800 font-semibold",
      icon: <AddIcon className="text-green-700" fontSize="small" />,
    };
  } else if (action.includes("updated")) {
    return {
      color: "info",
      className: "bg-blue-100 text-blue-800 font-semibold",
      icon: <EditIcon className="text-blue-700" fontSize="small" />,
    };
  } else if (action.includes("deleted")) {
    return {
      color: "error",
      className: "bg-red-100 text-red-800 font-semibold",
      icon: <DeleteIcon className="text-red-700" fontSize="small" />,
    };
  }
  return {
    color: "default",
    className: "bg-gray-100 text-gray-800 font-semibold",
    icon: null,
  };
};

export default function LogTableRow({ log }) {
  const actionConfig = getActionConfig(log.action);

  return (
    <TableRow className="hover:bg-gray-50 transition-colors duration-200">
      <TableCell>
        <Typography variant="body2" className="text-gray-900 font-medium">
          {new Date(log.timestamp).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </TableCell>

      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 font-bold shadow-md"
          >
            {log.user.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" className="font-semibold text-gray-900">
            {log.user}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Chip
          icon={actionConfig.icon}
          label={log.action}
          size="small"
          className={`${actionConfig.className} px-1`}
        />
      </TableCell>

      <TableCell>
        <Chip
          label={`#${log.task_id}`}
          size="small"
          variant="outlined"
          className="font-mono font-semibold border-2 border-gray-300 text-gray-700"
        />
      </TableCell>
    </TableRow>
  );
}
