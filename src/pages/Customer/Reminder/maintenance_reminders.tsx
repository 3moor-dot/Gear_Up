
import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import CreateReminderModal from "./create_reminder_modal";
import axios from "axios";
import { useTheme } from "../../../contexts/ThemeContext";
import { FaTrash, FaCheck, FaPause, FaPlay, FaBell, FaCalendarPlus, FaCarSide } from "react-icons/fa";

interface Reminder {
  carId: number;
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  preferredNotificationTime?: string;
  frequencyType: unknown;
  intervalValue?: unknown;
  intervalUnit?: any;
  status: "Active" | "Paused" | "Completed" | "Cancelled";
}

// egypt time
const formatToEgyptDate = (dateString: string) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(dateString));
};

// egypt time
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

const StatusBadge = ({ status }: { status: unknown }) => {
  const styles: Record<string, string> = {
    Completed: "bg-green-500/10 text-green-500 border-green-500/20",
    Active: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    Paused: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };
  const labels: Record<string, string> = {
    Completed: "مكتمل",
    Active: "نشط",
    Cancelled: "ملغي",
    Paused: "متوقف مؤقتًا",
  };
  const statusStr = String(status);
  return (
    <span className={`inline-block min-w-[80px] text-center px-2 py-1 rounded-full text-[10px] font-semibold border ${styles[statusStr] || styles.Active}`}>
      {labels[statusStr] || statusStr}
    </span>
  );
};

const MaintenanceReminders = () => {
  const { dark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [cars, setCars] = useState<any[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const token = sessionStorage.getItem("userToken");

  const fetchReminders = useCallback(async () => {
    if (!selectedCar || cars.length === 0) return;
    try {
      const carObj = cars.find((c) => `${c.year} ${c.brand} ${c.model}` === selectedCar);
      if (!carObj) return;
      const res = await axios.get(`http://gearupapp.runasp.net/api/Reminder/car/${carObj.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setReminders(Array.isArray(res.data) ? res.data : []);
    } catch (error) { console.error("فشل جلب التذكيرات:", error); }
  }, [token, selectedCar, cars]);

  useEffect(() => { fetchReminders(); }, [selectedCar, fetchReminders]);

  const fetchUpcoming = useCallback(async () => {
    try {
      const res = await axios.get("http://gearupapp.runasp.net/api/Reminder/upcoming?daysAhead=7", { headers: { Authorization: `Bearer ${token}` } });
      setUpcomingReminders(Array.isArray(res.data) ? res.data : []);
    } catch (error) { console.error("فشل جلب القادمة:", error); }
  }, [token]);

  const refreshAll = useCallback(() => {
    fetchReminders();
    fetchUpcoming();
  }, [fetchReminders, fetchUpcoming]);

  useEffect(() => {
    const handleUpdate = () => { refreshAll(); };
    window.addEventListener("remindersUpdated", handleUpdate);
    return () => window.removeEventListener("remindersUpdated", handleUpdate);
  }, [refreshAll]);

  const getFrequencyLabel = (r: any) => {
    const rawType = String(r.frequencyType ?? r.FrequencyType ?? "0").toLowerCase();
    const val = r.intervalValue ?? r.IntervalValue ?? 0;
    const unit = String(r.intervalUnit ?? r.IntervalUnit ?? "0").toLowerCase();
    const frequencyMap: Record<string, string> = {
      "0": "مرة واحدة", "once": "مرة واحدة",
      "1": "يومي", "daily": "يومي",
      "2": "أسبوعي", "weekly": "أسبوعي",
      "3": "شهري", "monthly": "شهري",
      "4": "سنوي", "yearly": "سنوي",
      "5": "مخصص", "custominterval": "مخصص",
      "custom": "مخصص"
    };
    const unitMap: Record<string, string> = { "0": "أيام", "days": "أيام", "1": "أسابيع", "weeks": "أسابيع", "2": "شهور", "months": "شهور", "3": "سنوات", "years": "سنوات" };
    if (rawType === "5" || rawType === "custominterval" || rawType === "custom") return `كل ${val} ${unitMap[unit] || "يوم"}`;
    return frequencyMap[rawType] || "مرة واحدة";
  };

  const handleStatusAction = async (id: number, action: string) => {
    try {
      await axios.post(`http://gearupapp.runasp.net/api/Reminder/${id}/${action}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      refreshAll();
    } catch (error: any) { alert(error.response?.data?.error || "فشل تنفيذ العملية"); }
  };

  const deleteReminder = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التذكير نهائياً؟")) return;
    try {
      await axios.delete(`http://gearupapp.runasp.net/api/Reminder/${id}/delete`, { headers: { Authorization: `Bearer ${token}` } });
      refreshAll();
    } catch (error: any) { alert(error.response?.data?.error || "فشل الحذف"); }
  };


  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://gearupapp.runasp.net/api/customers/cars", { 
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

  const filteredReminders = useMemo(() => reminders.filter((r) => filter === "all" || r.status === filter), [reminders, filter]);


  return (
    <div className={`flex min-h-screen ${dark ? "bg-primary_BGD text-white" : "bg-white text-gray-800"}`} dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-4 md:p-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">تذكيرات الصيانة</h1>
              <p className="text-sm opacity-70">إدارة تذكيرات سياراتك ومتابعة مواعيدها</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg font-medium flex items-center gap-2">
              <FaCalendarPlus /> إضافة تذكير جديد
            </button>
          </div>

          {upcomingReminders.length > 0 && (
            <div className={`p-5 rounded-2xl border ${dark ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-50/50 border-blue-100"}`}>
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-blue-500 animate-bounce"><FaBell /></span>
                تذكيرات قادمة قريباً
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  
                {upcomingReminders.map((u) => {
  const car = cars.find((c) => c.id === u.carId);
  const carName = car ? `${car.year} ${car.brand} ${car.model}` : "عربية غير معروفة";
  return (
    <div key={u.id} className={`p-4 rounded-xl border-l-4 border-l-blue-500 ${dark ? "bg-gray-800" : "bg-white"} shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer`}>
      <h4 className="font-bold text-sm mb-1 truncate">{u.name}</h4>
      
    {/* car icon */}
      <div className={`text-xs font-bold mb-2 flex items-center gap-2 ${dark ? "text-sky-400" : "text-sky-700"}`}>
        <FaCarSide size={14} className="flex-shrink-0" /> 
        <span className="truncate">{carName}</span>
      </div>

      <div className="flex justify-between text-xs font-medium opacity-80">
        <span>{formatToEgyptDate(u.startDate)}</span>
        {u.preferredNotificationTime && (<span className="font-bold">{formatToEgyptTime(u.preferredNotificationTime)}</span>)}
      </div>
    </div>
    );
       })}
         </div>
         </div>
          )}

          <div className="flex flex-wrap gap-4 items-center bg-gray-500/5 p-4 rounded-2xl">
            <select value={selectedCar} onChange={(e) => setSelectedCar(e.target.value)} className="bg-transparent border border-gray-500/20 rounded-lg px-3 py-2 outline-none">
              {cars.map((car, idx) => (<option key={idx} value={`${car.year} ${car.brand} ${car.model}`} className="text-black">{car.year} {car.brand} {car.model}</option>))}
            </select>
            <div className="flex bg-gray-500/10 p-1 rounded-lg">
              {["all", "Active", "Paused", "Completed"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-md text-sm transition-all ${filter === f ? "bg-blue-600 text-white" : "hover:bg-gray-500/10"}`}>
                  {f === "all" ? "الكل" : f === "Active" ? "نشط" : f === "Paused" ? "متوقف" : "مكتمل"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReminders.map((reminder) => (
              <div key={reminder.id} className={`p-5 rounded-2xl border ${dark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-white"} shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg">{reminder.name}</h3>
                  <StatusBadge status={reminder.status} />
                </div>
                {reminder.description && reminder.description.trim() !== "" && (
                <p className="text-xs opacity-60 mb-4 line-clamp-2 h-8">
                    {reminder.description}
                       </p>
                              )}

                <div className="space-y-2 mb-4 text-[11px]">
                  <div className="flex justify-between items-center"><span className="opacity-60">تاريخ البدء:</span><span className="font-medium">{formatToEgyptDate(reminder.startDate)}</span></div>
                  {reminder.preferredNotificationTime && (
                    <div className="flex justify-between items-center text-blue-500 bg-blue-500/5 px-2 py-1 rounded-md">
                      <span className="opacity-70">وقت التنبيه:</span><span className="font-bold tracking-wider">{formatToEgyptTime(reminder.preferredNotificationTime)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1 border-t border-gray-500/10"><span className="opacity-60">التكرار:</span><span className="text-blue-500 font-medium">{getFrequencyLabel(reminder)}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => deleteReminder(reminder.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[11px]"><FaTrash size={10} /> حذف</button>
                  {reminder.status === 'Active' && (<button onClick={() => handleStatusAction(reminder.id, 'complete')} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all text-[11px]"><FaCheck size={10} /> إتمام</button>)}
                  {(reminder.status === 'Active' || reminder.status === 'Paused') && (
                    <button onClick={() => handleStatusAction(reminder.id, reminder.status === 'Active' ? 'pause' : 'activate')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] transition-all ${reminder.status === 'Active' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white' : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white'}`}>
                      {reminder.status === 'Active' ? <><FaPause size={10} /> إيقاف مؤقت</> : <><FaPlay size={10} /> تنشيط</>}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <CreateReminderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cars={cars} selectedCar={selectedCar} setSelectedCar={setSelectedCar} onSuccess={refreshAll} />
    </div>
  );
};
export default MaintenanceReminders;