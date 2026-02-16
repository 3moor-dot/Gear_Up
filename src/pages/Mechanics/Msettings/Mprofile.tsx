import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import { FaEdit, FaSave, FaSpinner } from "react-icons/fa";

// Types
interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

interface AdditionalData {
  location: string;
  mainSpecialty: string[];
  subSpecialty: string;
  fieldVisit: boolean;
  workingHoursFrom: string;
  workingHoursTo: string;
  experience: string;
}

interface ServiceData {
  id?: string;
  name: string;
  minPrice: number;
  maxPrice: number;
}

interface ProfileData {
  personal: PersonalData;
  additional: AdditionalData;
  services: ServiceData[];
}

const Mprofile = () => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form Data State
  const [profileData, setProfileData] = useState<ProfileData>({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      address: "",
    },
    additional: {
      location: "",
      mainSpecialty: [],
      subSpecialty: "",
      fieldVisit: false,
      workingHoursFrom: "08:00",
      workingHoursTo: "18:00",
      experience: "",
    },
    services: [],
  });

  // Fetch Profile Data on Mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/mechanics/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  // Save Profile Data
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/mechanics/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to save profile");

      const data = await response.json();
      setProfileData(data);
      setIsEditing(false);
      // TODO: Show success toast
      alert("تم حفظ التغييرات بنجاح");
    } catch (error) {
      console.error("Error saving profile:", error);
      // TODO: Show error toast
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  // Update Personal Data
  const updatePersonalData = (field: keyof PersonalData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  // Update Additional Data
  const updateAdditionalData = (
    field: keyof AdditionalData,
    value: string | string[] | boolean
  ) => {
    setProfileData((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        [field]: value,
      },
    }));
  };

  // Toggle Specialty Selection
  const toggleSpecialty = (specialty: string) => {
    setProfileData((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        mainSpecialty: prev.additional.mainSpecialty.includes(specialty)
          ? prev.additional.mainSpecialty.filter((s) => s !== specialty)
          : [...prev.additional.mainSpecialty, specialty],
      },
    }));
  };

  // Add New Service
  const addService = () => {
    setProfileData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          name: "",
          minPrice: 0,
          maxPrice: 0,
        },
      ],
    }));
  };

  // Update Service
  const updateService = (index: number, field: keyof ServiceData, value: string | number) => {
    setProfileData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  // Delete Service
  const deleteService = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const tabs = [
    { id: "personal", label: "البيانات الشخصية" },
    { id: "additional", label: "بيانات إضافية" },
    { id: "services", label: "الخدمات" },
  ];

  const specialties = [
    "ميكانيكا عامة",
    "كهرباء سيارات",
    "ضبط زوايا",
    "التروس / السرعات",
  ];

  const cities = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "الشرقية",
    "الدقهلية",
    "المنوفية",
    "القليوبية",
    "البحيرة",
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

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

  <div className="flex items-center gap-3 md:gap-4">
    {/* أزرار التحكم */}
    {isEditing ? (
      <>
        <button
          onClick={() => {
            setIsEditing(false);
            fetchProfileData();
          }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !dark
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          إلغاء
        </button>
        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <FaSave />
              <span>حفظ جميع التغييرات</span>
            </>
          )}
        </button>
      </>
    ) : (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
      >
        <FaEdit />
        <span>تعديل البيانات</span>
      </button>
    )}

    <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl sm:bg-transparent sm:dark:bg-transparent">
      <NotificationBell size={20} />
      <ThemeToggle />
    </div>
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
                        {profileData.personal.firstName}{" "}
                        {profileData.personal.lastName}
                      </h3>
                      <p
                        className={`text-sm ${
                          !dark ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        ميكانيكي محترف - {profileData.additional.experience} خبرة
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : isEditing ? (
                      <>
                        <FaSave />
                        <span>حفظ التغييرات</span>
                      </>
                    ) : (
                      <>
                        <FaEdit />
                        <span>تعديل البيانات</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Personal Info Fields */}
              <div className="p-6">
                <h4 className="text-lg font-bold mb-6">
                  البيانات الشخصية الأساسية
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      الاسم الأول
                    </label>
                    <input
                      type="text"
                      value={profileData.personal.firstName}
                      onChange={(e) =>
                        updatePersonalData("firstName", e.target.value)
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      } ${
                        isEditing
                          ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      الاسم الأخير
                    </label>
                    <input
                      type="text"
                      value={profileData.personal.lastName}
                      onChange={(e) =>
                        updatePersonalData("lastName", e.target.value)
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      } ${
                        isEditing
                          ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "cursor-not-allowed"
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
                      type="tel"
                      value={profileData.personal.phone}
                      onChange={(e) =>
                        updatePersonalData("phone", e.target.value)
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      } ${
                        isEditing
                          ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "cursor-not-allowed"
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
                      onChange={(e) =>
                        updatePersonalData("email", e.target.value)
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      } ${
                        isEditing
                          ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "cursor-not-allowed"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      المدينة
                    </label>
                    <select
                      value={profileData.personal.city}
                      onChange={(e) =>
                        updatePersonalData("city", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      } ${
                        isEditing
                          ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "cursor-not-allowed"
                      }`}
                    >
                      <option value="">اختر المدينة</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm mb-2 ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      العنوان (المنطقة)
                    </label>
                    <input
                      type="text"
                      value={profileData.personal.address}
                      onChange={(e) =>
                        updatePersonalData("address", e.target.value)
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                        !dark
                          ? "bg-gray-50 border-gray-300 text-gray-900"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      } ${
                        isEditing
                          ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "cursor-not-allowed"
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
                <label className="block text-sm mb-2 text-gray-400">
                  الموقع
                </label>
                <select
                  value={profileData.additional.location}
                  onChange={(e) =>
                    updateAdditionalData("location", e.target.value)
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                    !dark
                      ? "bg-gray-50 border-gray-300"
                      : "bg-[#131c2f] border-gray-700 text-white"
                  } ${
                    isEditing
                      ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      : "cursor-not-allowed"
                  }`}
                >
                  <option value="">اختر الموقع</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* التخصص الرئيسي */}
              <div>
                <label className="block text-sm mb-3 text-gray-400">
                  التخصص الرئيسي
                </label>
                <div className="flex flex-wrap gap-3">
                  {specialties.map((item) => {
                    const isSelected =
                      profileData.additional.mainSpecialty.includes(item);

                    return (
                      <button
                        key={item}
                        onClick={() => isEditing && toggleSpecialty(item)}
                        disabled={!isEditing}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-lg scale-105"
                            : !dark
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        } ${!isEditing && "cursor-not-allowed opacity-60"}`}
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
                  value={profileData.additional.subSpecialty}
                  onChange={(e) =>
                    updateAdditionalData("subSpecialty", e.target.value)
                  }
                  readOnly={!isEditing}
                  placeholder="التخصص الفرعي"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                    !dark
                      ? "bg-gray-50 border-gray-300"
                      : "bg-[#131c2f] border-gray-700 text-white"
                  } ${
                    isEditing
                      ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      : "cursor-not-allowed"
                  }`}
                />
              </div>

              {/* سنوات الخبرة */}
              <div>
                <label className="block text-sm mb-2 text-gray-400">
                  سنوات الخبرة
                </label>
                <input
                  type="text"
                  value={profileData.additional.experience}
                  onChange={(e) =>
                    updateAdditionalData("experience", e.target.value)
                  }
                  readOnly={!isEditing}
                  placeholder="مثال: 5 سنوات"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                    !dark
                      ? "bg-gray-50 border-gray-300"
                      : "bg-[#131c2f] border-gray-700 text-white"
                  } ${
                    isEditing
                      ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      : "cursor-not-allowed"
                  }`}
                />
              </div>

              {/* إمكانية الزيارة الميدانية */}
              <div>
                <label className="block text-sm mb-2 text-gray-400">
                  إمكانية الزيارة الميدانية
                </label>
                <select
                  value={profileData.additional.fieldVisit ? "true" : "false"}
                  onChange={(e) =>
                    updateAdditionalData("fieldVisit", e.target.value === "true")
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                    !dark
                      ? "bg-gray-50 border-gray-300"
                      : "bg-[#131c2f] border-gray-700 text-white"
                  } ${
                    isEditing
                      ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      : "cursor-not-allowed"
                  }`}
                >
                  <option value="true">نعم</option>
                  <option value="false">لا</option>
                </select>
              </div>

              {/* ساعات العمل */}
              <div>
                <label className="block text-sm mb-3 text-gray-400">
                  ساعات العمل
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1 text-gray-500">
                      من
                    </label>
                    <input
                      type="time"
                      value={profileData.additional.workingHoursFrom}
                      onChange={(e) =>
                        updateAdditionalData("workingHoursFrom", e.target.value)
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                        !dark
                          ? "bg-gray-50 border-gray-300"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      } ${
                        isEditing
                          ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "cursor-not-allowed"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-gray-500">
                      إلى
                    </label>
                    <input
                      type="time"
                      value={profileData.additional.workingHoursTo}
                      onChange={(e) =>
                        updateAdditionalData("workingHoursTo", e.target.value)
                      }
                      readOnly={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                        !dark
                          ? "bg-gray-50 border-gray-300"
                          : "bg-[#131c2f] border-gray-700 text-white"
                      } ${
                        isEditing
                          ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          : "cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>
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

                <button
                  onClick={addService}
                  disabled={!isEditing}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">＋</span>
                  إضافة خدمة جديدة
                </button>
              </div>

              {/* Services List */}
              <div className="space-y-4">
                {profileData.services.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>لا توجد خدمات مضافة بعد</p>
                    <p className="text-sm mt-2">
                      اضغط على "إضافة خدمة جديدة" لإضافة خدمة
                    </p>
                  </div>
                ) : (
                  profileData.services.map((service, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        !dark
                          ? "bg-gray-50 border-gray-200"
                          : "bg-[#131c2f] border-gray-700"
                      }`}
                    >
                      <div className="space-y-4">
                        {/* اسم الخدمة */}
                        <div>
                          <label className="block text-sm mb-2 text-gray-400">
                            اسم الخدمة
                          </label>
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) =>
                              updateService(index, "name", e.target.value)
                            }
                            readOnly={!isEditing}
                            placeholder="مثال: تغيير الزيت"
                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                              !dark
                                ? "bg-white border-gray-300"
                                : "bg-[#0B1220] border-gray-600 text-white"
                            } ${
                              isEditing
                                ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                : "cursor-not-allowed"
                            }`}
                          />
                        </div>

                        {/* نطاق الأسعار */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <label className="block text-sm mb-2 text-gray-400">
                              الحد الأدنى
                            </label>
                            <input
                              type="number"
                              value={service.minPrice || ""}
                              onChange={(e) =>
                                updateService(
                                  index,
                                  "minPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              readOnly={!isEditing}
                              placeholder="0"
                              className={`w-full px-4 py-3 rounded-xl border outline-none pr-14 transition-all ${
                                !dark
                                  ? "bg-white border-gray-300"
                                  : "bg-[#0B1220] border-gray-600 text-white"
                              } ${
                                isEditing
                                  ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                  : "cursor-not-allowed"
                              }`}
                            />
                            <span className="absolute right-4 top-[42px] text-xs font-bold text-blue-500">
                              EGP
                            </span>
                          </div>

                          <div className="relative">
                            <label className="block text-sm mb-2 text-gray-400">
                              الحد الأقصى
                            </label>
                            <input
                              type="number"
                              value={service.maxPrice || ""}
                              onChange={(e) =>
                                updateService(
                                  index,
                                  "maxPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              readOnly={!isEditing}
                              placeholder="0"
                              className={`w-full px-4 py-3 rounded-xl border outline-none pr-14 transition-all ${
                                !dark
                                  ? "bg-white border-gray-300"
                                  : "bg-[#0B1220] border-gray-600 text-white"
                              } ${
                                isEditing
                                  ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                  : "cursor-not-allowed"
                              }`}
                            />
                            <span className="absolute right-4 top-[42px] text-xs font-bold text-blue-500">
                              EGP
                            </span>
                          </div>
                        </div>

                        {/* Delete Button */}
                        {isEditing && (
                          <button
                            onClick={() => deleteService(index)}
                            className="w-full py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition text-sm"
                          >
                            حذف الخدمة
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Floating Save Button
        {isEditing && (
          <div className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-24 max-w-md mx-auto lg:mx-0 z-50">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfileData(); // Reset data
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-medium transition shadow-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>حفظ جميع التغييرات</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )} */}
      </main>
    </div>
  );
};

export default Mprofile;