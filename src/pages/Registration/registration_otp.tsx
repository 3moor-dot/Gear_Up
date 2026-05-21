
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
      dir="rtl"
      className="min-h-screen flex flex-col bg-[#f7f9fd] dark:bg-primary_BGD text-gray-900 dark:text-white transition-colors duration-500 relative"
    >
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* FORM SECTION */}
          <div className="w-full flex flex-col justify-center order-1 lg:order-2">
            <div className="bg-white dark:bg-[#131A2E] rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="text-center space-y-4 mb-8">
                <span className="inline-flex rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] text-xs sm:text-sm font-bold px-4 py-2 mb-4">
                  منصة GearUp
                </span>
                <h2 className="text-3xl font-bold">تأكيد البريد الإلكتروني</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  أدخل الكود المرسل إلى بريدك الإلكتروني
                </p>
              </div>

              {/* email */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 px-1">البريد الإلكتروني</label>
                <div className="flex items-center gap-3 bg-[#f1f5fd] dark:bg-[#137FEC1A] p-4 rounded-2xl text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                  <FaEnvelope className="text-[#2563EB]" size={18} />
                  <span className="font-medium" dir="ltr">{email}</span>
                </div>
              </div>

              {/* OTP */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3 px-1">كود التفعيل</label>
                <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handlePaste} dir="ltr">
                  {otpArray.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputsRef.current[i] = el;
                      }}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, i)}
                      maxLength={1}
                      className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-xl sm:text-2xl font-bold border border-gray-200 dark:border-gray-700 rounded-2xl bg-[#f1f5fd] dark:bg-[#137FEC1A] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="mt-6 flex justify-center items-center gap-2">
                  {timer > 0 ? (
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl text-[#2563EB]">
                      <FaRegClock />
                      <span className="text-sm font-medium">إعادة الإرسال خلال {timer} ثانية</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendLoading}
                      className="text-sm text-[#2563EB] font-bold hover:underline disabled:opacity-50 transition-all"
                    >
                      {resendLoading ? "جارِ الإرسال..." : "إعادة إرسال الكود"}
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="w-full h-12 bg-[#2563EB] hover:bg-blue-600 text-white rounded-2xl font-bold transition-all disabled:opacity-60 shadow-md mb-6"
              >
                {loading ? "جارٍ التحقق..." : "تأكيد الحساب"}
              </button>

              <div className="w-full flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("fromOtpBack", "true");
                    window.location.href = "/register";
                  }}
                  className="text-gray-500 dark:text-gray-400 font-medium hover:text-[#2563EB] dark:hover:text-[#2563EB] transition-colors"
                >
                  العودة للتسجيل
                </button>
              </div>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="flex flex-col justify-center items-center order-2 lg:order-1 mt-8 lg:mt-0 w-full">
            <motion.div
              className="relative w-full flex-1 min-h-[500px] flex flex-col items-center justify-center overflow-hidden rounded-[32px]"
              initial={{ opacity: 0, x: 140 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[360px] h-[220px] rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />
              </div>

              {/* Benefits Card */}
              <motion.div
                className="absolute top-4 sm:top-8 right-4 sm:right-8 z-20 bg-white/95 dark:bg-[#0d1629]/95 backdrop-blur rounded-[20px] p-4 shadow-lg border border-gray-100 dark:border-gray-800"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.18, delayChildren: 0.6 },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                <div className="space-y-3 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {["تشخيص ذكي", "حجز سريع", "متابعة آلية", "دعم متواصل"].map((text, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: 16 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.35, ease: "easeOut" },
                        },
                      }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[#2563EB] text-base">✓</span>
                      <span>{text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.img
                src="/02_car_systems_cutaway.png"
                alt="GearUp Car Systems"
                className="relative z-10 w-full max-w-[520px] object-contain object-center"
                animate={{
                  x: [0, -8, 0],
                  y: [0, -3, 0],
                  rotate: [0, -0.4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.p
                className="relative z-10 mt-12 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                منصة GearUp — العناية الذكية بالسيارة، بشكل مبسط
              </motion.p>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegistrationOtp;