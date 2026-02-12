import { FaSearch } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/theme_toggle"; // تأكد من مسار مكون التبديل لديك
import NotificationBtn from "../NotificationBell/notification_bell"; // تأكد من مسار مكون جرس التنبيهات لديك

const Header = () => {
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

        {/* صورة البروفايل المصغرة */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#E5F1FD] overflow-hidden shadow-sm">
            <img 
              src="/avatar-path.png" // استبدلها بمسار الصورة الفعلي
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;