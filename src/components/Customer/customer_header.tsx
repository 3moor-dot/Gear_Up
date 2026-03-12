import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/theme_toggle"; 
import NotificationBtn from "../NotificationBell/notification_bell";

// تعريف شكل البيانات لتجنب أخطاء TypeScript
interface UserData {
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
}

const Header = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // 1. محاولة جلب البيانات من sessionStorage أولاً (سرعة الاستجابة)
    const savedData = sessionStorage.getItem("userData");
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }

    // 2. تحديث البيانات من السيرفر للتأكد من أنها الأحدث
    const fetchHeaderProfile = async () => {
      const token = sessionStorage.getItem("userToken");
      if (!token) return;

      try {
        const response = await fetch("https://gearupapp.runasp.net/api/users/profile", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // تحديث الكاش لضمان التزامن بين السايدبار والهيدر
          sessionStorage.setItem("userData", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error fetching header profile:", error);
      }
    };

    fetchHeaderProfile();
  }, []);

  return (
    <header className="w-full dark:bg-primary_BGD py-4 px-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 transition-colors duration-500" dir="rtl">
      
      {/* القسم الأوسط: شريط البحث */}
      <div className="flex-1 max-w-2xl mx-12">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن قطع الغيار بالاسم أو الرقم..."
            className="w-full bg-[#137FEC1A] dark:bg-[#137FEC1A] border-none rounded-full dark:text-white py-3 pr-12 pl-6 text-sm outline-none focus:ring-2 focus:ring-[#137FEC] transition-all"
          />
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
      </div>

      {/* القسم الأيسر: التنبيهات، الوضع الليلي، والبروفايل المصغر */}
      <div className="flex items-center gap-6">
        
        {/* زر التنبيهات */}
        <NotificationBtn />

        {/* زر تبديل الوضع (Dark/Light) */}
        <div className="flex items-center">
            <ThemeToggle />
        </div>

        {/* صورة البروفايل المصغرة الديناميكية */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#E5F1FD] dark:border-gray-700 overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
            {userData?.profilePhotoUrl ? (
              <img 
                src={userData.profilePhotoUrl} 
                alt="User Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              // حالة عدم وجود صورة: إظهار أول حرف من الاسم
              <div className="text-[#137FEC] font-bold text-lg">
                {userData?.firstName?.[0] || "U"}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;