
import { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
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

  const [role, setRole] = useState<string | null>(null);

useEffect(() => {
  try {
    const token = sessionStorage.getItem("userToken");
    if (token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));

        const r =
          payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        setRole(r);
      }
    }
  } catch (error) {
    console.error(error);
  }
}, []);




let userName = null;

try {
  const token = sessionStorage.getItem("userToken");

  if (token) {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));

      userName =
        payload?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];
    }
  }
} catch (error) {
  console.error("JWT parse error:", error);
}


console.log("ROLE:", role);

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


  const handleAccept = async (requestId: string, index: number) => {
    console.log("ACCEPT CLICK requestId:", requestId);
    try {
      await axios.post(
        `https://gearupapp.runasp.net/api/mechanic/requests/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("تم قبول الطلب ✅");
      removeNotificationFromList(index);
    } catch (error) {
      toast.error("فشل قبول الطلب ❌");
    }
  };
  
  const handleReject = async (requestId: string, index: number) => {
    try {
      await axios.post(
        `https://gearupapp.runasp.net/api/mechanic/requests/${requestId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("تم رفض الطلب ❌");
      removeNotificationFromList(index);
    } catch (error) {
      toast.error("فشل رفض الطلب ❌");
    }
  };


  useEffect(() => {
    if (!token) return;
  
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://gearupapp.runasp.net/hubs/notifications", {
        accessTokenFactory: () => token,
    
      })
      .withAutomaticReconnect()
      .build();

      connection.serverTimeoutInMilliseconds = 60000; // بدل 30 ثانية
connection.keepAliveIntervalInMilliseconds = 15000;

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

connection.on("ReceiveServiceRequest", (data: any) => {
  console.log("🔥🔥🔥 SERVICE REQUEST RECEIVED:", data);

  const formattedDate = data.scheduledDateTime
    ? new Date(data.scheduledDateTime).toLocaleString("ar-EG")
    : `${data.scheduledDate || ""} ${data.scheduledTime || ""}`;

  setNotifications((oldNotifications) => {

    const newNotification = {
      title: "طلب صيانة جديد 🛠️",
      isRequest: true,
      requestId: data.requestId || data.serviceRequestId,
      scheduledDateTime: data.scheduledDateTime,

      carName:
        data.car?.brand && data.car?.model && data.car?.year
          ? `${data.car.brand} ${data.car.model} ${data.car.year}`
          : "سيارة غير محددة",

      plateNumber: data.car?.plateNumber || "غير متوفر",

      location: data.location
        ? {
            lat: data.location.latitude,
            lng: data.location.longitude
          }
        : null,

  requestDetail:
  data.requestType === "Emergency"
    ? "طلب طارئ 🚨"
    : data.requestType === "Scheduled"
    ? "طلب مجدول 📅"
    : "طلب صيانة",

      description: data.issueDescription,

      time: new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    const updated = [newNotification, ...oldNotifications];
    localStorage.setItem(getStorageKey(), JSON.stringify(updated));
    return updated;
  });

  triggerShake();
});


connection.on("MechanicAccepted", async (data) => {
  console.log("MECHANIC DATA FULL:", data);

  let mechanicName = "ميكانيكي";

  try {
    const res = await axios.get(
      `https://gearupapp.runasp.net/api/requests/${data.serviceRequestId}/accepted-mechanics`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("MECHANICS RESPONSE FULL:", res.data);

    const mechanic = res.data?.mechanics?.find(
      (m: any) => m.mechanicUserId === data.mechanicUserId
    );

    if (mechanic) {
      mechanicName = `${mechanic.firstName} ${mechanic.lastName}`;
    }

  } catch (error) {
    console.error("Error fetching mechanic:", error);
  }


  // localStorage.setItem("accepted_mechanic_name", mechanicName);
  localStorage.setItem(
    "accepted_mechanic",
    JSON.stringify({
      requestId: data.serviceRequestId,
      name: mechanicName
    })
  );
  window.dispatchEvent(new Event("mechanicAccepted"));


  const newNotification = {
    title: "تم قبول طلبك 🎉",
    message: `تم قبول الطلب بواسطة الميكانيكي ${mechanicName} 🛠️`,
    mechanicName: mechanicName, // 👈 مهم جدا
    // requestId: data.serviceRequestId,
    requestId: data.requestId || data.serviceRequestId,
    time: new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit"
    })
  };


  const storageKey = getStorageKey();
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

  const updated = [newNotification, ...saved];
  localStorage.setItem(storageKey, JSON.stringify(updated));

  setNotifications(updated);
  triggerShake();
});


connection.on("YouAreSelected", (data: any) => {
  console.log("NOTIFICATION DATA:", data);
  console.log("🎉 MechanicSelected:", data);

  const newNotification = {
    title: "تم اختيارك 🎉",
    // message: data.message || "تم اختيارك لتنفيذ الطلب",
    message: "تم اختيارك من قبل العميل. ",
    requestId: data.serviceRequestId,
    hasTracking: true,
    isRequest: true,
    isSelected: true, 
  time: new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  const storageKey = getStorageKey();
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

  const updated = [newNotification, ...saved];
  localStorage.setItem(storageKey, JSON.stringify(updated));

  setNotifications(updated);
  triggerShake();
});

const statusMap: any = {
  Accepted: "تم القبول",
  OnTheWay: "في الطريق",
  Arrived: "وصل الميكانيكي",
  InProgress: "جاري الإصلاح",
  Completed: "تم الانتهاء",
  Cancelled: "تم الإلغاء"
};
connection.on("RequestStatusChanged", async (data: any) => {
  console.log("📢 STATUS UPDATED:", data);

  const id = data.requestId || data.serviceRequestId;

  if (!id) {
    console.log("❌ No requestId found");
    return;
  }

  let issue = "طلب صيانة";
  let mechanicName = "الميكانيكي";

  try {
    const res = await axios.get(
      `https://gearupapp.runasp.net/api/requests/${id}/status`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fullData = res.data;

    issue = fullData?.issueDescription || issue;

    if (fullData?.mechanic) {
      mechanicName = `${fullData.mechanic.firstName} ${fullData.mechanic.lastName}`;
    }


const newNotification = {
  title: "🔄 تم تحديث حالة الطلب",
  description: `المشكلة: ${issue}
  تم تحديث الحالة إلى: ${statusMap[data.newStatus] || data.newStatus}
  بواسطة الميكانيكي: ${mechanicName}`,

  requestId: id,
  status: data.newStatus,
  isRequest: true,
  hasTracking: true,
  time: new Date().toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit"
  })
};

    const storageKey = getStorageKey();
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

    const updated = [newNotification, ...saved];

    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNotifications(updated);
    triggerShake();

  } catch (err) {
    console.error("Status fetch error:", err);
  }
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


{(n.carName || n.carId) && (
  <div className="text-[11px] font-bold mb-1 flex items-center gap-1 dark:text-slate-200">
    
    {n.plateNumber && (
      <span className="text-[10px] opacity-70">
        {n.plateNumber}
      </span>
    )}

    <span>
      {n.carName || getCarName(n.carId)}
    </span>

  </div>
)}


{/* {n.location && (
  <div className="text-[11px] opacity-80">
    📍 {n.location.lat}, {n.location.lng}
  </div>
)} */}
{n.location && (
  <a
    href={`https://www.google.com/maps?q=${n.location.lat},${n.location.lng}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-[11px] opacity-80 text-blue-500 underline hover:text-blue-700"
  >
    📍 عرض الموقع على الخريطة
  </a>
)}


{n.isRequest && (
  <div className="space-y-2 mb-2">

    {/* لو تم اختيار الميكانيكي */}
    {n.requestId && n.title?.includes("تم اختيارك") && (
      <div className="text-[11px] bg-green-500/10 border-r-2 border-green-500 p-2 rounded-lg text-green-500 font-bold">
        {n.message}
      </div>
    )}

    {/* زر التتبع فقط */}
    {n.hasTracking && role?.toLowerCase() === "mechanic" && (
      <button


        onClick={() => {
          console.log("Navigating with requestId:", n.requestId);
          navigate(`/mechanics/request/mrequest_tracking/${n.requestId}`);
        }}


        className="mt-2 w-full bg-blue-500 text-white py-1 rounded text-xs"
      >
        تتبع الطلب
      </button>
    )}

    {/* أزرار قبول/رفض تظهر فقط لو مش "تم اختيارك" */}
    {role?.toLowerCase() === "mechanic" && !n.hasTracking && (
      <div className="flex gap-2 mt-2">

        <button
          // onClick={() => handleAccept(n.requestId, i)}
          onClick={() => {
            if (!n.requestId) {
              console.error("Missing requestId", n);
              toast.error("requestId غير موجود");
              return;
            }
            handleAccept(n.requestId, i);
          }}
          className="flex-1 text-[11px] py-1 rounded bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition font-bold"
        >
          قبول
        </button>

        <button
          onClick={() => handleReject(n.requestId, i)}
          className="flex-1 text-[11px] py-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition font-bold"
        >
          رفض
        </button>

      </div>
    )}

    <p className="text-[10px] opacity-90 font-bold text-blue-500/80">
      {n.requestDetail}
    </p>
    {n.scheduledDateTime && (
  <div className="text-[11px] opacity-80 mt-1">
   {new Date(n.scheduledDateTime).toLocaleString("ar-EG")}
  </div>
  )}

    <div className="text-[11px] leading-5 whitespace-pre-line bg-blue-500/10 p-2 rounded-lg border-r-2 border-blue-400">
  {n.description}
</div>

  </div>
)}

      {/* لو مش ريكوست (تذكير عادي) اعرض الرسالة العادية */}
      {!n.isRequest && n.message && (
        <p className="text-[11px] opacity-60 mb-2">{n.message}</p>
      )}


      <span className="text-[8px] mt-2 opacity-30 block font-mono">{n.time}</span>
    </div>
  </div>
)) : (
  <div className="text-center py-6 opacity-30 text-[11px]">لا توجد تنبيهات</div>
)}

          </div>

          {/* <button 
            onClick={() => { setIsOpen(false); navigate("/customer/reminders"); }} 
            className={`w-full mt-3 py-2 text-[11px] font-bold rounded-lg transition-all ${
              dark ? "bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white" : "bg-blue-50 text-blue-600"
            }`}
          >
            عرض سجل التنبيهات الكامل
          </button> */}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;