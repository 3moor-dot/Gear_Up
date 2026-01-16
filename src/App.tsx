import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing/landing";
import Register from "./pages/Registration/register";
import LogIn from "./pages/LogIn/log_in";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </Router>
  );
};

export default App;
