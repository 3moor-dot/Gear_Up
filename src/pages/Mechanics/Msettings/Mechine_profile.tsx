import React, { useState, useEffect } from "react";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const BASE_URL = "http://gearupapp.runasp.net/api";
const getToken = () => sessionStorage.getItem("userToken");

const Mechine_profile: React.FC = () => {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string>("/avatar-path.png");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ======= FETCH =======
  const fetchProfile = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      console.log("GET profile status:", res.status);
      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      console.log("Profile data:", data);

      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      if (data.profilePhotoUrl) setAvatar(data.profilePhotoUrl);
    } catch {
      setError("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ======= SAVE =======
  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("FirstName", firstName);
      formData.append("LastName", lastName);
      formData.append("Phone", ""); // مش موجود في الفورم دي
      if (selectedPhoto) {
        formData.append("ProfilePhoto", selectedPhoto);
      }

      console.log("Saving:", { firstName, lastName, photo: selectedPhoto?.name });

      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const json = await res.json().catch(() => null);
      console.log("PUT response:", json);

      if (!res.ok) {
        setError(json?.message || "حدث خطأ أثناء الحفظ");
        return;
      }

      setSuccess("تم حفظ التغييرات بنجاح ✅");
      setSelectedPhoto(null);
      fetchProfile();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  };

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

        {/* MESSAGES */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
          <button
            onClick={() => navigate("/mechanics/mprofile")}
            className={`px-6 py-2 rounded-xl text-sm md:text-base transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 ${
              dark
                ? "bg-[#0BDA65] text-white hover:bg-[#0AC959]"
                : "bg-[#0BDA6533] text-[#0BDA65] font-bold hover:bg-[#0BDA6550]"
            }`}
          >
            أكمل ملفك الشخصي
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm md:text-base transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              dark
                ? "bg-[#137FEC] text-white hover:bg-[#1A6FD4]"
                : "bg-[#137FEC80] text-[#0F132380] font-bold"
            }`}
          >
            {isSaving ? (
              <><FaSpinner className="animate-spin" /><span>جاري الحفظ...</span></>
            ) : (
              "حفظ التغييرات"
            )}
          </button>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
          </div>
        ) : (
          /* CONTENT */
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
                  if (file) {
                    setSelectedPhoto(file);
                    setAvatar(URL.createObjectURL(file));
                  }
                }}
              />

              <h4 className="font-bold text-lg md:text-xl">
                {firstName} {lastName}
              </h4>

              {selectedPhoto && (
                <p className="text-xs text-blue-500 mt-1">📷 {selectedPhoto.name}</p>
              )}

              <p className={`text-sm mb-2 mt-1 ${dark ? "text-white/50" : "text-gray-600"}`}>
                {email}
              </p>

              <span className="inline-block text-xs md:text-sm px-4 py-1 rounded-full mb-6 bg-[#0BDA6533] text-[#0BDA65]">
                مفعل
              </span>

              <button
                className={`w-full py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                  dark
                    ? "bg-[#1E2A44] hover:bg-[#2A3A5B] text-white"
                    : "bg-[#0F13231A] hover:bg-[#0F132340] text-[#0F132380] font-bold"
                }`}
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
                <Input label="الاسم الأول" value={firstName} onChange={setFirstName} dark={dark} />
                <Input label="الاسم الآخر" value={lastName} onChange={setLastName} dark={dark} />
              </div>

              {/* الإيميل للعرض فقط */}
              <div className="mt-4 md:mt-6">
                <label className={`block mb-2 text-sm md:text-base font-medium ${dark ? "text-white" : "text-[#0F132380]"}`}>
                  البريد الإلكتروني
                </label>
                <input
                  value={email}
                  readOnly
                  className={`w-full rounded-xl px-4 py-2 outline-none cursor-not-allowed bg-[#137FEC1A] border border-[#137FEC33] ${
                    dark ? "text-white/30" : "text-[#0F132350]"
                  }`}
                />
              </div>
            </div>

          </div>
        )}
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
    <label className={`block mb-2 text-sm md:text-base font-medium ${dark ? "text-white" : "text-[#0F132380]"}`}>
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-xl px-4 py-2 outline-none transition-all duration-200 bg-[#137FEC1A] border border-[#137FEC33] ${
        dark ? "text-white/50 font-normal" : "text-[#0F132380] font-bold"
      } focus:border-[#137FEC] focus:ring-2 focus:ring-[#137FEC33]`}
    />
  </div>
);