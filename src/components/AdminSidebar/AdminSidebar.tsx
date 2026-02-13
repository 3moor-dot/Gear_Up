
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaTools,
  FaClipboardList,
  FaBell,
  FaCog,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaRegCommentDots,
} from "react-icons/fa";
import { MdDashboard, MdMenu, MdClose } from "react-icons/md"; 
import { useTheme } from "../../contexts/ThemeContext";


type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  dark: boolean;
  to?: string;
  closeSidebar: () => void;
};

const AdminSidebar: React.FC = () => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-5 right-5 z-50 p-2 bg-[#137FEC] text-white rounded-lg shadow-lg"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar}></div>
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-40 w-72 flex flex-col justify-between p-6 transition-all duration-300 ease-in-out
          ${dark ? "bg-primary_BGD text-white" : "bg-white text-[#1E3A5F]"}
          ${isOpen ? "translate-x-0" : "translate-x-full"} 
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen shadow-2xl lg:shadow-none`}
        dir="rtl"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <h1 className={`text-2xl font-bold mb-10 ${dark ? "text-white" : "text-black"} text-center flex-shrink-0`}>
            GearUp 
          </h1>

          <nav className="space-y-2 text-lg overflow-y-auto flex-1 pr-2 custom-scrollbar">
            <SidebarItem icon={<MdDashboard />} label="لوحة التحكم" dark={dark} to="/admin/admindashboard" closeSidebar={() => setIsOpen(false)} />
            <SidebarItem icon={<FaUsers />} label="المستخدمين" dark={dark} to="/admin/usersmanagement" closeSidebar={() => setIsOpen(false)} />
            <SidebarItem icon={<FaTools />} label="الميكانيكيين" dark={dark} to="/admin/MechanicsManagement" closeSidebar={() => setIsOpen(false)} />
            <SidebarItem icon={<FaClipboardList />} label="الحجوزات" dark={dark} to="/admin/bookingmanagement" closeSidebar={() => setIsOpen(false)} />
            <SidebarItem icon={<FaRegCommentDots />} label="المراجعات" dark={dark} to="/admin/Reviews" closeSidebar={() => setIsOpen(false)} />
            <SidebarItem icon={<FaUsers />} label="المشرفين" dark={dark} to="/admin/supervisormanagement" closeSidebar={() => setIsOpen(false)} />
            <SidebarItem icon={<FaBell />} label="الإشعارات" dark={dark} to="/admin/NotificationsManagement" closeSidebar={() => setIsOpen(false)} />
            <SidebarItem icon={<FaCog />} label="الخدمات" dark={dark} to="/admin/Services" closeSidebar={() => setIsOpen(false)} />
            <SidebarItem icon={<FaMapMarkedAlt />} label="المدن" dark={dark} to="/admin/CitiesManagement" closeSidebar={() => setIsOpen(false)} />
          </nav>

          <div
            className={`rounded-2xl p-4 mt-6 flex-shrink-0 transition-colors duration-500
              ${dark ? "bg-[#137FEC1A] border-t border-[#137FEC]" : "bg-[#EAF4FF] border-t border-[#C6E0FF]"}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <img src="/avatar-path.png" alt="admin" className="w-10 h-10 rounded-full object-cover" />
              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">Jordan Admin</p>
                <p className={`text-[10px] ${dark ? "text-white/50" : "text-[#5C7AA5]"}`}>Administrator</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => { navigate("/admin/profile"); setIsOpen(false); }}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm transition-all
                  ${dark ? "bg-[#1E2A44] text-white hover:bg-[#2A3A5B]" : "bg-[#DCEEFF] text-[#1E3A5F] hover:bg-[#CFE6FF]"}`}
              >
                <FaCog /> الإعدادات
              </button>
              <button
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm transition-all
                  ${dark ? "bg-[#0B1020] text-red-500 hover:bg-[#1A1F2D]" : "bg-[#F2F8FF] text-red-600 hover:bg-[#E4F0FF]"}`}
              >
                <FaSignOutAlt /> تسجيل خروج
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};


const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, dark, to, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;

  return (
    <div
      onClick={() => { if (to) { navigate(to); closeSidebar(); } }}
      className={`group flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200
        ${dark
          ? `text-gray-300 ${isActive ? "bg-[#137FEC1A] text-white" : "hover:bg-[#137FEC1A] hover:text-white"}`
          : `text-black ${isActive ? "bg-[#EAF4FF] text-[#137FEC]" : "hover:bg-[#EAF4FF] hover:text-[#137FEC]"}`
        }`}
    >
      <span className={`text-lg transition-colors ${isActive ? "text-[#137FEC]" : "group-hover:text-[#137FEC]"}`}>
        {icon}
      </span>
      <span className={`whitespace-nowrap transition-colors ${isActive ? "text-[#137FEC]" : "group-hover:text-[#137FEC]"}`}>
        {label}
      </span>
    </div>
  );
};

export default AdminSidebar;

