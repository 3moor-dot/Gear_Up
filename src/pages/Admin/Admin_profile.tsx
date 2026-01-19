
import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../components/NotificationBell/notification_bell";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle/theme_toggle";

const AdminProfile: React.FC = () => {
  const { dark } = useTheme();

  const [firstName, setFirstName] = useState("Jordan");
  const [lastName, setLastName] = useState("Admin");
  const [email, setEmail] = useState("alex.johnson@example.com");
  const [avatar, setAvatar] = useState<string>("/avatar.png");

  return (
    <div dir="rtl" className="flex min-h-screen">
      <AdminSidebar />

      <main
        className={`flex-1 p-10 transition-colors duration-500 ${
          dark ? "bg-[#0B1020] text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-bold">لوحة القيادة / الحساب الشخصي</h2>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationBell onClick={() => console.log("Notifications clicked")} />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Save */}
            <button className="bg-[#137FEC] text-white px-6 py-2 rounded-xl transition-all duration-200 hover:bg-[#1A6FD4] hover:scale-105 hover:shadow-lg active:scale-95">
              حفظ التغييرات
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PROFILE CARD */}
          <div
            className={`rounded-2xl p-8 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
              dark ? "bg-[#137FEC1A]" : "bg-[#EAF4FF]"
            }`}
          >
            <div className="relative w-24 h-24 mx-auto mb-4 group">
              <img
                src={avatar}
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
              <label
                htmlFor="avatarUpload"
                className="absolute bottom-0 right-0 bg-[#137FEC] w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white transition hover:bg-[#1A6FD4] hover:scale-110"
              >
                ✎
              </label>
            </div>

            <input
              type="file"
              id="avatarUpload"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatar(URL.createObjectURL(file));
              }}
            />

            <h4 className="font-bold text-lg">
              {firstName} {lastName}
            </h4>
            <p className={`text-sm mb-2 ${dark ? "text-white/50" : "text-gray-600"}`}>
              Member since Jan 2023
            </p>

            <span className="inline-block bg-green-500 text-white text-xs px-4 py-1 rounded-full mb-6">
              مفعل
            </span>

            <button
              className={`w-full py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                dark
                  ? "bg-[#1E2A44] hover:bg-[#2A3A5B] text-white"
                  : "bg-[#DCEEFF] hover:bg-[#CFE6FF] text-gray-900"
              }`}
            >
              تغيير كلمة المرور
            </button>
          </div>

          {/* PERSONAL DATA */}
          <div
            className={`lg:col-span-2 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
              dark ? "bg-[#137FEC1A]" : "bg-[#EAF4FF]"
            }`}
          >
            <h3 className="font-bold mb-6">البيانات الشخصية</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="الاسم الأول" value={firstName} onChange={setFirstName} dark={dark} />
              <Input label="الاسم الآخر" value={lastName} onChange={setLastName} dark={dark} />
            </div>

            <div className="mt-6">
              <Input label="البريد الإلكتروني" value={email} onChange={setEmail} dark={dark} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;

/* ------------ INPUT COMPONENT ------------ */

type InputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  dark: boolean;
};

const Input: React.FC<InputProps> = ({ label, value, onChange, dark }) => (
  <div>
    <label className={`block mb-2 text-sm ${dark ? "text-white/60" : "text-gray-700"}`}>
      {label}
    </label>

    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-xl px-4 py-2 outline-none transition-all duration-200
        ${
          dark
            ? "bg-[#0B1020] border border-[#1E2A44] text-white/70 focus:border-[#137FEC] focus:ring-2 focus:ring-[#137FEC33]"
            : "bg-[#DCEEFF] border border-[#C6E0FF] text-gray-900 focus:border-[#137FEC] focus:ring-2 focus:ring-[#137FEC33]"
        }`}
    />
  </div>
);
