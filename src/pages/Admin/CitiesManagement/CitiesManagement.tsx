
import React from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";

import { FaEllipsisH } from "react-icons/fa";

const CitiesManagement: React.FC = () => {
  const { dark } = useTheme();

  return (
    <div className={`flex min-h-screen ${dark ? "bg-[#0F1323]" : "bg-white"}`}>
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <main className="flex-1 px-10 pt-4">
        {/* TOP BAR */}
        <div className="flex justify-end items-center gap-4 mb-8 mt-6">
          <NotificationBell size={22}/>
          <ThemeToggle />
        </div>

        {/* TITLE */}
        <div className="mb-8 text-right -mt-20"> 
          <h1
            className={`text-3xl font-bold ${
              dark ? "text-white" : "text-[#0B2545]"
            }`}
          >
            إدارة المدن
          </h1>
          <p
            className={`mt-1 text-sm ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            إدارة مناطق الخدمة والتوافر الإقليمي
          </p>
        </div>

        {/* ADD BUTTON */}
<div className="mb-6 flex justify-end">
  <button
    className="
      bg-[#137FEC]
      hover:bg-[#0F6AD1]
      text-white
      px-6 py-2
      rounded-lg
      font-medium
      transition
    "
  >
    إضافة مدينة جديدة
  </button>
</div>

        {/* TABLE CARD */}
        <div
          className={`
            rounded-2xl
            overflow-hidden
            transition-colors
            ${
              dark
                ? "bg-[#0B1020] border border-[#1E2A44]"
                : "bg-white border border-[#D6E9FF]"
            }
          `}
        >
          {/* TABLE HEADER */}
          <div
            className={`
              grid grid-cols-4
              px-6 py-4
              text-sm font-medium
              ${
                dark
                  ? "text-gray-300 border-b border-[#1E2A44]"
                  : "text-[#5C7AA5] bg-[#EAF4FF] border-b border-[#D6E9FF]"
              }
            `}
          >
            <span>المنطقة/الولاية</span>
            <span className="text-center">آخر تحديث</span>
            <span className="text-center">حالة</span>
            <span className="text-center">الإجراءات</span>
          </div>

          {/* ROW */}
          <div
            className={`
              grid grid-cols-4
              items-center
              px-6 py-4
              text-sm
              ${
                dark
                  ? "text-white hover:bg-[#111B34]"
                  : "text-[#0B2545] hover:bg-[#F2F8FF]"
              }
              transition
            `}
          >
            {/* City */}
            <span>أوستن</span>

            {/* Date */}
            <span className="text-center text-gray-400">
              Oct 24, 2023
            </span>

            {/* Status */}
<div className="flex justify-center">
  <span
    className={`
      px-4 py-1
      text-xs font-medium
      rounded-full
      bg-[#0BDA651A]
      text-[#0BDA65]
    `}
  >
    نشط
  </span>
</div>
            {/* Actions */}
            <div className="flex justify-center">
              <button
                className={`
                  w-8 h-8
                  flex items-center justify-center
                  rounded-full
                  ${
                    dark
                      ? "hover:bg-[#1E2A44]"
                      : "hover:bg-[#EAF4FF]"
                  }
                `}
              >
                <FaEllipsisH />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitiesManagement;
