import React, { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Box,
    Typography
} from "@mui/material";
import { z } from "zod";
import { createEmployee, updateEmployee, getSkills } from "../api/employeeApi";
import { toast } from "react-toastify";

const employeeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name must contain letters only"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const inputDate = new Date(date);
      const today = new Date();

      // remove time portion for accurate comparison
      today.setHours(0, 0, 0, 0);

      return inputDate <= today;
    }, "Date of birth cannot be a future date"),

  skillIds: z
    .array(z.number())
    .min(1, "Select at least one skill"),
});

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

    const result = employeeSchema.safeParse(form);

    if (!result.success) {
        const fieldErrors = {};

        result.error.issues.forEach(err => {
            fieldErrors[err.path[0]] = err.message;
        });

        setErrors(fieldErrors);
        return;
    }

    setErrors({});

    try {
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

    } catch (err) {
        toast.error("Something went wrong!");
    }
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