
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Customer/customer_header";
import Sidebar from "../../../components/Customer/customer_sidebar";

// --- Types ---
type ServiceRequest = {
  requestId: string;
  issueDescription: string;
  createdAt: string;
  status: string;
  serviceType: string;
};

type Car = {
  id: string;
  brand?: string;
  model?: string;
  year?: number;
  plateNumber?: string;
  carPhotoUrl?: string;
};

// --- تعديل الـ Type ليحتوي على nextScheduledAt ---
type Reminder = {
  id: number;
  name: string;
  title?: string;
  startDate: string;
  frequencyType: string | number;
  intervalValue?: number;
  intervalUnit?: string | number;
  status: string;
  carId: number | string; // تأكد أنه يتوافق مع معرف السيارة
  nextScheduledAt?: string; // خاصية جديدة تظهر في القادمة
};

// --- تعديل الـ Type ليتوافق مع رابط /api/mechanics ---
type Mechanic = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePhotoUrl: string | null;
  avgRating: number;
  isAvailable: boolean;
  isVerified: boolean;
  specializations: string[];
};

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

const serviceIconMap: Record<string, string> = {
  Diagnosis: "🔍",
  Tires: "🛞",
  BodyRepair: "🛠️",
  OilChange: "🛢️",
};

const allowedStatuses = [
  "Accepted",
  "OnTheWay",
  "Arrived",
  "InProgress",
  "Completed",
];

const formatToEgyptDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("T")[0].split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const getFrequencyLabel = (r: Reminder) => {
  const rawType = String(r.frequencyType ?? "").toLowerCase();
  const val = Number(r.intervalValue ?? 0);
  const unitKey = String(r.intervalUnit ?? "0");

  switch (rawType) {
    case "0":
    case "once":
      return "مرة واحدة";
    case "1":
    case "daily":
      return "يومي";
    case "2":
    case "weekly":
      return "أسبوعي";
    case "3":
    case "monthly":
      return "شهري";
    case "4":
    case "yearly":
      return "سنوي";
    case "5":
    case "custom":
    case "custominterval": {
      const unitMap: Record<string, string> = {
        "0": "أيام",
        "1": "أسابيع",
        "2": "شهور",
        "3": "سنوات",
      };
      return `كل ${val} ${unitMap[unitKey] ?? "أيام"}`;
    }
    default:
      return "";
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("userToken");

  const [historyData, setHistoryData] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);

  // --- تعديل الاستيت هنا ---
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(false);
  const [daysAhead] = useState<number>(7); // القادمة خلال 7 أيام

  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [mechanicsLoading, setMechanicsLoading] = useState(false);
  const [showAllMechanics, setShowAllMechanics] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://gearupapp.runasp.net/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data?.firstName || "");
      } catch {
        setUserName("");
      }
    };
    if (token) fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("https://gearupapp.runasp.net/api/requests/cars", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(res.data?.cars || []);
      } catch {
        setCars([]);
      }
    };
    if (token) fetchCars();
  }, [token]);

  useEffect(() => {
    const fetchMechanics = async () => {
      setMechanicsLoading(true);
      try {
        const res = await axios.get("https://gearupapp.runasp.net/api/mechanics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw: Mechanic[] = Array.isArray(res.data?.data) ? res.data.data : [];
        // ترتيب الميكانيكيين حسب الأعلى تقييماً
        const sorted = raw.sort((a, b) => b.avgRating - a.avgRating);
        setMechanics(sorted);
      } catch {
        setMechanics([]);
      } finally {
        setMechanicsLoading(false);
      }
    };
    if (token) fetchMechanics();
  }, [token]);

  // --- التعديل الجديد: جلب التذكيرات من /upcoming ---
  useEffect(() => {
    const fetchUpcomingReminders = async () => {
      if (!token) return;
      setRemindersLoading(true);
      try {
        const res = await axios.get(
          `https://gearupapp.runasp.net/api/Reminder/upcoming?daysAhead=${daysAhead}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = Array.isArray(res.data) ? res.data : [];
        setUpcomingReminders(data);
      } catch {
        setUpcomingReminders([]);
      } finally {
        setRemindersLoading(false);
      }
    };
    fetchUpcomingReminders();
  }, [token, daysAhead]);

  // الاستماع لأحداث التحديث (من مكونات أخرى)
  useEffect(() => {
    const handleRefresh = () => {
      // إعادة جلب البيانات القادمة فقط
      axios
        .get(`https://gearupapp.runasp.net/api/Reminder/upcoming?daysAhead=${daysAhead}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUpcomingReminders(Array.isArray(res.data) ? res.data : []))
        .catch(() => setUpcomingReminders([]));
    };

    window.addEventListener("reminderCompleted", handleRefresh);
    window.addEventListener("reminderSnoozed", handleRefresh);
    return () => {
      window.removeEventListener("reminderCompleted", handleRefresh);
      window.removeEventListener("reminderSnoozed", handleRefresh);
    };
  }, [token, daysAhead]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://gearupapp.runasp.net/api/requests/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistoryData(res.data?.requests || []);
      } catch {
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchHistory();
  }, [token]);

  const dashboardHistory = historyData
    .filter((item) => allowedStatuses.includes(item.status))
    .slice(0, 3);

  // --- الفلترة الجديدة: نأخذ القادمة للكل ونفلترها حسب السيارة المختارة ---
  const displayedReminders = upcomingReminders
    .filter((r) => String(r.carId) === String(cars[selectedCarIndex]?.id))
    .slice(0, 3);

  const handleSwitchCar = () => {
    if (cars.length > 1) {
      setSelectedCarIndex((prev) => (prev + 1) % cars.length);
    }
  };

  const displayedMechanics = showAllMechanics ? mechanics : mechanics.slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden dark:bg-primary_BGD" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="text-right">
            <h2 className="text-xl md:text-2xl font-bold dark:text-white">
              أهلاً بعودتك{userName ? ` يا ${userName}` : ""}!
            </h2>
            <p className="text-gray-400 text-xs md:text-sm">
              إليك نظرة عامة سريعة على حالة سيارتك.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="col-span-1 lg:col-span-8 space-y-6">
              {/* كارت السيارة */}
              <div className="bg-[#137FEC1A] dark:bg-[#162240] rounded-[25px] md:rounded-[30px] p-6 flex flex-col md:flex-row items-center justify-between border border-blue-100 dark:border-blue-900/40 gap-6 shadow-sm min-h-[200px]">
                {cars.length === 0 ? (
                  <div className="flex-1 text-center text-gray-400 dark:text-gray-500 py-8">
                    <p className="text-5xl mb-3">🚗</p>
                    <p className="font-bold text-base dark:text-gray-300">لا توجد سيارات مضافة بعد</p>
                    <p className="text-xs mt-1">قم بإضافة سيارتك من الملف الشخصي</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center md:text-right w-full md:w-auto">
                      <h3 className="text-lg md:text-xl font-bold dark:text-white">
                        {cars[selectedCarIndex]?.year || "----"}{" "}
                        {cars[selectedCarIndex]?.brand || ""}{" "}
                        {cars[selectedCarIndex]?.model || ""}
                      </h3>
                      {cars[selectedCarIndex]?.plateNumber && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 break-all md:break-normal mt-1">
                          {cars[selectedCarIndex].plateNumber} :رقم اللوحة
                        </p>
                      )}
                      {cars.length > 1 && (
                        <button
                          onClick={handleSwitchCar}
                          className="bg-[#137FEC] text-white w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors active:scale-95 mt-4"
                        >
                          <span>تبديل المركبة ({selectedCarIndex + 1}/{cars.length})</span> ⇅
                        </button>
                      )}
                    </div>
                    <div className="h-32 md:h-48 flex items-center justify-center">
                      {cars[selectedCarIndex]?.carPhotoUrl ? (
                        <img
                          src={cars[selectedCarIndex].carPhotoUrl}
                          className="h-full object-contain"
                          alt="Car"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-7xl opacity-50">🚙</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* الصيانة القادمة - تم تعديل البيانات المعروضة هنا */}
              <div className="bg-[#137FEC1A] dark:bg-[#162240] rounded-[25px] md:rounded-[30px] p-6 md:p-8 shadow-sm border border-blue-100 dark:border-blue-900/40">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[#137FEC] font-bold border-b-2 border-[#137FEC] inline-block pb-1">
                    الصيانة القادمة
                  </h4>
                  <button
                    onClick={() => navigate("/customer/maintenance_reminders")}
                    className="text-[10px] text-[#137FEC] underline hover:text-blue-400 transition-colors"
                  >
                    عرض الكل
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {remindersLoading ? (
                    <div className="col-span-full flex items-center justify-center py-8 gap-3">
                      <div className="w-5 h-5 border-2 border-[#137FEC] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-gray-400">جاري تحميل التذكيرات...</span>
                    </div>
                  ) : displayedReminders.length > 0 ? (
                    displayedReminders.map((r) => (
                      <div
                        key={r.id}
                        className="bg-[#93C5FD] dark:bg-[#1e2d4d] p-4 rounded-2xl flex items-center gap-4 text-white border border-blue-200 dark:border-blue-800/30 hover:bg-[#7BB8FC] dark:hover:bg-[#253a5e] transition-all cursor-pointer group"
                        onClick={() => navigate("/customer/maintenance_reminders")}
                      >
                        <div className="bg-[#137FEC] dark:bg-[#0d6dd6] p-3 rounded-full shrink-0 shadow-md group-hover:scale-110 transition-transform">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                        </div>
                        <div className="text-right flex-1 min-w-0">
                          <p className="font-bold text-sm md:text-base truncate">
                            {r.name || r.title || "تذكير صيانة"}
                          </p>
                          {/* تعديل: استخدام nextScheduledAt إذا وجد، وإلا startDate */}
                          <p className="text-[10px] opacity-80">
                            {formatToEgyptDate(r.nextScheduledAt || r.startDate)}
                          </p>
                          {getFrequencyLabel(r) && (
                            <span className="inline-block mt-1 text-[9px] bg-white/20 dark:bg-white/10 px-2 py-0.5 rounded-full opacity-70">
                              {getFrequencyLabel(r)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-4xl mb-3 opacity-40">📋</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">لا توجد صيانات قادمة لهذه السيارة</p>
                      <button
                        onClick={() => navigate("/customer/maintenance_reminders")}
                        className="mt-3 text-[11px] text-[#137FEC] font-bold underline hover:text-blue-400 transition-colors"
                      >
                        إنشاء تذكير جديد
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-4 space-y-6">
              {/* العثور على ميكانيكي */}
              <div className="bg-[#137FECE5] dark:bg-[#162240] rounded-[25px] md:rounded-[30px] p-6 text-white border border-blue-300 dark:border-blue-900/40 shadow-sm flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2 text-center md:text-right">
                  <div>
                    <h4 className="font-bold text-lg">
                      {showAllMechanics ? "كل الميكانيكيين" : "العثور على ميكانيكي"}
                    </h4>
                    <p className="text-sm text-white/80 mt-1">
                      {showAllMechanics ? "الكل " : "الأعلى تقييماً"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAllMechanics(!showAllMechanics)}
                    // className="text-[11px] text-[#137FEC] underline hover:text-blue-400 transition-colors font-bold"
                    className="text-[11px] text-white dark:text-[#137FEC] underline hover:text-gray-200 dark:hover:text-blue-400 transition-colors font-bold"
                  >
                    {showAllMechanics ? "عرض الأعلى" : "عرض الكل"}
                  </button>
                </div>

                <div className={`space-y-4 overflow-y-auto pr-1 ${showAllMechanics ? "max-h-[500px]" : ""} custom-scrollbar`}>
                  {mechanicsLoading ? (
                    <div className="flex items-center justify-center py-6 gap-3">
                      <div className="w-5 h-5 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px] text-white/60">جاري التحميل...</span>
                    </div>
                  ) : displayedMechanics.length > 0 ? (
                    displayedMechanics.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white/20 dark:bg-[#1e2d4d] p-4 rounded-2xl flex items-center gap-4 hover:bg-white/30 dark:hover:bg-[#253656] transition-all cursor-pointer border border-white/10 dark:border-blue-800/30"
                        onClick={() => navigate(`/ai_mechanic_profile/${m.id}`)}
                      >
                        <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-white/40 dark:border-blue-700 shadow-sm flex items-center justify-center bg-white/10">
                          {m.profilePhotoUrl ? (
                            <img
                              src={m.profilePhotoUrl}
                              alt={m.firstName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                (e.target as HTMLImageElement).parentElement!.innerHTML = `
                                   <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                     <circle cx="12" cy="7" r="4"></circle>
                                   </svg>`;
                              }}
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          )}
                        </div>

                        <div className="text-right flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col min-w-0">
                              <p className="text-sm font-bold truncate text-white">
                                {m.firstName} {m.lastName}
                              </p>
                              <p className="text-[10px] text-white/70 mt-0.5 font-medium tracking-wide flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                {m.phoneNumber}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-400/20 px-1.5 py-0.5 rounded-md shrink-0 mr-2">
                              <span className="text-[10px] font-bold text-yellow-300">{m.avgRating}</span>
                              <span className="text-[10px]">⭐</span>
                            </div>
                          </div>
                        </div>

                        <button className="text-white/50 hover:text-white transition-colors mt-1 shrink-0">
                          ←
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-2 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <p className="text-[11px] text-white/60 font-medium">لا يوجد ميكانيكيين حالياً</p>
                    </div>
                  )}
                </div>
              </div>

              {/* تاريخ الخدمة */}
              <div className="bg-[#137FEC1A] dark:bg-[#162240] rounded-[25px] md:rounded-[30px] p-6 border border-blue-100 dark:border-blue-900/40 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-gray-700 dark:text-white">تاريخ الخدمة</h4>
                  <button
                    onClick={() => navigate("/customer/servicehistory")}
                    className="text-[10px] text-[#137FEC] underline hover:text-blue-400 transition-colors"
                  >
                    عرض الكل
                  </button>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <p className="text-center text-gray-400 text-xs py-4">جاري التحميل...</p>
                  ) : dashboardHistory.length === 0 ? (
                    <p className="text-center text-gray-400 text-xs py-4">لا يوجد سجل خدمات حتى الآن</p>
                  ) : (
                    dashboardHistory.map((service) => (
                      <div
                        key={service.requestId}
                        onClick={() =>
                          navigate(`/customer/maintenance_request/request_tracking/${service.requestId}`)
                        }
                        className="bg-[#0F132312] dark:bg-[#1e2d4d] rounded-xl flex items-center gap-3 p-3 border border-gray-100 dark:border-blue-800/30 cursor-pointer hover:bg-[#0F132320] dark:hover:bg-[#253656] transition-all group"
                      >
                        <div className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-[#0d6dd6]/20 text-xl group-hover:scale-110 transition-transform">
                          {serviceIconMap[service.serviceType] || "🔧"}
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-gray-700 dark:text-gray-100 truncate">
                            {service.issueDescription}
                          </p>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">
                            {service.createdAt
                              ? new Date(service.createdAt).toLocaleDateString("ar-EG")
                              : "-"}{" "}
                            - {statusMap[service.status] || service.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
