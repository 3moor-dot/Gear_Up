
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Star, Car, User, Calendar, Clock } from "lucide-react";

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

  // خريطة الحالات الألوان (مطابقة للتصميم الجديد)
  const statusColorMap: Record<string, string> = {
    Submitted: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600",
    Dispatching: "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800",
    Accepted: "bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100",
    OnTheWay: "bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-100 dark:border-purple-800",
    Arrived: "bg-cyan-50 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800",
    InProgress: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-800",
    Completed: "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-100 dark:border-green-800",
    Cancelled: "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-100 dark:border-red-800",
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

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

  return (
    <div className="flex min-h-screen">
      <MachineSidebar />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-colors ${
          dark ? "bg-[#0F172A] text-white" : "bg-white text-black"
        }`}
      >
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-12 md:mt-0 mb-6 p-4 md:p-6 gap-4">
          <div className="text-right">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
              طلبات الصيانة
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              عرض طلبات الصيانة والتقييمات
            </p>
          </div>

          <div className="flex gap-3">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-white dark:bg-[#0F172A]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 dark:text-gray-300">جاري التحميل...</p>
            </div>
          ) : currentRequests.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center p-8 md:p-12 min-h-[400px] text-center space-y-4">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                <Car className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                لا توجد طلبات حالياً
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                لم يتم استلام أي طلبات صيانة حتى هذه اللحظة.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* 1. DESKTOP TABLE VIEW */}
              <div className="hidden md:block rounded-xl overflow-hidden shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                        <th className="p-3 font-semibold">المشكلة</th>
                        <th className="p-3 font-semibold">العميل</th>
                        <th className="p-3 font-semibold">السيارة</th>
                        <th className="p-3 font-semibold">الخدمة</th>
                        <th className="p-3 font-semibold">الحالة</th>
                        <th className="p-3 font-semibold">التقييم</th>
                        <th className="p-3 font-semibold">السعر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                      {currentRequests.map((req) => (
                        <tr
                          key={req.requestId}
                          onClick={() =>
                            navigate(`/mechanics/request/mrequest_tracking/${req.requestId}`)
                          }
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer group"
                        >
                          {/* Problem */}
                          <td className="p-3 align-top">
                            <div className="font-bold text-gray-900 dark:text-gray-100 mb-1 max-w-[200px] line-clamp-2">
                              {req.issueDescription}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                              <Calendar size={10} />
                              <span>
                                {new Date(req.createdAt + "Z").toLocaleString("en-GB")}
                              </span>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="p-3 relative group/tooltip">
                            <div className="flex items-center gap-2">
                              {req.customer.profilePhotoUrl ? (
                                <img
                                  src={req.customer.profilePhotoUrl}
                                  alt="customer"
                                  className="w-7 h-7 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                                  <User size={12} className="text-gray-500" />
                                </div>
                              )}
                              <div className="text-xs font-medium truncate max-w-[80px]">
                                {req.customer.firstName} {req.customer.lastName}
                              </div>
                            </div>
                            {/* Tooltip for Comment */}
                            {req.rating?.comment && (
                              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 rounded-lg shadow-lg bg-gray-900 text-white text-[10px] hidden group-hover/tooltip:block z-50">
                                "{req.rating.comment}"
                              </div>
                            )}
                          </td>

                          {/* Car */}
                          <td className="p-3">
                            <div className="text-xs font-bold">{req.car.brand} {req.car.model}</div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                              {req.car.plateNumber}
                            </div>
                          </td>

                          {/* Service */}
                          <td className="p-3">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-medium">
                              {serviceTypeMap[req.serviceType] || "—"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                statusColorMap[req.status] || "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {statusMap[req.status] || "—"}
                            </span>
                          </td>

                          {/* Rating */}
                          <td className="p-3">
                            {req.rating ? (
                              <div className="relative group/star">
                                <StarRatingDisplay stars={req.rating.stars} />
                                {req.rating.comment && (
                                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg shadow-lg bg-gray-900 text-white text-[10px] text-center hidden group-hover/star:block z-50">
                                      "{req.rating.comment}"
                                    </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-400">غير مقيم</span>
                            )}
                          </td>

                          {/* Price */}
                          <td className="p-3 font-bold">
                            {req.price !== null && req.price !== undefined ? (
                              <span className="text-green-600 dark:text-green-400">
                                {req.price.toLocaleString()} ج.م
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. MOBILE CARD VIEW */}
              <div className="block md:hidden space-y-4">
                {currentRequests.map((req) => (
                  <div
                    key={req.requestId}
                    onClick={() =>
                      navigate(`/mechanics/request/mrequest_tracking/${req.requestId}`)
                    }
                    className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    {/* Header: Issue + Status */}
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-relaxed flex-1">
                        {req.issueDescription}
                      </h3>
                      <span
                        className={`shrink-0 inline-block px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          statusColorMap[req.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusMap[req.status] || "—"}
                      </span>
                    </div>

                    {/* Body Grid */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-3">
                      {/* Customer */}
                      <div className="flex items-center gap-2">
                        {req.customer.profilePhotoUrl ? (
                          <img
                            src={req.customer.profilePhotoUrl}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                            alt="customer"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700">
                            <User size={10} />
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-[10px] text-gray-400">العميل</p>
                          <p className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[100px]">
                            {req.customer.firstName}
                          </p>
                        </div>
                      </div>

                      {/* Car */}
                      <div>
                        <p className="text-[10px] text-gray-400">السيارة</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {req.car.brand} {req.car.model}
                        </p>
                      </div>

                      {/* Service */}
                      <div>
                        <p className="text-[10px] text-gray-400">الخدمة</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {serviceTypeMap[req.serviceType] || "—"}
                        </p>
                      </div>

                      {/* Date */}
                      <div>
                        <p className="text-[10px] text-gray-400">التاريخ</p>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Clock size={10} />
                          <span className="truncate max-w-[80px]">
                            {new Date(req.createdAt + "Z").toLocaleDateString("en-GB")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Price + Rating */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      {/* Rating */}
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">التقييم</p>
                        {req.rating ? (
                          <StarRatingDisplay stars={req.rating.stars} />
                        ) : (
                          <span className="text-[10px] text-gray-500">—</span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-left">
                        <p className="text-[10px] text-gray-400 mb-1">السعر</p>
                        {req.price !== null && req.price !== undefined ? (
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">
                            {req.price.toLocaleString()} ج.م
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* PAGINATION */}
          {requests.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-4 text-gray-700 dark:text-gray-200 mt-6 pb-4">
              <button
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                السابق
              </button>

              <span className="text-xs font-medium">
                صفحة {currentPage} من {totalPages || 1}
              </span>

              <button
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition-colors"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages || 1))}
                disabled={currentPage === totalPages}
              >
                التالي
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Mrequest_history;
