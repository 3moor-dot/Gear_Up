import { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

const NotificationBell = ({ size = 25 }) => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cars, setCars] = useState<any[]>([]);

  const token = sessionStorage.getItem("userToken");

  const getStorageKey = () => {
    if (!token) return "guest_notifications";
    return `notifications_${token.slice(-10)}`;
  };


  const [notifications, setNotifications] = useState<any[]>(() => {
    const token = sessionStorage.getItem("userToken");
    const key = token ? `notifications_${token.slice(-10)}` : "guest_notifications";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 2500);
  };

 
  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(notifications));
  }, [notifications, token]);

//fetching cars
  useEffect(() => {
    if (!token) {
      setCars([]);
      return;
    }
    const fetchCars = async () => {
      try {
        const res = await axios.get(
          "https://gearupapp.runasp.net/api/customers/cars",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCars(res.data.cars || []);
      } catch (error) {
        console.error("فشل جلب العربيات:", error);
      }
    };
    fetchCars();
  }, [token]);


  useEffect(() => {
    if (!token) return;
  
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://gearupapp.runasp.net/hubs/notifications", {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();
  
    connection.on("ReceiveReminderNotification", (data: any) => {


      setNotifications(() => {
        const key = getStorageKey();
        const old = JSON.parse(localStorage.getItem(key) || "[]");
      
        const exists = old.some((n: any) => n.reminderId === data.reminderId);
        if (exists) return old;
      
        const newNotification = {
          title: data.title || "تنبيه صيانة",
          message: data.message || "لديك تنبيه جديد",
          reminderId: data.reminderId,
          carId: data.carId,
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
        };
      
        const updated = [newNotification, ...old];
        localStorage.setItem(key, JSON.stringify(updated));
        return updated;
      });


      triggerShake();
    });
    
  
    connection.start()
      .then(() => console.log("SignalR Connected ✅"))
      .catch(err => console.error("SignalR Connection Error ❌", err));
  
    return () => {
      void connection.stop();
    };
  
  }, [token]);


  const removeNotification = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    setNotifications(() => {
      const key = getStorageKey();
      const old = JSON.parse(localStorage.getItem(key) || "[]");
      const newNotifications = old.filter((_: any, index: number) => index !== indexToRemove);
      localStorage.setItem(key, JSON.stringify(newNotifications));
      return newNotifications;
    });
  };



  const getCarName = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    if (!car) return "جاري تحميل بيانات السيارة..."; 
    return `${car.brand} ${car.model} ${car.year}`;
  };

  return (
    <div className="relative inline-block">
      <style>{`
        @keyframes gentle-shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        .animate-bell-shake {
          animation: gentle-shake 0.5s ease-in-out 5;
        }
      `}</style>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors relative ${dark ? "text-white hover:bg-white/10" : "text-[#137FEC] hover:bg-blue-50"} ${isShaking ? "animate-bell-shake" : ""}`}
      >
        <FaBell size={size} />
        {notifications.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
      </button>

{isOpen && (
  <div className={`absolute left-0 mt-3 w-80 rounded-2xl shadow-2xl z-50 p-4 border backdrop-blur-md ${
    dark 
      ? "bg-[#0f172a]/80 border-white/10 text-white" 
      : "bg-white/90 border-gray-100"
  }`} dir="rtl">
    
    <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
      <h3 className="font-bold text-[13px] opacity-90">التنبيهات ({notifications.length})</h3>
      <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
        <FaTimes size={12} />
      </button>
    </div>


    <div className="max-h-72 overflow-y-auto space-y-2.5 custom-scrollbar">
      {notifications.length > 0 ? notifications.map((n, i) => (
        <div key={i} className={`relative p-3.5 rounded-xl border transition-all ${
          dark 
          ? "bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.08]" 
          : "bg-blue-50 border-blue-100"
        } group`}>
          
          <button onClick={(e) => removeNotification(e, i)} className="absolute top-2 left-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <FaTimes size={10} />
          </button>

          {/* تم إزالة div الخاص بـ FaBell من هنا */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[12px] text-blue-400 leading-tight mb-1">{n.title}</h4>
            
            {n.carId && (
              <div className={`text-[10px] font-medium mb-1 flex items-center gap-1 ${dark ? "text-slate-300" : "text-slate-600"}`}>
                 <span className="opacity-70 text-[12px]">🚗</span> {getCarName(n.carId)}
              </div>
            )}
            
            {n.message && <p className="text-[11px] opacity-60 leading-snug">{n.message}</p>}
            
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
        dark 
        ? "bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white" 
        : "bg-blue-50 text-blue-600"
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