import { useState } from "react";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import PersonalTab from "./Taps/PersonalTab";
import AdditionalTab from "./Taps/AdditionalTab";
import ServicesTab from "./Taps/ServicesTab";
import SecuritySettings from "./Taps/SecurtyTap";

const tabs = [
  { id: "personal",   label: "البيانات الشخصية" },
  { id: "additional", label: "بيانات إضافية"     },
  { id: "services",   label: "الخدمات"           },
  { id: "security",   label: "الأمان"            },
];

const Mprofile = () => {
  const { dark } = useTheme();
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div
      dir="rtl"
      className={`flex min-h-screen transition-colors duration-500 ${
        !dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"
      }`}
    >
      <MachineSidebar />

      <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-5 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto space-y-5 md:space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-end mt-14 lg:mt-0 gap-2 sm:gap-3">
            <NotificationBell size={25} />
            <ThemeToggle />
          </div>

          {/* HEADER */}
          <div className="bg-[#137FECFA] dark:bg-[#137FEC1A] text-white px-5 py-3 rounded-2xl border border-[#D7E7FF] dark:border-[#24324A]  mb-5 shadow-md">
            <h1 className="text-lg sm:text-2xl font-black text-center">ملفك الشخصي</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Profile Tabs Side Navigation */}
            <div>
              {/* Mobile Horizontal Tabs */}
              <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === tab.id
                        ? "bg-[#137FEC] text-white shadow-md shadow-blue-500/20"
                        : "bg-white dark:bg-[#0d1629] text-gray-600 dark:text-gray-400 border border-[#D7E7FF] dark:border-[#24324A]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Desktop Vertical Tabs */}
              <div className="hidden lg:block bg-white dark:bg-[#0d1629] rounded-3xl border border-[#D7E7FF] dark:border-[#24324A] shadow-sm p-5 h-fit sticky top-6">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  الملف والإعدادات
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  إدارة بياناتك وحسابك
                </p>

                <div className="mt-6 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        activeTab === tab.id
                          ? "bg-[#137FEC] text-white shadow-md shadow-blue-500/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-[#131c2f]"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                          activeTab === tab.id
                            ? "bg-white border-white"
                            : "border-[#D7E7FF] dark:border-[#24324A]"
                        }`}
                      />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Content Area */}
            <div className="min-w-0">
              {activeTab === "personal"   && <PersonalTab />}
              {activeTab === "additional" && <AdditionalTab />}
              {activeTab === "services"   && <ServicesTab />}
              {activeTab === "security"   && <SecuritySettings />}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Mprofile;