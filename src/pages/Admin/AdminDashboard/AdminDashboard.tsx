import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";

// Types
interface DashboardStats {
  totalUsers: number;
  activeBookings: number;
  pendingVerifications: number;
  newReviews: number;
}

interface DashboardItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: string;
  registeredAt: string;
}

interface ApiResponse {
  stats: DashboardStats;
  recentUsers: DashboardItem[];
  recentMechanics: DashboardItem[];
}

const AdminDashboard: React.FC = () => {
  const { dark } = useTheme();
  
  // States
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<DashboardItem[]>([]);
  const [recentMechanics, setRecentMechanics] = useState<DashboardItem[]>([]);

  // Fetch Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("userToken");

      try {
        const response = await fetch("https://gearupapp.runasp.net/api/admin/dashboard", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data: ApiResponse = await response.json();
          setStats(data.stats);
          setRecentUsers(data.recentUsers);
          setRecentMechanics(data.recentMechanics);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper: Format Date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Helper: Status Color
  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      Active: "bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400",
      Pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
      Rejected: "bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400",
      Frozen: "bg-gray-200 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300", 
    };
    const labelMap: Record<string, string> = {
      Active: "نشط",
      Pending: "معلق",
      Rejected: "مرفوض",
      Frozen: "مجمد"
    };
    
    const className = colorMap[status] || "bg-gray-200 text-gray-600";
    const label = labelMap[status] || status;

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${className}`}>
        {label}
      </span>
    );
  };

  // Loading View
  if (loading) {
    return (
      <div dir="rtl" className={`flex min-h-screen ${!dark ? "bg-gray-50" : "bg-[#0B1220]"}`}>
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className={!dark ? "text-gray-600" : "text-gray-400"}>جاري تحميل لوحة التحكم...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`
        flex min-h-screen transition-colors duration-500
        ${!dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"}
      `}
    >
      <AdminSidebar />
      <main className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 md:space-y-8 w-full overflow-x-hidden mt-12 lg:mt-0">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6">
          <div>
            <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold ${!dark ? "text-black" : "text-white"}`}>
              لوحة التحكم
            </h1>
            <p className={`text-sm md:text-base mt-1 ${!dark ? "text-gray-500" : "text-gray-400"}`}>
              أهلاً بك مجددًا أيها المدير، إليك ملخصاً لنشاط المنصة.
            </p>
          </div>

          <div className="flex items-center gap-3 md:gap-4 self-end sm:self-auto">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* STATS CARDS */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            <StatCard title="إجمالي المستخدمين" value={stats.totalUsers}   />
            <StatCard title="الحجوزات النشطة" value={stats.activeBookings} />
            <StatCard title="التحققات المعلقة" value={stats.pendingVerifications}  />
            <StatCard title="المراجعات الجديدة" value={stats.newReviews} />
          </div>
        )}

        {/* TABLES SECTION */}
        <div className="space-y-6 md:space-y-8">
          
          {/* USERS TABLE */}
          <Section title="تسجيلات المستخدمين الأخيرة">
            <TableWrapper>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${!dark ? "bg-gray-50 text-gray-700" : "bg-[#131c2f] text-gray-300"}`}>
                    <tr>
                      <th className="p-4 text-right font-semibold">الاسم</th>
                      <th className="p-4 text-right font-semibold">رقم الهاتف</th>
                      <th className="p-4 text-right font-semibold">البريد الإلكتروني</th>
                      <th className="p-4 text-right font-semibold">تاريخ التسجيل</th>
                      <th className="p-4 text-right font-semibold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${!dark ? "divide-gray-200" : "divide-gray-800"}`}>
                    {recentUsers.length > 0 ? (
                      recentUsers.map((user) => (
                        <tr key={user.id} className={`${!dark ? "hover:bg-gray-50" : "hover:bg-[#131c2f]"} transition-colors`}>
                          <td className="p-4 font-medium whitespace-nowrap">{user.name}</td>
                          <td className={`p-4 whitespace-nowrap ${!dark ? "text-gray-600" : "text-gray-400"}`}>{user.phone}</td>
                          <td className={`p-4 whitespace-nowrap ${!dark ? "text-gray-600" : "text-gray-400"}`}>{user.email}</td>
                          <td className={`p-4 whitespace-nowrap ${!dark ? "text-gray-600" : "text-gray-400"}`}>{formatDate(user.registeredAt)}</td>
                          <td className="p-4 whitespace-nowrap">{getStatusBadge(user.accountStatus)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">لا يوجد مستخدمين حديثين</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="md:hidden space-y-3">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <div key={user.id} className={`p-4 rounded-xl border ${!dark ? "bg-white border-gray-200" : "bg-[#0d1629] border-gray-800"}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{user.name}</h3>
                        {getStatusBadge(user.accountStatus)}
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
                          <span className="font-medium">الهاتف:</span> {user.phone}
                        </p>
                        <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
                          <span className="font-medium">البريد:</span> {user.email}
                        </p>
                        <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
                          <span className="font-medium">التسجيل:</span> {formatDate(user.registeredAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">لا يوجد مستخدمين حديثين</div>
                )}
              </div>
            </TableWrapper>
          </Section>

          {/* MECHANICS TABLE */}
          <Section title="تسجيلات الميكانيكيين الأخيرة">
            <TableWrapper>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`${!dark ? "bg-gray-50 text-gray-700" : "bg-[#131c2f] text-gray-300"}`}>
                    <tr>
                      <th className="p-4 text-right font-semibold">الاسم</th>
                      <th className="p-4 text-right font-semibold">رقم الهاتف</th>
                      <th className="p-4 text-right font-semibold">البريد الإلكتروني</th>
                      <th className="p-4 text-right font-semibold">تاريخ التسجيل</th>
                      <th className="p-4 text-right font-semibold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${!dark ? "divide-gray-200" : "divide-gray-800"}`}>
                    {recentMechanics.length > 0 ? (
                      recentMechanics.map((mech) => (
                        <tr key={mech.id} className={`${!dark ? "hover:bg-gray-50" : "hover:bg-[#131c2f]"} transition-colors`}>
                          <td className="p-4 font-medium whitespace-nowrap">{mech.name}</td>
                          <td className={`p-4 whitespace-nowrap ${!dark ? "text-gray-600" : "text-gray-400"}`}>{mech.phone}</td>
                          <td className={`p-4 whitespace-nowrap ${!dark ? "text-gray-600" : "text-gray-400"}`}>{mech.email}</td>
                          <td className={`p-4 whitespace-nowrap ${!dark ? "text-gray-600" : "text-gray-400"}`}>{formatDate(mech.registeredAt)}</td>
                          <td className="p-4 whitespace-nowrap">{getStatusBadge(mech.accountStatus)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">لا يوجد ميكانيكيين حديثين</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="md:hidden space-y-3">
                {recentMechanics.length > 0 ? (
                  recentMechanics.map((mech) => (
                    <div key={mech.id} className={`p-4 rounded-xl border ${!dark ? "bg-white border-gray-200" : "bg-[#0d1629] border-gray-800"}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{mech.name}</h3>
                        {getStatusBadge(mech.accountStatus)}
                      </div>
                      <div className="space-y-1 text-xs">
                        <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
                          <span className="font-medium">الهاتف:</span> {mech.phone}
                        </p>
                        <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
                          <span className="font-medium">البريد:</span> {mech.email}
                        </p>
                        <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
                          <span className="font-medium">التسجيل:</span> {formatDate(mech.registeredAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">لا يوجد ميكانيكيين حديثين</div>
                )}
              </div>
            </TableWrapper>
          </Section>

        </div>
      </main>
    </div>
  );
};

/* ---------------- SUB-COMPONENTS ---------------- */

interface StatCardProps {
  title: string;
  value: number;

}

const StatCard: React.FC<StatCardProps> = ({ title, value}) => {
  const { dark } = useTheme();
  
  return (
    <div
      className={`
        rounded-xl p-5 md:p-6 transition-all duration-300
        border shadow-sm
        ${!dark ? "bg-white border-gray-200 hover:shadow-md" : "bg-[#0d1629] border-gray-800 hover:border-gray-700"}
      `}
    >
      <p className={`text-sm mb-2 font-medium ${!dark ? "text-gray-500" : "text-gray-400"}`}>{title}</p>
      <h2 className={`text-3xl md:text-4xl font-bold ${!dark ? "text-[#1E3A5F]" : "text-white"}`}>
        {value.toLocaleString()}
      </h2>
      <div className="mt-4 flex items-center gap-2">
         {/* Icon placeholder */}
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
    <div className="space-y-3 md:space-y-4">
      <h2 className={`text-lg md:text-xl font-bold ${!dark ? "text-black" : "text-white"}`}>{title}</h2>
      {children}
    </div>
  );
};

const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dark } = useTheme();
  return (
    <div className={`
      rounded-xl overflow-hidden border transition-colors
      ${dark ? "border-gray-800 bg-[#0d1629]" : "border-gray-200 bg-white"}
    `}>
      {children}
    </div>
  );
};

export default AdminDashboard;