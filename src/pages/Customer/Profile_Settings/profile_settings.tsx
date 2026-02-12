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
        { name: "البيانات الشخصية", id: "personal" },
        { name: "سيارتي", id: "cars" },
        { name: "كلمة المرور والحماية", id: "security" }
    ];

    const inputStyle = "w-full bg-[#137FECE0] dark:bg-[#137FEC1A] text-white placeholder-blue-200 dark:placeholder-gray-400 border-none rounded-xl p-4 text-right outline-none font-bold shadow-inner";

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

                <main className="p-4 md:p-8 mt-12 lg:mt-0 max-w-6xl mx-auto w-full pb-20">
                    {/* العنوان والمؤشر العلوي (Tabs) */}
                    <div className="bg-[#137FECFA] dark:bg-[#137FEC1A] text-white p-4 rounded-full mb-8 flex justify-between items-center shadow-lg">
                        <h1 className="text-2xl font-black px-6">ملفك الشخصي</h1>
                    </div>

                    <div className="flex justify-center gap-4 mb-10 bg-[#137FEC1A] dark:bg-[#137FEC0D] p-2 rounded-full w-full mx-auto shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.name)}
                                className={`px-8 py-3 rounded-full font-bold transition-all flex-1 md:flex-none ${activeTab === tab.name
                                        ? 'bg-[#137FEC] text-white shadow-md scale-105'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-[#137FEC11]'
                                    }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* --- عرض المحتوى بناءً على التبويب المختار --- */}

                    {activeTab === "البيانات الشخصية" && (
                        <PersonalData
                            profileImage={profileImage}
                            handleImageUpload={handleImageUpload}
                            inputStyle={inputStyle}
                        />
                    )}

                    {activeTab === "سيارتي" && (
                        <MyCars inputStyle={inputStyle} />
                    )}

                    {activeTab === "كلمة المرور والحماية" && (
                        <SecuritySettings inputStyle={inputStyle} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProfileSettings;