
import React, { useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import { useTheme } from "../../../contexts/ThemeContext";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";

import { FaEllipsisH, FaTint, FaTimes } from "react-icons/fa";

const Services: React.FC = () => {
  const { dark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const services = [
    {
      id: 1,
      name: "تغيير الزيت",
      category: "صيانة",
      description: "استبدال الزيت الاصطناعي بالكامل، بما في ذلك فحص الفلتر والتخلص من الزيت القديم",
      status: "نشط",
    },
  ];

  return (
    <div
      className={`flex min-h-screen font-sans transition-colors duration-500 ${
        dark ? "bg-primary_BGD text-white" : "bg-white text-[#1E3A5F]"
      }`}
      dir="rtl"
    >
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-10 gap-8">
          <div className="text-right">
            <h2 className={`text-3xl font-bold mb-2 ${dark ? "text-white" : "text-black"}`}>
              إدارة الخدمات
            </h2>
            <p className={`text-sm whitespace-nowrap ${dark ? "text-gray-400" : "text-gray-500"}`}>
              إدارة كتالوج الخدمات، والأسعار المقترحة بواسطة الذكاء الاصطناعي، والأوصاف الفنية المقدمة لمالكي السيارات.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 mt-1"> 
            <NotificationBell size={24} />
            <ThemeToggle />
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#137FEC] hover:bg-[#0F6AD1] text-white px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            إضافة خدمة جديدة
          </button>
        </div>

        {/* Table Content */}
        <div className={`rounded-2xl overflow-hidden border transition-all duration-500 ${dark ? "border-[#1E2A44] bg-[#0B1020]" : "border-[#E2E8F0] bg-white shadow-sm"}`}>
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className={`${dark ? "bg-[#137FEC1A] text-white" : "bg-[#F1F7FF] text-[#0F1323]"}`}>
                <th className="p-5 font-bold text-sm">اسم الخدمة</th>
                <th className="p-5 font-bold text-sm text-center">فئة</th>
                <th className="p-5 font-bold text-sm text-center w-1/3">وصف</th>
                <th className="p-5 font-bold text-sm text-center">حالة</th>
                <th className="p-5 font-bold text-sm text-center">الاجراءات</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className={`border-t transition-colors ${dark ? "border-[#1E2A44] hover:bg-white/5" : "border-[#E2E8F0] hover:bg-gray-50"}`}>
                  <td className="p-5 flex items-center gap-3 text-nowrap">
                    <div className={`${dark ? "text-gray-300" : "text-[#137FEC]"} text-lg`}><FaTint /></div>
                    <span className="font-semibold">{service.name}</span>
                  </td>
                  <td className="p-5 text-center text-sm font-medium">{service.category}</td>
                  <td className={`p-5 text-center text-xs leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>{service.description}</td>
                  <td className="p-5 text-center">
                    <span className="px-5 py-1 rounded-full text-xs font-bold inline-block bg-[#0BDA651A] text-[#0BDA65]">{service.status}</span>
                  </td>
                  <td className="p-5 text-center">
                    <button className={`${dark ? "text-gray-400" : "text-gray-500"} hover:text-[#137FEC] transition-colors`}><FaEllipsisH size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- (MODAL) --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity"
          style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
        >
          <div 
            className="w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all border border-white/10"
            style={{ backgroundColor: "rgba(19, 127, 236, 0.35)" }} 
            dir="rtl"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-start border-b border-white/10">
              <div className="text-right">
                <h3 className="text-3xl font-bold text-white">إضافة خدمة جديدة</h3>
                <p className="text-white/70 text-sm mt-2 font-medium">قم بإنشاء خدمة جديدة</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-2"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-10 space-y-8">
              <div className="space-y-4 text-center">
                <label className="text-white text-lg font-bold block">اسم الخدمة</label>
                <input 
                  type="text" 
                  placeholder="مثال: تغيير الزيت الاصطناعي بالكامل"
                  className="w-full p-5 rounded-2xl outline-none text-center border-none text-white placeholder:text-white/40 font-medium"
                  style={{ backgroundColor: "rgba(10, 31, 58, 0.75)" }} 
                />
              </div>

              <div className="space-y-4 text-center">
                <label className="text-white text-lg font-bold block">وصف</label>
                <textarea 
                  rows={4}
                  placeholder="صف تفاصيل الخدمة، والعمالة المشمولة..."
                  className="w-full p-5 rounded-2xl outline-none text-center border-none resize-none text-white placeholder:text-white/40 font-medium"
                  style={{ backgroundColor: "rgba(10, 31, 58, 0.75)" }} 
                />
              </div>
            </div>

          
            <div className="p-8 pt-0 flex gap-4 justify-start flex-row-reverse">
              <button 
                className="w-[140px] py-3 rounded-xl text-white font-bold text-md shadow-lg hover:bg-blue-600 transition active:scale-95"
                style={{ backgroundColor: "#137FEC" }}
              >
                إضافة خدمة
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-[140px] py-3 rounded-xl text-white font-bold text-md hover:bg-gray-900 transition active:scale-95"
                style={{ backgroundColor: "#000000" }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;