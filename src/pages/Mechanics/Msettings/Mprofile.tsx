 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import PersonalTab from "./Taps/PersonalTab";
import AdditionalTab from "./Taps/AdditionalTab";
import ServicesTab from "./Taps/ServicesTab";

const tabs = [
  { id: "personal", label: "البيانات الشخصية" },
  { id: "additional", label: "بيانات إضافية" },
  { id: "services", label: "الخدمات" },
];

const Mprofile = () => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div
      dir="rtl"
      className={`flex min-h-screen transition-colors duration-500 ${
        !dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"
      }`}
    >
      <MachineSidebar />

      <main className="flex-1 p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 w-full overflow-x-hidden">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6 mt-14 lg:mt-0">
          <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold transition-colors ${!dark ? "text-black" : "text-white"}`}>
            ملفك الشخصي
          </h1>
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl sm:bg-transparent sm:dark:bg-transparent">
            <NotificationBell size={20} />
            <ThemeToggle />
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                  : !dark
                  ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  : "bg-[#0d1629] text-gray-300 hover:bg-[#131c2f] border border-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="max-w-4xl">
          {activeTab === "personal"  && <PersonalTab />}
          {activeTab === "additional" && <AdditionalTab />}
          {activeTab === "services"  && <ServicesTab />}
        </div>

      </main>
    </div>
  );
};

export default Mprofile;