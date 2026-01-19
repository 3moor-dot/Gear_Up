import { useState } from 'react';
import {
  MdDashboard, MdNotifications, MdHistory,
  MdBuild, MdAccessTime, MdSmartToy, MdSettings, MdLogout,
  MdMenu, MdClose
} from 'react-icons/md';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // حالة القائمة في الموبايل

  const menuItems = [
    { name: 'لوحة التحكم', icon: <MdDashboard />, path: '/customer/dashboard' },
    { name: 'تذكير', icon: <MdNotifications />, path: '/customer/reminders' },
    { name: 'تاريخ الخدمة', icon: <MdHistory />, path: '/customer/servicehistory' },
    { name: 'حجز صيانة', icon: <MdBuild />, path: '/booking' },
    { name: 'طلب صيانة', icon: <MdAccessTime />, path: '/request' },
    { name: 'المساعد الذكي', icon: <MdSmartToy />, path: '/ai-assistant' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* زر الهامبرغر - يظهر فقط في الشاشات الصغيرة (Mobile) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-5 right-5 z-50 p-2 bg-[#137FEC] text-white rounded-lg shadow-lg"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* خلفية معتمة (Overlay) عند فتح السايد بار في الموبايل */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-72 dark:bg-primary_BGD bg-white h-screen flex flex-col shadow-2xl lg:shadow-none
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"} 
        lg:translate-x-0 lg:static lg:block
      `} dir="rtl">

        {/* Logo */}
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white">GearUp</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            // التحقق إذا كان هذا العنصر هو الصفحة النشطة حالياً
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)} // غلق القائمة عند الضغط في الموبايل
                className={`flex items-center gap-4 px-6 py-3 rounded-xl cursor-pointer transition-all ${isActive
                    ? 'bg-[#E5F1FD] dark:bg-[#137FEC1A] text-[#137FEC] dark:text-blue-400 font-bold shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E2A44] hover:text-[#137FEC]'
                  }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-lg">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="p-6 border-t border-gray-50 dark:border-gray-800">
          <div className="rounded-[25px] border border-blue-400/30 p-4 relative bg-gray-50/50 dark:bg-[#137FEC0D]">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/avatar-path.png"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#E5F1FD]"
                alt="Profile"
              />
              <div className="text-right">
                <h4 className="font-bold text-sm dark:text-white truncate">Client Name</h4>
                <p className="text-[10px] text-gray-400">Client Account</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="flex items-center gap-3 w-full text-gray-700 hover:text-[#137FEC] dark:text-gray-300 dark:hover:text-[#137FEC] transition-colors text-sm">
                <MdSettings className="text-xl" />
                <span className="font-medium">الاعدادات</span>
              </button>
              <button className="flex items-center gap-3 w-full text-red-500 hover:text-red-600 transition-colors text-sm">
                <MdLogout className="text-xl rotate-180" />
                <span className="font-medium">تسجيل خروج</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;