// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/Landing/landing";
// import Register from "./pages/Registration/register";
// import LogIn from "./pages/LogIn/log_in";
// import ForgotPassword from "./pages/Forgot_Password/forgot_password";
// import Verification from "./pages/Verfiy_Account/verfiy_account";
// import ResetPassword from "./pages/Reset_Password/reset_password";
// import "./App.css";

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<LogIn />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/verify-account" element={<Verification />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import LandingPage from "./pages/Landing/landing";
import Register from "./pages/Registration/register";
import LogIn from "./pages/LogIn/log_in";
import ForgotPassword from "./pages/Forgot_Password/forgot_password";
import AdminProfile from "./pages/Admin/Admin_profile";

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
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;