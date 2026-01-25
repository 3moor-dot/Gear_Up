import React from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
// import NotificationBell from "../../../components/NotificationBell/notification_bell";
import { useTheme } from "../../../contexts/ThemeContext";
// import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";

const UserProfile: React.FC = () => {
  const { dark } = useTheme();

  // تدرج الألوان بناءً على المود
  const bgColor = dark ? "bg-[#0B1020]" : "bg-[#F8FAFC]";
  const cardBg = dark ? "bg-[#0B1020]" : "bg-white";
  const borderColor = dark ? "border-[#1E2A44]" : "border-[#C6E0FF]";
  const textColor = dark ? "text-white" : "text-[#1E3A5F]";
  const inputBg = dark ? "bg-[#131B2F]" : "bg-[#EAF4FF]";
  const inputTextColor = dark ? "text-gray-300" : "text-[#5C7AA5]";

  return (
    <div className={`flex min-h-screen font-sans ${bgColor}`} dir="rtl">
      {/* Sidebar - المكون الجاهز تبعك */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-sm font-medium ${textColor}`}>
            ادارة المستخدمين / <span className="opacity-70">الملف الشخصي John Doe</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Section 1: البيانات الشخصية الأساسية */}
          <div className={`border-2 rounded-3xl p-8 relative ${cardBg} ${borderColor}`}>
            <h3 className={`text-xl font-bold mb-8 text-center ${textColor}`}>
              البيانات الشخصية الأساسية
            </h3>
            
            <div className="flex flex-col items-center mb-8">
               {/* Avatar Placeholder */}
               <div className="w-24 h-24 rounded-full bg-[#F3D1C1] border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                  <div className="w-16 h-16 border-t-4 border-white rounded-full opacity-50"></div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="الاسم الكامل" value="John Doe" bg={inputBg} color={inputTextColor} />
              <InputField label="رقم الهاتف" value="0123456789" bg={inputBg} color={inputTextColor} />
              <InputField label="البريد الإلكتروني" value="john@example.com" bg={inputBg} color={inputTextColor} />
              <InputField label="العنوان بالتفصيل" value="القاهرة، المعادي" bg={inputBg} color={inputTextColor} />
              <InputField label="البلد" value="مصر" bg={inputBg} color={inputTextColor} />
              <InputField label="المدينة" value="القاهرة" bg={inputBg} color={inputTextColor} />
              <div className="md:col-start-2">
                <InputField label="رمز بريدي" value="12345" bg={inputBg} color={inputTextColor} />
              </div>
            </div>
          </div>

          {/* Section 2: بيانات سيارات */}
          <div className={`border-2 rounded-3xl p-8 ${cardBg} ${borderColor}`}>
            <h3 className={`text-xl font-bold mb-8 text-left pr-4 ${textColor}`}>
              بيانات سيارات
            </h3>

            {/* Car Card */}
            <div className={`flex items-center justify-between p-4 rounded-full ${inputBg} border ${borderColor}`}>
              <div className="flex items-center gap-4 px-6">
                <span className={`font-bold text-lg ${textColor}`}>2022 Toyota RAV4</span>
              </div>
              <img 
                src="/car_rav4" // استبدلها بصورة الـ RAV4
                alt="Toyota RAV4"
                className="w-32 h-20 object-cover rounded-2xl"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// مكون فرعي للحقول (Sub-component) لتقليل تكرار الكود
const InputField = ({ label, bg, color }: { label: string, value: string, bg: string, color: string }) => (
  <div className={`relative flex items-center justify-end rounded-xl p-4 h-14 ${bg}`}>
    <span className={`text-sm font-medium ${color}`}>{label}</span>
    {/* القيمة تكون مخفية أو Placeholder بناءً على التصميم */}
  </div>
);

export default UserProfile;