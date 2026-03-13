
import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import CreateReminderModal from "./create_reminder_modal";
import axios from "axios";
import { useTheme } from "../../../contexts/ThemeContext";
import { 
  FaTrash, FaCheck, FaPause, FaPlay, FaPlus, 
  FaCar, FaWrench, FaClock, FaSync, FaHistory, FaCalendarAlt
} from "react-icons/fa";

// --- واجهة البيانات ---
interface Reminder {
  carId: number;
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  preferredNotificationTime?: string;
  frequencyType: string | number;
  intervalValue?: number;
  intervalUnit?: string | number;
  status: "Active" | "Paused" | "Completed" | "Cancelled";
}

// --- توابع التنسيق ---
const formatToEgyptDate = (dateString: string) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const formatToEgyptTime = (timeString: string) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setUTCHours(parseInt(hours), parseInt(minutes));
  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const MaintenanceReminders = () => {
  const { dark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [cars, setCars] = useState<any[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [, setUpcomingReminders] = useState<Reminder[]>([]);
  const token = sessionStorage.getItem("userToken");

  // --- جلب البيانات ---
  const fetchReminders = useCallback(async () => {
    if (!selectedCar || cars.length === 0) return;
    const carObj = cars.find((c) => `${c.year} ${c.brand} ${c.model}` === selectedCar);
    if (!carObj) return;
    try {
      const res = await axios.get(`https://gearupapp.runasp.net/api/Reminder/car/${carObj.id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setReminders(Array.isArray(res.data) ? res.data : []);
    } catch (error) { console.error("فشل جلب التذكيرات:", error); }
  }, [token, selectedCar, cars]);

  const fetchUpcoming = useCallback(async () => {
    try {
      const res = await axios.get("https://gearupapp.runasp.net/api/Reminder/upcoming?daysAhead=7", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setUpcomingReminders(Array.isArray(res.data) ? res.data : []);
    } catch (error) { console.error("فشل جلب القادمة:", error); }
  }, [token]);

  const refreshAll = useCallback(() => {
    fetchReminders();
    fetchUpcoming();
  }, [fetchReminders, fetchUpcoming]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("https://gearupapp.runasp.net/api/customers/cars", { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const carsData = res.data.cars || [];
        setCars(carsData);
        if (carsData.length > 0) setSelectedCar(`${carsData[0].year} ${carsData[0].brand} ${carsData[0].model}`);
      } catch (error) { console.error(error); }
    };
    fetchCars();
    fetchUpcoming();
  }, [token, fetchUpcoming]);

  useEffect(() => { fetchReminders(); }, [selectedCar, fetchReminders]);

  // --- العمليات ---
  const handleStatusAction = async (id: number, action: string) => {
    try {
      await axios.post(`https://gearupapp.runasp.net/api/Reminder/${id}/${action}`, {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      refreshAll();
    } catch (error: any) { alert(error.response?.data?.error || "فشل تنفيذ العملية"); }
  };

  const deleteReminder = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التذكير نهائياً؟")) return;
    try {
      await axios.delete(`https://gearupapp.runasp.net/api/Reminder/${id}/delete`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      refreshAll();
    } catch (error: any) { alert(error.response?.data?.error || "فشل الحذف"); }
  };

  const getFrequencyLabel = (r: any) => {
    const rawType = String(r.frequencyType ?? "").toLowerCase();
    const val = Number(r.intervalValue ?? 0);
    const unitKey = String(r.intervalUnit ?? "0");

    switch (rawType) {
      case "0":
      case "once": return "مرة واحدة";
      case "1":
      case "daily": return "يومي";
      case "2":
      case "weekly": return "أسبوعي";
      case "3":
      case "monthly": return "شهري";
      case "4":
      case "yearly": return "سنوي";
      case "5":
      case "custom":
      case "custominterval": {
        const unitMap: Record<string, string> = { "0": "أيام", "1": "أسابيع", "2": "شهور", "3": "سنوات" };
        return `كل ${val} ${unitMap[unitKey] ?? "أيام"}`;
      }
      default: return "غير معروف";
    }
  };

  // --- تصفية البيانات ---
  const filteredActive = useMemo(() => reminders.filter((r) => r.status !== "Completed" && (filter === "all" || r.status === filter)), [reminders, filter]);
  const completedList = useMemo(() => reminders.filter((r) => r.status === "Completed"), [reminders]);

  return (
    <div className={`flex min-h-screen ${dark ? "bg-[#0B1120] text-white" : "bg-[#F8FAFC] text-slate-800"}`} dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-4 md:p-10 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-black mb-2">تذكيرات الصيانة</h1>
              <p className="text-slate-700 dark:text-slate-300 font-medium italic underline underline-offset-4 decoration-blue-400">إدارة المهام القادمة وعرض سجل سيارتك.</p>
            </div>
            <div className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-xl shadow-lg gap-3">
              <FaCar />
              <select value={selectedCar} onChange={(e) => setSelectedCar(e.target.value)} className="bg-transparent border-none outline-none font-bold text-sm cursor-pointer">
                {cars.map((car, idx) => (
                  <option key={idx} value={`${car.year} ${car.brand} ${car.model}`} className="text-black">{car.year} {car.brand} {car.model}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-6 order-2">
              {/* Completed */}
              <div className="bg-white dark:bg-[#137FEC33] p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-600">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><FaHistory className="text-blue-500"/> تاريخ مكتمل</h3>
                <div className="space-y-6">
                  {completedList.length > 0 ? completedList.map(r => (
                    <div key={r.id} className="flex justify-between items-center group">
                      <div>
                        <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{r.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{formatToEgyptDate(r.startDate)}</p>
                      </div>
                      <div className="text-green-600 bg-green-50 dark:bg-green-500/10 p-1.5 rounded-lg"><FaCheck size={12} /></div>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400 italic text-center py-4">لا يوجد سجلات مكتملة.</p>
                  )}
                </div>
              </div>

              {/* Create Reminder */}
              <div className="bg-[#007AFF] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-4 flex items-center justify-between">تذكيرات مخصصة <div className="bg-white/20 p-2 rounded-lg"><FaPlus size={12}/></div></h3>
                  <p className="text-xs leading-relaxed opacity-90 mb-8 font-medium">لا تنسَ الأمور الصغيرة. اضبط تذكيرات دورية لتجديد التأمين، أو غسيل السيارة.</p>
                  <button onClick={() => setIsModalOpen(true)} className="w-full bg-white text-[#007AFF] py-3.5 rounded-2xl font-black text-sm shadow-md transition hover:bg-slate-50">إنشاء تذكير جديد</button>
                </div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              </div>
            </div>

            {/* Main */}
            <div className="lg:col-span-9 space-y-6 order-1">
              {/* Filters */}
              <div className="flex flex-wrap justify-between items-center gap-4 px-2">
                <h2 className="text-xl font-black text-slate-700 dark:text-slate-200">المهام القادمة ({filteredActive.length})</h2>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {["all", "Active", "Paused"].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
                      {f === "all" ? "الجميع" : f === "Active" ? "نشط" : "متوقفة"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminder Cards */}
              <div className="space-y-6">
                {filteredActive.map((r, idx) => {
                  const isOnce = String(r.frequencyType).toLowerCase() === "0" || String(r.frequencyType).toLowerCase() === "once";
                  const isUrgent = idx === 0 && r.status === "Active";

                  return (
                    <div key={r.id} className={`p-4 md:p-2 rounded-[2.5rem] shadow-sm border transition-all dark:bg-[#137FEC33] ${isUrgent ? "border-red-400 relative" : "border-slate-200 dark:border-slate-600"}`}>
                      {isUrgent && <span className="absolute -top-3 right-10 bg-white dark:bg-slate-900 px-3 text-red-500 font-black text-[10px] border-2 border-red-400 rounded-full py-0.5 animate-pulse">⚠️ مطلوب الانتباه</span>}
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-inner ${isUrgent ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500 dark:bg-blue-500/10"}`}>
                            <FaWrench />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h1 className="text-2xl font-black text-slate-700 dark:text-slate-200">{r.name}</h1>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${r.status === "Active" ? "bg-green-100 text-green-600 dark:bg-green-500/10" : "bg-orange-100 text-orange-600 dark:bg-orange-500/10"}`}>
                                {r.status === "Active" ? "نشط" : "متوقف مؤقتاً"}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">"{r.description || "لا يوجد وصف إضافي"}"</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:flex md:flex-col gap-3 text-xs font-bold border-r-2 border-slate-200 dark:border-slate-600 pr-0 md:pr-6 min-w-[150px]">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><FaClock className="text-blue-500"/> {r.preferredNotificationTime ? formatToEgyptTime(r.preferredNotificationTime) : "غير محدد"}</div>
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><FaSync className="text-blue-500"/> {getFrequencyLabel(r)}</div>
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><FaCalendarAlt className="text-blue-500"/> {formatToEgyptDate(r.startDate)}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-200 dark:border-slate-600">
                        {!isOnce && r.status === "Active" && (
                          <button onClick={() => handleStatusAction(r.id, "complete")} className="bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-600 transition">
                            <FaCheck size={11}/> إتمام
                          </button>
                        )}
                        <button onClick={() => handleStatusAction(r.id, r.status === "Active" ? "pause" : "activate")} className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 px-4 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1 hover:bg-amber-200 dark:hover:bg-amber-500/20 transition">
                          {r.status === "Active" ? <><FaPause size={10}/> إيقاف</> : <><FaPlay size={10}/> تنشيط</>}
                        </button>
                        <button onClick={() => deleteReminder(r.id)} className="bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-4 py-1.5 rounded-xl text-[11px] font-semibold mr-auto flex items-center gap-1 hover:bg-red-200 dark:hover:bg-red-500/20 transition">
                          <FaTrash size={10}/> حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredActive.length === 0 && <p className="text-center py-20 text-slate-400 font-bold">لا يوجد تذكيرات حالية.</p>}
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreateReminderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cars={cars} 
        selectedCar={selectedCar} 
        setSelectedCar={setSelectedCar} 
        onSuccess={refreshAll} 
      />
    </div>
  );
};

export default MaintenanceReminders;
