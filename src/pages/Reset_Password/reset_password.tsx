import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
// import Footer from "../../components/Footer/footer";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (password.length < 8) {
      setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }

    const token = sessionStorage.getItem("reset_token");
    if (!token) {
      setError("انتهت صلاحية الجلسة، يرجى البدء من جديد");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://gearupapp.runasp.net/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "حدث خطأ، يرجى المحاولة مرة أخرى");
      }

      sessionStorage.removeItem("reset_token");
      setSuccess(true);
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ، يرجى المحاولة مرة أخرى");
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
                <h1 className="text-3xl font-bold">إعادة تعيين كلمة المرور</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  أدخل كلمة المرور الجديدة لتأمين حسابك
                </p>
              </div>

              <div className="space-y-6">
                {/* NEW PASSWORD */}
                <div className="space-y-2">
                  <label className="block font-medium text-right px-1">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الجديدة"
                      className="w-full h-12 rounded-2xl bg-[#f1f5fd] dark:bg-[#137FEC1A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pr-12 pl-4 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-2">
                  <label className="block font-medium text-right px-1">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                      className="w-full h-12 rounded-2xl bg-[#f1f5fd] dark:bg-[#137FEC1A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pr-12 pl-4 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center font-medium mt-1">{error}</p>
                )}
                {success && (
                  <p className="text-green-500 text-sm text-center font-medium mt-1">
                    تم تغيير كلمة المرور بنجاح! جارٍ التحويل...
                  </p>
                )}

                {/* SUBMIT */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || success}
                  className="w-full h-12 mt-4 bg-[#2563EB] hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-md"
                >
                  {loading ? "جارٍ الإرسال..." : "إرسال"}
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

export default ResetPassword;