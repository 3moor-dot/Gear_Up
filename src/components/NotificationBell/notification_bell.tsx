
import { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheck, FaClock, FaChevronDown } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import toast from 'react-hot-toast';

const NotificationBell = ({ size = 25 }) => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cars, setCars] = useState<any[]>([]);
  const [activeSnoozeIndex, setActiveSnoozeIndex] = useState<number | null>(null);

  const token = sessionStorage.getItem("userToken");

  const getStorageKey = () => {
    if (!token) return "guest_notifications";
    return `notifications_${token.slice(-10)}`;
  };

  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem(getStorageKey());
    return saved ? JSON.parse(saved) : [];
  });

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 2500);
  };

  const removeNotificationFromList = (indexToRemove: number) => {
    setNotifications((prev) => {
      const updated = prev.filter((_, i) => i !== indexToRemove);
      localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      return updated;
    });
    setActiveSnoozeIndex(null);
  };

  const completeReminder = async (reminderId: number, index: number) => {
    try {
      await axios.post(
        `https://gearupapp.runasp.net/api/Reminder/${reminderId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم تسجيل الإتمام بنجاح");
      removeNotificationFromList(index);
  
      // --- الإضافة هنا: نبعت إشارة إن فيه تذكير اكتمل ---
      window.dispatchEvent(new Event("reminderCompleted")); 
      
    } catch (error) {
      toast.error("فشل تسجيل الإتمام");
    }
  };

  const snoozeReminder = async (reminderId: number, snoozeType: number, index: number) => {
    try {
      await axios.post(
        `https://gearupapp.runasp.net/api/Reminder/${reminderId}/snooze`,
        { snoozeType: snoozeType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("تم تأجيل التذكير");
      removeNotificationFromList(index);
  
      // --- السطر اللي ناقص هنا ---
      window.dispatchEvent(new Event("reminderSnoozed")); // بنبعت إشارة إن فيه تأجيل حصل
        
    } catch (error) {
      console.error("Snooze Error:", error);
      toast.error("فشل تأجيل التذكير");
    }
  };


  useEffect(() => {
    // 1. التأكد من وجود التوكن
    if (!token) return;
  
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://gearupapp.runasp.net/hubs/notifications", {
        accessTokenFactory: () => token,
        skipNegotiation: true, 
        transport: signalR.HttpTransportType.WebSockets 
      })
      .withAutomaticReconnect()
      .build();
  

    connection.on("ReceiveReminderNotification", (data: any) => {
      console.log("🚨 استلام إشعار:", data);
      
      setNotifications((oldNotifications) => {
        // 1. شيل أي نسخة قديمة من نفس الـ reminderId عشان نحدثها بالجديدة
        const filtered = oldNotifications.filter((n: any) => n.reminderId !== data.reminderId);
    
        const newNotification = {
          title: data.title || "تنبيه صيانة",
          message: data.message || "لديك تنبيه جديد",
          reminderId: data.reminderId,
          carId: data.carId,
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
        };
    
        const updated = [newNotification, ...filtered];
        localStorage.setItem(getStorageKey(), JSON.stringify(updated));
        return updated;
      });
      
      triggerShake();
    });



  
    // تشغيل الاتصال
    const startConnection = async () => {
      try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          await connection.start();
          console.log("SignalR Connected ✅");
        }
      } catch (err) {
        console.error("SignalR Connection Error ❌", err);
      }
    };
  
    startConnection();
  
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [token]); 



  const fetchCars = async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://gearupapp.runasp.net/api/customers/cars", { headers: { Authorization: `Bearer ${token}` } });
      setCars(res.data.cars || []);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchCars(); }, [token]);

  const getCarName = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.brand} ${car.model} ${car.year}` : "جاري التحميل...";
  };

  const snoozeOptions = [
    // { label: " دقيقتين", value: 5 },
    { label: "ساعة واحدة", value: 0 },
    { label: "3 ساعات", value: 1 },
    { label: "يوم واحد", value: 2 },
    { label: "3 أيام", value: 3 },
    { label: "أسبوع", value: 4 },
 
    
  ];

  return (
    <div className="relative inline-block">
      <style>{`
        @keyframes gentle-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        .animate-bell-shake { animation: gentle-shake 0.5s ease-in-out 5; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #137FEC33; border-radius: 10px; }
      `}</style>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors relative ${dark ? "text-white hover:bg-white/10" : "text-[#137FEC] hover:bg-blue-50"} ${isShaking ? "animate-bell-shake" : ""}`}
      >
        <FaBell size={size} />
        {notifications.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
      </button>

      {isOpen && (
        <div className={`absolute left-0 mt-3 w-80 rounded-2xl shadow-2xl z-[100] p-4 border backdrop-blur-md ${
          dark ? "bg-[#0f172a]/95 border-white/10 text-white" : "bg-white/95 border-gray-100"
        }`} dir="rtl">
          
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
            <h3 className="font-bold text-[13px] opacity-90">التنبيهات ({notifications.length})</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <FaTimes size={12} />
            </button>
          </div>

<div className="max-h-80 overflow-y-visible space-y-3 custom-scrollbar px-1">
            {notifications.length > 0 ? notifications.map((n, i) => (
              <div key={i} className={`relative p-3.5 rounded-xl border transition-all ${
                dark ? "bg-white/[0.03] border-white/[0.05]" : "bg-blue-50 border-blue-100"
              }`}>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-[12px] text-blue-400 leading-tight mb-1">{n.title}</h4>
                    <button onClick={() => removeNotificationFromList(i)} className="text-slate-600 hover:text-red-400">
                      <FaTimes size={10} />
                    </button>
                  </div>
                  
                  {n.carId && (
                    <div className={`text-[10px] font-medium mb-1 flex items-center gap-1 ${dark ? "text-slate-300" : "text-slate-600"}`}>
                       <span className="opacity-70 text-[12px]">🚗</span> {getCarName(n.carId)}
                    </div>
                  )}
                  
                  {n.message && <p className="text-[11px] opacity-60 leading-snug mb-3">{n.message}</p>}
                  
                  <div className="flex gap-2 relative">
                    <button
                      onClick={() => completeReminder(n.reminderId, i)}
                      className="flex-1 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <FaCheck size={10} /> إتمام
                    </button>


<div className="flex-1 relative">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setActiveSnoozeIndex(activeSnoozeIndex === i ? null : i);
    }}
    className="w-full py-1.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1"
  >
    <FaClock size={10} /> تأجيل <FaChevronDown size={8} className={activeSnoozeIndex === i ? "rotate-180" : ""} />
  </button>

  {activeSnoozeIndex === i && (
    <div 
      className={`absolute bottom-full left-0 mb-2 w-32 rounded-lg shadow-2xl border z-[999] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        dark ? "bg-slate-900 border-white/20" : "bg-white border-gray-200"
      }`}
      style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }} // لزيادة الوضوح
    >
      {snoozeOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => snoozeReminder(n.reminderId, opt.value, i)}
          className={`w-full text-right px-3 py-2 text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-colors border-b last:border-0 ${
            dark ? "text-slate-200 border-white/5" : "text-slate-700 border-gray-100"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )}
</div>



                  </div>
                  <span className="text-[8px] mt-2 opacity-30 block font-mono">{n.time}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 opacity-30 text-[11px]">لا توجد تنبيهات جديدة</div>
            )}
          </div>

          <button 
            onClick={() => { setIsOpen(false); navigate("/customer/reminders"); }} 
            className={`w-full mt-3 py-2 text-[11px] font-bold rounded-lg transition-all ${
              dark ? "bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white" : "bg-blue-50 text-blue-600"
            }`}
          >
            عرض سجل التنبيهات الكامل
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;