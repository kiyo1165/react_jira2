import React from "react";
import { useSelector } from "react-redux";
import { selectSelectedTask } from "./taskSlice";
import {} from "@mui/icons-material";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

const TaskDisplay: React.FC = () => {
  const selectedTask = useSelector(selectSelectedTask);
  const rows = [
    { item: "Task", data: selectedTask.task },
    { item: "Description", data: selectedTask.description },
    { item: "Criteria", data: selectedTask.criteria },
    { item: "Owner", data: selectedTask.owner_username },
    { item: "Responsible", data: selectedTask.responsible_username },
    { item: "Estimate [day]", data: selectedTask.estimate },
    { item: "Category", data: selectedTask.category_item },
    { item: "Sutatus", data: selectedTask.status_name },
    { item: "Created", data: selectedTask.created_at },
    { item: "Updated", data: selectedTask.updated_at },
  ];
  if (!selectedTask.task) {
    return null;
  }

  return (
    <>
      <h2>Task detail</h2>
      <Table>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={row.item}>
              <TableCell align="center">
                <strong>{row.item}</strong>
              </TableCell>
              <TableCell>{row.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TaskDisplay;
