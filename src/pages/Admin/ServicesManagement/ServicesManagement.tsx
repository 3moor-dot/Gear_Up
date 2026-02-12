
import React, { useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import { useTheme } from "../../../contexts/ThemeContext";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { FaEllipsisH, FaTint, FaTimes, FaBars } from "react-icons/fa";

const Services: React.FC = () => {
  const { dark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const services = [
    {
      id: 1,
      name: "تغيير الزيت",
      category: "صيانة",
      description:
        "استبدال الزيت الاصطناعي بالكامل، بما في ذلك فحص الفلتر والتخلص من الزيت القديم",
      status: "نشط",
    },
  ];

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        dark ? "bg-primary_BGD text-white" : "bg-white text-[#1E3A5F]"
      }`}
      dir="rtl"
    >
      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex`}
      >
        <AdminSidebar />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-10 gap-4">
          <div className="text-right flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-xl"
            >
              <FaBars />
            </button>
            <div>
              <h2
                className={`text-2xl md:text-3xl font-bold mb-1 md:mb-2 ${
                  dark ? "text-white" : "text-black"
                }`}
              >
                إدارة الخدمات
              </h2>
              <p
                className={`text-xs md:text-sm ${
                  dark ? "text-gray-400" : "text-gray-500"
                } max-w-xl`}
              >
                إدارة كتالوج الخدمات، والأسعار المقترحة بواسطة الذكاء الاصطناعي،
                والأوصاف الفنية.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
            <NotificationBell size={22} />
            <ThemeToggle />
          </div>
        </div>

        {/* ADD BUTTON */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-[#137FEC] hover:bg-[#0F6AD1]
            text-white px-8 py-3 rounded-xl font-bold transition-all
            shadow-lg active:scale-95 text-sm md:text-base"
          >
            إضافة خدمة جديدة
          </button>
        </div>

        {/* CONTENT */}
        <div
          className={`rounded-2xl overflow-hidden border transition-all duration-500 ${
            dark
              ? "border-[#1E2A44] bg-[#0B1020]"
              : "border-[#E2E8F0] bg-white shadow-sm"
          }`}
        >
          {/* TABLE (RESPONSIVE) */}
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[600px]">
              <thead>
                <tr
                  className={`${
                    dark
                      ? "bg-[#137FEC1A] text-white"
                      : "bg-[#F1F7FF] text-[#0F1323]"
                  }`}
                >
                  <th className="p-5 text-sm font-bold">اسم الخدمة</th>
                  <th className="p-5 text-sm font-bold text-center">فئة</th>
                  <th className="p-5 text-sm font-bold text-center w-1/3">
                    وصف
                  </th>
                  <th className="p-5 text-sm font-bold text-center">حالة</th>
                  <th className="p-5 text-sm font-bold text-center">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className={`border-t transition-colors ${
                      dark
                        ? "border-[#1E2A44] hover:bg-white/5"
                        : "border-[#E2E8F0] hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-5 flex items-center gap-3">
                      <FaTint className="text-[#137FEC]" />
                      <span className="font-semibold">{service.name}</span>
                    </td>
                    <td className="p-5 text-center text-sm">
                      {service.category}
                    </td>
                    <td
                      className={`p-5 text-xs leading-relaxed ${
                        dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {service.description}
                    </td>
                    <td className="p-5 text-center">
                      <span className="px-5 py-1 rounded-full text-xs font-bold bg-[#0BDA651A] text-[#0BDA65]">
                        {service.status}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <FaEllipsisH className="text-gray-400 hover:text-[#137FEC]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div
            className="w-full max-w-2xl rounded-3xl md:rounded-[2.5rem]
            shadow-2xl overflow-hidden border border-white/10
            bg-[#137FEC]/35"
            dir="rtl"
          >
            {/* HEADER */}
            <div className="p-6 md:p-8 pb-4 flex justify-between items-center border-b border-white/10">
              <div>
                <h3 className="text-xl md:text-3xl font-bold text-white">
                  إضافة خدمة جديدة
                </h3>
                <p className="text-white/70 text-xs md:text-sm mt-1">
                  قم بإنشاء خدمة جديدة
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-2"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 md:p-10 space-y-6 md:space-y-8">
              <div className="text-center space-y-2 md:space-y-4">
                <label className="text-white text-base md:text-lg font-bold block">
                  اسم الخدمة
                </label>
                <input
                  type="text"
                  placeholder="مثال: تغيير الزيت الاصطناعي بالكامل"
                  className="w-full p-4 md:p-5 rounded-xl bg-[#0A1F3A]/80 text-white text-center outline-none"
                />
              </div>

              <div className="text-center space-y-2 md:space-y-4">
                <label className="text-white text-base md:text-lg font-bold block">
                  وصف الخدمة
                </label>
                <textarea
                  rows={3}
                  placeholder="صف تفاصيل الخدمة، والعمالة المشمولة والأجزاء المستخدمة"
                  className="w-full p-4 md:p-5 rounded-xl bg-[#0A1F3A]/80 text-white text-center outline-none resize-none"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 md:p-8 pt-0 flex flex-col md:flex-row-reverse gap-3 md:gap-4">
              <button className="w-full md:w-[160px] py-3 rounded-xl bg-[#137FEC] text-white font-bold text-sm md:text-md shadow-lg active:scale-95">
                إضافة خدمة
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full md:w-[140px] py-3 rounded-xl bg-black text-white font-bold text-sm md:text-md active:scale-95"
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
