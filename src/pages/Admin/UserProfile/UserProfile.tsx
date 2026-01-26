
import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";

const UserProfile: React.FC = () => {
  const { dark } = useTheme();

  const bgColor = dark ? "bg-primary_BGD" : "bg-white"; 
  const cardBg = bgColor; 
  const borderColor = "border-[#137FEC]"; 
  const mainTextColor = dark ? "text-white" : "text-black";
  const carCardBg = dark ? "bg-[#137FEC1A]" : "bg-[#137FEC33]"; 
  const carNameColor = dark ? "text-white" : "text-black";

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${bgColor}`} dir="rtl">
      <AdminSidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className={`text-2xl font-bold ${mainTextColor}`}>
            إدارة المستخدمين /{" "}
            <span className={dark ? "text-white" : "text-black"}>الملف الشخصي</span>{" "}
            <span className="mr-2 text-[#137FEC] font-extrabold">John Doe</span>
          </h2>
        </div>

        <div className="max-w-6xl space-y-6">

          {/* البيانات الشخصية */}
          <div className={`rounded-3xl border ${borderColor} ${cardBg} p-8 relative`}>
            <h3 className={`text-lg font-bold mb-8 text-right pr-2 ${mainTextColor}`}>
              البيانات الشخصية الأساسية
            </h3>
            <hr className={`absolute top-14 left-8 right-8 ${borderColor} border-t`} />

            <div className="flex justify-center mb-10 mt-4">
              <div className="w-24 h-24 rounded-full border-4 border-[#137FEC]/20 overflow-hidden shadow-md">
                <img 
                  src="/userProfile.png" 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className={`rounded-3xl border ${borderColor} ${cardBg} p-8 relative`}>
            <h3 className={`text-lg font-bold mb-8 text-right pr-2 ${mainTextColor}`}>
              بيانات السيارات
            </h3>
            <hr className={`absolute top-14 left-8 right-8 ${borderColor} border-t`} />

            <div className={`mt-10 rounded-3xl p-4 flex items-center justify-start gap-4 px-8 
                ${carCardBg} border-transparent shadow-none w-full transition-all`}>
              
              <img 
                src="/car_rav4.png" 
                alt="Toyota RAV4"
                className="w-56 h-32 object-cover rounded-2xl shadow-sm" 
              />

              <span className={`font-bold text-2xl ${carNameColor}`}>2022 Toyota RAV4</span>
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
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={label}
        style={{ color: dark ? "#FFFFFF" : "#0F132380" }} // لون الخط 50% في اللايت مود
        className={`w-full p-4 rounded-xl text-right outline-none transition-all
          bg-[#137FEC1A] border border-transparent
          ${dark ? "placeholder-gray-500" : "placeholder-[#0F132380]"}
          focus:border-[#137FEC]`}
      />
    </div>
  );
};

export default UserProfile;
