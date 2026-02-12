import { Link } from "react-router-dom";
import Footer from "../../components/Footer/footer";
import { FaPhone } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";

const Login = () => {
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
      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* RIGHT – IMAGE */}
          <div className="hidden lg:flex flex-col items-center text-center space-y-6">
            <img
              src="/car.png"
              alt="car ai"
              className="w-full max-w-md rounded-xl"
            />
            <div>
              <h3 className="font-bold text-lg">
                العناية الذكية بالسيارة، بشكل مبسط
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                مساعدك المدعم بالذكاء الاصطناعي لصيانة السيارة وتحسين أدائها.
              </p>
            </div>
          </div>

          {/* LEFT – FORM */}
          <div className="space-y-8 ">
            <div>
              <h1 className="text-3xl font-bold text-center">
                مرحباً بعودتك 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                تسجيل الدخول إلى حسابك
              </p>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 font-medium text-[#137FEC]">
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <div className="relative">
                <input
                  className="
                    w-full h-12 rounded-xl
                    bg-[#8EC1F5] dark:bg-[#137FEC1A]
                    text-white placeholder-gray-200 dark:placeholder-gray-400
                    pr-12 pl-4
                    outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
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
                <Link to="/forgot-password" className="text-[#137FEC] text-sm">
                  هل نسيت كلمة السر؟
                </Link>
                <label className="font-medium">كلمة المرور</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  className="
                    w-full h-12 rounded-xl
                    bg-[#8EC1F5] dark:bg-[#137FEC1A]
                    text-white placeholder-gray-200 dark:placeholder-gray-400
                    pr-12 pl-4
                    outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                  placeholder="ادخل كلمة المرور"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-400">
                  <FaLock />
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <button className="w-full h-12 bg-[#137FEC] rounded-xl text-white font-semibold">
              تسجيل الدخول
            </button>

            <p className="text-center text-sm">
              ليس لديك حساب؟
              <Link to="/register" className="text-blue-600 mr-1">
                قم بالتسجيل
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Login;