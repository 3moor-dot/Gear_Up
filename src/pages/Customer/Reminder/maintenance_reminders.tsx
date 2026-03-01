
import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import CreateReminderModal from "./create_reminder_modal";

import { MdAccessTime, MdCalendarToday, MdPlayArrow, 
  MdPause, MdCheck, MdClose, MdDelete, MdNotificationsActive } from "react-icons/md";
import { useTheme } from "../../../contexts/ThemeContext";
import axios from "axios";

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

const StatusBadge = ({ status }: { status: unknown }) => {
  const styles: Record<string, string> = {
    Completed: "bg-green-500/10 text-green-500 border-green-500/20",
    Active: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    Paused: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  };
  const labels: Record<string, string> = {
    Completed: "مكتمل", Active: "نشط", Cancelled: "ملغي", Paused: "متوقف مؤقتًا",
  };
  return (
    <span className={`inline-block min-w-[90px] text-center px-3 py-1.5 rounded-full text-xs font-semibold border ${styles[status] || styles.Active}`}>
      {labels[status] || status}
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
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);

  const fetchReminders = useCallback(async () => {
    if (!selectedCar) return; 
    try {
      const carObj = cars.find(c => `${c.year} ${c.brand} ${c.model}` === selectedCar);
      if (!carObj) return;
      const res = await axios.get(`http://gearupapp.runasp.net/api/Reminder/car/${carObj.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(Array.isArray(res.data) ? res.data : []);
    } catch (error) { console.error("فشل جلب التذكيرات:", error); }
  }, [token, selectedCar, cars]);
  
  useEffect(() => { fetchReminders(); }, [selectedCar, fetchReminders]);

  const fetchUpcoming = useCallback(async () => {
    try {
      const res = await axios.get("http://gearupapp.runasp.net/api/Reminder/upcoming?daysAhead=7", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpcomingReminders(Array.isArray(res.data) ? res.data : []);
    } catch (error) { console.error("فشل جلب القادمة:", error); }
  }, [token]);

  const refreshAll = useCallback(() => { fetchReminders(); fetchUpcoming(); }, [fetchReminders, fetchUpcoming]);

  const getFrequencyLabel = (r: any) => {
    const typeRaw = String(r.frequencyType ?? r.FrequencyType ?? "0").toLowerCase();
    const val = r.intervalValue ?? r.IntervalValue ?? r.interval ?? r.value;
    let unitRaw: string = String(r.intervalUnit ?? r.IntervalUnit ?? r.unit ?? "0").toLowerCase();
    const frequencyMap: Record<string, string> = {
      "0": "مرة واحدة", "once": "مرة واحدة",
      "1": "يومي", "daily": "يومي",
      "2": "أسبوعي", "weekly": "أسبوعي",
      "3": "شهري", "monthly": "شهري",
      "4": "سنوي", "yearly": "سنوي",
      "5": "مخصص", "custominterval": "مخصص"
    };
    const unitMap: Record<string, string> = {
      "0": "أيام", "day": "أيام", "days": "أيام",
      "1": "أسابيع", "week": "أسابيع", "weeks": "أسابيع",
      "2": "شهور", "month": "شهور", "months": "شهور",
      "3": "سنوات", "year": "سنوات", "years": "سنوات"
    };
    if ((typeRaw === "5" || typeRaw === "custominterval") && val && Number(val) > 0) {
      if (["0","1","2","3"].includes(unitRaw)) { } else { unitRaw = unitRaw.toLowerCase(); }
      const unitLabel = unitMap[unitRaw] || "أيام";
      return `كل ${val} ${unitLabel}`;
    }
    return frequencyMap[typeRaw] || "مرة واحدة";
  };

  const handleStatusAction = async (
    id: number,
    action: "complete" | "pause" | "activate" | "cancel"
  ) => {
    try {
      await axios.post(
        `http://gearupapp.runasp.net/api/Reminder/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // جلب البيانات الجديدة مباشرة
      const carObj = cars.find(c => `${c.year} ${c.brand} ${c.model}` === selectedCar);
      if (carObj) {
        const res = await axios.get(`http://gearupapp.runasp.net/api/Reminder/car/${carObj.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedReminders = Array.isArray(res.data) ? res.data : [];
        setReminders(updatedReminders);
  
        // تحديث currentReminder فورًا لو كان هذا التذكير هو المختار
        setCurrentReminder(prev => {
          if (!prev || prev.id !== id) return prev;
          const updated = updatedReminders.find(r => r.id === id);
          return updated || prev;
        });
      }
  
      fetchUpcoming(); // تحديث القادمة
  
    } catch (error: any) {
      console.log("ERROR:", error.response?.data);
      alert(`فشل تنفيذ العملية: ${action}`);
    }
  };



  const deleteReminder = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التذكير نهائياً؟")) return;
    try {
      await axios.delete(`http://gearupapp.runasp.net/api/Reminder/${id}/delete`, { headers: { Authorization: `Bearer ${token}` } });
      refreshAll();
      if(currentReminder?.id === id) setCurrentReminder(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { alert("فشل الحذف"); }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://gearupapp.runasp.net/api/customers/cars", { headers: { Authorization: `Bearer ${token}` } });
        const carsData = res.data.cars || [];
        setCars(carsData);
        if (carsData.length > 0) setSelectedCar(`${carsData[0].year} ${carsData[0].brand} ${carsData[0].model}`);
      } catch (error) { console.error(error); }
    };
    fetchCars();
    fetchUpcoming(); 
  }, [token]);

  const filteredReminders = useMemo(() => reminders.filter(r => filter === "all" || r.status === filter), [reminders, filter]);
  const getCarName = (carId: number) => { const car = cars.find(c => c.id === carId); return car ? `${car.year} ${car.brand} ${car.model}` : "سيارة غير معروفة"; };

  return (
    <div className={`flex min-h-screen ${dark ? "bg-primary_BGD text-white" : "bg-white text-gray-800"}`} dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-4 md:p-8 space-y-8 relative">
          
          {/* عنوان الصفحة + زر إنشاء تذكير */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="text-right">
              <h2 className="text-2xl font-bold text-[#137FEC]">تذكيرات الصيانة</h2>
              <p className={dark ? "text-gray-400" : "text-gray-500 text-sm"}>إدارة مهام الصيانة لسيارتك.</p>
            </div>
          
            <button 
  onClick={() => setIsModalOpen(true)} 
  className="bg-[#137FEC] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-blue-600 shadow-lg"
>
  <MdCalendarToday size={22} /> إنشاء تذكير
</button>
          </div>

          {/* المهام القادمة */}
          {upcomingReminders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#137FEC]">
                <MdNotificationsActive size={24} className="animate-bounce" />
                <h3 className="text-lg font-bold">مهام قادمة قريباً</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingReminders.map((r) => (
                  <div key={r.id} className={`p-5 rounded-[24px] border-2 ${dark ? "bg-[#1A233A] border-gray-800" : "bg-blue-50/50 border-blue-100"}`}>
                    <div className="flex justify-between mb-2 text-[11px] font-bold">
                      <span className="text-[#137FEC]">{getFrequencyLabel(r)}</span>
                      <span className="text-gray-400">{new Date(r.startDate).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{r.name}</h4>
                    <p className="text-[11px] text-gray-500 mb-2">🚗 {getCarName(r.carId)}</p>
                    <button onClick={() => handleStatusAction(r.id, "complete")} className="w-full py-2 bg-[#137FEC] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                      <MdCheck size={16} /> علّم كمكتمل
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* الفلتر والدروب داون */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[{ id: "all", label: "الكل" }, { id: "Active", label: "النشطة" }, { id: "Paused", label: "المتوقفة" }, { id: "Completed", label: "المكتملة" }].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === f.id ? "bg-[#137FEC] text-white" : dark ? "bg-[#1A233A] text-gray-400 border-gray-700" : "bg-white text-gray-600 border-gray-200"}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative w-48">
              <select value={selectedCar} onChange={(e) => setSelectedCar(e.target.value)} className={`appearance-none px-4 py-3 pl-10 rounded-lg font-bold w-full outline-none transition-all cursor-pointer ${dark ? "bg-[#1A233A] text-white border border-gray-700 hover:border-[#137FEC]" : "bg-[#137FEC1A] text-[#137FEC] border border-[#137FEC]"}`}>
                {cars.map((car, i) => (<option key={i} value={`${car.year} ${car.brand} ${car.model}`}>{`${car.year} ${car.brand} ${car.model}`}</option>))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className={`w-5 h-5 ${dark ? "text-gray-400" : "text-[#137FEC]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* جدول التذكيرات */}
          <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-[#111827] border-gray-800 shadow-2xl" : "bg-white border-gray-200 shadow-sm"} relative`}>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse min-w-[900px]">
                <thead>
                  <tr className={`${dark ? "bg-[#1F2937] text-gray-200 border-b border-gray-700" : "bg-[#F8FAFC] text-gray-600 border-b border-gray-100"} text-xs uppercase font-bold`}>
                    <th className="p-5">المهمة والوصف</th>
                    <th className="p-5">الجدولة والتكرار</th>
                    <th className="p-5 text-center">الحالة</th>
                    <th className="p-5 text-center">الإجراءات</th>
                  </tr>
                </thead>
               
<tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
  {filteredReminders.map((r) => (
    <tr
      key={r.id}
      className={`transition-colors cursor-pointer ${
        dark ? "hover:bg-[#1F2937]/40" : "hover:bg-blue-50/30"
      }`}
      onClick={() => setCurrentReminder(r)}
    >
      {/* المهمة والوصف */}
      <td className="p-4">
        <div className="font-semibold text-sm mb-1 truncate">
          {r.name}
        </div>
        <div className="text-[12px] text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
          {r.description || "لا يوجد وصف"}
        </div>
      </td>

      {/* التاريخ والتكرار */}
      <td className="p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#137FEC]">
            <MdCalendarToday size={14} />
            {new Date(r.startDate).toLocaleDateString("ar-EG")}
          </div>
          {r.preferredNotificationTime && (
            <div className="flex items-center gap-1 text-[11px] text-gray-400 italic">
              <MdAccessTime size={14} />
              {r.preferredNotificationTime}
            </div>
          )}
          <div className="mt-1">
            <span
              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                dark ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-[#137FEC]"
              }`}
            >
              {getFrequencyLabel(r)}
            </span>
          </div>
        </div>
      </td>

      {/* الحالة */}
      <td className="p-4 text-center">
        <StatusBadge status={r.status} />
      </td>

      {/* الإجراءات */}
      <td className="p-4">
        <div className="flex flex-wrap justify-center gap-2">
          {r.status === "Active" && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleStatusAction(r.id, "complete"); }}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition"
                title="إتمام"
              >
                <MdCheck size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleStatusAction(r.id, "pause"); }}
                className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-500 hover:text-white transition"
                title="إيقاف مؤقت"
              >
                <MdPause size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleStatusAction(r.id, "cancel"); }}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition"
                title="إلغاء"
              >
                <MdClose size={18} />
              </button>
            </>
          )}

          {r.status === "Paused" && (
            <button
              onClick={(e) => { e.stopPropagation(); handleStatusAction(r.id, "activate"); }}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#137FEC] text-white rounded-lg text-xs font-bold transition"
            >
              <MdPlayArrow size={16} /> تنشيط
            </button>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); deleteReminder(r.id); }}
            className={`p-3 rounded-lg transition-colors ${
              dark ? "text-gray-600 hover:bg-red-500/10 hover:text-red-500" : "text-gray-400 hover:bg-red-50 hover:text-red-500"
            }`}
            title="حذف"
          >
            <MdDelete size={27} />
          </button>
        </div>
      </td>
    </tr>
  ))}
    </tbody>


              </table>
            </div>

      
{/* reminder details */}
{currentReminder && (
  <div className="absolute inset-0 flex justify-center items-start p-4 z-10 pointer-events-none">
    <div
      className={`w-full max-w-2xl p-5 rounded-2xl shadow-lg pointer-events-auto backdrop-blur-md transition-colors
        ${dark 
          ? "bg-[#0C52C7]/20"   //dark
          : "bg-[#FFFBF1]/30"   //light   
        }`}
    >
    {/* head of details */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-[#137FEC]">{currentReminder.name}</h3>
        <button onClick={() => setCurrentReminder(null)} className="text-gray-400 hover:text-red-500">
          <MdClose size={22} />
        </button>
      </div>

      {/* الوصف */}
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">{currentReminder.description || "لا يوجد وصف"}</p>

      {/* معلومات التذكير */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <span className="block text-xs text-gray-400 mb-1">تاريخ البدء</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
            <MdCalendarToday size={16}/> {new Date(currentReminder.startDate).toLocaleDateString('ar-EG')}
          </span>
        </div>
        {currentReminder.preferredNotificationTime && (
          <div>
            <span className="block text-xs text-gray-400 mb-1">وقت الإشعار</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <MdAccessTime size={16}/> {currentReminder.preferredNotificationTime}
            </span>
          </div>
        )}
        <div>
          <span className="block text-xs text-gray-400 mb-1">نوع التكرار</span>
          <span className="px-2 py-0.5 bg-blue-50 text-[#137FEC] dark:bg-blue-900/20 dark:text-blue-400 rounded-md font-bold">
            {getFrequencyLabel(currentReminder)}
          </span>
        </div>
      </div>

      {/* الحالة والسيارة */}
      <div className="flex flex-col sm:flex-row sm:gap-4 mb-4 items-start sm:items-center">
        <StatusBadge status={currentReminder.status} />
        <span className="text-sm text-gray-500 mt-2 sm:mt-0">🚗 {getCarName(currentReminder.carId)}</span>
      </div>

      {/* أزرار التحكم */}
      <div className="flex gap-2 flex-wrap">
        {currentReminder.status === "Active" && (
          <>
            <button onClick={() => handleStatusAction(currentReminder.id, "complete")} className="px-4 py-1.5 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white flex items-center gap-1"><MdCheck size={16}/> إتمام</button>
            <button onClick={() => handleStatusAction(currentReminder.id, "pause")} className="px-4 py-1.5 bg-orange-500/10 text-orange-600 rounded-lg hover:bg-orange-500 hover:text-white flex items-center gap-1"><MdPause size={16}/> إيقاف مؤقت</button>
            <button onClick={() => handleStatusAction(currentReminder.id, "cancel")} className="px-4 py-1.5 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500 hover:text-white flex items-center gap-1"><MdClose size={16}/> إلغاء</button>
          </>
        )}
        {currentReminder.status === "Paused" && (
          <button onClick={() => handleStatusAction(currentReminder.id, "activate")} className="px-4 py-1.5 bg-[#137FEC] text-white rounded-lg flex items-center gap-1"><MdPlayArrow size={16}/> تنشيط</button>
        )}
        <button onClick={() => deleteReminder(currentReminder.id)} className="px-4 py-1.5 bg-gray-200 text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 flex items-center gap-1"><MdDelete size={16}/> حذف</button>
      </div>
    </div>
  </div>
)}




          </div>

        </main>
      </div>
      <CreateReminderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cars={cars} selectedCar={selectedCar} setSelectedCar={setSelectedCar} onSuccess={refreshAll}  />
    </div>
  );
};

export default MaintenanceReminders;