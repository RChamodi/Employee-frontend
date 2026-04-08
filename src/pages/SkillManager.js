import React, { useEffect, useState } from "react";
import { getSkills } from "../api/employeeApi";
import axios from "axios";

import {
  TextField,
  Button,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box
} from "@mui/material";
import { toast } from "react-toastify";

function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const res = await getSkills();
    setSkills(res.data);
  };

  const addSkill = async () => {
    if (!name || !name.trim()) {
      toast.error("Skill name is required");
      return;
    }

    try {
      await axios.post("https://localhost:7200/api/skills", {
        name: name.trim()
      });
      toast.success("Skill added successfully!");
      setName("");
      loadSkills();
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      toast.error("Failed to add skill");
    }
  };

  const deleteSkill = async (id) => {
    await axios.delete(`https://localhost:7200/api/skills/${id}`);
    toast.success("Skill deleted successfully!");
    loadSkills();
  };

  return (
    <Paper
  elevation={4}
  sx={{
    p: 4,
    borderRadius: 3,
    maxWidth: 800,
    mx: "auto",
    mt: 4
  }}
>
  <Typography variant="h5" fontWeight="bold" gutterBottom>
    Manage Skills
  </Typography>

      {/* Add Skill Section */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Skill Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <Button
         variant="contained"
        size="large"
        onClick={addSkill}
        sx={{ px: 4 }}
        >
          Add
        </Button>
      </Box>

      {/* Skills Table */}
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
        <TableCell><b>Skill Name</b></TableCell>
        <TableCell align="right"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {skills.map((s) => (
            <TableRow key={s.id}hover
          sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
              <TableCell>{s.name}</TableCell>

              <TableCell align="right">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => deleteSkill(s.id)}
            >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default SkillManager;