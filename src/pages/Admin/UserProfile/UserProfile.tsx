
import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import { FaBars, FaTimes } from "react-icons/fa"; // إضافة أيقونات للقائمة

const UserProfile: React.FC = () => {
  const { dark } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // حالة السايدبار للموبايل

  const bgColor = dark ? "bg-primary_BGD" : "bg-white"; 
  const cardBg = bgColor; 
  const borderColor = "border-[#137FEC]"; 
  const mainTextColor = dark ? "text-white" : "text-black";
  const carCardBg = dark ? "bg-[#137FEC1A]" : "bg-[#137FEC33]"; 
  const carNameColor = dark ? "text-white" : "text-black";

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${bgColor}`} dir="rtl">
      
      {/* Sidebar - Responsive Wrapper */}
      <div className={`fixed inset-y-0 right-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex shadow-2xl lg:shadow-none`}>
        <AdminSidebar />
        {/* زر إغلاق في الموبايل */}
        <button onClick={() => setSidebarOpen(false)} className="absolute left-4 top-4 lg:hidden text-2xl text-[#137FEC]">
          <FaTimes />
        </button>
      </div>

      {/* Overlay للموبايل */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            {/* زر القائمة للموبايل */}
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-xl text-[#137FEC]">
              <FaBars />
            </button>
        
<h2 className={`text-xl md:text-2xl font-bold ${mainTextColor} leading-tight`}>
  إدارة المستخدمين /{" "}
  <span className={`${dark ? "text-white" : "text-black"} text-sm md:text-xl`}>
    الملف الشخصي
  </span>{" "}
  <div className="block sm:inline mt-1 sm:mt-0 sm:mr-2 text-[#137FEC] font-extrabold truncate">
    John Doe
  </div>
</h2>



          </div>
        </div>

        <div className="max-w-6xl space-y-6">

          {/* البيانات الشخصية */}
          <div className={`rounded-2xl md:rounded-3xl border ${borderColor} ${cardBg} p-5 md:p-8 relative`}>
            <h3 className={`text-base md:text-lg font-bold mb-8 text-right pr-2 ${mainTextColor}`}>
              البيانات الشخصية الأساسية
            </h3>
            <hr className={`absolute top-14 left-5 right-5 md:left-8 md:right-8 ${borderColor} border-t`} />

            <div className="flex justify-center mb-8 md:mb-10 mt-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#137FEC]/20 overflow-hidden shadow-md">
                <img 
                  src="/userProfile.png" 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ProfileInput label="الاسم الكامل" dark={dark} />
              <ProfileInput label="رقم الهاتف" dark={dark} />
              <ProfileInput label="البريد الإلكتروني" dark={dark} />
              <ProfileInput label="العنوان بالتفصيل" dark={dark} />
              <ProfileInput label="البلد" dark={dark} />
              <ProfileInput label="المدينة" dark={dark} />
              <ProfileInput label="الرمز بريدي" dark={dark} />
            </div>
          </div>

          {/* بيانات السيارات */}
          <div className={`rounded-2xl md:rounded-3xl border ${borderColor} ${cardBg} p-5 md:p-8 relative`}>
            <h3 className={`text-base md:text-lg font-bold mb-8 text-right pr-2 ${mainTextColor}`}>
              بيانات السيارات
            </h3>
            <hr className={`absolute top-14 left-5 right-5 md:left-8 md:right-8 ${borderColor} border-t`} />

            <div className={`mt-10 rounded-2xl md:rounded-3xl p-4 flex flex-col md:flex-row items-center justify-start gap-4 md:gap-8 px-4 md:px-8 
                ${carCardBg} border-transparent w-full transition-all`}>
              
              <div className="w-full md:w-auto flex justify-center">
                <img 
                  src="/car_rav4.png" 
                  alt="Toyota RAV4"
                  className="w-full max-w-[250px] md:w-56 h-auto md:h-32 object-cover rounded-2xl shadow-sm" 
                />
              </div>

              <span className={`font-bold text-xl md:text-2xl text-center md:text-right ${carNameColor}`}>
                2022 Toyota RAV4
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};


const ProfileInput = ({ label, dark }: { label: string, dark: boolean }) => {
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full">
      <label className={`block text-xs mb-1 mr-2 font-medium opacity-60 ${dark ? "text-white" : "text-black"}`}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={label}
        style={{ color: dark ? "#FFFFFF" : "#0F1323" }}
        className={`w-full p-3 md:p-4 rounded-xl text-right outline-none transition-all text-sm md:text-base
          bg-[#137FEC1A] border border-transparent
          ${dark ? "placeholder-gray-600" : "placeholder-[#0F132340]"}
          focus:border-[#137FEC] focus:bg-transparent`}
      />
    </div>
  );
};

export default UserProfile;