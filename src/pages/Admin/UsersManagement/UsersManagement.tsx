// import React from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { FaEye } from "react-icons/fa";
import { useTheme } from "../../../contexts/ThemeContext";

export default function UsersManagementPage() {
  const { dark } = useTheme();

  return (
    <div className="flex min-h-screen bg-white dark:bg-primary_BGD text-[#0F172A] dark:text-[#E5E7EB]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <div className="flex-1 px-8 py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400 -mt-8">
          عرض جميع المستخدمين المسجلين والبحث عنهم وإدارتهم
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-between">
          <input
            placeholder="ابحث حسب الاسم أو البريد الإلكتروني أو طراز السيارة..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none order-1"
            style={{ backgroundColor: "#137FEC1A" }}
          />

          <div className="flex gap-4 order-2">
            <button
              className="px-5 py-2 rounded-xl"
              style={{ backgroundColor: "#137FEC1A" }}
            >
              <span className="text-black dark:text-white">
                حالة الحساب: الكل
              </span>
            </button>

            <button
              className="px-5 py-2 rounded-xl"
              style={{ backgroundColor: "#137FEC1A" }}
            >
              <span className="text-black dark:text-white">
                تاريخ التسجيل
              </span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1428]">
          <table className="w-full text-sm text-right">
            <thead className="bg-blue-50 dark:bg-[#111A33]">
              <tr className="text-slate-600 dark:text-slate-300">
                <th className="p-4">الاسم</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">رقم الهاتف</th>
                <th className="p-4">البريد</th>
                <th className="p-4">تاريخ التسجيل</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 10 }).map((_, i) => {
                let status;
                if (i === 0) {
                  status = (
                    <span
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: "#0BDA651A",
                        color: "#0BDA65",
                      }}
                    >
                      نشط
                    </span>
                  );
                } else if (i === 1) {
                  status = (
                    <span
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: "#EAB3081A",
                        color: "#EAB308",
                      }}
                    >
                      معلق
                    </span>
                  );
                } else {
                  status = (
                    <span
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: "#EF444433",
                        color: "#EF4444",
                      }}
                    >
                      مرفوض
                    </span>
                  );
                }

                return (
                  <tr
                    key={i}
                    className="
                      border-t border-slate-100 dark:border-slate-800
                      hover:bg-[#EFF6FFCC]
                      dark:hover:bg-[#FFFFFF0D]
                      transition-colors duration-200
                      cursor-pointer
                    "
                  >
                    <td className="p-4 font-medium">John Doe</td>
                    <td className="p-4">{status}</td>
                    <td className="p-4">01068593214</td>
                    <td className="p-4 text-slate-500">
                      john.doe@example.com
                    </td>
                    <td className="p-4 text-slate-500">2023-10-26</td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button className="hover:opacity-80 transition-opacity">
                          <FaEye size={18} color={dark ? "white" : "black"} />
                        </button>
                        <span className={dark ? "text-white" : "text-black"}>⋮</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 text-sm text-slate-500">
          <span>عرض 1 إلى 5 من 2,345 مستخدم</span>

          <div className="flex gap-2">
            {["10", "…", "3", "2", "1"].map((item, idx) =>
              item === "…" ? (
                <span key={idx} className="px-2">
                  …
                </span>
              ) : (
                <button
                  key={idx}
                  className="
                    w-8 h-8 rounded-lg flex items-center justify-center
                    text-black bg-[#0F13231A]
                    dark:text-white dark:bg-[#D9D9D91A]
                    font-semibold
                  "
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
