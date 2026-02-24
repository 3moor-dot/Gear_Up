// import { useState } from 'react';
// import {
//   MdDashboard, MdNotifications, MdHistory,
//   MdBuild, MdAccessTime, MdSmartToy, MdSettings, MdLogout,
//   MdMenu, MdClose
// } from 'react-icons/md';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false); // حالة القائمة في الموبايل

//   const menuItems = [
//     { name: 'لوحة التحكم', icon: <MdDashboard />, path: '/customer/dashboard' },
//     { name: 'تذكير', icon: <MdNotifications />, path: '/customer/reminders' },
//     { name: 'تاريخ الخدمة', icon: <MdHistory />, path: '/customer/servicehistory' },
//     { name: 'حجز صيانة', icon: <MdBuild />, path: '/customer/maintenancebookings' },
//     { name: 'طلب صيانة', icon: <MdAccessTime />, path: '/customer/maintenancerequest' },
//     { name: 'المساعد الذكي', icon: <MdSmartToy />, path: '/ai-assistant' },
//   ];
//   const location = useLocation();
//   const settingsPath = '/customer/profilesettings';
//   const isSettingsActive = location.pathname === settingsPath;

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <>
//       {/* زر الهامبرغر - يظهر فقط في الشاشات الصغيرة (Mobile) */}
//       <button
//         onClick={toggleSidebar}
//         className="lg:hidden fixed top-5 right-5 z-50 p-2 bg-[#137FEC] text-white rounded-lg shadow-lg"
//       >
//         {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
//       </button>

//       {/* خلفية معتمة (Overlay) عند فتح السايد بار في الموبايل */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={toggleSidebar}
//         ></div>
//       )}

//       {/* Sidebar Container */}
//       <aside className={`
//         fixed inset-y-0 right-0 z-40 w-72 dark:bg-primary_BGD bg-white h-screen flex flex-col shadow-2xl lg:shadow-none
//         transition-transform duration-300 ease-in-out
//         ${isOpen ? "translate-x-0" : "translate-x-full"} 
//         lg:translate-x-0 lg:static lg:block
//       `} dir="rtl">

//         {/* Logo */}
//         <div className="p-8 text-center">
//           <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white">GearUp</h1>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
//           {menuItems.map((item, index) => {
//             // التحقق إذا كان هذا العنصر هو الصفحة النشطة حالياً
//             const isActive = location.pathname === item.path;

//             return (
//               <Link
//                 key={index}
//                 to={item.path}
//                 onClick={() => setIsOpen(false)} // غلق القائمة عند الضغط في الموبايل
//                 className={`flex items-center gap-4 px-6 py-3 rounded-xl cursor-pointer transition-all ${isActive
//                   ? 'bg-[#E5F1FD] dark:bg-[#137FEC1A] text-[#137FEC] dark:text-blue-400 font-bold shadow-sm'
//                   : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E2A44] hover:text-[#137FEC]'
//                   }`}
//               >
//                 <span className="text-2xl">{item.icon}</span>
//                 <span className="text-lg">{item.name}</span>
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Profile Section */}
//         <div className="p-6 border-t border-gray-50 dark:border-gray-800">
//           <div className="rounded-[25px] border border-blue-400/30 p-4 relative bg-gray-50/50 dark:bg-[#137FEC0D]">
//             <div className="flex items-center gap-3 mb-6">
//               <img
//                 src="/avatar-path.png"
//                 className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#E5F1FD]"
//                 alt="Profile"
//               />
//               <div className="text-right">
//                 <h4 className="font-bold text-sm dark:text-white truncate">Client Name</h4>
//                 <p className="text-[10px] text-gray-400">Client Account</p>
//               </div>
//             </div>

//             <div className="space-y-3">
//               {/* تحويل الزر إلى Link لإضافة تأثير الاختيار والـ Hover */}
//               <Link
//                 to={settingsPath}
//                 onClick={() => setIsOpen(false)}
//                 className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all text-sm ${isSettingsActive
//                     ? 'bg-[#E5F1FD] dark:bg-[#137FEC1A] text-[#137FEC] dark:text-blue-400 font-bold shadow-sm'
//                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E2A44] hover:text-[#137FEC]'
//                   }`}
//               >
//                 <MdSettings className="text-xl" />
//                 <span className="font-medium">الاعدادات</span>
//               </Link>

//               <button className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-sm">
//                 <MdLogout className="text-xl rotate-180" />
//                 <span className="font-medium">تسجيل خروج</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
import { useState } from 'react';
import {
  MdDashboard, MdNotifications, MdHistory,
  MdBuild, MdAccessTime, MdSmartToy, MdSettings, MdLogout,
  MdMenu, MdClose
} from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // جلب بيانات اليوزر من sessionStorage
  const rawUserData = sessionStorage.getItem("userData");
  const userData = rawUserData ? JSON.parse(rawUserData) : null;
  const fullName = userData
    ? `${userData.firstName} ${userData.lastName}`.trim()
    : "اسم المستخدم";

  const menuItems = [
    { name: 'لوحة التحكم', icon: <MdDashboard />, path: '/customer/dashboard' },
    { name: 'تذكير', icon: <MdNotifications />, path: '/customer/reminders' },
    { name: 'تاريخ الخدمة', icon: <MdHistory />, path: '/customer/servicehistory' },
    { name: 'حجز صيانة', icon: <MdBuild />, path: '/customer/maintenancebookings' },
    { name: 'طلب صيانة', icon: <MdAccessTime />, path: '/customer/maintenancerequest' },
    { name: 'المساعد الذكي', icon: <MdSmartToy />, path: '/ai-assistant' },
  ];

  const settingsPath = '/customer/profilesettings';
  const isSettingsActive = location.pathname === settingsPath;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <>
      {/* زر الهامبرغر */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-5 right-5 z-50 p-2 bg-[#137FEC] text-white rounded-lg shadow-lg"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Overlay */}
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
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
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
              {/* صورة البروفايل أو الأحرف الأولى */}
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#E5F1FD] object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#137FEC] bg-[#137FEC1A] flex items-center justify-center text-[#137FEC] font-bold text-lg">
                  {userData?.firstName?.[0] || "U"}
                </div>
              )}
              <div className="text-right">
                <h4 className="font-bold text-sm dark:text-white truncate max-w-[130px]">
                  {fullName}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {userData?.role === 1 ? "حساب عميل" : userData?.role === 2 ? "حساب ميكانيكي" : "حساب مستخدم"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to={settingsPath}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all text-sm ${isSettingsActive
                  ? 'bg-[#E5F1FD] dark:bg-[#137FEC1A] text-[#137FEC] dark:text-blue-400 font-bold shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E2A44] hover:text-[#137FEC]'
                }`}
              >
                <MdSettings className="text-xl" />
                <span className="font-medium">الاعدادات</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-sm"
              >
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