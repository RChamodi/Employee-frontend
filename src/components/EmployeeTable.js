import React from "react";
import {
    Table, TableHead, TableRow, TableCell,
    TableBody, Button
} from "@mui/material";


function EmployeeTable({ employees, onEdit, onDelete }) {

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>DOB</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {employees.map(emp => (
                    <TableRow key={emp.id}>
                        <TableCell>{emp.name}</TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{emp.dateOfBirth?.substring(0, 10)}</TableCell>
                        <TableCell>{emp.employeeSkills?.map(es => es.skill?.name).join(", ")}
                        </TableCell>

                        <TableCell>
                            <Button onClick={() => onEdit(emp)}>Edit</Button>

                            <Button
                                color="error"
                                onClick={() => onDelete(emp.id)}
                            >
                                Delete
                            </Button>
                        </TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default EmployeeTable;