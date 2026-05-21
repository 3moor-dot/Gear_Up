import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
// import Footer from "../../components/Footer/footer";
const Verification = () => {
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const token = otp.join("");
    if (token.length < 5) {
      setError("يرجى إدخال الرمز كاملاً");
      return;
    }
    setError("");
    // حفظ التوكين بس — الـ API call هيتعمل في صفحة reset-password مع الباسورد
    sessionStorage.setItem("reset_token", token);
    window.location.href = "/reset-password";
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
              <div className="text-center space-y-4">
                <span className="inline-flex rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] text-xs sm:text-sm font-bold px-4 py-2 mb-4">
                  منصة GearUp
                </span>
                <h1 className="text-3xl font-bold">التحقق من حسابك</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mt-2">
                  لضمان سلامتك، يرجى إدخال الرمز المكون من 5 أرقام <br className="hidden sm:block" />
                  الذي أرسلناه إلى عنوان بريدك الإلكتروني للمتابعة.
                </p>
              </div>

              {/* OTP INPUTS */}
              <div className="flex justify-center gap-3 my-8" dir="ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputsRef.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="
                      w-12 h-14 md:w-14 md:h-16 
                      text-center text-2xl font-bold
                      rounded-2xl border border-gray-200 dark:border-gray-700
                      bg-[#f1f5fd] dark:bg-[#137FEC1A]
                      focus:ring-2 focus:ring-[#2563EB] outline-none
                      text-gray-900 dark:text-white transition-all
                    "
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center font-medium mb-4">{error}</p>
              )}

              {/* VERIFY BUTTON */}
              <button
                type="button"
                onClick={handleVerify}
                className="w-full h-12 bg-[#2563EB] hover:bg-blue-600 text-white font-bold rounded-2xl transition-all shadow-md"
              >
                التحقق من الحساب
              </button>

              {/* RESEND SECTION */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-2 gap-4">
                <p className="text-sm">
                  لم تستلم الرمز؟
                  <button
                    type="button"
                    disabled={timer > 0}
                    onClick={() => setTimer(60)}
                    className={`mr-2 font-bold transition-colors ${timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-[#2563EB] hover:underline"}`}
                  >
                    أعد الإرسال
                  </button>
                </p>
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl text-[#2563EB]">
                  <span className="font-mono font-bold">
                    {formatTime(timer)}
                  </span>
                </div>
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

export default Verification;