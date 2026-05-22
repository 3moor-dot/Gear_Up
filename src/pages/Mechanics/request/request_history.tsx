import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Star, Car, User, Calendar, Clock } from "lucide-react";
import { FaSearch } from "react-icons/fa";

// استيراد المكونات
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";

// تعريف أنواع البيانات
type RequestItem = {
  requestId: string;
  status: string;
  requestType: string;
  serviceType: string;
  issueDescription: string;
  createdAt: string;
  car: {
    brand: string;
    model: string;
    plateNumber: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
  };
  price?: number;
  rating?: {
    stars: number;
    comment: string;
  };
};

const Mrequest_history = () => {
  const { dark } = useTheme();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  // خريطة الحالات العربية
  const statusMap: Record<string, string> = {
    Submitted: "تم الإرسال",
    Dispatching: "جاري التوزيع",
    Accepted: "تم القبول",
    OnTheWay: "في الطريق",
    Arrived: "وصل",
    InProgress: "قيد التنفيذ",
    Completed: "مكتمل",
    Cancelled: "ملغي",
  };

  // خريطة أنواع الخدمة
  const serviceTypeMap: Record<string, string> = {
    Tires: "إطارات",
    Battery: "بطارية",
    Engine: "محرك",
    Maintenance: "صيانة",
    OilChange: "تغيير زيت",
    Electrical: "كهرباء",
    Diagnosis: "تشخيص",
    BodyRepair: "إصلاح هيكل",
  };

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      Submitted: "bg-gray-100 text-gray-800 dark:bg-gray-600/20 dark:text-gray-300",
      Dispatching: "bg-blue-100 text-blue-800 dark:bg-blue-600/20 dark:text-blue-300",
      Accepted: "bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400",
      OnTheWay: "bg-purple-100 text-purple-800 dark:bg-purple-600/20 dark:text-purple-300",
      Arrived: "bg-cyan-100 text-cyan-800 dark:bg-cyan-600/20 dark:text-cyan-300",
      InProgress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-600/20 dark:text-yellow-300",
      Completed: "bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400",
      Cancelled: "bg-rose-100 text-rose-800 dark:bg-red-600/20 dark:text-red-400",
    };

    const displayLabel = statusMap[status] || status;

    return (
      <span
        className={`inline-block px-2.5 md:px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
          colorMap[status] || "bg-gray-600/20 text-gray-400"
        }`}
      >
        {displayLabel}
      </span>
    );
  };

  // جلب البيانات
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem("userToken");
        
        if (!token) return;

        const res = await axios.get(
          "https://gearupapp.runasp.net/api/mechanic/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRequests(res.data.requests || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("فشل تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const uniqueStatuses = [...new Set(requests.map((r) => r.status))];

  const getCount = (status: string) => {
    if (status === "all") return requests.length;
    return requests.filter((r) => r.status === status).length;
  };

  const tabs = [
    { id: "all", label: "الجميع", count: getCount("all") },
    ...uniqueStatuses.map((s) => ({
      id: s,
      label: statusMap[s] || s,
      count: getCount(s),
    })),
  ];

  const filteredRequests = requests
    .filter((req) => {
      const matchesTab = activeTab === "all" || req.status === activeTab;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        req.customer.firstName.toLowerCase().includes(searchLower) ||
        req.customer.lastName.toLowerCase().includes(searchLower) ||
        req.car.brand.toLowerCase().includes(searchLower) ||
        req.car.model.toLowerCase().includes(searchLower) ||
        req.issueDescription.toLowerCase().includes(searchLower) ||
        (serviceTypeMap[req.serviceType] || "").includes(searchLower);
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // دالة مساعدة لعرض النجوم
  const StarRatingDisplay = ({ stars}: { stars: number; comment?: string }) => {
    return (
      <div className="flex items-center gap-0.5 text-yellow-400">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Star
            key={starValue}
            size={12}
            fill={starValue <= Math.round(stars) ? "currentColor" : "none"}
            className={
              starValue <= Math.round(stars)
                ? "text-yellow-500"
                : "text-gray-300 dark:text-gray-600"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        dir="rtl"
        className={`flex min-h-screen ${!dark ? "bg-gray-50" : "bg-[#0B1220]"}`}
      >
        <MachineSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className={!dark ? "text-gray-600" : "text-gray-400"}>
              جاري تحميل الطلبات...
            </p>
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
      <MachineSidebar />
      <main className="flex-1 p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 w-full overflow-x-hidden">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6 mt-14 lg:mt-0">
          <h1
            className={`text-xl md:text-2xl lg:text-3xl font-bold ${
              !dark ? "text-black" : "text-white"
            }`}
          >
            طلبات الصيانة
          </h1>
          <div className="flex items-center gap-3 md:gap-4 self-end sm:self-auto">
            <NotificationBell size={25} />
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
          <FaSearch
            className={`text-base md:text-lg ${
              !dark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="البحث حسب العميل أو السيارة أو الخدمة..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={`flex-1 bg-transparent outline-none text-sm md:text-base ${
              !dark ? "text-gray-900" : "text-white"
            } placeholder-gray-500`}
          />
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
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

        {/* EMPTY */}
        {filteredRequests.length === 0 && (
          <div
            className={`flex flex-col items-center justify-center p-8 md:p-12 min-h-[400px] text-center space-y-4 rounded-xl ${
              !dark ? "bg-white shadow-md border border-gray-200" : "bg-[#0d1629] border border-gray-800"
            }`}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-2 ${!dark ? "bg-gray-100" : "bg-gray-800"}`}>
              <Car className={`w-12 h-12 ${!dark ? "text-gray-400" : "text-gray-500"}`} />
            </div>
            <h3 className={`text-xl font-bold ${!dark ? "text-gray-800" : "text-white"}`}>
              لا توجد طلبات
            </h3>
            <p className={!dark ? "text-gray-500 max-w-sm" : "text-gray-400 max-w-sm"}>
              لم يتم العثور على طلبات صيانة تطابق بحثك.
            </p>
          </div>
        )}

        {/* TABLE - Desktop */}
        {filteredRequests.length > 0 && (
          <div
            className={`hidden md:block rounded-xl overflow-hidden ${
              !dark ? "bg-white shadow-xl" : "bg-[#0d1629]"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr
                    className={`text-right text-xs lg:text-sm ${
                      !dark
                        ? "bg-gray-50 text-gray-700"
                        : "bg-[#131c2f] text-gray-300"
                    }`}
                  >
                    <th className="p-3 lg:p-4 font-semibold">المشكلة</th>
                    <th className="p-3 lg:p-4 font-semibold">العميل</th>
                    <th className="p-3 lg:p-4 font-semibold">السيارة</th>
                    <th className="p-3 lg:p-4 font-semibold">الخدمة</th>
                    <th className="p-3 lg:p-4 font-semibold">الحالة</th>
                    <th className="p-3 lg:p-4 font-semibold">التقييم</th>
                    <th className="p-3 lg:p-4 font-semibold">السعر</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((req) => (
                    <tr
                      key={req.requestId}
                      onClick={() =>
                        navigate(`/mechanics/request/mrequest_tracking/${req.requestId}`)
                      }
                      className={`border-b transition-colors cursor-pointer group ${
                        !dark
                          ? "border-gray-200 hover:bg-gray-50"
                          : "border-gray-800 hover:bg-[#131c2f]"
                      }`}
                    >
                      {/* Problem */}
                      <td className="p-3 lg:p-4 align-top">
                        <div className={` text-xs lg:text-sm mb-1 max-w-[200px] line-clamp-2 ${!dark ? "text-gray-900" : "text-gray-100"}`}>
                          {req.issueDescription}
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] lg:text-xs ${!dark ? "text-gray-500" : "text-gray-400"}`}>
                          <Calendar size={12} />
                          <span>
                            {new Date(req.createdAt + "Z").toLocaleString("en-GB")}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="p-3 lg:p-4 relative group/tooltip">
                        <div className="flex items-center gap-2">
                          {req.customer.profilePhotoUrl ? (
                            <img
                              src={req.customer.profilePhotoUrl}
                              alt="customer"
                              className={`w-8 h-8 rounded-full object-cover border ${!dark ? "border-gray-300" : "border-gray-600"}`}
                            />
                          ) : (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${!dark ? "bg-gray-200 border-gray-300" : "bg-gray-700 border-gray-600"}`}>
                              <User size={14} className={!dark ? "text-gray-500" : "text-gray-400"} />
                            </div>
                          )}
                          <div className="text-xs lg:text-sm font-medium truncate max-w-[100px]">
                            {req.customer.firstName} {req.customer.lastName}
                          </div>
                        </div>
                        {req.rating?.comment && (
                          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 rounded-lg shadow-lg bg-gray-900 text-white text-[10px] hidden group-hover/tooltip:block z-50">
                            "{req.rating.comment}"
                          </div>
                        )}
                      </td>

                      {/* Car */}
                      <td className={`p-3 lg:p-4 text-xs lg:text-sm ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                        <div className={` ${!dark ? "text-gray-900" : "text-gray-100"}`}>
                          {req.car.brand} {req.car.model}
                        </div>
                        <div className="text-[10px] lg:text-xs mt-0.5">
                          {req.car.plateNumber}
                        </div>
                      </td>

                      {/* Service */}
                      <td className={`p-3 lg:p-4 text-xs lg:text-sm ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                        {serviceTypeMap[req.serviceType] || "—"}
                      </td>

                      {/* Status */}
                      <td className="p-3 lg:p-4">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Rating */}
                      <td className="p-3 lg:p-4">
                        {req.rating ? (
                          <div className="relative group/star inline-block">
                            <StarRatingDisplay stars={req.rating.stars} />
                            {req.rating.comment && (
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg shadow-lg bg-gray-900 text-white text-[10px] text-center hidden group-hover/star:block z-50">
                                  "{req.rating.comment}"
                                </div>
                            )}
                          </div>
                        ) : (
                          <span className={`text-[10px] lg:text-xs ${!dark ? "text-gray-400" : "text-gray-500"}`}>غير مقيم</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="p-3 lg:p-4 font-bold">
                        {req.price !== null && req.price !== undefined ? (
                          <span className="text-green-600 dark:text-green-400 text-xs lg:text-sm">
                            {req.price.toLocaleString()} ج.م
                          </span>
                        ) : (
                          <span className={`text-xs ${!dark ? "text-gray-400" : "text-gray-500"}`}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION - Desktop */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t ${
                !dark ? "border-gray-200" : "border-gray-800"
              }`}
            >
              <p
                className={`text-xs md:text-sm ${
                  !dark ? "text-gray-600" : "text-gray-400"
                }`}
              >
                عرض {(currentPage - 1) * itemsPerPage + 1} إلى{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredRequests.length
                )}{" "}
                من {filteredRequests.length} طلب
              </p>
              <div className="flex gap-2">
                {Array.from(
                  { length: totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : !dark
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CARDS - Mobile */}
        {filteredRequests.length > 0 && (
          <div className="md:hidden space-y-3">
            {currentRequests.map((req) => (
              <div
                key={req.requestId}
                onClick={() =>
                  navigate(`/mechanics/request/mrequest_tracking/${req.requestId}`)
                }
                className={`p-4 rounded-xl cursor-pointer active:scale-[0.99] transition-transform ${
                  !dark
                    ? "bg-white shadow-md border border-gray-200"
                    : "bg-[#0d1629] border border-gray-800"
                }`}
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className={`text-sm font-bold line-clamp-2 leading-relaxed flex-1 ${!dark ? "text-gray-900" : "text-white"}`}>
                    {req.issueDescription}
                  </h3>
                  {getStatusBadge(req.status)}
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-3">
                  <div className="flex items-center gap-2">
                    {req.customer.profilePhotoUrl ? (
                      <img
                        src={req.customer.profilePhotoUrl}
                        className={`w-6 h-6 rounded-full object-cover border ${!dark ? "border-gray-200" : "border-gray-600"}`}
                        alt="customer"
                      />
                    ) : (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${!dark ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-gray-800 border-gray-700 text-gray-400"}`}>
                        <User size={10} />
                      </div>
                    )}
                    <div className="truncate">
                      <p className={`text-[10px] ${!dark ? "text-gray-400" : "text-gray-500"}`}>العميل</p>
                      <p className={`font-medium truncate max-w-[100px] ${!dark ? "text-gray-800" : "text-gray-200"}`}>
                        {req.customer.firstName}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className={`text-[10px] ${!dark ? "text-gray-400" : "text-gray-500"}`}>الخدمة</p>
                    <p className={`font-medium ${!dark ? "text-gray-800" : "text-gray-200"}`}>
                      {serviceTypeMap[req.serviceType] || "—"}
                    </p>
                  </div>

                  <div>
                    <p className={`text-[10px] ${!dark ? "text-gray-400" : "text-gray-500"}`}>التاريخ</p>
                    <div className={`flex items-center gap-1 ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                      <Clock size={10} />
                      <span className="truncate max-w-[80px]">
                        {new Date(req.createdAt + "Z").toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between ${!dark ? "border-gray-100" : "border-gray-800"}`}>
                  <div>
                    <p className={`text-[10px] mb-1 ${!dark ? "text-gray-400" : "text-gray-500"}`}>التقييم</p>
                    {req.rating ? (
                      <StarRatingDisplay stars={req.rating.stars} />
                    ) : (
                      <span className={`text-[10px] ${!dark ? "text-gray-500" : "text-gray-500"}`}>—</span>
                    )}
                  </div>

                  <div className="text-left">
                    <p className={`text-[10px] mb-1 ${!dark ? "text-gray-400" : "text-gray-500"}`}>السعر</p>
                    {req.price !== null && req.price !== undefined ? (
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">
                        {req.price.toLocaleString()} ج.م
                      </span>
                    ) : (
                      <span className={`text-xs ${!dark ? "text-gray-400" : "text-gray-500"}`}>—</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center gap-2 mt-4">
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : !dark
                      ? "bg-white text-gray-700 border border-gray-200"
                      : "bg-[#131c2f] text-gray-300 border border-gray-800"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Mrequest_history;
