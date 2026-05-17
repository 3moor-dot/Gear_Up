
import { useState, useRef, useEffect } from "react";
import { FaEnvelope, FaRegClock } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const RegistrationOtp = () => {
  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const email = localStorage.getItem("pendingEmail") || "";

  const isDarkMode = () =>
    document.documentElement.classList.contains("dark");

  // ✅ تأثير العداد الزمني
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ handle typing
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

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

  // ✅ handle Resend OTP (تم التعديل هنا لإصلاح الخطأ)

const handleResend = async () => {
  if (!email) {
    Swal.fire({
      icon: "error",
      title: "خطأ",
      text: "البريد الإلكتروني غير موجود",
      background: isDarkMode() ? "#1B1F2D" : "#fff",
      color: isDarkMode() ? "#fff" : "#000",
    });
    return;
  }

  setResendLoading(true);

  try {
    // ✅ تم تعديل الرابط هنا من resend-otp إلى resendOTP
    const res = await fetch(
      "https://gearupapp.runasp.net/api/users/resendOTP",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const text = await res.text();
    console.log("Server Status:", res.status);
    console.log("Server Response:", text);

    let data = {};
    let errorMessage = "فشل إعادة الإرسال";

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        console.warn("الرد ليس بصيغة JSON");
      }
    }

    if (!res.ok) {
      const apiMessage = (data as any)?.message || (data as any)?.error || text;
      errorMessage = apiMessage || `خطأ في السيرفر: ${res.status}`;
      throw new Error(errorMessage);
    }

    Swal.fire({
      icon: "success",
      title: "تم الإرسال",
      text: "تم إرسال كود تفعيل جديد إلى بريدك الإلكتروني",
      timer: 2000,
      showConfirmButton: false,
      background: isDarkMode() ? "#1B1F2D" : "#fff",
      color: isDarkMode() ? "#fff" : "#000",
    });

    setTimer(30);
  } catch (err: any) {
    Swal.fire({
      icon: "error",
      title: "خطأ في الإرسال",
      text: err.message || "حدث خطأ غير معروف",
      background: isDarkMode() ? "#1B1F2D" : "#fff",
      color: isDarkMode() ? "#fff" : "#000",
    });
  } finally {
    setResendLoading(false);
  }
};

  // ✅ verify OTP (يفضل تطبيق نفس منطق الحماية هنا إذا كان اليمكن أن يرجع فارغاً)
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

      const text = await res.text();
      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch  {
          console.warn("Failed to parse JSON");
        }
      }

      if (!res.ok) {
        throw new Error((data as any)?.message || "كود غير صحيح");
      }

      // التحقق من تأكيد الإيميل (ملاحظة: إذا كان الرد فارغاً، data.isEmailConfirmed ستكون undefined)
      if (!(data as any).isEmailConfirmed && res.ok) {
         // في حالة نجاح الطلب لكن البيانات غير موجودة، نفترض النجاح بناءً على status code
         // أو يمكنك معالجتها حسب منطق الباك إند الخاص بك
      }
      
      // إذا كان الباك إند يعيد 200 OK بدون بيانات، نعتبره نجاحاً
      // ولكن بناءً على كودك القديم، كنت تتحقق من data.isEmailConfirmed
      // لذا سأترك الشرط كما هو مع ملاحظة أن الباك إند يجب أن يرجع هذه القيمة
      if (!res.ok || (data as any).isEmailConfirmed === false) {
         throw new Error((data as any)?.message || "كود غير صحيح أو لم يتم تأكيد الإيميل");
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
          window.location.href = "/login";
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
        <div className="mb-4">
          <label className="block text-sm mb-2 dark:text-white">
            كود التفعيل
          </label>

          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otpArray.map((digit, i) => (
              <input
                key={i}
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

          <div className="mt-3 text-center flex justify-center items-center gap-2">
            {timer > 0 ? (
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <FaRegClock /> إعادة الإرسال خلال {timer} ثانية
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-[#137FEC] font-bold hover:underline disabled:opacity-50"
              >
                {resendLoading ? "جارِ الإرسال..." : "إعادة إرسال الكود"}
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-[#137FEC] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "جارٍ التحقق..." : "تأكيد الحساب"}
        </button>

        <div className="w-full flex justify-end mt-6">
          <span
            onClick={() => {
              localStorage.setItem("fromOtpBack", "true");
              window.location.href = "/register";
            }}
            className="text-[#137FEC] text-xl font-bold cursor-pointer hover:no-underline transition"
          >
            رجوع
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationOtp;