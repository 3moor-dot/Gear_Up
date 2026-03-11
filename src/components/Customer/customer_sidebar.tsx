import { useState, useEffect } from 'react'; 
import {
  MdDashboard, MdNotifications, MdHistory,
  MdBuild, MdAccessTime, MdSmartToy, MdSettings, MdLogout,
  MdMenu, MdClose
} from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// ===== تعريف شكل بيانات المستخدم =====
interface UserData {
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
  role: number;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null); 
  const location = useLocation();
  const navigate = useNavigate();

  // ===== جلب بيانات البروفايل =====
  const fetchSidebarProfile = async () => {
    const token = sessionStorage.getItem("userToken");
    if (!token) return;

    try {
      const response = await fetch("http://gearupapp.runasp.net/api/users/profile", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data: UserData = await response.json();
        setUserData(data);
        sessionStorage.setItem("userData", JSON.stringify(data));
      } else {
        const savedData = sessionStorage.getItem("userData");
        if (savedData) setUserData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Error fetching sidebar profile:", error);
    }
  };

  useEffect(() => {
    fetchSidebarProfile();
  }, [location.pathname]); 

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
      {/* زر فتح/غلق السايدبار على الموبايل */}
      <button onClick={toggleSidebar} className="lg:hidden fixed top-5 right-5 z-50 p-2 bg-[#137FEC] text-white rounded-lg shadow-lg">
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* الخلفية الشفافة عند فتح السايدبار */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar}></div>}

      <aside className={`fixed inset-y-0 right-0 z-40 w-72 dark:bg-primary_BGD bg-white h-screen flex flex-col shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0 lg:static lg:block`} dir="rtl">
        
        {/* شعار */}
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white">GearUp</h1>
        </div>

        {/* قائمة الروابط */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-6 py-3 rounded-xl transition-all ${isActive ? 'bg-[#E5F1FD] dark:bg-[#137FEC1A] text-[#137FEC] font-bold shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-[#137FEC]'}`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-lg">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* قسم البروفايل والإعدادات */}
        <div className="p-6 border-t border-gray-50 dark:border-gray-800">
          <div className="rounded-[25px] border border-blue-400/30 p-4 bg-gray-50/50 dark:bg-[#137FEC0D]">
            <div className="flex items-center gap-3 mb-6">
              {/* صورة البروفايل */}
              <div className="w-12 h-12 rounded-full border-2 border-[#137FEC] overflow-hidden bg-gray-100 flex items-center justify-center">
                {userData?.profilePhotoUrl ? (
                  <img
                    src={userData.profilePhotoUrl}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <div className="text-[#137FEC] font-bold text-lg">
                    {userData?.firstName?.[0] || "U"}
                  </div>
                )}
              </div>

              {/* الاسم والدور */}
              <div className="text-right">
                <h4 className="font-bold text-sm dark:text-white truncate max-w-[120px]">
                  {fullName}
                </h4>
                <p className="text-[10px] text-gray-400">
                  {userData?.role === 1 ? "حساب عميل" : "حساب مستخدم"}
                </p>
              </div>
            </div>

            {/* إعدادات وتسجيل خروج */}
            <div className="space-y-3">
              <Link
                to={settingsPath}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm ${isSettingsActive ? 'bg-[#E5F1FD] text-[#137FEC] font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
              >
                <MdSettings className="text-xl" />
                <span>الاعدادات</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm"
              >
                <MdLogout className="text-xl rotate-180" />
                <span>تسجيل خروج</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;