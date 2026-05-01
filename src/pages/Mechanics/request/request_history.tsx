
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";

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
};

const statusColorMap: Record<string, string> = {
  Submitted: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  Dispatching: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Accepted: "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100",
  OnTheWay: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Arrived: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  InProgress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const Mrequest_history = () => {
  const { dark } = useTheme();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [pageGroup, setPageGroup] = useState(0);
  const pagesPerGroup = 5;
  const navigate = useNavigate();

  const statusMap: Record<string, string> = {
    Submitted: "تم الإرسال",
    Dispatching: "جاري التوجيه",
    Accepted: "تم القبول",
    OnTheWay: "في الطريق",
    Arrived: "تم الوصول",
    InProgress: "قيد التنفيذ",
    Completed: "مكتمل",
    Cancelled: "ملغي",
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem("userToken");

        const res = await axios.get(
          "https://gearupapp.runasp.net/api/mechanic/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRequests(res.data.requests);
      } catch {
        toast.error("فشل تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [requests]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(requests.length / itemsPerPage);

  const startPage = pageGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const serviceTypeMap: Record<string, string> = {
    Tires: "إطارات",
    Battery: "بطارية",
    Engine: "محرك",
    Maintenance: "صيانة",
    OilChange: "تغيير زيت",
    Electrical: "كهرباء",
  };

  return (
    <div className="flex min-h-screen">
      <MachineSidebar />

      <div
        className={`flex-1 p-4 md:p-6 transition-colors ${
          dark ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"
        }`}
      >
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-12 md:mt-0 mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">طلبات الصيانة</h1>
            <p
              className={`text-sm mt-1 ${
                dark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              عرض طلبات الصيانة
            </p>
          </div>
          
          {/* الأيقونات على اليسار بفضل justify-between في اتجاه RTL */}
          <div className="flex gap-3">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="rounded-xl shadow border border-gray-200 dark:border-gray-700">
              <table className="w-full text-right">
                {/* HEADER */}
                <thead
                  className={`${
                    dark ? "bg-[#1E293B] text-gray-200" : "bg-gray-100 text-gray-700"
                  } text-[10px] md:text-sm`}
                >
                  <tr>
                    <th className="p-2 md:p-4 font-semibold">المشكلة</th>
                    <th className="p-2 md:p-4 font-semibold">العميل</th>
                    <th className="p-2 md:p-4 font-semibold">السيارة</th>
                    <th className="p-2 md:p-4 font-semibold">الخدمة</th>
                    <th className="p-2 md:p-4 font-semibold">الحالة</th>
                    <th className="p-2 md:p-4 font-semibold">التاريخ</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody className={`divide-y ${dark ? "divide-gray-700" : "divide-gray-200"}`}>
                  {currentRequests.length > 0 ? (
                    currentRequests.map((req) => (
                      <tr
                        key={req.requestId}
                        onClick={() =>
                          navigate(
                            `/mechanics/request/mrequest_tracking/${req.requestId}`
                          )
                        }
                        className={`cursor-pointer transition ${
                          dark ? "hover:bg-[#1E293B]" : "hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-2 md:p-4 text-[10px] md:text-sm break-words ${
                            dark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {req.issueDescription}
                        </td>

                        <td className="p-2 md:p-4">
                          <div className="flex items-center gap-1 md:gap-3">
                            <img
                              src={req.customer.profilePhotoUrl || "/default-avatar.png"}
                              alt="customer"
                              className="w-6 h-6 md:w-9 md:h-9 rounded-full object-cover border flex-shrink-0"
                            />
                            <div className="font-medium text-[10px] md:text-sm leading-tight">
                              {req.customer.firstName} {req.customer.lastName}
                            </div>
                          </div>
                        </td>

                        <td className="p-2 md:p-4">
                          <div className="font-semibold text-[10px] md:text-sm leading-tight">
                            {req.car.brand} {req.car.model}
                          </div>
                          <div
                            className={`text-[9px] md:text-xs leading-tight ${
                              dark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {req.car.plateNumber}
                          </div>
                        </td>

                        <td className="p-2 md:p-4 text-[10px] md:text-sm">
                          {serviceTypeMap[req.serviceType] || "—"}
                        </td>

                        <td className="p-2 md:p-4">
                          <span
                            className={`px-1.5 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-xs font-medium block w-fit ${
                              statusColorMap[req.status] ||
                              "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {statusMap[req.status] || "—"}
                          </span>
                        </td>

                        <td className="p-2 md:p-4 text-[9px] md:text-xs text-gray-500">
                          {new Date(req.createdAt).toLocaleString('en-GB')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        // تم تعديل الارتفاع هنا: 50vh للموبايل لمنع السكرول، و 70vh للشاشات الكبيرة
                        className={`h-[50vh] md:h-[70vh] text-center text-gray-500 ${
                          dark ? "bg-[#0F172A]" : "bg-white"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                        <p className="text-lg">لا توجد طلبات حتى الآن</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 0 && (
              <div className="flex justify-center mt-4 gap-2 flex-wrap items-center">
                <button
                  onClick={() => setPageGroup((prev) => Math.max(prev - 1, 0))}
                  disabled={pageGroup === 0}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm ${
                    dark
                      ? "bg-[#1E293B] text-white hover:bg-gray-700 border border-gray-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  السابق
                </button>

                {visiblePages.map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm ${
                      currentPage === num
                        ? "bg-blue-600 text-white shadow-sm"
                        : dark
                        ? "bg-[#1E293B] text-white hover:bg-gray-700 border border-gray-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setPageGroup((prev) =>
                      endPage < totalPages ? prev + 1 : prev
                    )
                  }
                  disabled={endPage >= totalPages}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm ${
                    dark
                      ? "bg-[#1E293B] text-white hover:bg-gray-700 border border-gray-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  التالي
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mrequest_history;