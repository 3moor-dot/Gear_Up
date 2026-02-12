
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
      <main className="flex-1 p-4 md:p-8 space-y-8 w-full overflow-x-hidden">
        
        {/* HEADER - Responsive adjustments */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-14 lg:mt-0">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold mb-1 transition-colors ${!dark ? "text-black" : "text-white"}`}>
              لوحة التحكم
            </h1>
            <p
              className="transition-colors text-sm md:text-base opacity-80"
              style={{ color: dark ? "#FFFFFF99" : "#0F132399" }}
            >
              أهلاً بك مجددًا أيها المدير، إليك ملخصاً لنشاط المنصة.
            </p>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto bg-gray-50 dark:bg-white/5 p-2 rounded-2xl sm:bg-transparent sm:dark:bg-transparent">
            <NotificationBell size={22} />
            <ThemeToggle />
          </div>
        </div>

        {/* STATS CARDS - Removed 'up' prop to avoid warnings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard title="إجمالي المستخدمين" value="1,482" change="+5.2%" icon="/img14green.png" />
          <StatCard title="الحجوزات النشطة" value="96" change="+1.8%" icon="/img14green.png" />
          <StatCard title="التحققات المعلقة" value="12" change="-6.2%" icon="/img14red.png" />
          <StatCard title="المراجعات الجديدة" value="35" change="+8.5%" icon="/img14green.png" />
        </div>

        {/* TABLES SECTION */}
        <div className="space-y-10">
          <Section title="تسجيلات المستخدمين الأخيرة">
            <TableWrapper>
              <Table />
            </TableWrapper>
          </Section>

          <Section title="تسجيلات الميكانيكيين الأخيرة">
            <TableWrapper>
              <Table />
            </TableWrapper>
          </Section>
        </div>
      </main>
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

interface StatCardProps {
  title: string;
  value: string;
  change: string; 
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  const { dark } = useTheme();
  
 
  const isNegative = change.includes("-");
  const changeColor = isNegative ? "#EF476F" : "#22C55E";

  return (
    <div
      className={`
        rounded-2xl p-5 md:p-6 transition-all duration-300
        transform hover:scale-[1.02] md:hover:scale-105 hover:shadow-md
        ${!dark ? "bg-[#137FEC0A] border border-[#C6E0FF]" : "bg-[#FFFFFF08] border border-white/10"}
      `}
    >
      <p className={`text-sm mb-2 font-medium ${!dark ? "text-[#6B8BB5]" : "text-[#FFFFFF80]"}`}>{title}</p>
      <h2 className={`text-3xl md:text-4xl font-bold transition-all ${!dark ? "text-[#137FEC]" : "text-white"}`}>{value}</h2>
      <div className="flex items-center gap-2 mt-4 text-base md:text-lg">
        <span className="font-bold" style={{ color: changeColor }}>
          {change}
        </span>
        <img src={icon} alt="" className="w-5 h-5 object-contain" />
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
      <h2 className={`text-xl font-bold px-1 ${!dark ? "text-black" : "text-white"}`}>{title}</h2>
      {children}
    </div>
  );
};

const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dark } = useTheme();
  return (
    <div className={`
      rounded-2xl overflow-hidden border transition-colors
      ${dark ? "border-[#1E2A44]" : "border-[#C6E0FF]"}
    `}>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {children}
        </div>
      </div>
    </div>
  );
};

const Table: React.FC = () => {
  const { dark } = useTheme();
  return (
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
      <tbody className="divide-y divide-black/5 dark:divide-white/5">
        <TableRow status="active" />
        <TableRow status="pending" />
        <TableRow status="rejected" />
      </tbody>
    </table>
  );
};

interface TableRowProps {
  status: "active" | "pending" | "rejected";
}

const TableRow: React.FC<TableRowProps> = ({ status }) => {
  const { dark } = useTheme();

  const statusMap = {
    active: { label: "نشط", style: "bg-[#0BDA651A] text-[#0BDA65]" },
    pending: { label: "قيد الانتظار", style: "bg-[#EAB3081A] text-[#EAB308]" },
    rejected: { label: "مرفوض", style: "bg-[#EF44441A] text-[#EF4444]" },
  };

  const icons = dark ? ["/reject.png", "/approve.png"] : ["/rejectdark.png", "/approvedark.png"];
  const hoverBg = dark ? "hover:bg-white/5" : "hover:bg-[#137FEC05]";

  return (
    <tr className={`transition-colors duration-200 cursor-pointer ${hoverBg}`}>
      <td className="p-4 font-medium dark:text-white whitespace-nowrap">John Doe</td>
      <td className="p-4 text-[#1E3A5F] dark:text-gray-300 whitespace-nowrap">01098683512</td>
      <td className="p-4 text-gray-400 dark:text-gray-400 whitespace-nowrap">john.doe@example.com</td>
      <td className={`p-4 transition-colors whitespace-nowrap ${dark ? "text-white/50" : "text-gray-500"}`}>2023-10-26</td>
      <td className="p-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusMap[status].style}`}>
          {statusMap[status].label}
        </span>
      </td>
      <td className="p-4">
        <div className="flex gap-3">
          {icons.map((icon, index) => (
            <img
              key={index}
              src={icon}
              alt="action"
              className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:scale-110 transition-transform active:opacity-60"
            />
          ))}
        </div>
      </td>
    </tr>
  );
};

export default AdminDashboard;