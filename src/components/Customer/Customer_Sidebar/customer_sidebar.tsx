import { 
  MdDashboard, MdNotifications, MdHistory, 
  MdBuild, MdAccessTime, MdSmartToy, MdSettings, MdLogout 
} from 'react-icons/md';

const Sidebar = () => {
  const menuItems = [
    { name: 'لوحة التحكم', icon: <MdDashboard />, active: true },
    { name: 'تذكير', icon: <MdNotifications /> },
    { name: 'تاريخ الخدمة', icon: <MdHistory /> },
    { name: 'حجز صيانة', icon: <MdBuild /> },
    { name: 'طلب صيانة', icon: <MdAccessTime /> },
    { name: 'المساعد الذكي', icon: <MdSmartToy /> },
  ];

  return (
    <aside className="w-72 dark:bg-primary_BGD h-screen flex flex-col" dir="rtl">
      {/* Logo */}
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white">GearUp</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 px-6 py-3 rounded-xl cursor-pointer transition-all dark:text-white ${
              item.active 
              ? 'bg-[#E5F1FD] dark:bg-[#137FEC1A] text-[#137FEC] dark:text-white font-bold' 
              : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-[#1E2A44] hover:text-[#137FEC'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-lg">{item.name}</span>
          </div>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-6 border-t border-gray-50 dark:border-gray-800">
        <div className="rounded-3xl border border-blue-400 p-4 relative">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="/avatar-path.png" 
              className="w-12 h-12 rounded-full border-2 border-[#E5F1FD]" 
              alt="Profile" 
            />
            <div className="text-right">
              <h4 className="font-bold text-sm dark:text-white">Clinet Name</h4>
              <p className="text-xs text-gray-400">Client</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="flex items-center gap-3 w-full text-gray-700 hover:text-[#137FEC] dark:text-white dark:hover:text-[#137FEC] transition-colors">
              <MdSettings className="text-xl" />
              <span className="font-medium">الاعدادات</span>
            </button>
            <button className="flex items-center gap-3 w-full text-red-500 hover:text-red-600 transition-colors">
              <MdLogout className="text-xl rotate-180" />
              <span className="font-medium">تسجيل خروج</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;