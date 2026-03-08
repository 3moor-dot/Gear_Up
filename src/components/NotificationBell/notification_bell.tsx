import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { MdAccessTime, MdCheckCircle, MdPauseCircle } from "react-icons/md";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

type Notif = { id: number; title: string; body: string; time: string };

const NotificationBell = ({ size = 20 }: { size?: number }) => {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    let isMounted = true;

    const token = sessionStorage.getItem("userToken");
    if (!token) {
      console.warn("No userToken found, SignalR will not start.");
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://gearupapp.runasp.net/hubs/notifications", {
        accessTokenFactory: () => token,
        // ✅ سيبي SignalR يتفاوض (أضمن)
        // transport: signalR.HttpTransportType.WebSockets, // اختياري
        // skipNegotiation: true,                           // ❌ شيليه
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    const parseServerTimeToEgypt = (ts?: string) => {
      const d = ts ? new Date(ts) : new Date();
      return d.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Africa/Cairo",
      });
    };

    const handler = (data: any) => {
      console.log("ReceiveReminderNotification:", data);

      const title = data?.Title ?? data?.title ?? "تنبيه صيانة";
      const body = data?.Message ?? data?.message ?? "";
      const localTime = parseServerTimeToEgypt(data?.Timestamp ?? data?.timestamp);

      toast.success(
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-xs">{body}</p>
        </div>
      );

      if (isMounted) {
        setNotifications((prev) => [
          { id: Date.now(), title, body, time: localTime },
          ...prev,
        ]);
      }
    };

    const start = async () => {
      try {
        // ✅ يمنع تكرار ال handler في حالة re-render/strict mode
        connection.off("ReceiveReminderNotification");
        connection.on("ReceiveReminderNotification", handler);

        await connection.start();
        console.log("SignalR Connected ✅", connection.connectionId);
      } catch (err) {
        console.error("SignalR start error:", err);
      }
    };

    connection.onreconnecting((err) => console.warn("Reconnecting...", err));
    connection.onreconnected((id) => console.log("Reconnected ✅", id));
    connection.onclose((err) => console.warn("Closed ❌", err));

    start();

    return () => {
      isMounted = false;
      connection.off("ReceiveReminderNotification", handler);
      connection
        .stop()
        .catch((e) => console.warn("Stop error:", e));
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

          <div
            className={`absolute left-0 mt-3 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden border transition-all duration-300 transform origin-top-left
              ${dark ? "bg-[#1A233A] border-gray-700 text-white" : "bg-white border-gray-100 text-gray-800"}`}
            dir="rtl"
          >
            <div className="p-4 border-b dark:border-gray-700 font-bold text-sm flex justify-between items-center">
              <span>تنبيهات الصيانة</span>
              <span className="text-[10px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                {notifications.length} جديد
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 border-b last:border-0 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex gap-3 text-right">
                      <div className="text-[#137FEC] mt-1">
                        <MdAccessTime size={18} />
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-bold">{n.title}</p>
                        <p className="text-[10px] text-gray-400 mt-1 italic">
                          الموعد: {n.time}
                        </p>
                        {n.body && (
                          <p className="text-[9px] text-gray-500 mt-1">{n.body}</p>
                        )}

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
                <div className="p-10 text-center text-gray-400 text-xs">
                  لا توجد إشعارات جديدة
                </div>
              )}
            </div>

            <button
              onClick={() => {
                navigate("/notification");
                setIsOpen(false);
              }}
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