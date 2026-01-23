
import React from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import { useTheme } from "../../../contexts/ThemeContext";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";

const NotificationsManagement: React.FC = () => {
  const { dark } = useTheme();

  const notifications = [
    { id: 1, title: "طلب انضمام ميكانيكي جديد", time: "اليوم ، 10:00 صباحاً", statusColor: "bg-green-400" },
    { id: 2, title: "عميل جديد", time: "اليوم ، 10:00 صباحاً", statusColor: "bg-red-400" },
    { id: 3, title: "مشكلة في عملية التسجيل", time: "اليوم ، 10:00 صباحاً", statusColor: "bg-yellow-400" },
  ];

  return (
    <div 
      dir="rtl" 
      className={`flex h-screen w-full transition-colors duration-500 
        ${dark ? "bg-primary_BGD" : "bg-white"}`}
    >
      
 
      <AdminSidebar />

      {/* main content*/}
      <main className="flex-1 flex flex-col p-10 overflow-y-auto">
        
       
        <div className="flex justify-between items-start mb-6">
          
          
          <div className="text-right">
          
            <h2 className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-black"}`}>
              إدارة الاشعارات
            </h2>
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              إدارة وإرسال التنبيهات على مستوى النظام
            </p>
          </div>

         
          <div className="flex items-center gap-4">
            <NotificationBell size={24} />
            <ThemeToggle />
          </div>
        </div>

       
        <div className="flex justify-end mt-4 mb-12"> 
          <button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-2.5 rounded-lg font-medium shadow-md transition-all active:scale-95">
            ارسال اشعار جديد
          </button>
        </div>

        {/* notification list*/}
        <div className="max-w-full space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`relative flex flex-col justify-center p-6 rounded-xl border transition-all duration-300
                ${dark 
                  ? "bg-[#137FEC1A] border-[#1E2A44] hover:bg-[#137FEC2A]" 
                  : "bg-[#EAF4FF] border-[#C6E0FF] hover:bg-[#DCEEFF]"
                }`}
            >
              {/* colored side*/}
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3/5 rounded-l-full ${notif.statusColor}`} />
              
              <div className="pr-6 text-right">
                <h3 className={`font-bold text-xl ${dark ? "text-white" : "text-[#1E3A5F]"}`}>
                  {notif.title}
                </h3>
                <span className={`text-xs mt-2 block ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  {notif.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NotificationsManagement;