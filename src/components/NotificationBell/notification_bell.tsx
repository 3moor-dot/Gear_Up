
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
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const token = sessionStorage.getItem("userToken");

  // دالة لإنشاء مفتاح خاص لكل مستخدم بناءً على التوكن بتاعه
  const getStorageKey = () => {
    if (!token) return "guest_notifications";
    // بناخد آخر 10 حروف من التوكن كتعريف فريد للمستخدم
    return `notifications_${token.slice(-10)}`;
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 2500);
  };

  // 1. تحميل التنبيهات الخاصة بالمستخدم الحالي فقط عند فتح الصفحة أو تغيير الحساب
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    setNotifications(saved ? JSON.parse(saved) : []);
  }, [token]);

  // 2. حفظ التنبيهات في المفتاح الخاص بالمستخدم كل ما تتحدث
  useEffect(() => {
    if (token) {
      localStorage.setItem(getStorageKey(), JSON.stringify(notifications));
    }
  }, [notifications, token]);

  // 3. جلب عربيات المستخدم الحالي
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

  // 4. إعداد الاتصال بـ SignalR
  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://gearupapp.runasp.net/hubs/notifications", { 
        accessTokenFactory: () => token 
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveReminderNotification", (data: any) => {
      setNotifications(prev => [
        {
          title: data.title || "تنبيه صيانة",
          message: data.message || "لديك تنبيه جديد",
          reminderId: data.reminderId,
          carId: data.carId,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
      triggerShake();
    });

    connection.start()
      .then(() => console.log("SignalR Connected ✅"))
      .catch(err => console.error("SignalR Connection Error ❌", err));

    return () => {
      connection.stop();
    };
  }, [token]);

  const removeNotification = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter((_, index) => index !== indexToRemove));
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
        <div className={`absolute left-0 mt-2 w-80 rounded-2xl shadow-2xl z-50 p-4 border ${dark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"}`} dir="rtl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">التنبيهات ({notifications.length})</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-500/20 rounded-full">
              <FaTimes size={14} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3">
            {notifications.length > 0 ? notifications.map((n, i) => (
              <div key={i} className="relative p-3 bg-gray-500/5 rounded-xl border border-gray-500/10 group">
                <button onClick={(e) => removeNotification(e, i)} className="absolute top-2 left-2 p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <FaTimes size={10} />
                </button>
                <h4 className="font-bold text-xs mb-1 ml-4">{n.title}</h4>

                {n.carId && (
            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
             🚗 {getCarName(n.carId)}
                </div>
                        )}
                {n.message && <p className="text-[11px] opacity-70 mb-3 leading-relaxed">{n.message}</p>}
                <span className="text-[9px] opacity-50 block">{n.time}</span>
              </div>
            )) : <p className="text-center text-xs opacity-50 py-4">لا توجد تنبيهات جديدة</p>}
          </div>

          <button onClick={() => { setIsOpen(false); navigate("/customer/reminders"); }} className="w-full mt-3 py-2 text-blue-500 hover:bg-blue-500/10 rounded-lg font-bold text-xs transition-colors">
            عرض سجل التنبيهات الكامل
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;