
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
      className={`
        flex min-h-screen transition-colors duration-500
        ${!dark ? "bg-white text-[#1E3A5F]" : "bg-primary_BGD text-white"}
      `}
    >
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-1 transition-colors ${!dark ? "text-black" : "text-white"}`}>
              لوحة التحكم
            </h1>
    
            <p
  className="transition-colors"
  style={{
    color: dark ? "#FFFFFF99" : "#0F132399"
  }}
>
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

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  up?: boolean;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, up = true, icon }) => {
  const { dark } = useTheme();
  const changeColor = change.includes("6.2") ? "#EF476F" : up ? "#22C55E" : "#EF476F";

  return (
    <div
      className={`
        rounded-2xl p-6 transition-all
        ${!dark ? "bg-[#137FEC1A] border border-[#C6E0FF]" : "bg-[#FFFFFF1A] border-white/10"}
      `}
    >
      <p className={`mb-2 ${!dark ? "text-[#6B8BB5]" : "text-[#FFFFFF80]"}`}>{title}</p>
      <h2 className={`text-4xl font-bold transition-all ${!dark ? "text-[#137FEC]" : "text-white"}`}>{value}</h2>
      <div className="flex items-center gap-2 mt-4 text-lg">
        <span className="font-semibold" style={{ color: changeColor }}>
          {change}
        </span>
        <img src={icon} alt="" className="w-6 h-6 object-contain" />
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const { dark } = useTheme();
  return (
    <div className="space-y-4">
      <h2 className={`text-xl font-bold ${!dark ? "text-black" : "text-white"}`}>{title}</h2>
      {children}
    </div>
  );
};

const Table: React.FC = () => {
  const { dark } = useTheme();
  return (
    <div className={`rounded-2xl overflow-hidden border ${dark ? "border-[#1E2A44]" : "border-[#C6E0FF]"}`}>
      <table className="w-full text-sm">
        <thead className={dark ? "bg-[#0E162B]" : "bg-[#137FEC1A]"}>
          <tr>
            {["الاسم", "رقم الهاتف", "البريد الإلكتروني", "تاريخ التسجيل", "الحالة", "الإجراءات"].map((h) => (
              <th key={h} className="p-4 text-right font-semibold text-[#6B8BB5] dark:text-white/70">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <TableRow status="active" />
          <TableRow status="pending" />
          <TableRow status="rejected" />
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  status: "active" | "pending" | "rejected";
}

const TableRow: React.FC<TableRowProps> = ({ status }) => {
  const { dark } = useTheme();

  const statusMap = {
    active: { label: "نشط", light: "bg-[#0BDA651A] text-[#0BDA65]", dark: "bg-[#0BDA651A] text-[#0BDA65]" },
    pending: { label: "قيد الانتظار", light: "bg-[#EAB3081A] text-[#EAB308]", dark: "bg-[#EAB3081A] text-[#EAB308]" },
    rejected: { label: "مرفوض", light: "bg-[#EF444433] text-[#EF4444]", dark: "bg-[#EF444433] text-[#EF4444]" },
  };

  const icons = dark ? ["/reject.png", "/approve.png"] : ["/rejectdark.png", "/approvedark.png"];
  const hoverBg = dark ? "hover:bg-white/10" : "hover:bg-[#EFF6FFCC]";

  return (
    <tr
      className={`
        border-t border-black/5 dark:border-white/5
        transition-colors duration-200
        cursor-pointer
        ${hoverBg}
      `}
    >
      <td className="p-4 font-medium dark:text-white">John Doe</td>
      <td className="p-4 text-[#1E3A5F] dark:text-gray-300">01098683512</td>
      <td className="p-4 text-gray-400">john.doe@example.com</td>
      <td className={`p-4 transition-colors ${dark ? "text-white/50" : "text-gray-500"}`}>2023-10-26</td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            dark ? statusMap[status].dark : statusMap[status].light
          }`}
        >
          {statusMap[status].label}
        </span>
      </td>
      <td className="p-4 flex gap-2">
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon}
            alt=""
            className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
          />
        ))}
      </td>
    </tr>
  );
};

export default AdminDashboard;
