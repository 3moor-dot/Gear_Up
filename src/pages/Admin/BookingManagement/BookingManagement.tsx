
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import { FaSearch, FaEllipsisH } from "react-icons/fa";

const mockBookings = [
  { id: 1, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Completed", cost: "$150.00" },
  { id: 2, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Pending", cost: "$150.00" },
  { id: 3, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Confirmed", cost: "$150.00" },
  { id: 4, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Cancelled", cost: "$150.00" },
  { id: 5, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Cancelled", cost: "$150.00" },
  { id: 6, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Cancelled", cost: "$150.00" },
  { id: 7, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Cancelled", cost: "$150.00" },
  { id: 8, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Cancelled", cost: "$150.00" },
  { id: 9, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Cancelled", cost: "$150.00" },
  { id: 10, client: "Alex Johnson", mechanic: "Mike Williams", service: "Oil Change", date: "2023-10-26, 10:00 AM", status: "Cancelled", cost: "$150.00" },
];

const BookingManagement: React.FC = () => {
  const { dark } = useTheme();

  return (
    <div
      dir="rtl"
      className="
        flex min-h-screen
        bg-white
        dark:bg-primary_BGD
        text-gray-800
        dark:text-white
        transition-colors duration-500
      "
    >
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">إدارة الحجوزات</h2>
            <p className={dark ? "text-gray-400" : "text-gray-500"}>
              إدارة وعرض وتحديث كافة حجوزات الخدمة.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell size={24} />
            <ThemeToggle />
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="البحث حسب المعرف، المستخدم، الميكانيكي..."
              className={`w-full py-2 pr-10 pl-4 rounded-lg outline-none border transition-all
                ${
                  dark
                    ? "bg-[#137FEC1A] border-transparent text-white focus:border-[#137FEC]"
                    : "bg-[#137FEC1A] border-transparent text-black focus:border-[#137FEC]"
                }`}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>

          <FilterButton label="الحالة" dark={dark} />
          <FilterButton label="نوع الخدمة" dark={dark} />
          <FilterButton label="نطاق التاريخ" dark={dark} />

          <button className="bg-[#137FEC] text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-600 transition-all">
            يتقدم
          </button>
        </div>

        {/* Table */}
        <div
          className={`rounded-2xl border overflow-hidden transition-all duration-500
          ${
            dark
              ? "bg-[#0B1020]/50 border-[#1E2A44]"
              : "bg-white border-[#E2E8F0] shadow-sm"
          }`}
        >
          <table className="w-full text-right border-collapse">
            <thead>
              <tr
                className={`text-sm ${
                  dark
                    ? "bg-[#137FEC1A] text-white"
                    : "bg-[#137FEC1A] text-black"
                }`}
              >
                <th className="p-4 font-medium">العميل</th>
                <th className="p-4 font-medium">الميكانيكي</th>
                <th className="p-4 font-medium">نوع الخدمة</th>
                <th className="p-4 font-medium">تاريخ الطلب</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium">التكلفة</th>
                <th className="p-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {mockBookings.map((booking, idx) => (
                <tr
                  key={idx}
                  className={`border-b last:border-0 transition-colors
                    ${dark 
                      ? "border-[#1E2A44] hover:bg-white/5" 
                      : "border-[#E2E8F0] hover:bg-gray-50"
                    }`}
                >
                  <td className="p-4 font-medium">{booking.client}</td>
                  <td className="p-4 text-gray-400">{booking.mechanic}</td>
                  <td className="p-4">{booking.service}</td>
                  <td className="p-4 text-sm">{booking.date}</td>
                  <td className="p-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="p-4 font-bold">{booking.cost}</td>
                  <td className="p-4 text-center cursor-pointer">
                    <FaEllipsisH className="inline-block text-gray-400 hover:text-white" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


{/* Pagination */}
<div className="flex items-center justify-between mt-6 text-sm">
  {/* Text info */}
  <span className={dark ? "text-white/50" : "text-[#0F132380]/50"}>
    عرض 1 إلى 5 من 2,345 حجز
  </span>

  {/* Page buttons */}
  <div className="flex gap-2">
    {["1", "2", "3", "…", "10"].map((item, idx) =>
      item === "…" ? (
        <span key={idx} className="px-2 text-gray-400">
          …
        </span>
      ) : (
        <button
          key={idx}
          className={`w-8 h-8 rounded-lg flex items-center justify-center
            text-black bg-[#0F13231A]
            dark:text-white dark:bg-[#FFFFFF1A]
            font-semibold
            hover:opacity-80 transition-opacity
          `}
        >
          {item}
        </button>
      )
    )}
  </div>
</div>


      </main>
    </div>
  );
};

/* Helpers */
const FilterButton = ({ label, dark }: { label: string; dark: boolean }) => (
  <button
    className={`px-6 py-2 rounded-lg border text-sm transition-all
    ${
      dark
        ? "bg-[#137FEC1A] border-transparent text-white hover:bg-[#137FEC33]"
        : "bg-[#137FEC1A] border-transparent text-black hover:bg-[#137FEC33]"
    }`}
  >
    {label}
  </button>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Completed: "bg-green-500/10 text-green-500 border-green-500/20",
    Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span
      className={`inline-block min-w-[100px] text-center px-5 py-2.5 rounded-full text-sm font-semibold border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default BookingManagement;
