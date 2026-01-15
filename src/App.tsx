import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import Register from "./pages/Registration/register";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
