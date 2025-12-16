import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import LogsTableHeader from "./LogsTableHeader";
import LogTableRow from "./LogTableRow";

export default function LogsTable({ logs }) {
  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      className="border border-gray-200 rounded-2xl overflow-hidden"
    >
      <Table>
        <LogsTableHeader />
        <TableBody>
          {logs.map((log) => (
            <LogTableRow key={log.id} log={log} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
