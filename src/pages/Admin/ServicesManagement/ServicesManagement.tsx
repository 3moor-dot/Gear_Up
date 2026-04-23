import React, { useEffect, useState } from 'react';
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { FaEye, FaSearch, FaWrench, FaPlus } from "react-icons/fa";
import { useTheme } from "../../../contexts/ThemeContext";

// Interfaces
interface SubSpecialization {
  id: string;
  name: string;
}

interface ApiSpecialization {
  id: string;
  name: string;
  subSpecializations: SubSpecialization[];
}

interface ServiceDisplay {
  id: string;
  name: string;
  count: number; // عدد الخدمات الفرعية
}

const ServicesManagement: React.FC = () => {
  const { dark } = useTheme();
  
  const [allServices, setAllServices] = useState<ServiceDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // يمكن توسيع الفلاتر لاحقاً
  const [selectedService, setSelectedService] = useState<ServiceDisplay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Data
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("userToken");
      
      try {
        const response = await fetch("https://gearupapp.runasp.net/api/specializations", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data: ApiSpecialization[] = await response.json();
          const formattedData: ServiceDisplay[] = data.map(item => ({
            id: item.id,
            name: item.name,
            count: item.subSpecializations.length
          }));
          setAllServices(formattedData);
        } else {
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Tabs Logic
  const tabs = [
    { id: "all", label: "الكل", count: allServices.length },
    // يمكن إضافة فلاتر أخرى هنا حسب الحاجة
  ];

  const filteredServices = allServices.filter((s) => {
    const matchesTab = activeTab === "all";
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status Badge (Simulated for Services)
  const getStatusBadge = () => {
    // الخدمات عادة نشطة، لذا سنعرض شارة "نشط" كتصميم ثابت
    return (
      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap 
        ${!dark ? "bg-green-100 text-green-700" : "bg-green-600/20 dark:text-green-400"}`}>
        نشط
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
            <p className={!dark ? "text-gray-600" : "text-gray-400"}>جاري تحميل الخدمات...</p>
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
            إدارة الخدمات
          </h1>
          <div className="flex items-center gap-3 md:gap-4 self-end sm:self-auto">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* SEARCH & ADD BUTTON */}
        <div className="flex flex-col md:flex-row gap-4">
          <div
            className={`flex-1 flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl ${
              !dark
                ? "bg-white shadow-md border border-gray-200"
                : "bg-[#0d1629] border border-gray-800"
            }`}
          >
            <FaSearch className={`text-base md:text-lg ${!dark ? "text-gray-400" : "text-gray-500"}`} />
            <input
              type="text"
              placeholder="البحث عن خدمة رئيسية..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className={`flex-1 bg-transparent outline-none text-sm md:text-base ${!dark ? "text-gray-900" : "text-white"} placeholder-gray-500`}
            />
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#137FEC] hover:bg-blue-600 text-white rounded-xl font-bold text-sm md:text-base transition shadow-lg active:scale-95"
          >
            <FaPlus /> إضافة خدمة
          </button>
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
        {filteredServices.length === 0 && (
          <div className={`text-center py-16 rounded-xl ${!dark ? "bg-white" : "bg-[#0d1629]"}`}>
            <p className={!dark ? "text-gray-500" : "text-gray-400"}>لا توجد خدمات حالياً</p>
          </div>
        )}

        {/* TABLE - Desktop */}
        {filteredServices.length > 0 && (
          <div className={`hidden md:block rounded-xl overflow-hidden ${!dark ? "bg-white shadow-xl" : "bg-[#0d1629]"}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className={`text-right text-xs lg:text-sm ${!dark ? "bg-gray-50 text-gray-700" : "bg-[#131c2f] text-gray-300"}`}>
                    <th className="p-3 lg:p-4 font-semibold">الخدمة الرئيسية</th>
                    <th className="p-3 lg:p-4 font-semibold text-center">عدد الخدمات الفرعية</th>
                    <th className="p-3 lg:p-4 font-semibold text-center">الحالة</th>
                    <th className="p-3 lg:p-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedServices.map((service) => (
                    <tr
                      key={service.id}
                      className={`border-b transition-colors ${!dark ? "border-gray-200 hover:bg-gray-50" : "border-gray-800 hover:bg-[#131c2f]"}`}
                    >
                      <td className="p-3 lg:p-4 font-medium text-xs lg:text-sm flex items-center gap-2">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${!dark ? "bg-blue-50 text-blue-600" : "bg-blue-900/20 text-blue-400"}`}>
                           <FaWrench size={14} />
                         </div>
                         {service.name}
                      </td>
                      <td className="p-3 lg:p-4 text-center text-xs lg:text-sm font-bold text-[#137FEC]">
                        {service.count}
                      </td>
                      <td className="p-3 lg:p-4 text-center">
                        {getStatusBadge()}
                      </td>
                      <td className="p-3 lg:p-4">
                         <button onClick={() => setSelectedService(service)} className="p-2 hover:bg-[#137FEC1A] rounded-full transition-colors">
                            <FaEye size={18} color={dark ? "#E5E7EB" : "#1E293B"} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOR DESKTOP */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t ${!dark ? "border-gray-200" : "border-gray-800"}`}>
              <span className={`text-xs md:text-sm ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                عرض {(currentPage - 1) * itemsPerPage + 1} إلى {Math.min(currentPage * itemsPerPage, filteredServices.length)} من {filteredServices.length} خدمة
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
        {filteredServices.length > 0 && (
          <div className="md:hidden space-y-3">
            {paginatedServices.map((service) => (
              <div
                key={service.id}
                className={`p-4 rounded-xl ${!dark ? "bg-white shadow-md border border-gray-200" : "bg-[#0d1629] border border-gray-800"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                       <FaWrench size={14} className="text-[#137FEC]" /> {service.name}
                    </h3>
                    <p className={`text-xs ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                       تحتوي على <span className="font-bold text-[#137FEC]">{service.count}</span> خدمة فرعية
                    </p>
                  </div>
                  {getStatusBadge()}
                </div>
                <button onClick={() => setSelectedService(service)} className="w-full py-2 text-center text-sm font-medium text-[#137FEC] hover:bg-[#137FEC1A] rounded-lg transition-colors">
                  عرض الخدمات الفرعية
                </button>
              </div>
            ))}
            
            {/* PAGINATION FOR MOBILE */}
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
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedService(null)} />
      )}

      {/* DRAWER */}
      <div
        dir="rtl"
        className={`fixed top-0 left-0 h-full w-full sm:w-[420px] z-50 shadow-2xl transition-transform duration-300 overflow-y-auto
          ${selectedService ? "translate-x-0" : "-translate-x-full"}
          ${!dark ? "bg-white" : "bg-[#0d1629]"}
        `}
      >
        {/* Drawer Header */}
        <div className={`flex items-center justify-between p-5 border-b ${!dark ? "border-gray-200" : "border-gray-800"}`}>
          <h2 className="text-lg font-bold">تفاصيل الخدمة</h2>
          <button onClick={() => setSelectedService(null)} className={`w-8 h-8 flex items-center justify-center rounded-full transition ${!dark ? "hover:bg-gray-100 text-gray-600" : "hover:bg-gray-800 text-gray-400"}`}>
            ✕
          </button>
        </div>

        {/* Drawer Content */}
        {selectedService && (
          <div className="p-5 space-y-5">
             <div className="flex justify-center">
              {getStatusBadge()}
            </div>

            {/* Service Info */}
            <div className={`rounded-xl p-4 space-y-3 ${!dark ? "bg-gray-50 border border-gray-200" : "bg-[#131c2f] border border-gray-800"}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${!dark ? "text-gray-500" : "text-gray-400"}`}>الخدمة الرئيسية</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#137FEC] flex items-center justify-center text-white font-bold text-lg">
                  {selectedService.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedService.name}</p>
                  <p className={`text-xs ${!dark ? "text-gray-500" : "text-gray-400"}`}>خدمة رئيسية</p>
                </div>
              </div>
            </div>

            {/* Sub-Services List */}
            <div className={`rounded-xl p-4 space-y-2 ${!dark ? "bg-gray-50 border border-gray-200" : "bg-[#131c2f] border border-gray-800"}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${!dark ? "text-gray-500" : "text-gray-400"}`}>
                الخدمات الفرعية ({selectedService.count})
              </h3>
              {/* Note: Since we didn't fetch the full details, we are showing the main info. 
                  Ideally, we should fetch the full object including subSpecializations here. 
                  For now, let's just show a placeholder or a generic message because the list API might not send subNames. */}
              <p className={`text-sm text-center py-4 ${!dark ? "text-gray-500" : "text-gray-400"}`}>
                (لعرض الخدمات الفرعية بالتفصيل، يرجى فتح تفاصيل الخدمة من قاعدة البيانات)
              </p>
              <div className="text-center text-xs text-gray-400 mt-2">ID: {selectedService.id}</div>
            </div>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl
              bg-[#137FEC]/95" // تمتين الخلفية
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">إضافة خدمة جديدة</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white p-2">
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
               <div className="space-y-2">
                  <label className="text-white text-sm font-bold block">اسم الخدمة الرئيسية</label>
                  <input
                    type="text"
                    placeholder="مثال: كهرباء السيارات"
                    className="w-full p-3 rounded-xl bg-[#0A1F3A]/80 text-white outline-none focus:ring-2 focus:ring-white/50"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-white text-sm font-bold block">وصف الخدمة (اختياري)</label>
                  <textarea
                    rows={3}
                    placeholder="وصف قصير..."
                    className="w-full p-3 rounded-xl bg-[#0A1F3A]/80 text-white outline-none resize-none focus:ring-2 focus:ring-white/50"
                  />
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-black/20 text-white font-bold hover:bg-black/40 transition"
              >
                إلغاء
              </button>
              <button 
                onClick={() => { /* Implement Add Logic */ setIsModalOpen(false); }}
                className="flex-1 py-3 rounded-xl bg-white text-[#137FEC] font-bold hover:bg-gray-100 transition"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServicesManagement;