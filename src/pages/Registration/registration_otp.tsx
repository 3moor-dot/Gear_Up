
import { useState, useRef } from "react";
import { FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const RegistrationOtp = () => {
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const email = localStorage.getItem("pendingEmail") || "";

  const isDarkMode = () =>
    document.documentElement.classList.contains("dark");

  // ✅ handle typing
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    // move next
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // ✅ handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const paste = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(paste)) return;

    const arr = paste.split("");
    setOtpArray(arr);

    inputsRef.current[5]?.focus();
  };

  // ✅ verify OTP
  const handleVerify = async () => {
    const finalOtp = otpArray.join("");

    if (finalOtp.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "برجاء إدخال كود التفعيل",
        background: isDarkMode() ? "#1B1F2D" : "#fff",
        color: isDarkMode() ? "#fff" : "#000",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://gearupapp.runasp.net/api/users/user-registration-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp: finalOtp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.isEmailConfirmed) {
        throw new Error(data?.message || "كود غير صحيح");
      }

      Swal.fire({
        icon: "success",
        title: "تم تأكيد الحساب",
        text: "يمكنك الآن تسجيل الدخول",
        timer: 2500,
        showConfirmButton: false,
        background: isDarkMode() ? "#1B1F2D" : "#fff",
        color: isDarkMode() ? "#fff" : "#000",
      });

      setTimeout(() => {
        const role = localStorage.getItem("pendingRole");

        localStorage.removeItem("pendingEmail");
        localStorage.removeItem("pendingFirstName");
  localStorage.removeItem("pendingLastName");
  localStorage.removeItem("pendingPhone");
  localStorage.removeItem("pendingPassword");

        if (role === "2") {
          window.location.href = "/upload-license";
        } else {
          window.location.href = "/login";
        }
      }, 2500);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: err.message,
        background: isDarkMode() ? "#1B1F2D" : "#fff",
        color: isDarkMode() ? "#fff" : "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#EAF4FF] to-white dark:from-[#0F1323] dark:to-[#101922]"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}

        className="w-full max-w-2xl bg-white dark:bg-[#1B1F2D] rounded-3xl shadow-2xl p-12 sm:p-14"
      >
        <h2 className="text-2xl font-bold text-center dark:text-white mb-2">
          تأكيد البريد الإلكتروني
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          أدخل الكود المرسل إلى بريدك الإلكتروني
        </p>

        {/* email */}
        <div className="mb-5">
          <label className="block text-sm mb-2 dark:text-white">
            البريد الإلكتروني
          </label>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#137FEC1A] p-3 rounded-xl text-sm text-gray-600 dark:text-gray-200">
            <FaEnvelope />
            <span>{email}</span>
          </div>
        </div>

        {/* OTP */}
        <div className="mb-6">
          <label className="block text-sm mb-2 dark:text-white">
            كود التفعيل
          </label>

          <div
            className="flex gap-2 justify-center"
            onPaste={handlePaste}
          >
            {otpArray.map((digit, i) => (
              <input
                key={i}
                // ref={(el) => (inputsRef.current[i] = el)}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                maxLength={1}
                className="w-12 h-12 text-center text-xl border rounded-lg bg-white dark:bg-[#137FEC1A] dark:text-white focus:ring-2 focus:ring-[#137FEC] outline-none"
              />
            ))}
          </div>
        </div>


<button
  onClick={handleVerify}
  disabled={loading}
  className="w-full bg-[#137FEC] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
>
  {loading ? "جارٍ التحقق..." : "تأكيد الحساب"}
</button>

{/* 👇 زرار الرجوع */}
<p className="text-center mt-4 text-sm">

{/* 👇 زر الرجوع */}
<div className="w-full flex justify-end mt-6">

 <span
  onClick={() => {
    // علامة إننا راجعين من الـ OTP
    localStorage.setItem("fromOtpBack", "true");
    
    // اطلعي لصفحة التسجيل
    window.location.href = "/register";
  }}
  className="text-[#137FEC] text-xl font-bold cursor-pointer hover:no-underline transition"
>
  رجوع
</span>
</div>
</p>

</motion.div>
</div>
  );
};

export default RegistrationOtp;