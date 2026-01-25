
import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
// import NotificationBell from "../../../components/NotificationBell/notification_bell";
// import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";

const MechanicProfile: React.FC = () => {
  const { dark } = useTheme();


  const [profileData, setProfileData] = useState({
    fullName: "جون دو",
    phone: "0123456789",
    email: "john@example.com",
    address: "القاهرة - مدينة نصر",
    location: "القاهرة",
    subSpecialty: "ميكانيكا محركات دقيقة",
  });

  const bgColor = dark ? "bg-primary_BGD" : "bg-white";
  const cardBg = dark ? "bg-primary_BGD" : "bg-white"; 
  const cardBorder = "border-[#137FEC]"; 
  
  const textMain = dark ? "text-white" : "text-black";
  const textSecondary = dark ? "text-gray-400" : "text-[#0F132380]"; 
  const inputBg = "bg-[#137FEC1A]"; 

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("ميكانيكا عامة");

  const specialties = ["ميكانيكا عامة", "كهرباء سيارات", "مكيف السيارة", "التروس/المحركات"];


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-500 ${bgColor}`} dir="rtl">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
      
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <span className={dark ? "text-white" : "text-black"}>إدارة الميكانيكيين /</span>
            <span className={dark ? "text-white" : "text-black"}> الملف الشخصي </span>
            <span className="text-[#137FEC]">{profileData.fullName}</span>
          </div>
          {/* <div className="flex items-center gap-6">
            <ThemeToggle />
            <NotificationBell size={24} />
          </div> */}
        </div>

        <div className="w-full space-y-6">
          {/* البيانات الشخصية الأساسية */}
          <section className={`rounded-3xl p-8 border ${cardBg} ${cardBorder} shadow-sm`}>
            <h3 className={`text-right text-lg font-bold mb-2 ${textMain}`}>البيانات الشخصية الأساسية</h3>
            <div className="border-b border-[#137FEC] mb-8"></div>

            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden bg-gray-100">
                <img src="/userProfile.png" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="fullName" value={profileData.fullName} onChange={handleInputChange}
                className={`py-4 px-6 rounded-2xl text-right text-sm font-medium outline-none ${inputBg} ${textSecondary}`} 
                placeholder="الاسم الكامل" 
              />
              <input 
                name="phone" value={profileData.phone} onChange={handleInputChange}
                className={`py-4 px-6 rounded-2xl text-right text-sm font-medium outline-none ${inputBg} ${textSecondary}`} 
                placeholder="رقم الهاتف" 
              />
              <input 
                name="email" value={profileData.email} onChange={handleInputChange}
                className={`py-4 px-6 rounded-2xl text-right text-sm font-medium outline-none ${inputBg} ${textSecondary}`} 
                placeholder="البريد الإلكتروني" 
              />
              <input 
                name="address" value={profileData.address} onChange={handleInputChange}
                className={`py-4 px-6 rounded-2xl text-right text-sm font-medium outline-none ${inputBg} ${textSecondary}`} 
                placeholder="العنوان" 
              />
            </div>
          </section>


          <section className={`rounded-3xl p-8 border ${cardBg} ${cardBorder} shadow-sm`}>
            <h3 className={`text-right text-lg font-bold mb-2 ${textMain}`}>البيانات الإضافية</h3>
            <div className="border-b border-[#137FEC] mb-8"></div>

            <div className="space-y-6">
              <div>
                <label className={`block mb-3 font-bold text-sm ${textMain}`}>الموقع</label>
                <input 
                  name="location" value={profileData.location} onChange={handleInputChange}
                  className={`w-full p-4 rounded-2xl text-right text-sm outline-none ${inputBg} ${textSecondary}`} 
                />
              </div>

              <div>
                <label className={`block mb-3 font-bold text-sm ${textMain}`}>التخصص الرئيسي</label>
                <div className="flex flex-wrap gap-2 p-2 bg-[#137FEC1A] rounded-2xl border border-[#137FEC33]">
                  {specialties.map((item) => (
                    <span
                      key={item}
                      onClick={() => setSelectedSpecialty(item)}
                      className={`px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                        selectedSpecialty === item ? "bg-[#137FEC] text-white" : dark ? "bg-[#0B1020] text-white/70" : "bg-white text-[#137FEC] shadow-sm"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block mb-3 font-bold text-sm ${textMain}`}>التخصص الفرعي</label>
                <input 
                  name="subSpecialty" value={profileData.subSpecialty} onChange={handleInputChange}
                  className={`w-full p-4 rounded-2xl text-right font-medium text-sm outline-none ${inputBg} ${textSecondary}`} 
                />
              </div>

              <div>
                <label className={`block mb-3 font-bold text-sm ${textMain}`}>إمكانية الزيارة الميدانية</label>
                <div className="relative">
                  <select className={`w-full p-4 rounded-2xl text-right font-medium text-sm appearance-none cursor-pointer outline-none border-none ${inputBg} ${textSecondary}`}>
                    <option value="yes">نعم</option>
                    <option value="no">لا</option>
                  </select>
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke={dark ? "white" : "black"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

     
          <section className={`rounded-3xl p-8 border ${cardBg} ${cardBorder} shadow-sm`}>
            <h3 className={`text-right text-lg font-bold mb-2 ${textMain}`}>الخدمات والأسعار</h3>
            <div className="border-b border-[#137FEC] mb-8"></div>

            <div className="space-y-8">
              {[ {id: 1, title: "تغيير الزيت", p1: "100", p2: "150"}, {id: 2, title: "إصلاح الفرامل", p1: "200", p2: "300"} ].map((service) => (
                <div key={service.id} className="flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1 w-full">
                    <p className={`mb-3 text-right text-sm font-bold ${textMain}`}>الخدمات المقدمة</p>
                    <input 
                      defaultValue={service.title}
                      className={`w-full p-4 rounded-2xl font-bold text-sm text-right outline-none ${inputBg} ${textSecondary}`}
                    />
                  </div>
                  <div className="flex-[0.8] w-full">
                    <p className={`mb-3 text-center text-sm font-bold ${textMain}`}>نطاق السعر</p>
                    <div className="flex gap-3">
                      <div className="flex flex-1 rounded-xl overflow-hidden border border-[#137FEC66]">
                        <span className="bg-[#137FEC33] text-red-500 px-3 py-3 text-xs font-bold border-l border-[#137FEC66]">EGP</span>
                        <input defaultValue={service.p1} className={`w-full text-center py-3 text-sm font-bold outline-none ${inputBg} ${textSecondary}`} />
                      </div>
                      <div className="flex flex-1 rounded-xl overflow-hidden border border-[#137FEC66]">
                        <span className="bg-[#137FEC33] text-red-500 px-3 py-3 text-xs font-bold border-l border-[#137FEC66]">EGP</span>
                        <input defaultValue={service.p2} className={`w-full text-center py-3 text-sm font-bold outline-none ${inputBg} ${textSecondary}`} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MechanicProfile;