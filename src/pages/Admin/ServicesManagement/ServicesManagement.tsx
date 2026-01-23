
import React from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import { useTheme } from "../../../contexts/ThemeContext";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";

import { FaEllipsisH, FaTint } from "react-icons/fa";

const Services: React.FC = () => {
  const { dark } = useTheme();

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

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* الهيدر العلوي */}
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

        {/* زر الإضافة */}
        <div className="flex justify-end mb-6">
          <button className="bg-[#137FEC] hover:bg-[#0F6AD1] text-white px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            إضافة خدمة جديدة
          </button>
        </div>

        {/* الجدول */}
        <div
          className={`rounded-2xl overflow-hidden border transition-all duration-500 ${
            dark ? "border-[#1E2A44] bg-[#0B1020]" : "border-[#E2E8F0] bg-white shadow-sm"
          }`}
        >
          <table className="w-full text-right border-collapse">
            <thead>
              {/* التعديل هنا: text-white في الدارك و text-[#0F1323] في اللايت */}
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
                <tr
                  key={service.id}
                  className={`border-t transition-colors ${
                    dark ? "border-[#1E2A44] hover:bg-white/5" : "border-[#E2E8F0] hover:bg-gray-50"
                  }`}
                >
                  <td className="p-5 flex items-center gap-3 text-nowrap">
                    <div className={`${dark ? "text-gray-300" : "text-[#137FEC]"} text-lg`}>
                      <FaTint />
                    </div>
                    <span className="font-semibold">{service.name}</span>
                  </td>
                  <td className="p-5 text-center text-sm font-medium">{service.category}</td>
                  <td className={`p-5 text-center text-xs leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>
                    {service.description}
                  </td>
                  <td className="p-5 text-center">
                    <span
                      className="px-5 py-1 rounded-full text-xs font-bold inline-block bg-[#0BDA651A] text-[#0BDA65]"
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <button className={`${dark ? "text-gray-400" : "text-gray-500"} hover:text-[#137FEC] transition-colors`}>
                      <FaEllipsisH size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Services;