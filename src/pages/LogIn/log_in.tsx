import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPhone, FaEye, FaEyeSlash } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import Swal from "sweetalert2"; // 1. استيراد المكتبة
import { motion } from "framer-motion";
const Login = () => {
  const navigate = useNavigate();

  // منع الوصول لصفحة Login إذا كان المستخدم مسجل بالفعل
  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    const savedData = sessionStorage.getItem("userData");
    if (token && savedData) {
      const userData = JSON.parse(savedData);
      if (userData.role === 3) navigate("/admin/admindashboard", { replace: true });
      else if (userData.role === 2) navigate("/mechanics/mprofile", { replace: true });
      else if (userData.role === 1) navigate("/customer/profilesettings", { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    rememberMe: true,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // تحقق سريع قبل الإرسال
    if (!formData.emailOrPhone || !formData.password) {
      Swal.fire({
        icon: "warning",
        title: "بيانات ناقصة",
        text: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        confirmButtonText: "موافق",
        confirmButtonColor: "#137FEC",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://gearupapp.runasp.net/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ... نفس منطق حفظ البيانات ...
        const token = data.accessToken;
        sessionStorage.setItem("userToken", token);
        const extractVal = (field: any) => typeof field === 'object' && field !== null ? field.value ?? '' : field ?? '';
        const userData = {
          firstName: extractVal(data.firstName ?? data.data?.firstName),
          lastName: extractVal(data.lastName ?? data.data?.lastName),
          email: data.email || data.data?.email || '',
          phone: data.phone || data.data?.phone || '',
          role: data.role ?? data.data?.role,
          profileImage: data.profileImage || data.data?.profileImage || null,
        };
        sessionStorage.setItem("userData", JSON.stringify(userData));

        // إظهار رسالة نجاح خفيفة قبل التوجيه
        Swal.fire({
          icon: "success",
          title: "تم تسجيل الدخول بنجاح",
          showConfirmButton: false,
          timer: 1500,
          background: document.documentElement.classList.contains('dark') ? '#0B1120' : '#fff',
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        });

        setTimeout(() => {
          if (userData.role === 3) navigate("/admin/admindashboard", { replace: true });
          else if (userData.role === 2) navigate("/mechanics/mprofile", { replace: true });
          else if (userData.role === 1) navigate("/customer/profilesettings", { replace: true });
        }, 1500);

      } else {
        // رسالة الخطأ الاحترافية
        Swal.fire({
          icon: "error",
          title: "فشل الدخول",
          text: data.message || "تأكد من صحة البريد الإلكتروني أو كلمة المرور",
          confirmButtonText: "حاول مرة أخرى",
          confirmButtonColor: "#137FEC",
          background: document.documentElement.classList.contains('dark') ? '#0B1120' : '#fff',
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
          customClass: {
            popup: 'rounded-2xl border border-[#137FEC26]'
          }
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "خطأ في الاتصال",
        text: "تعذر الاتصال بالسيرفر، يرجى التحقق من الإنترنت",
        confirmButtonColor: "#137FEC",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... باقي الـ JSX الخاص بك بدون تغيير ...
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-[#f7f9fd] dark:bg-primary_BGD text-gray-900 dark:text-white transition-colors duration-500 relative"
    >
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* FORM SECTION */}
          <div className="w-full flex flex-col justify-center order-1 lg:order-2">
            <div className="bg-white dark:bg-[#131A2E] rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="inline-flex rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] text-xs sm:text-sm font-bold px-4 py-2 mb-4">
                    منصة GearUp
                  </span>
                  <h1 className="text-3xl font-bold">مرحباً بعودتك 👋</h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">تسجيل الدخول إلى حسابك</p>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block mb-2 font-medium">البريد الإلكتروني أو رقم الهاتف</label>
                  <div className="relative">
                    <input
                      value={formData.emailOrPhone}
                      onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                      className="w-full h-12 rounded-2xl bg-[#f1f5fd] dark:bg-[#137FEC1A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pr-12 pl-4 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#2563EB]"
                      placeholder="ادخل البريد الإلكتروني أو رقم الهاتف"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      <FaPhone />
                    </span>
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium">كلمة المرور</label>
                    <Link to="/forgot-password" className="text-[#2563EB] text-sm font-medium hover:underline">هل نسيت كلمة السر؟</Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-12 rounded-2xl bg-[#f1f5fd] dark:bg-[#137FEC1A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pr-12 pl-12 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#2563EB]"
                      placeholder="ادخل كلمة المرور"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      <FaLock />
                    </span>
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#2563EB] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "جاري التحميل..." : "تسجيل الدخول"}
                </button>

                <p className="text-center text-sm mt-4">
                  ليس لديك حساب؟
                  <Link to="/register" className="text-[#2563EB] mr-1 font-bold hover:underline">إنضم إلينا الآن</Link>
                </p>
              </form>
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

export default Login;