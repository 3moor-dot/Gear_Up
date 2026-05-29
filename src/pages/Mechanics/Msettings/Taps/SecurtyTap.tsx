import { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaSave, FaSpinner, FaLock, FaEdit } from "react-icons/fa";
import {
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircleOutline,
  MdErrorOutline,
} from "react-icons/md";

const PasswordField = ({
  label,
  name,
  value,
  show,
  onToggle,
  onChange,
  dark,
  disabled,
}: {
  label: string;
  name: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dark: boolean;
  disabled?: boolean;
}) => {
  const inputClass = `w-full text-right font-semibold py-3 px-4 pl-12 rounded-2xl transition-all duration-200 border outline-none ${
    !dark
      ? "bg-white border-[#D7E7FF] focus:border-[#137FEC] focus:ring-2 focus:ring-[#137FEC]/15 text-gray-900 shadow-sm"
      : "bg-[#131c2f] border-[#24324A] focus:border-[#137FEC] focus:ring-2 focus:ring-[#137FEC]/25 text-white"
  } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`;

  return (
    <div>
      <label className="text-xs sm:text-sm font-extrabold text-[#137FEC] block mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          required
          disabled={disabled}
          className={inputClass}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors z-10 ${
            disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-[#137FEC]"
          }`}
        >
          {show ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
        </button>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const { dark } = useTheme();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const token = sessionStorage.getItem("userToken");
  const BASE_URL = "https://gearupapp.runasp.net/api/auth/change-password";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus({
      type: null,
      message: "",
    });

    if (passwords.newPassword !== passwords.confirmPassword) {
      return setStatus({
        type: "error",
        message: "كلمة المرور الجديدة غير متطابقة",
      });
    }

    setLoading(true);

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message || "تم تغيير كلمة المرور بنجاح",
        });

        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsEditing(false);

        setTimeout(() => window.location.reload(), 1000);
      } else {
        setStatus({
          type: "error",
          message: data.message || "فشل التغيير، تأكد من كلمة المرور الحالية",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "حدث خطأ في الاتصال بالسيرفر",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="bg-white dark:bg-[#0d1629] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 md:p-6 space-y-6 md:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full border-4 border-[#BFD8FF] dark:border-[#1E3A5F] bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
            <FaLock className="text-[#137FEC] text-2xl sm:text-3xl" />
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">
              إعدادات الأمان
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              تغيير كلمة المرور وتأمين حسابك
            </p>
          </div>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-500/20 bg-[#137FEC] hover:bg-blue-600 text-white"
          >
            <FaEdit />
            <span>تعديل</span>
          </button>
        ) : (
          <button
            type="submit"
            form="password-form"
            disabled={loading}
            className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-500/20 ${
              loading
                ? "bg-gray-400 cursor-wait text-white shadow-none"
                : "bg-[#137FEC] hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>حفظ التغييرات</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Fields */}
      <div>
        {status.type && (
          <div
            className={`mb-6 p-3 rounded-xl text-sm text-center flex items-center justify-center gap-2 font-medium border ${
              status.type === "success"
                ? "bg-green-500/10 border-green-500/25 text-green-600 dark:text-green-400"
                : "bg-red-500/10 border-red-500/25 text-red-600 dark:text-red-400"
            }`}
          >
            {status.type === "success" ? (
              <MdCheckCircleOutline size={18} />
            ) : (
              <MdErrorOutline size={18} />
            )}
            {status.message}
          </div>
        )}

        <form id="password-form" onSubmit={handleChangePassword}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <PasswordField
                label="كلمة المرور الحالية"
                name="currentPassword"
                value={passwords.currentPassword}
                show={showCurrent}
                onToggle={() => setShowCurrent(!showCurrent)}
                onChange={handleInputChange}
                dark={dark}
                disabled={!isEditing}
              />
            </div>

            <PasswordField
              label="كلمة المرور الجديدة"
              name="newPassword"
              value={passwords.newPassword}
              show={showNew}
              onToggle={() => setShowNew(!showNew)}
              onChange={handleInputChange}
              dark={dark}
              disabled={!isEditing}
            />

            <PasswordField
              label="تأكيد كلمة المرور الجديدة"
              name="confirmPassword"
              value={passwords.confirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
              onChange={handleInputChange}
              dark={dark}
              disabled={!isEditing}
            />
          </div>

          <div
            className={`mt-6 p-4 rounded-xl border ${
              !dark
                ? "bg-blue-50/70 border-[#CFE3FF] text-blue-600"
                : "bg-blue-900/20 border-[#1E3A5F] text-blue-400"
            }`}
          >
            <p className="text-sm text-center font-medium">
              ملاحظة: يفضل أن تحتوي كلمة المرور على 8 أحرف على الأقل، بما في
              ذلك أرقام ورموز خاصة.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;