
import React from "react";
import { FaBell } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

interface NotificationBellProps {
  onClick?: () => void;
  size?: number; 
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onClick, size = 20 }) => {
  const { dark } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`
        transition-colors hover:scale-110 cursor-pointer
        ${dark ? "text-white hover:text-gray-300" : "text-[#137FEC] hover:text-[#0F6AD1]"}
      `}
      aria-label="Notifications"
    >
      <FaBell size={size} />
    </button>
  );
};

export default NotificationBell;
