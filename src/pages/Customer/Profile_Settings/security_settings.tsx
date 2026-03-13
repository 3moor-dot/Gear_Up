import { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { FaSave, FaSpinner, FaLock } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff, MdCheckCircleOutline, MdErrorOutline } from "react-icons/md";

const PasswordField = ({
  label, name, value, show, onToggle, onChange, dark,
}: {
  label: string;
  name: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dark: boolean;
}) => (
  <div>
    <label className={`block text-xs sm:text-sm mb-1.5 font-extrabold text-[#137FEC]`}>
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
        className={`w-full px-4 py-3 pr-12 rounded-2xl border outline-none transition-all font-semibold text-right ${
          !dark
            ? "bg-white border-blue-400 ring-2 ring-blue-100 text-gray-900"
            : "bg-gray-800 border-gray-600 ring-2 ring-blue-900/40 text-white"
        } focus:border-blue-500`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#137FEC] transition-colors"
      >
        {show ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
      </button>
    </div>
  </div>
);

const SecuritySettings = () => {
  const { dark } = useTheme();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const token    = sessionStorage.getItem("userToken");
  const BASE_URL = "https://gearupapp.runasp.net/api/auth/change-password";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (passwords.newPassword !== passwords.confirmPassword)
      return setStatus({ type: "error", message: "كلمة المرور الجديدة غير متطابقة" });

    setLoading(true);
    try {
      const res  = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword:     passwords.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: data.message || "تم تغيير كلمة المرور بنجاح" });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setStatus({ type: "error", message: data.message || "فشل التغيير، تأكد من كلمة المرور الحالية" });
      }
    } catch {
      setStatus({ type: "error", message: "حدث خطأ في الاتصال بالسيرفر" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-[32px] sm:rounded-[40px] border overflow-hidden shadow-xl ${
        !dark ? "bg-white border-gray-200" : "bg-[#0d1629] border-blue-900/30"
      }`}
      dir="rtl"
    >
      {/* Header */}
      <div className={`p-4 sm:p-6 border-b flex flex-wrap items-center justify-between gap-3 ${
        !dark ? "border-gray-200" : "border-gray-800"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-4 border-blue-500 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <FaLock className="text-blue-500 text-base sm:text-xl" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold">إعدادات الأمان</h3>
            <p className={`text-xs sm:text-sm ${!dark ? "text-gray-500" : "text-gray-400"}`}>تغيير كلمة المرور</p>
          </div>
        </div>

        <button
          type="submit"
          form="password-form"
          disabled={loading}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#137FEC] hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold transition disabled:opacity-50 active:scale-95"
        >
          {loading
            ? <><FaSpinner className="animate-spin" /><span>جاري الحفظ...</span></>
            : <><FaSave /><span>حفظ التغييرات</span></>
          }
        </button>
      </div>

      {/* Fields */}
      <div className="p-4 sm:p-6 md:p-8">

        {status.type && (
          <div className={`mb-5 p-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 ${
            status.type === "success"
              ? "bg-green-500/10 border border-green-500/30 text-green-600"
              : "bg-red-500/10 border border-red-500/30 text-red-500"
          }`}>
            {status.type === "success"
              ? <MdCheckCircleOutline size={18} />
              : <MdErrorOutline size={18} />}
            {status.message}
          </div>
        )}

        <form id="password-form" onSubmit={handleChangePassword} className="space-y-4 sm:space-y-5">

          {/* كلمة المرور الحالية — سطر كامل */}
          <PasswordField
            label="كلمة المرور الحالية"
            name="currentPassword"
            value={passwords.currentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
            onChange={handleInputChange}
            dark={dark}
          />

          {/* الجديدة + التأكيد — في نفس السطر على sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <PasswordField
              label="كلمة المرور الجديدة"
              name="newPassword"
              value={passwords.newPassword}
              show={showNew}
              onToggle={() => setShowNew(!showNew)}
              onChange={handleInputChange}
              dark={dark}
            />
            <PasswordField
              label="تأكيد كلمة المرور"
              name="confirmPassword"
              value={passwords.confirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
              onChange={handleInputChange}
              dark={dark}
            />
          </div>

          {/* ملاحظة أمنية */}
          <div className={`p-3 sm:p-4 rounded-2xl border text-xs sm:text-sm text-center font-medium ${
            !dark
              ? "bg-blue-50 border-blue-100 text-blue-600"
              : "bg-blue-900/20 border-blue-900/30 text-blue-400"
          }`}>
            يفضل أن تحتوي كلمة المرور على 8 أحرف على الأقل، بما في ذلك أرقام ورموز خاصة.
          </div>

        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;