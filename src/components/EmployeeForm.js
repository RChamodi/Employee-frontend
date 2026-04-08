import React, { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Box,
    Typography
} from "@mui/material";
import validator from "validator";
import { createEmployee, updateEmployee, getSkills } from "../api/employeeApi";
import { toast } from "react-toastify";

function EmployeeForm({ selectedEmployee, refresh, clearSelection }) {

    const [form, setForm] = useState({
        name: "",
        email: "",
        dateOfBirth: "",
        skillIds: []
    });

    const [skills, setSkills] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadSkills();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            setForm({
                name: selectedEmployee.name,
                email: selectedEmployee.email,
                dateOfBirth: selectedEmployee.dateOfBirth?.substring(0, 10),
                skillIds: selectedEmployee.employeeSkills?.map(s => s.skillId) || []
            });
        }
    }, [selectedEmployee]);

    const loadSkills = async () => {
        const res = await getSkills();
        setSkills(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleSkill = (id) => {
        if (form.skillIds.includes(id)) {
            setForm({
                ...form,
                skillIds: form.skillIds.filter(s => s !== id)
            });
        } else {
            setForm({
                ...form,
                skillIds: [...form.skillIds, id]
            });
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};

    if (!form.name.trim()) {
        tempErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
        tempErrors.email = "Email is required";
    } else if (!validator.isEmail(form.email)) {
        tempErrors.email = "Invalid email format";
    }

    if (!form.dateOfBirth) {
        tempErrors.dateOfBirth = "Date of birth is required";
    }

    if (form.skillIds.length === 0) {
        tempErrors.skillIds = "Select at least one skill";
    }

    if (Object.keys(tempErrors).length > 0) {
        setErrors(tempErrors);
        return;
    }

    setErrors({}); 

    
    if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, form);
        toast.success("Employee updated successfully!");
    } else {
        await createEmployee(form);
        toast.success("Employee added successfully!");
    }

    refresh();
    clearSelection();

    setForm({
        name: "",
        email: "",
        dateOfBirth: "",
        skillIds: []
    });
};

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5">
                {selectedEmployee ? "Edit Employee" : "Add Employee"}
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                />

                <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                />

                <TextField
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth}
                />

                <Typography variant="subtitle1">Skills</Typography>

                {skills.map(skill => (
                    <FormControlLabel
                        key={skill.id}
                        control={
                            <Checkbox
                                checked={form.skillIds.includes(skill.id)}
                                onChange={() => toggleSkill(skill.id)}
                            />
                        }
                        label={skill.name}
                    />
                ))}
                {errors.skillIds && (
                    <Typography color="error">
                        {errors.skillIds}
                    </Typography>
                )}

                <Box mt={2}>
                    <Button variant="contained" type="submit">
                        {selectedEmployee ? "Update" : "Add"}
                    </Button>

                    {selectedEmployee && (
                        <Button
                            sx={{ ml: 2 }}
                            variant="outlined"
                            onClick={clearSelection}
                        >
                            Cancel
                        </Button>
                    )}
                </Box>
            </form>
        </Box>
    );
}

export default EmployeeForm;