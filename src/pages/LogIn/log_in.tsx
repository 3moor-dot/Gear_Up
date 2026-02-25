import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/footer";
import { FaPhone, FaEye, FaEyeSlash } from "react-icons/fa6"; // استيراد الأيقونات الجديدة
import { FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    rememberMe: true,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // حالة جديدة للتحكم في ظهور كلمة المرور

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://gearupapp.runasp.net/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.accessToken;
        sessionStorage.setItem("userToken", token);

        const extractVal = (field: any) =>
          typeof field === 'object' && field !== null ? field.value ?? '' : field ?? '';

        const userData = {
          firstName: extractVal(data.firstName ?? data.data?.firstName),
          lastName: extractVal(data.lastName ?? data.data?.lastName),
          email: data.email || data.data?.email || '',
          phone: data.phone || data.data?.phone || '',
          role: data.role ?? data.data?.role,
          profileImage: data.profileImage || data.data?.profileImage || null,
        };
        sessionStorage.setItem("userData", JSON.stringify(userData));

        const userRole = userData.role;

        if (userRole === 3) {
          navigate("/admin/admindashboard");
        } else if (userRole === 2) {
          navigate("/mechanics/mprofile");
        } else if (userRole === 1) {
          navigate("/customer/profilesettings");
        }
      } else {
        alert(data.message || "بيانات الدخول غير صحيحة");
      }
    } catch (err) {
      alert("فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex flex-col
        bg-white dark:bg-primary_BGD
        text-gray-900 dark:text-white
        transition-colors duration-500
      "
      dir="rtl"
    >
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* RIGHT – IMAGE */}
          <div className="hidden lg:flex flex-col items-center text-center space-y-6">
            <img src="/car.png" alt="car ai" className="w-full max-w-md rounded-xl" />
            <div>
              <h3 className="font-bold text-lg">العناية الذكية بالسيارة، بشكل مبسط</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                مساعدك المدعم بالذكاء الاصطناعي لصيانة السيارة وتحسين أدائها.
              </p>
            </div>
          </div>

          {/* LEFT – FORM */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-center">مرحباً بعودتك 👋</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">تسجيل الدخول إلى حسابك</p>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 font-medium">البريد الإلكتروني أو رقم الهاتف</label>
              <div className="relative">
                <input
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({...formData, emailOrPhone: e.target.value})}
                  className="w-full h-12 rounded-xl bg-[#8EC1F5] dark:bg-[#137FEC1A] text-white placeholder-gray-200 dark:placeholder-gray-400 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ادخل البريد الإلكتروني أو رقم الهاتف"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-400">
                  <FaPhone />
                </span>
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-medium">كلمة المرور</label>
                <Link to="/forgot-password" className="text-[#137FEC] text-sm hover:underline">هل نسيت كلمة السر؟</Link>
              </div>
              <div className="relative">
                <input
                  // تغيير النوع بناءً على حالة showPassword
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  // أضفنا pl-12 لترك مساحة للأيقونة جهة اليسار
                  className="w-full h-12 rounded-xl bg-[#8EC1F5] dark:bg-[#137FEC1A] text-white placeholder-gray-200 dark:placeholder-gray-400 pr-12 pl-12 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ادخل كلمة المرور"
                />
                {/* أيقونة القفل اليمنى */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-400">
                  <FaLock />
                </span>
                
                {/* زر العين جهة اليسار */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 bg-[#137FEC] rounded-xl text-white font-semibold disabled:bg-gray-400 transition-all active:scale-[0.98]"
            >
              {loading ? "جاري التحميل..." : "تسجيل الدخول"}
            </button>

            <p className="text-center text-sm">
              ليس لديك حساب؟
              <Link to="/register" className="text-blue-600 mr-1 font-bold hover:underline">إنضم إلينا الآن</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;