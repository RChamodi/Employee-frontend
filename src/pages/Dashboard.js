import React, { useEffect, useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";
import { getEmployees, deleteEmployee } from "../api/employeeApi";
import { Container, Typography,Box,Paper } from "@mui/material";
import { toast } from "react-toastify";

function Dashboard() {

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const loadEmployees = async () => {
        const res = await getEmployees();
        setEmployees(res.data);
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleDelete = async (id) => {
        await deleteEmployee(id);
        toast.success("Employee deleted successfully!");
        loadEmployees();
    };

    return (
        <Container maxWidth="lg" sx={{mt:4}}>

            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <EmployeeForm
                selectedEmployee={selectedEmployee}
                refresh={loadEmployees}
                clearSelection={() => setSelectedEmployee(null)}
            />
            </Paper>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
            Employees List
            </Typography>
            <EmployeeTable
                employees={employees}
                onEdit={setSelectedEmployee}
                onDelete={handleDelete}
            />
            </Paper>

        </Container>
    );
}

export default Dashboard;