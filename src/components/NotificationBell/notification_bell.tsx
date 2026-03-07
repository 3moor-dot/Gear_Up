
import { useState, useEffect } from "react";
import { FaBell, FaTimes, FaCheck, FaPause } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

const NotificationBell = ({ size = 25 }) => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [isShaking, setIsShaking] = useState(false);
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem("userNotifications");
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const token = sessionStorage.getItem("userToken");

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 2500);
  };

  useEffect(() => {
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
  }, [notifications]);

  // دالة التعامل مع الأكشن (إتمام أو إيقاف) من داخل التوست
  const handleAction = async (e: React.MouseEvent, index: number, reminderId: number, action: string) => {
    e.stopPropagation();
    if (!reminderId) return;

    try {
      await axios.post(
        `http://gearupapp.runasp.net/api/Reminder/${reminderId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 1. مسح النوتيفيكيشن بعد النجاح
      setNotifications(prev => prev.filter((_, i) => i !== index));
      
      // 2. إرسال حدث لتنبيه صفحة الريمايندرز بوجود تحديث
      window.dispatchEvent(new Event("remindersUpdated"));
      
    } catch (error) {
      console.error("فشل تنفيذ العملية من التنبيه:", error);
    }
  };

  const removeNotification = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://gearupapp.runasp.net/hubs/notifications", {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveReminderNotification", (data: any) => {
      setNotifications(prev => [{ 
        title: data.title || "تنبيه صيانة", 
        message: data.message || "لديك تنبيه جديد", 
        reminderId: data.reminderId, // التأكد من وصول الـ ID من السيرفر
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) 
      }, ...prev]);
      triggerShake();
    });

    connection.start().catch(err => console.error(err));
    return () => { connection.stop(); };
  }, [token]);

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
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        )}
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
            {notifications.length > 0 ? (
              notifications.map((n, i) => (
                <div key={i} className="relative p-3 bg-gray-500/5 rounded-xl border border-gray-500/10 group">
                  <button 
                    onClick={(e) => removeNotification(e, i)}
                    className="absolute top-2 left-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FaTimes size={10} />
                  </button>
                  <h4 className="font-bold text-xs mb-1 ml-4">{n.title}</h4>
                  <p className="text-[11px] opacity-70 mb-3">{n.message}</p>
                  
                  {/* أزرار العمليات داخل التوست */}
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={(e) => handleAction(e, i, n.reminderId, 'complete')}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-green-500/20 text-green-600 hover:bg-green-500 hover:text-white transition-all text-[10px] font-bold"
                    >
                      <FaCheck size={8} /> إتمام
                    </button>
                    <button 
                      onClick={(e) => handleAction(e, i, n.reminderId, 'pause')}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-orange-500/20 text-orange-600 hover:bg-orange-500 hover:text-white transition-all text-[10px] font-bold"
                    >
                      <FaPause size={8} /> إيقاف مؤقت
                    </button>
                  </div>

                  <span className="text-[9px] opacity-50 block">{n.time}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-xs opacity-50 py-4">لا توجد تنبيهات جديدة</p>
            )}
          </div>
          
          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/customer/reminders");
            }}
            className="w-full mt-3 py-2 text-blue-500 hover:bg-blue-500/10 rounded-lg font-bold text-xs transition-colors"
          >
            عرض سجل التنبيهات الكامل
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;