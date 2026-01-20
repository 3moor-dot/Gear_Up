
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import LandingPage from "./pages/Landing/landing";
import Register from "./pages/Registration/register";
import LogIn from "./pages/LogIn/log_in";
import ForgotPassword from "./pages/Forgot_Password/forgot_password";
import VerifyAccount from "./pages/Verfiy_Account/verfiy_account";
import ResetPassword from "./pages/Reset_Password/reset_password";
import AdminProfile from "./pages/Admin/admin_profile";
import SupervisorManagement from "./pages/Admin/supervisor_management";
import AddSupervisor from "./pages/Admin/add_supervisor";
import CustomerDashBoard from "./pages/Customer/dashboard";
import MaintenanceReminders from "./pages/Customer/maintenance_reminders";
import ServiceHistory from "./pages/Customer/service_history";
import MaintenanceBookings from "./pages/Customer/maintenance_bookings";


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* CUSTOMER PAGES */}
          <Route path="/customer/dashboard" element={<CustomerDashBoard />} />
          <Route path="/customer/reminders" element={<MaintenanceReminders />} />
          <Route path="/customer/servicehistory" element={<ServiceHistory />} />
          <Route path="/customer/maintenancebookings" element={<MaintenanceBookings />} />
          {/* PUBLIC PAGES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ADMIN PAGES */}
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/supervisormanagement" element={<SupervisorManagement />} />
          <Route path="/admin/addsupervisor" element={<AddSupervisor dark={false} onClose={function (): void {
            throw new Error("Function not implemented.");
          } } />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;