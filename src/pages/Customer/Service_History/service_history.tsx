
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCar } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

type ServiceRequest = {
  requestId: string;
  issueDescription: string;
  createdAt: string;
  status: string;
  serviceType: string;
  price?: number;
  rating?: {
    stars: number;
    comment?: string;
    createdAt?: string;
  } | null;
  car?: {
    id?: string;
    brand?: string;
    model?: string;
  };
  assignedMechanic?: {
    mechanicUserId?: string;
    firstName?: string;
    lastName?: string;
    profilePhotoUrl?: string;
    phoneNumber?: string;
  };
};

const ServiceHistory = () => {
  const [historyData, setHistoryData] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [cars, setCars] = useState<any[]>([]);
  const [selectedCar, setSelectedCar] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
    Submitted: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600",
    Dispatching: "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800",
    Accepted: "bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100",
    OnTheWay: "bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-100 dark:border-purple-800",
    Arrived: "bg-cyan-50 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800",
    InProgress: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-800",
    Completed: "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-100 dark:border-green-800",
    Cancelled: "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-100 dark:border-red-800",
  };

  const allowedStatuses = [
    "Accepted",
    "OnTheWay",
    "Arrived",
    "InProgress",
    "Completed",
  ];

  const filteredHistory = historyData.filter((item) => {
    const statusMatch = allowedStatuses.includes(item.status);
    const activeCar = cars.find((c) => `${c.year} ${c.brand} ${c.model}`.trim() === selectedCar.trim());
    
    if (!activeCar) return statusMatch;

    const carMatch = item.car?.id 
      ? item.car.id === activeCar.id 
      : (item.car?.brand && item.car?.model && 
         `${item.car.brand} ${item.car.model}` === `${activeCar.brand} ${activeCar.model}`);

    return statusMatch && carMatch;
  });

  const serviceTypeMap = {
    Diagnosis: "تشخيص",
    Tires: "إطارات",
    BodyRepair: "إصلاح هيكل",
    OilChange: "تغيير زيت",
  };

  const navigate = useNavigate();

  // --- جلب بيانات السيارات ---
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("https://gearupapp.runasp.net/api/customers/cars", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const carsData = Array.isArray(res.data) ? res.data : (res.data.cars || []);
        setCars(carsData);

        if (carsData.length > 0) {
          const savedCar = localStorage.getItem("selectedCar");
          if (savedCar && carsData.some((c: any) => `${c.year} ${c.brand} ${c.model}` === savedCar)) {
            setSelectedCar(savedCar);
          } else {
            const firstCarString = `${carsData[0].year} ${carsData[0].brand} ${carsData[0].model}`;
            setSelectedCar(firstCarString);
          }
        }
      } catch (error) {
        console.error("فشل جلب السيارات", error);
      }
    };
    
    if (token) fetchCars();
  }, [token]);

  // --- جلب سجل الطلبات ---
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
  const currentItems = filteredHistory.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  return (
    <div className="flex min-h-screen bg-white dark:bg-primary_BGD" dir="rtl">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-white dark:bg-primary_BGD">
       
          {/* Title Section & Car Selector */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-right w-full">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                عرض طلبات الصيانة
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                متابعة جميع طلبات الصيانة الخاصة بسيارتك
              </p>
            </div>
            
            {/* Car Filter Component */}
            {cars.length > 0 && (
              <div className="relative group w-auto min-w-[160px] md:w-48 shrink-0"> {/* تم التعديل هنا: w-full -> w-auto min-w-[160px] */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <FaCar size={14} />
                </div>
                <select 
                  value={selectedCar} 
                  onChange={(e) => { 
                    setSelectedCar(e.target.value); 
                    localStorage.setItem("selectedCar", e.target.value); 
                  }} 
                  className="w-full appearance-none bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-sm py-1.5 pr-9 pl-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all shadow-sm" 
                >
                  {cars.map((car, idx) => (
                    <option key={idx} value={`${car.year} ${car.brand} ${car.model}`}>
                      {car.year} {car.brand} {car.model}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <BsChevronDown size={10} />
                </div>
              </div>
            )}
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center p-12 min-h-[300px]">
                <span className="text-gray-500 dark:text-gray-300 text-lg">جاري التحميل...</span>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 md:p-12 min-h-[400px] text-center space-y-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                    <svg 
                        className="w-12 h-12 text-gray-400 dark:text-gray-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01M9 16h.01"></path>
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  لا يوجد طلبات صيانة
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  لم تقم بإرسال أي طلبات صيانة حالياً. عند إرسال طلب، ستظهر تفاصيله وسجله هنا.
                </p>
                <button 
                  onClick={() => navigate('/customer/maintenancerequest')} 
                  className="mt-4 px-6 py-2 bg-[#137FEC] hover:bg-blue-600 text-white rounded-lg transition duration-200 shadow-sm"
                >
                  طلب صيانة
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 1. DESKTOP TABLE VIEW (Compact) */}
                <div className="hidden md:block rounded-xl overflow-hidden shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs"> {/* Line size reduced to text-xs */}
                      <thead>
                        <tr className="bg-[#137FEC1A] dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                          <th className="p-2.5 whitespace-nowrap font-semibold"> المشكلة </th>
                          <th className="p-2.5 whitespace-nowrap font-semibold">السيارة</th>
                          <th className="p-2.5 whitespace-nowrap font-semibold">الخدمة</th>
                          <th className="p-2.5 whitespace-nowrap font-semibold">الحالة</th>
                          <th className="p-2.5 whitespace-nowrap font-semibold">الميكانيكي</th>
                          <th className="p-2.5 whitespace-nowrap font-semibold">التقييم</th>
                          <th className="p-2.5 whitespace-nowrap font-semibold">السعر</th>
                        </tr>
                      </thead>

                      <tbody className="text-gray-700 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentItems.map((row) => (
                          <tr
                            key={row.requestId}
                            onClick={() =>
                              navigate(
                                `/customer/maintenance_request/request_tracking/${row.requestId}`
                              )
                            }
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                          >
                            <td className="p-2.5 align-top">
                              <div className="font-bold text-gray-900 dark:text-gray-100 mb-0.5 max-w-[180px] truncate">
                                {row.issueDescription}
                              </div>
                              <div className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                 <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                 </svg>
                                <span>
                                  {row.createdAt
                                    ? new Date(row.createdAt + "Z").toLocaleString("ar-EG", {
                                        timeZone: "Africa/Cairo",
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : "-"}
                                </span>
                              </div>
                            </td>

                            <td className="p-2.5">
                              {row.car?.brand} {row.car?.model}
                            </td>

                            <td className="p-2.5">
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-medium">
                                {serviceTypeMap[row.serviceType as keyof typeof serviceTypeMap] || "—"}
                              </span>
                            </td>

                            <td className="p-2.5">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                  statusColorMap[
                                    row.status as keyof typeof statusColorMap
                                  ] ||
                                  "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                              >
                                {statusMap[row.status as keyof typeof statusMap] || "—"}
                              </span>
                            </td>

                            <td className="p-2.5">
                              <div className="flex items-center gap-2">
                                {row.assignedMechanic?.profilePhotoUrl ? (
                                  <img
                                    src={row.assignedMechanic.profilePhotoUrl}
                                    className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                                    alt="mechanic"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                                     <FaUser size={10} />
                                  </div>
                                )}
                                <span className="text-xs truncate max-w-[90px]">
                                  {row.assignedMechanic?.firstName} {row.assignedMechanic?.lastName}
                                </span>
                              </div>
                            </td>

                            <td className="p-2.5">
                              {row.rating ? (
                                <div className="relative group inline-block">
                                  <div className="flex text-yellow-400 gap-0.5 text-xs cursor-pointer">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i}>{i < row.rating!.stars ? "★" : "☆"}</span>
                                    ))}
                                  </div>
                                  {row.rating.comment && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-50">
                                      {row.rating.comment}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>

                            <td className="p-2.5 font-bold text-gray-800 dark:text-white">
                              {row.price !== null && row.price !== undefined ? (
                                <span className="text-green-600 dark:text-green-400 text-xs">
                                  {row.price.toLocaleString()} ج.م
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. MOBILE CARD VIEW (Readable) */}
                <div className="block md:hidden space-y-4">
                  {currentItems.map((row) => (
                    <div
                      key={row.requestId}
                      onClick={() =>
                        navigate(
                          `/customer/maintenance_request/request_tracking/${row.requestId}`
                        )
                      }
                      className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                    >
                      {/* Top Row: Title + Status */}
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-relaxed">
                          {row.issueDescription}
                        </h3>
                        <span
                          className={`shrink-0 inline-block px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                            statusColorMap[
                              row.status as keyof typeof statusColorMap
                            ] || "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {statusMap[row.status as keyof typeof statusMap] || "—"}
                        </span>
                      </div>

                      {/* Middle Section: Details Grid */}
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs mb-3">
                        
                        {/* Service Type */}
                        <div>
                          <span className="text-gray-400 block mb-0.5">نوع الخدمة</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {serviceTypeMap[row.serviceType as keyof typeof serviceTypeMap] || "—"}
                          </span>
                        </div>

                        {/* Car */}
                        <div>
                          <span className="text-gray-400 block mb-0.5">السيارة</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {row.car?.brand} {row.car?.model}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="col-span-2">
                          <span className="text-gray-400 block mb-0.5">تاريخ الطلب</span>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="font-medium">
                              {row.createdAt
                                ? new Date(row.createdAt + "Z").toLocaleString("ar-EG", {
                                    timeZone: "Africa/Cairo",
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section: Mechanic + Price/Rating */}
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        
                        {/* Mechanic */}
                        <div className="flex items-center gap-2">
                          {row.assignedMechanic?.profilePhotoUrl ? (
                            <img
                              src={row.assignedMechanic.profilePhotoUrl}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                              alt="mech"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700">
                              <FaUser size={12} />
                            </div>
                          )}
                          <div className="text-right">
                            <p className="text-[10px] text-gray-400">الميكانيكي</p>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                              {row.assignedMechanic?.firstName} {row.assignedMechanic?.lastName}
                            </p>
                          </div>
                        </div>

                        {/* Price & Rating */}
                        <div className="flex flex-col items-end gap-1">
                          {row.price !== null && row.price !== undefined ? (
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">
                              {row.price.toLocaleString()} ج.م
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                          
                          {row.rating ? (
                            <div className="flex text-yellow-400 text-[10px] gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>{i < row.rating!.stars ? "★" : "☆"}</span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {filteredHistory.length > itemsPerPage && (
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages || 1))
                }
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

export default ServiceHistory;
