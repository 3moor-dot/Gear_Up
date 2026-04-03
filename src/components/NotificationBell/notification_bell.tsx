
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


  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        setNotifications(JSON.parse(saved));
        triggerShake(); // <--- ضيفي السطر ده هنا عشان الجرس يتهز أول ما الإشعار يوصل
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  
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


  // useEffect(() => {
  //   // 1. التأكد من وجود التوكن
  //   if (!token) return;
  //   const connection = new signalR.HubConnectionBuilder()
  //     .withUrl("https://gearupapp.runasp.net/hubs/notifications", {
  //       accessTokenFactory: () => token,
  //       skipNegotiation: true, 
  //       transport: signalR.HttpTransportType.WebSockets 
  //     })
  //     .withAutomaticReconnect()
  //     .build();
  
  //   connection.on("ReceiveReminderNotification", (data: any) => {
  //     console.log("🚨 استلام إشعار:", data);
      



      
  //     setNotifications((oldNotifications) => {
  //       // 1. شيل أي نسخة قديمة من نفس الـ reminderId عشان نحدثها بالجديدة
  //       const filtered = oldNotifications.filter((n: any) => n.reminderId !== data.reminderId);
    
  //       const newNotification = {
  //         title: data.title || "تنبيه صيانة",
  //         message: data.message || "لديك تنبيه جديد",
  //         reminderId: data.reminderId,
  //         carId: data.carId,
  //         time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
  //       };
    
  //       const updated = [newNotification, ...filtered];
  //       localStorage.setItem(getStorageKey(), JSON.stringify(updated));
  //       return updated;
  //     });
      
  //     triggerShake();
  //   });



  
  //   // تشغيل الاتصال
  //   const startConnection = async () => {
  //     try {
  //       if (connection.state === signalR.HubConnectionState.Disconnected) {
  //         await connection.start();
  //         console.log("SignalR Connected ✅");
  //       }
  //     } catch (err) {
  //       console.error("SignalR Connection Error ❌", err);
  //     }
  //   };
  
  //   startConnection();
  
  //   return () => {
  //     if (connection) {
  //       connection.stop();
  //     }
  //   };
  // }, [token]); 
  useEffect(() => {
    if (!token) return;
  
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://gearupapp.runasp.net/hubs/notifications", {
        accessTokenFactory: () => token,
        skipNegotiation: true, 
        transport: signalR.HttpTransportType.WebSockets 
      })
      .withAutomaticReconnect()
      .build();

    // 1. استماع لتنبيهات المواعيد (Reminders)
    connection.on("ReceiveReminderNotification", (data: any) => {
      console.log("🚨 استلام تنبيه موعد:", data);
      setNotifications((oldNotifications) => {
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

    // 2. استماع لطلبات الصيانة الجديدة (Service Requests) - دي كانت محطوطة غلط جوه اللي فوقها
    connection.on("ReceiveServiceRequest", (data: any) => {
      console.log("🚨 طلب صيانة جديد وصل للميكانيكي! 🚨", data);
      
      setNotifications((oldNotifications) => {
        const newNotification = {
          title: "طلب صيانة جديد 🛠️",
          isRequest: true,
          carName: data.carName || "سيارة غير محددة",
          // التأكد من عرض الداتا بناءً على نوع الطلب
          requestDetail: data.requestType === 1 ? "طلب طارئ 🚨" : `موعد مجدول: ${data.scheduledDate}`,
          description: data.issueDescription,
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
        };

        const updated = [newNotification, ...oldNotifications];
        localStorage.setItem(getStorageKey(), JSON.stringify(updated));
        return updated;
      });

      triggerShake();
    });

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
      if (connection) connection.stop();
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
     { label: " دقيقتين", value: 5 },
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

{/* <div className="max-h-80 overflow-y-visible space-y-3 custom-scrollbar px-1"> */}
<div className="max-h-80 overflow-y-auto space-y-3 custom-scrollbar px-1">



{notifications.length > 0 ? notifications.map((n, i) => (
  <div key={i} className={`relative p-3.5 rounded-xl border transition-all ${
    dark ? "bg-white/[0.03] border-white/[0.05]" : "bg-blue-50 border-blue-100"
  }`}>
    <div className="flex-1 min-w-0 text-right">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-[12px] text-blue-400">{n.title}</h4>
        <button onClick={() => removeNotificationFromList(i)} className="text-slate-600 hover:text-red-400">
          <FaTimes size={10} />
        </button>
      </div>

      {/* عرض بيانات السيارة لو موجودة */}
      {(n.carName || n.carId) && (
        <div className="text-[11px] font-bold mb-1 flex items-center gap-1 dark:text-slate-200">
          <span>🚗</span> {n.carName || getCarName(n.carId)}
        </div>
      )}

      {/* تفاصيل إضافية للريكوست */}
      {/* {n.isRequest && (
        <div className="space-y-1 mb-2">
          <p className="text-[10px] opacity-80">🛠️ نوع الخدمة: <span className="font-bold">{n.serviceType}</span></p>
          <p className="text-[10px] opacity-80">📍 الوضع: <span className="font-bold">{n.mode}</span></p>
          <p className="text-[10px] bg-blue-500/10 p-1.5 rounded italic">"{n.description}"</p>
        </div>
      )} */}
      {/* تفاصيل إضافية للريكوست */}
{n.isRequest && (
  <div className="space-y-1 mb-2">
    {/* هنا هيعرض "الوضع: متنقل" أو "الموعد: 2026-03-28 الساعة 10:00" تلقائياً */}
    <p className="text-[10px] opacity-90 font-bold text-blue-500/80">
      {n.requestDetail}
    </p>
    <p className="text-[10px] bg-blue-500/10 p-2 rounded-lg italic border-r-2 border-blue-400">
      {n.description}
    </p>
  </div>
)}

      {/* لو مش ريكوست (تذكير عادي) اعرض الرسالة العادية */}
      {!n.isRequest && n.message && (
        <p className="text-[11px] opacity-60 mb-2">{n.message}</p>
      )}

      {/* إخفاء الأزرار مؤقتاً للريكوستات، وإظهارها فقط للتذكيرات القديمة لو حابة */}
      {!n.isRequest && (
        <div className="flex gap-2">
           {/* الأزرار القديمة كانت هنا، شيلناها مؤقتاً */}
        </div>
      )}

      <span className="text-[8px] mt-2 opacity-30 block font-mono">{n.time}</span>
    </div>
  </div>
)) : (
  <div className="text-center py-6 opacity-30 text-[11px]">لا توجد تنبيهات</div>
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
