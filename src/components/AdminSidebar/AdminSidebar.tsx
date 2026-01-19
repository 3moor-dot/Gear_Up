
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaUsers,
  FaTools,
  FaClipboardList,
  FaBell,
  FaCog,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaRegCommentDots,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";

const AdminSidebar: React.FC = () => {
  const { dark } = useTheme();

  return (
    <aside
      className={`w-72 flex flex-col justify-between p-6 transition-colors duration-500
        ${
          dark
            ? "bg-[#0B1020] text-white border-l border-[#1E2A44]"
            : "bg-white text-[#1E3A5F] border-l border-[#C6E0FF]"
        }`}
    >
      {/* TOP */}
      <div>
        <h1 className="text-2xl font-bold mb-10">GearUp</h1>

        <nav className="space-y-2 text-sm">
          <SidebarItem icon={<FaUser />} label="لوحة التحكم" dark={dark} to="/admin/profile" />
          <SidebarItem icon={<FaUsers />} label="المستخدمين" dark={dark} to="/admin/users" />
          <SidebarItem icon={<FaTools />} label="الميكانيكيين" dark={dark} to="/admin/mechanics" />
          <SidebarItem icon={<FaClipboardList />} label="الحجوزات" dark={dark} to="/admin/bookings" />
          <SidebarItem icon={<FaRegCommentDots />} label="المراجعات" dark={dark} to="/admin/reviews" />
          <SidebarItem icon={<FaUsers />} label="المشرفين" dark={dark} to="/admin/supervisormanagement" />
          <SidebarItem icon={<FaBell />} label="الإشعارات" dark={dark} to="/admin/notifications" />
          <SidebarItem icon={<FaCog />} label="الخدمات" dark={dark} to="/admin/services" />
          <SidebarItem icon={<FaMapMarkedAlt />} label="المحافظات" dark={dark} to="/admin/governorates" />
          <SidebarItem icon={<FaMapMarkedAlt />} label="المدن" dark={dark} to="/admin/cities" />
        </nav>
      </div>

      {/* BOTTOM CARD */}
      <div
        className={`rounded-2xl p-4 mt-6 transition-colors duration-500
          ${
            dark
              ? "bg-[#137FEC1A] border-t border-[#137FEC]"
              : "bg-[#EAF4FF] border-t border-[#C6E0FF]"
          }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/avatar.png"
            alt="admin"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">Jordan Admin</p>
            <p className={`text-xs ${dark ? "text-white/50" : "text-[#5C7AA5]"}`}>
              Administrator
            </p>
          </div>
        </div>

        {/* SETTINGS */}
        <button
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl mb-2 transition-all duration-200
            ${
              dark
                ? "bg-[#1E2A44] text-white hover:bg-[#2A3A5B]"
                : "bg-[#DCEEFF] text-[#1E3A5F] hover:bg-[#CFE6FF]"
            }`}
        >
          <FaCog />
          الإعدادات
        </button>

        {/* LOGOUT */}
        <button
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-200
            ${
              dark
                ? "bg-[#0B1020] text-red-500 hover:bg-[#1A1F2D]"
                : "bg-[#F2F8FF] text-red-600 hover:bg-[#E4F0FF]"
            }`}
        >
          <FaSignOutAlt />
          تسجيل خروج
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

/* ---------- SIDEBAR ITEM ---------- */
type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  dark: boolean;
  to?: string;
};


const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, dark, to }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const isActive = to === location.pathname; 

  return (
    <div
      onClick={() => to && navigate(to)}
      className={`group flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200
        ${
          dark
            ? `text-gray-300 hover:text-white hover:bg-[#1E2A44] hover:shadow-lg hover:shadow-black/30 ${
                isActive ? 'bg-[#1E2A44] text-white' : ''
              }`
            : `text-[#1E3A5F] hover:text-[#137FEC] hover:bg-[#EAF4FF] ${
                isActive ? 'bg-[#EAF4FF] text-[#137FEC]' : ''
              }`
        }`}
    >
      <span className="text-lg transition-colors duration-200 group-hover:text-[#137FEC]">
        {icon}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
};
