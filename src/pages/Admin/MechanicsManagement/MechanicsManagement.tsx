import React, { useEffect, useState } from 'react';
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { FaEye, FaSearch } from "react-icons/fa";
import { useTheme } from "../../../contexts/ThemeContext";

// Types
interface ApiMechanic {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: number; 
  registeredAt: string;
}

interface MechanicDisplay {
  id: string;
  name: string;
  status: 'Active' | 'Pending' | 'Rejected'; 
  statusLabel: string; 
  phone: string;
  email: string;
  regDate: string;
}

const MechanicsManagement: React.FC = () => {
  const { dark } = useTheme();
  
  const [allMechanics, setAllMechanics] = useState<MechanicDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMechanic, setSelectedMechanic] = useState<MechanicDisplay | null>(null);
  
  // ✅ Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // عدد العناصر في الصفحة

  // Fetch Data
  useEffect(() => {
    const fetchMechanics = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("userToken");
      
      try {
        const response = await fetch("https://gearupapp.runasp.net/api/admin/mechanics", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data: ApiMechanic[] = await response.json();
          const formattedData: MechanicDisplay[] = data.map(item => {
            const statusInfo = mapStatus(item.status);
            return {
              id: item.id,
              name: `${item.firstName} ${item.lastName}`,
              status: statusInfo.status,
              statusLabel: statusInfo.label,
              phone: item.phone,
              email: item.email,
              regDate: formatDate(item.registeredAt)
            };
          });
          setAllMechanics(formattedData);
        } else {
          console.error("Failed to fetch mechanics");
        }
      } catch (error) {
        console.error("Error fetching mechanics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  // Status Logic
  const mapStatus = (status: number) => {
    if (status === 2) return { status: 'Active' as const, label: 'نشط' };
    if (status === 1) return { status: 'Pending' as const, label: 'معلق' };
    return { status: 'Rejected' as const, label: 'مرفوض' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Tabs Logic
  const tabs = [
    { id: "all", label: "الكل", count: allMechanics.length },
    { id: "Active", label: "نشط", count: allMechanics.filter(m => m.status === 'Active').length },
    { id: "Pending", label: "معلق", count: allMechanics.filter(m => m.status === 'Pending').length },
    { id: "Rejected", label: "مرفوض", count: allMechanics.filter(m => m.status === 'Rejected').length },
  ];

  const filteredMechanics = allMechanics.filter((m) => {
    const matchesTab = activeTab === "all" || m.status === activeTab;
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredMechanics.length / itemsPerPage);
  const paginatedMechanics = filteredMechanics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      Active: "bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400",
      Pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
      Rejected: "bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400",
    };
    
    const label = tabs.find(t => t.id === status)?.label || status;
    return (
      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${colorMap[status] || "bg-gray-200 text-gray-600"}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div dir="rtl" className={`flex min-h-screen ${!dark ? "bg-gray-50" : "bg-[#0B1220]"}`}>
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className={!dark ? "text-gray-600" : "text-gray-400"}>جاري تحميل الميكانيكيين...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`flex min-h-screen transition-colors duration-500 ${
        !dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"
      }`}
    >
      <AdminSidebar />
      <main className="flex-1 p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 w-full overflow-x-hidden mt-12 lg:mt-0">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6">
          <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold ${!dark ? "text-black" : "text-white"}`}>
            إدارة الميكانيكيين
          </h1>
          <div className="flex items-center gap-3 md:gap-4 self-end sm:self-auto">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* SEARCH */}
        <div
          className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl ${
            !dark
              ? "bg-white shadow-md border border-gray-200"
              : "bg-[#0d1629] border border-gray-800"
          }`}
        >
          <FaSearch className={`text-base md:text-lg ${!dark ? "text-gray-400" : "text-gray-500"}`} />
          <input
            type="text"
            placeholder="البحث حسب الاسم أو البريد أو الهاتف..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className={`flex-1 bg-transparent outline-none text-sm md:text-base ${!dark ? "text-gray-900" : "text-white"} placeholder-gray-500`}
          />
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
              className={`px-3 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : !dark
                  ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  : "bg-[#0d1629] text-gray-300 hover:bg-[#131c2f] border border-gray-800"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredMechanics.length === 0 && (
          <div className={`text-center py-16 rounded-xl ${!dark ? "bg-white" : "bg-[#0d1629]"}`}>
            <p className={!dark ? "text-gray-500" : "text-gray-400"}>لا يوجد ميكانيكيين بهذا الفلتر</p>
          </div>
        )}

        {/* TABLE - Desktop */}
        {filteredMechanics.length > 0 && (
          <div className={`hidden md:block rounded-xl overflow-hidden ${!dark ? "bg-white shadow-xl" : "bg-[#0d1629]"}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className={`text-right text-xs lg:text-sm ${!dark ? "bg-gray-50 text-gray-700" : "bg-[#131c2f] text-gray-300"}`}>
                    <th className="p-3 lg:p-4 font-semibold">الميكانيكي</th>
                    <th className="p-3 lg:p-4 font-semibold">الحالة</th>
                    <th className="p-3 lg:p-4 font-semibold">رقم الهاتف</th>
                    <th className="p-3 lg:p-4 font-semibold">البريد الإلكتروني</th>
                    <th className="p-3 lg:p-4 font-semibold">تاريخ التسجيل</th>
                    <th className="p-3 lg:p-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMechanics.map((mechanic) => (
                    <tr
                      key={mechanic.id}
                      className={`border-b transition-colors ${!dark ? "border-gray-200 hover:bg-gray-50" : "border-gray-800 hover:bg-[#131c2f]"}`}
                    >
                      <td className="p-3 lg:p-4 font-medium text-xs lg:text-sm">{mechanic.name}</td>
                      <td className="p-3 lg:p-4">{getStatusBadge(mechanic.status)}</td>
                      <td className={`p-3 lg:p-4 text-xs lg:text-sm ${!dark ? "text-gray-600" : "text-gray-400"}`}>{mechanic.phone}</td>
                      <td className={`p-3 lg:p-4 text-xs lg:text-sm ${!dark ? "text-gray-600" : "text-gray-400"}`}>{mechanic.email}</td>
                      <td className={`p-3 lg:p-4 text-xs lg:text-sm ${!dark ? "text-gray-600" : "text-gray-400"}`}>{mechanic.regDate}</td>
                      <td className="p-3 lg:p-4">
                         <button onClick={() => setSelectedMechanic(mechanic)} className="p-2 hover:bg-[#137FEC1A] rounded-full transition-colors">
                            <FaEye size={18} color={dark ? "#E5E7EB" : "#1E293B"} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ HERE IS THE PAGINATION SECTION (DESKTOP) */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t ${!dark ? "border-gray-200" : "border-gray-800"}`}>
              <span className={`text-xs md:text-sm ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                عرض {(currentPage - 1) * itemsPerPage + 1} إلى {Math.min(currentPage * itemsPerPage, filteredMechanics.length)} من {filteredMechanics.length} ميكانيكي
              </span>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : !dark
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CARDS - Mobile */}
        {filteredMechanics.length > 0 && (
          <div className="md:hidden space-y-3">
            {paginatedMechanics.map((mechanic) => (
              <div
                key={mechanic.id}
                className={`p-4 rounded-xl ${!dark ? "bg-white shadow-md border border-gray-200" : "bg-[#0d1629] border border-gray-800"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{mechanic.name}</h3>
                    <p className={`text-xs ${!dark ? "text-gray-600" : "text-gray-400"}`}>{mechanic.email}</p>
                  </div>
                  {getStatusBadge(mechanic.status)}
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className={dark ? "text-gray-400" : "text-gray-600"}>الهاتف:</span>
                    <span className="font-medium">{mechanic.phone}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={dark ? "text-gray-400" : "text-gray-600"}>التسجيل:</span>
                    <span className="font-medium">{mechanic.regDate}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedMechanic(mechanic)} className="w-full py-2 text-center text-sm font-medium text-[#137FEC] hover:bg-[#137FEC1A] rounded-lg transition-colors">
                  عرض التفاصيل
                </button>
              </div>
            ))}

            {/* ✅ HERE IS THE PAGINATION SECTION (MOBILE) */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : !dark
                        ? "bg-white text-gray-700 border border-gray-200"
                        : "bg-[#131c2f] text-gray-300 border border-gray-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* OVERLAY */}
      {selectedMechanic && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedMechanic(null)} />
      )}

      {/* DRAWER */}
      <div
        dir="rtl"
        className={`fixed top-0 left-0 h-full w-full sm:w-[420px] z-50 shadow-2xl transition-transform duration-300 overflow-y-auto
          ${selectedMechanic ? "translate-x-0" : "-translate-x-full"}
          ${!dark ? "bg-white" : "bg-[#0d1629]"}
        `}
      >
        {/* Drawer Header */}
        <div className={`flex items-center justify-between p-5 border-b ${!dark ? "border-gray-200" : "border-gray-800"}`}>
          <h2 className="text-lg font-bold">تفاصيل الميكانيكي</h2>
          <button onClick={() => setSelectedMechanic(null)} className={`w-8 h-8 flex items-center justify-center rounded-full transition ${!dark ? "hover:bg-gray-100 text-gray-600" : "hover:bg-gray-800 text-gray-400"}`}>
            ✕
          </button>
        </div>

        {/* Drawer Content */}
        {selectedMechanic && (
          <div className="p-5 space-y-5">
            <div className="flex justify-center">
              {getStatusBadge(selectedMechanic.status)}
            </div>

            {/* Mechanic Info */}
            <div className={`rounded-xl p-4 space-y-3 ${!dark ? "bg-gray-50 border border-gray-200" : "bg-[#131c2f] border border-gray-800"}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${!dark ? "text-gray-500" : "text-gray-400"}`}>البيانات الشخصية</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {selectedMechanic.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedMechanic.name}</p>
                  <p className={`text-xs ${!dark ? "text-gray-500" : "text-gray-400"}`}>ميكانيكي</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className={`rounded-xl p-4 space-y-1 ${!dark ? "bg-gray-50 border border-gray-200" : "bg-[#131c2f] border border-gray-800"}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${!dark ? "text-gray-500" : "text-gray-400"}`}>معلومات الاتصال</h3>
              {[
                { label: "رقم الهاتف", value: selectedMechanic.phone, icon: "📞" },
                { label: "البريد الإلكتروني", value: selectedMechanic.email, icon: "✉️" },
                { label: "تاريخ التسجيل", value: selectedMechanic.regDate, icon: "📅" },
                { label: "الحالة الحالية", value: selectedMechanic.statusLabel, icon: "⚠️" },
              ].map(({ label, value, icon }) => (
                <div key={label} className={`flex items-center justify-between py-2 border-b last:border-0 ${!dark ? "border-gray-200" : "border-gray-700"}`}>
                  <span className={`text-sm ${!dark ? "text-gray-500" : "text-gray-400"}`}>{icon} {label}</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
            
             {/* ID Display */}
             <div className={`rounded-xl p-4 text-center ${!dark ? "bg-gray-50 border border-gray-200" : "bg-[#131c2f] border border-gray-800"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${!dark ? "text-gray-500" : "text-gray-400"}`}>المعرف الفريد (ID)</p>
                <p className="text-sm font-mono text-blue-600 dark:text-blue-400 break-all">{selectedMechanic.id}</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicsManagement;