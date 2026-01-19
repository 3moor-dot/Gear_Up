
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import LandingPage from "./pages/Landing/landing";
import Register from "./pages/Registration/register";
import LogIn from "./pages/LogIn/log_in";
import ForgotPassword from "./pages/Forgot_Password/forgot_password";
import AdminProfile from "./pages/Admin/Admin_profile";
import SupervisorManagement from "./pages/Admin/SupervisorManagement";
import AddSupervisor from "./pages/Admin/AddSupervisor";


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* PUBLIC PAGES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ADMIN PAGES */}
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/supervisormanagement" element={<SupervisorManagement />} />
          <Route path="/admin/addsupervisor" element={<AddSupervisor />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;