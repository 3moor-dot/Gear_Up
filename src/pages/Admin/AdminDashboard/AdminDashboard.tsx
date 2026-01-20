
import React from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";

const AdminDashboard: React.FC = () => {
  const { dark } = useTheme();

  return (
    <div
      dir="rtl"
      className="
        flex min-h-screen transition-colors duration-500
        bg-[#F6FAFF] text-[#1E3A5F]
        dark:bg-primary_BGD dark:text-white
      "
    >
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            {/* "لوحة التحكم" بالأسود في اللايت مود */}
            <h1 className={`text-3xl font-bold mb-1 transition-colors ${!dark ? "text-black" : "text-white"}`}>
              لوحة التحكم
            </h1>
            <p className={dark ? "text-white/60" : "text-[#6B8BB5]"}>
              أهلاً بك مجددًا أيها المدير، إليك ملخصاً لنشاط المنصة.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell size={22} />
            <ThemeToggle />
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="إجمالي المستخدمين" value="1,482" change="+5.2%" up icon="/img14green.png" />
          <StatCard title="الحجوزات النشطة" value="96" change="+1.8%" up icon="/img14green.png" />
          <StatCard title="التحققات المعلقة" value="12" change="-6.2%" up={false} icon="/img14red.png" />
          <StatCard title="المراجعات الجديدة" value="35" change="+8.5%" up icon="/img14green.png" />
        </div>

        {/* USERS TABLE SECTION */}
        <Section title="تسجيلات المستخدمين الأخيرة">
          <Table />
        </Section>

        {/* MECHANICS TABLE SECTION */}
        <Section title="تسجيلات الميكانيكيين الأخيرة">
          <Table />
        </Section>
      </main>
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

const StatCard = ({ title, value, change, up, icon }: any) => {
  const { dark } = useTheme();
  const changeColor = change.includes("6.2") ? "#EF476F" : up ? "#22C55E" : "#EF476F";

  return (
    <div
      className="
        rounded-2xl p-6 transition-all
        bg-[#EAF4FF] border border-[#C6E0FF]
        dark:bg-[#FFFFFF1A] dark:border-white/10
      "
    >
      <p className="text-[#6B8BB5] dark:text-[#FFFFFF80] mb-2">{title}</p>
      
      {/* الأرقام باللون الأزرق المطلوب كنص صريح بدون ديف (فقط في اللايت مود) */}
      <h2 className={`text-4xl font-bold transition-all ${!dark ? "text-[#137FEC]" : "text-white"}`}>
        {value}
      </h2>

      <div className="flex items-center gap-2 mt-4 text-lg">
        <span className="font-semibold" style={{ color: changeColor }}>
          {change}
        </span>
        <img src={icon} alt="" className="w-6 h-6 object-contain" />
      </div>
    </div>
  );
};

const Section = ({ title, children }: any) => {
  const { dark } = useTheme();
  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-bold ${!dark ? "text-black" : "text-white"}`}>
        {title}
      </h2>
      {children}
    </div>
  );
};

const Table = () => {
  const { dark } = useTheme();
  return (
    <div className={`rounded-2xl overflow-hidden border ${dark ? "border-[#1E2A44]" : "border-[#C6E0FF]"}`}>
      <table className="w-full text-sm">
        <thead className={dark ? "bg-[#0E162B]" : "bg-[#EAF4FF]"}>
          <tr>
            {["الاسم", "رقم الهاتف", "البريد الإلكتروني", "تاريخ التسجيل", "الحالة", "الإجراءات"].map((h) => (
              <th key={h} className="p-4 text-right font-semibold text-[#6B8BB5] dark:text-white/70">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-transparent">
          <TableRow status="active" actionIcons={["/rejectdark.png", "/approvedark.png"]} />
          <TableRow status="pending" actionIcons={["/rejectdark.png", "/approvedark.png"]} />
          <TableRow status="rejected" actionIcons={["/rejectdark.png", "/approvedark.png"]} />
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ status, actionIcons = [] }: any) => {
  const { dark } = useTheme();
  
  const statusMap = {
    active: { label: "نشط", color: "bg-[#DCFCE7] text-[#166534]" },
    pending: { label: "قيد الانتظار", color: "bg-[#FEF9C3] text-[#854D0E]" },
    rejected: { label: "مرفوض", color: "bg-[#FEE2E2] text-[#991B1B]" },
  };

  return (
    <tr className="border-t border-black/5 dark:border-white/5">
      <td className="p-4 font-medium dark:text-white">John Doe</td>
      <td className="p-4 text-[#1E3A5F] dark:text-gray-300">01098683512</td>
      <td className="p-4 text-gray-400">john.doe@example.com</td>
      
      {/* التاريخ أبيض 50% فقط في الدارك مود */}
      <td className={`p-4 transition-colors ${dark ? "text-white/50" : "text-gray-500"}`}>
        2023-10-26
      </td>

      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusMap[status as keyof typeof statusMap].color}`}>
          {statusMap[status as keyof typeof statusMap].label}
        </span>
      </td>
      <td className="p-4 flex gap-2">
        {actionIcons.map((icon: string, index: number) => (
          <img key={index} src={icon} alt="" className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity" />
        ))}
      </td>
    </tr>
  );
};

export default AdminDashboard;