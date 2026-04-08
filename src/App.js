// App.jsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SkillManager from "./pages/SkillManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {
  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    <ToastContainer />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 20 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/employees" element={<Dashboard />} />
            <Route path="/admin/skills" element={<SkillManager />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;