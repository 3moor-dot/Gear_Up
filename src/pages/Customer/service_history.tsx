
import Sidebar from "../../components/Customer/customer_sidebar";
import Header from "../../components/Customer/customer_header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



type ServiceRequest = {
  requestId: string;
  issueDescription: string;
  createdAt: string;
  status: string;
  serviceType: string;
  car?: {
    brand?: string;
    model?: string;
  };
  assignedMechanic?: {
    profilePhotoUrl?: string;
    firstName?: string;
    lastName?: string;
  };
};

const ServiceHistory = () => {
  // const [historyData, setHistoryData] = useState([]);
  const [historyData, setHistoryData] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = sessionStorage.getItem("userToken");

  const statusMap = {
    Submitted: "تم الإرسال",
    Dispatching: "جاري التوزيع",
    Accepted: "تم القبول",
    OnTheWay: "في الطريق",
    Arrived: "وصل",
    InProgress: "قيد التنفيذ",
    Completed: "مكتمل",
    Cancelled: "ملغي",
  };
  
  const statusColorMap = {
    Submitted: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    Dispatching: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Accepted: "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100",
    OnTheWay: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Arrived: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    InProgress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };


  const allowedStatuses = [
    "Accepted",
    "OnTheWay",
    "Arrived",
    "InProgress",
    "Completed",
  ];
  
  const filteredHistory = historyData.filter((item) =>
    allowedStatuses.includes(item.status)
  );

  
  const serviceTypeMap = {
    Diagnosis: "تشخيص",
    Tires: "إطارات",
    BodyRepair: "إصلاح هيكل",
    OilChange: "تغيير زيت",
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://gearupapp.runasp.net/api/requests/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setHistoryData(res.data?.requests || []);
        setCurrentPage(1);
      } catch {
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchHistory();
  }, [token]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  // const currentItems = historyData.slice(indexOfFirst, indexOfLast);
  // const totalPages = Math.ceil(historyData.length / itemsPerPage);
  const currentItems = filteredHistory.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="flex min-h-screen bg-white dark:bg-primary_BGD" dir="rtl">

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-white dark:bg-primary_BGD">



{/* Title Section */}
<div className="text-right">
  <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
    عرض طلبات الصيانة
  </h2>

  <p className="text-xs md:text-sm text-slate-400 mt-1">
    متابعة جميع طلبات الصيانة الخاصة بسيارتك
  </p>
</div>

          {/* TABLE CARD */}
          <div className="rounded-xl overflow-hidden shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="bg-[#137FEC1A] dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <th className="p-3"> المشكلة</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">السيارة</th>
                    <th className="p-3">الخدمة</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">الميكانيكي</th>
                  </tr>
                </thead>

                <tbody className="text-gray-700 dark:text-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center p-6">
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-6">
                        لا يوجد بيانات
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((row) => (

                <tr
                  key={row.requestId}
                  onClick={() => navigate(`/customer/maintenance_request/request_tracking/${row.requestId}`)}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                >

                        <td className="p-3">{row.issueDescription}</td>

                        <td className="p-3">
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="p-3">
                          {row.car?.brand} {row.car?.model}
                        </td>

                        <td className="p-3">{serviceTypeMap[row.serviceType as keyof typeof serviceTypeMap] || "—"}</td>

            
                        <td className="p-3">
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
      statusColorMap[row.status as keyof typeof statusColorMap] ||
      "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }`}
  >
    {statusMap[row.status as keyof typeof statusMap] || "—"}
  </span>
</td>


                        <td className="p-3 flex items-center gap-2">
                          <img
                            src={row.assignedMechanic?.profilePhotoUrl}
                            className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                          />
                          <span>
                            {row.assignedMechanic?.firstName}{" "}
                            {row.assignedMechanic?.lastName}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-3 text-gray-700 dark:text-gray-200">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            >
              السابق
            </button>

            <span>
              {currentPage} / {totalPages || 1}
            </span>

            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800"
              onClick={() =>
                setCurrentPage(p => Math.min(p + 1, totalPages || 1))
              }
            >
              التالي
            </button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ServiceHistory;
