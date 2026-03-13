import { useState } from "react";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import { PersonalData } from "./personal_data";
import { MyCars } from "./my_car";
import SecuritySettings from "./security_settings";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("البيانات الشخصية");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const tabs = [
    { name: "البيانات الشخصية", id: "personal"  },
    { name: "سيارتي",           id: "cars"      },
    { name: "كلمة المرور",      id: "security"  },
  ];

  const inputStyle = "";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen dark:bg-primary_BGD bg-gray-50" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-3 sm:p-6 md:p-8 mt-12 lg:mt-0 w-full max-w-5xl mx-auto pb-20">

          {/* العنوان */}
          <div className="bg-[#137FECFA] dark:bg-[#137FEC1A] text-white px-5 py-3 rounded-2xl mb-5 shadow-md">
            <h1 className="text-lg sm:text-2xl font-black text-center">ملفك الشخصي</h1>
          </div>

          {/* Tabs — على موبايل تبقى أصغر وتتسع */}
          <div className="flex bg-[#137FEC1A] dark:bg-[#137FEC0D] p-1.5 rounded-2xl mb-6 gap-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.name)}
                className={`flex-1 px-2 py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm text-center leading-tight ${
                  activeTab === tab.name
                    ? "bg-[#137FEC] text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-[#137FEC22]"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* المحتوى */}
          {activeTab === "البيانات الشخصية" && (
            <PersonalData
              profileImage={profileImage}
              handleImageUpload={handleImageUpload}
              inputStyle={inputStyle}
            />
          )}
          {activeTab === "سيارتي" && <MyCars inputStyle={inputStyle} />}
          {activeTab === "كلمة المرور" && <SecuritySettings />}

        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;