
import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { MdAccessTime, MdCheckCircle, MdPauseCircle } from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

const NotificationBell = ({ size = 20 }) => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    let isMounted = true;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://gearupapp.runasp.net/hubs/notifications", {
        accessTokenFactory: () => token || "",
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets 
      })
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        if (isMounted) console.log("SignalR Connected! ✅🚀");

        // --- الجزء اللي عدلناه عشان يستقبل صح ويحول الوقت ---
        connection.on("ReceiveReminderNotification", (data) => {
          console.log("إشعار استُلم فعلياً من السيرفر! 🔔", data);

          const title = data.Title || data.title || "تنبيه صيانة";
          const body = data.Message || data.message || "";
          
          // تحويل وقت جرينتش (UTC) لوقت مصر (Local)
          const serverTime = data.Timestamp ? new Date(data.Timestamp + "Z") : new Date();
          const localTime = serverTime.toLocaleTimeString('ar-EG', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });

          toast.success(
            <div>
              <p className="font-bold">{title}</p>
              <p className="text-xs">{body}</p>
            </div>
          );

          if (isMounted) {
            setNotifications(prev => [
              { id: Date.now(), title, body, time: localTime }, 
              ...prev
            ]);
          }
        });
      } catch (err) {
        if (isMounted) console.error("SignalR Connection Error: ", err);
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (connection.state === signalR.HubConnectionState.Connected) connection.stop();
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 transition-all duration-200 hover:scale-110 cursor-pointer rounded-full
          ${dark ? "text-white hover:bg-gray-800" : "text-[#137FEC] hover:bg-blue-50"}`}
      >
        <FaBell size={size} />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 dark:border-primary_BGD border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className={`absolute left-0 mt-3 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden border transition-all duration-300 transform origin-top-left
              ${dark ? "bg-[#1A233A] border-gray-700 text-white" : "bg-white border-gray-100 text-gray-800"}`} dir="rtl">
            
            <div className="p-4 border-b dark:border-gray-700 font-bold text-sm flex justify-between items-center">
              <span>تنبيهات الصيانة</span>
              <span className="text-[10px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full">{notifications.length} جديد</span>
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="p-4 border-b last:border-0 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex gap-3 text-right">
                      <div className="text-[#137FEC] mt-1"><MdAccessTime size={18} /></div>
                      
                      {/* --- الجزء بتاع عرض البيانات المعدل --- */}
                      <div className="flex-1">
                        <p className="text-xs font-bold">{n.title}</p>
                        <p className="text-[10px] text-gray-400 mt-1 italic">الموعد: {n.time}</p>
                        {n.body && <p className="text-[9px] text-gray-500 mt-1">{n.body}</p>}
                        
                        <div className="flex gap-2 mt-3">
                          <button className="flex items-center gap-1 text-[9px] bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors">
                            <MdCheckCircle size={12} /> إتمام
                          </button>
                          <button className="flex items-center gap-1 text-[9px] bg-orange-500 text-white px-2 py-1 rounded-md hover:bg-orange-600 transition-colors">
                            <MdPauseCircle size={12} /> تأجيل
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 text-xs">لا توجد إشعارات جديدة</div>
              )}
            </div>

            <button
              onClick={() => { navigate("/notification"); setIsOpen(false); }}
              className="w-full py-3 text-center text-[11px] font-bold text-[#137FEC] bg-gray-50 dark:bg-gray-800/30 hover:bg-blue-50 dark:hover:bg-gray-800 transition-all"
            >
              عرض سجل التنبيهات بالكامل
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;