import React, { useState } from "react";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import { FaEdit } from "react-icons/fa";

const Mprofile = () => {
  const { dark } = useTheme();
  const [activeTab, setActiveTab] = useState("personal"); // personal, additional, services
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);


  // بيانات الملف الشخصي
  const profileData = {
    personal: {
      name: "محمد أحمد",
      email: "mohamed@example.com",
      phone: "+966 50 123 4567",
      address: "الرياض، المملكة العربية السعودية",
    },
    additional: {
      experience: "5 سنوات",
      specialization: "صيانة محركات",
      certifications: "معتمد من هيئة النقل",
      workingHours: "8:00 AM - 6:00 PM",
    },
    services: [
      "تغيير الزيت",
      "فحص المحركات",
      "إصلاح الفرامل",
      "صيانة الإطارات",
      "فحص كهرباء السيارات",
    ],
  };

  const tabs = [
    { id: "personal", label: "البيانات الشخصية" },
    { id: "additional", label: "بيانات إضافية" },
    { id: "services", label: "الخدمات" },
  ];

  return (
    <div
      dir="rtl"
      className={`flex min-h-screen transition-colors duration-500 ${
        !dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"
      }`}
    >
      <MachineSidebar />
      <main className="flex-1 p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 w-full overflow-x-hidden">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6 mt-14 lg:mt-0">
          <div>
            <h1
              className={`text-xl md:text-2xl lg:text-3xl font-bold transition-colors ${
                !dark ? "text-black" : "text-white"
              }`}
            >
              ملفك الشخصي
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4 self-end sm:self-auto bg-gray-50 dark:bg-white/5 p-2 rounded-2xl sm:bg-transparent sm:dark:bg-transparent">
            <NotificationBell size={20} />
            <ThemeToggle />
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                  : !dark
                  ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  : "bg-[#0d1629] text-gray-300 hover:bg-[#131c2f] border border-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div
              className={`rounded-xl border overflow-hidden ${
                !dark
                  ? "bg-white shadow-md border-gray-200"
                  : "bg-[#0d1629] border-blue-900/30"
              }`}
            >
              {/* Header with Avatar and Edit Button */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src="https://i.pravatar.cc/150?img=12"
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-blue-500"
                    />
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        {profileData.personal.name}
                      </h3>
                      <p className={`text-sm ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                        ميكانيكي محترف - {profileData.additional.experience} خبرة
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                    <FaEdit />
                    <span>تعديل البيانات</span>
                  </button>
                </div>
              </div>

              {/* Personal Info Fields */}
              <div className="p-6">
                <h4 className="text-lg font-bold mb-6">البيانات الشخصية الأساسية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={profileData.personal.name}
                      readOnly
                      className={`w-full px-4 py-3 rounded-lg border outline-none ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      رقم الهاتف
                    </label>
                    <input
                      type="text"
                      value={profileData.personal.phone}
                      readOnly
                      className={`w-full px-4 py-3 rounded-lg border outline-none ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={profileData.personal.email}
                      readOnly
                      className={`w-full px-4 py-3 rounded-lg border outline-none ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      العنوان (المدينة - المنطقة)
                    </label>
                    <input
                      type="text"
                      value={profileData.personal.address}
                      readOnly
                      className={`w-full px-4 py-3 rounded-lg border outline-none ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information Tab */}
        {activeTab === "additional" && (
  <div
    className={`rounded-2xl border p-6 space-y-6 ${
      !dark
        ? "bg-white border-gray-200 shadow-md"
        : "bg-[#0d1629] border-blue-900/30"
    }`}
  >
    <h3 className="text-lg font-bold mb-4">البيانات الإضافية</h3>

    {/* الموقع */}
    <div>
      <label className="block text-sm mb-2 text-gray-400">الموقع</label>
      <select
        className={`w-full px-4 py-3 rounded-xl border outline-none ${
          !dark
            ? "bg-gray-50 border-gray-300"
            : "bg-[#131c2f] border-gray-700 text-white"
        }`}
      >
        <option>القاهرة</option>
        <option>الجيزة</option>
        <option>الإسكندرية</option>
      </select>
    </div>

    {/* التخصص الرئيسي */}
    <div>
      <label className="block text-sm mb-3 text-gray-400">
        التخصص الرئيسي
      </label>
<div className="flex flex-wrap gap-3">
  {[
    "ميكانيكا عامة",
    "كهرباء سيارات",
    "ضبط زوايا",
    "التروس / السرعات",
  ].map((item) => {
    const isSelected = selectedSpecialties.includes(item);

    return (
      <button
        key={item}
        onClick={() => {
          setSelectedSpecialties((prev) =>
            prev.includes(item)
              ? prev.filter((i) => i !== item) // إلغاء التحديد
              : [...prev, item] // تحديد
          );
        }}
        className={`px-4 py-2 rounded-full text-sm transition-all ${
          isSelected
            ? "bg-blue-600 text-white shadow-lg scale-105"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {item}
      </button>
    );
  })}
</div>

    </div>

    {/* التخصص الفرعي */}
    <div>
      <label className="block text-sm mb-2 text-gray-400">
        التخصص الفرعي
      </label>
      <input
        type="text"
        placeholder="التخصص الفرعي"
        className={`w-full px-4 py-3 rounded-xl border outline-none ${
          !dark
            ? "bg-gray-50 border-gray-300"
            : "bg-[#131c2f] border-gray-700 text-white"
        }`}
      />
    </div>

    {/* إمكانية الزيارة الميدانية */}
    <div>
      <label className="block text-sm mb-2 text-gray-400">
        إمكانية الزيارة الميدانية
      </label>
      <select
        className={`w-full px-4 py-3 rounded-xl border outline-none ${
          !dark
            ? "bg-gray-50 border-gray-300"
            : "bg-[#131c2f] border-gray-700 text-white"
        }`}
      >
        <option>نعم</option>
        <option>لا</option>
      </select>
    </div>

    {/* ساعات العمل */}
    <div>
      <label className="block text-sm mb-2 text-gray-400">
        ساعات العمل
      </label>
      <input
        type="text"
        placeholder="حدد ساعات العمل"
        className={`w-full px-4 py-3 rounded-xl border outline-none ${
          !dark
            ? "bg-gray-50 border-gray-300"
            : "bg-[#131c2f] border-gray-700 text-white"
        }`}
      />
    </div>
  </div>
)}

          {/* Services Tab */}
        {activeTab === "services" && (
  <div
    className={`rounded-2xl border p-6 space-y-6 ${
      !dark
        ? "bg-white border-gray-200 shadow-md"
        : "bg-[#0d1629] border-blue-900/30"
    }`}
  >
    {/* Header */}
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold">الخدمات والأسعار</h3>

      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
        <span className="text-lg">＋</span>
        إضافة خدمة جديدة
      </button>
    </div>

    {/* الخدمات المقدمة */}
    <div>
      <label className="block text-sm mb-2 text-gray-400">
        الخدمات المقدمة
      </label>
      <input
        type="text"
        placeholder="على سبيل المثال: تغيير الزيت، إصلاح الفرامل، تشخيص أعطال المحرك..."
        className={`w-full px-4 py-3 rounded-xl border outline-none ${
          !dark
            ? "bg-gray-50 border-gray-300"
            : "bg-[#131c2f] border-gray-700 text-white"
        }`}
      />
    </div>

    {/* نطاق الأسعار */}
    <div>
      <label className="block text-sm mb-3 text-gray-400">
        نطاق الأسعار لكل خدمة
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* الحد الأدنى */}
        <div className="relative">
          <input
            type="number"
            placeholder="الحد الأدنى"
            className={`w-full px-4 py-3 rounded-xl border outline-none pr-14 ${
              !dark
                ? "bg-gray-50 border-gray-300"
                : "bg-[#131c2f] border-gray-700 text-white"
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500">
            EGP
          </span>
        </div>

        {/* الحد الأقصى */}
        <div className="relative">
          <input
            type="number"
            placeholder="الحد الأقصى"
            className={`w-full px-4 py-3 rounded-xl border outline-none pr-14 ${
              !dark
                ? "bg-gray-50 border-gray-300"
                : "bg-[#131c2f] border-gray-700 text-white"
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500">
            EGP
          </span>
        </div>
      </div>
    </div>
  </div>
)}

        </div>
      </main>
    </div>
  );
};

export default Mprofile;