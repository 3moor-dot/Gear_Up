
import React, { useState } from "react";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Mechine_profile: React.FC = () => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("أحمد");
  const [lastName, setLastName] = useState("ميكانيكي");
  const [email, setEmail] = useState("ahmed@example.com");
  const [avatar, setAvatar] = useState<string>("/avatar-path.png");

  return (
    <div dir="rtl" className="flex flex-col lg:flex-row min-h-screen">
      <MachineSidebar />

      <main
        className={`flex-1 p-6 md:p-10 transition-colors duration-500 ${
          dark ? "bg-primary_BGD text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold">
            لوحة القيادة / الحساب الشخصي
          </h2>

          <div className="flex items-center gap-4">
            <NotificationBell onClick={() => console.log("Notifications clicked")} />
            <ThemeToggle />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
          <button
            onClick={() => navigate("/mechanics/mprofile")}
            className={`
              px-6 py-2 rounded-xl text-sm md:text-base transition-all duration-200
              hover:scale-105 hover:shadow-md active:scale-95
              ${
                dark
                  ? "bg-[#0BDA65] text-white hover:bg-[#0AC959]"
                  : "bg-[#0BDA6533] text-[#0BDA65] font-bold hover:bg-[#0BDA6550]"
              }
            `}
          >
            أكمل ملفك الشخصي
          </button>

          <button
            className={`
              px-6 py-2 rounded-xl text-sm md:text-base transition-all duration-200
              hover:scale-105 hover:shadow-md active:scale-95
              ${
                dark
                  ? "bg-[#137FEC] text-white hover:bg-[#1A6FD4]"
                  : "bg-[#137FEC80] text-[#0F132380] font-bold"
              }
            `}
          >
            حفظ التغييرات
          </button>
        </div>


        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-2">
          {/* PROFILE CARD */}
          <div
            className={`rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
              dark ? "bg-[#137FEC1A]" : "bg-[#EAF4FF]"
            }`}
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={avatar}
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />

              <label
                htmlFor="avatarUpload"
                className="absolute bottom-0 right-0 bg-[#137FEC] w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white transition hover:bg-[#1A6FD4]"
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

            <h4 className="font-bold text-lg md:text-xl">
              {firstName} {lastName}
            </h4>

            <p className={`text-sm mb-2 ${dark ? "text-white/50" : "text-gray-600"}`}>
              Member since Jan 2023
            </p>

            <span className="inline-block text-xs md:text-sm px-4 py-1 rounded-full mb-6 bg-[#0BDA6533] text-[#0BDA65]">
              مفعل
            </span>

            <button
              className={`
                w-full py-2 rounded-xl transition-all duration-200 hover:scale-105
                ${
                  dark
                    ? "bg-[#1E2A44] hover:bg-[#2A3A5B] text-white"
                    : "bg-[#0F13231A] hover:bg-[#0F132340] text-[#0F132380] font-bold"
                }
              `}
            >
              تغيير كلمة المرور
            </button>
          </div>

          {/* PERSONAL DATA */}
          <div
            className={`lg:col-span-2 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
              dark ? "bg-[#137FEC1A]" : "bg-[#EAF4FF]"
            }`}
          >
            <h3
              className={`font-bold mb-6 text-lg md:text-xl ${
                dark ? "text-white" : "text-[#0F132380]"
              }`}
            >
              البيانات الشخصية
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <Input
                label="الاسم الأول"
                value={firstName}
                onChange={setFirstName}
                dark={dark}
              />
              <Input
                label="الاسم الآخر"
                value={lastName}
                onChange={setLastName}
                dark={dark}
              />
            </div>

            <div className="mt-4 md:mt-6">
              <Input
                label="البريد الإلكتروني"
                value={email}
                onChange={setEmail}
                dark={dark}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Mechine_profile;

/* ------------ INPUT COMPONENT ------------ */

type InputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  dark: boolean;
};

const Input: React.FC<InputProps> = ({ label, value, onChange, dark }) => (
  <div>
    <label
      className={`block mb-2 text-sm md:text-base font-medium ${
        dark ? "text-white" : "text-[#0F132380]"
      }`}
    >
      {label}
    </label>

    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full rounded-xl px-4 py-2 outline-none transition-all duration-200
        bg-[#137FEC1A] border border-[#137FEC33]
        ${
          dark
            ? "text-white/50 font-normal"
            : "text-[#0F132380] font-bold"
        }
        focus:border-[#137FEC]
        focus:ring-2 focus:ring-[#137FEC33]
      `}
    />
  </div>
);

