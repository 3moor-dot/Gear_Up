
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { FaEye } from "react-icons/fa";
import { useTheme } from "../../../contexts/ThemeContext";

export default function UsersManagementPage() {
  const { dark } = useTheme();

  return (
    <div className="flex min-h-screen bg-white dark:bg-primary_BGD text-[#0F172A] dark:text-[#E5E7EB]" dir="rtl">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-8 py-6 w-full overflow-x-hidden mt-14 lg:mt-0">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              عرض جميع المستخدمين المسجلين والبحث عنهم وإدارتهم
            </p>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Input */}
          <input
            placeholder="ابحث حسب الاسم أو البريد أو السيارة..."
            className="w-full lg:flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none transition-all focus:ring-2 focus:ring-[#137FEC]/20"
            style={{ backgroundColor: "#137FEC1A" }}
          />

          {/* Filter Buttons */}
          <div className="flex flex-row gap-3 w-full lg:w-auto">
            <button
              className="flex-1 lg:px-5 py-2.5 rounded-xl text-sm whitespace-nowrap border border-transparent transition-colors hover:border-[#137FEC]"
              style={{ backgroundColor: "#137FEC1A" }}
            >
              حالة الحساب: الكل
            </button>

            <button
              className="flex-1 lg:px-5 py-2.5 rounded-xl text-sm whitespace-nowrap border border-transparent transition-colors hover:border-[#137FEC]"
              style={{ backgroundColor: "#137FEC1A" }}
            >
              تاريخ التسجيل
            </button>
          </div>
        </div>

        {/* Table Container with Horizontal Scroll for Mobile */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1428] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right min-w-[800px]">
              <thead className="bg-blue-50 dark:bg-[#111A33]">
                <tr className="text-slate-600 dark:text-slate-300">
                  <th className="p-4 font-semibold">الاسم</th>
                  <th className="p-4 font-semibold">الحالة</th>
                  <th className="p-4 font-semibold">رقم الهاتف</th>
                  <th className="p-4 font-semibold">البريد</th>
                  <th className="p-4 font-semibold">تاريخ التسجيل</th>
                  <th className="p-4 text-center font-semibold">الإجراءات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {Array.from({ length: 8 }).map((_, i) => {
                  let statusLabel = "نشط";
                  let statusStyle = { bg: "#0BDA651A", text: "#0BDA65" };

                  if (i === 1) {
                    statusLabel = "معلق";
                    statusStyle = { bg: "#EAB3081A", text: "#EAB308" };
                  } else if (i === 2) {
                    statusLabel = "مرفوض";
                    statusStyle = { bg: "#EF444433", text: "#EF4444" };
                  }

                  return (
                    <tr
                      key={i}
                      className="hover:bg-[#EFF6FFCC] dark:hover:bg-[#FFFFFF0D] transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-medium whitespace-nowrap">John Doe</td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className="px-3 py-1 rounded-full text-[11px] font-bold"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">01068593214</td>
                      <td className="p-4 text-slate-500 whitespace-nowrap">john.doe@example.com</td>
                      <td className="p-4 text-slate-500 whitespace-nowrap">2023-10-26</td>

                      <td className="p-4">
                        <div className="flex justify-center items-center gap-3">
                          <button className="p-2 hover:bg-[#137FEC1A] rounded-lg transition-colors group-hover:scale-110">
                            <FaEye size={18} color={dark ? "#E5E7EB" : "#1E293B"} />
                          </button>
                          <button className="text-xl hover:text-[#137FEC] transition-colors px-1">⋮</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Responsive stacking */}
  
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4 text-sm text-center">
  <span className={dark ? "text-white/50" : "text-[#0F132380]/50"}>
    عرض 1 إلى 5 من 2,345 مستخدم
  </span>

  <div className="flex gap-2 flex-row-reverse">
    {["1", "2", "3", "…", "10"].map((item, idx) => (
      <button
        key={idx}
        className={`
          w-8 h-8 rounded-lg flex items-center justify-center font-semibold transition-opacity
          ${item === "…" 
            ? "cursor-default text-gray-400" 
            : "hover:opacity-80 text-black bg-[#0F13231A] dark:text-white dark:bg-[#FFFFFF1A]"
          }
        `}
      >
        {item}
      </button>
    ))}
  </div>
</div>

      </div>
    </div>
  );
}