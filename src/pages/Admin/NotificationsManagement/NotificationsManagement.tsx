
import React, { useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import { useTheme } from "../../../contexts/ThemeContext";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { FaTimes } from "react-icons/fa";

const NotificationsManagement: React.FC = () => {
  const { dark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const notifications = [
    { id: 1, title: "طلب انضمام ميكانيكي جديد", time: "اليوم ، 10:00 صباحاً", statusColor: "bg-green-400" },
    { id: 2, title: "عميل جديد", time: "اليوم ، 10:00 صباحاً", statusColor: "bg-red-400" },
    { id: 3, title: "مشكلة في عملية التسجيل", time: "اليوم ، 10:00 صباحاً", statusColor: "bg-yellow-400" },
  ];

  return (
    <div 
      dir="rtl" 
      className={`flex h-screen w-full transition-colors duration-500 relative
        ${dark ? "bg-primary_BGD" : "bg-white"}`}
    >
      <AdminSidebar />

      <main className="flex-1 flex flex-col p-10 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="text-right">
            <h2 className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-black"}`}>إدارة الاشعارات</h2>
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>إدارة وإرسال التنبيهات على مستوى النظام</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell size={24} />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex justify-end mt-4 mb-12"> 
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#137FEC] hover:bg-[#0F6AD1] text-white px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg active:scale-95"
          >
            ارسال اشعار جديد
          </button>
        </div>

        <div className="max-w-full space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className={`relative flex flex-col justify-center p-6 rounded-xl border transition-all duration-300 ${dark ? "bg-[#137FEC1A] border-[#1E2A44] hover:bg-[#137FEC2A]" : "bg-[#EAF4FF] border-[#C6E0FF] hover:bg-[#DCEEFF]"}`}>
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3/5 rounded-l-full ${notif.statusColor}`} />
              <div className="pr-6 text-right">
                <h3 className={`font-bold text-xl ${dark ? "text-white" : "text-[#1E3A5F]"}`}>{notif.title}</h3>
                <span className={`text-xs mt-2 block ${dark ? "text-gray-400" : "text-gray-500"}`}>{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- (MODAL) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
          <div className="w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all border border-white/10" style={{ backgroundColor: "rgba(19, 127, 236, 0.35)" }} dir="rtl">
            
            <div className="p-8 pb-4 flex justify-between items-start border-b border-white/10">
              <div className="text-right">
                <h3 className="text-3xl font-bold text-white">إرسال اشعار جديد</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors p-2">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-4 text-center">
                <label className="text-white text-lg font-bold block">الأشخاص المستهدفون</label>
                <div className="relative">
                 
                  <select 
                    className="w-full p-5 rounded-2xl outline-none text-center appearance-none border-none text-white/40 font-medium cursor-pointer"
                    style={{ backgroundColor: "rgba(10, 31, 58, 0.75)" }}
                    onChange={(e) => e.target.style.color = "white"} 
                  >
                    <option value="" disabled selected>مثال: المشرفون</option>
                    <option className="bg-[#0A1F3A] text-white">المستخدمين</option>
                    <option className="bg-[#0A1F3A] text-white">الميكانيكيين</option>
                    <option className="bg-[#0A1F3A] text-white">الكل</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 text-center">
                <label className="text-white text-lg font-bold block">الرسالة</label>
                <textarea 
                  rows={4}
                  placeholder="اكتب نص الرسالة هنا..."
                  className="w-full p-5 rounded-2xl outline-none text-center border-none resize-none text-white placeholder:text-white/40 font-medium"
                  style={{ backgroundColor: "rgba(10, 31, 58, 0.75)" }} 
                />
              </div>
            </div>

            <div className="p-8 pt-0 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="w-[140px] py-3 rounded-xl text-white font-bold text-md hover:bg-gray-900 transition active:scale-95 shadow-lg" style={{ backgroundColor: "#000000" }}>إلغاء</button>
              <button className="w-[160px] py-3 rounded-xl text-white font-bold text-md shadow-lg hover:bg-blue-600 transition active:scale-95" style={{ backgroundColor: "#137FEC" }}>إرسال إشعار</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement;