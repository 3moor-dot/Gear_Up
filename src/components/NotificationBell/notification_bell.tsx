
import React from "react";
import { FaBell } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
interface NotificationBellProps {
  onClick?: () => void;
  size?: number; 
}

const NotificationBell = ({ size = 20 }) => {
  const { dark } = useTheme();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/notification")}
      className={`
        transition-all duration-200 hover:scale-110 cursor-pointer
        ${dark
          ? "text-white hover:text-gray-300"
          : "text-[#137FEC] hover:text-[#0F6AD1]"}
      `}
      aria-label="Notifications"
    >
      <FaBell size={size} />
    </button>
  );
};

export default NotificationBell;

