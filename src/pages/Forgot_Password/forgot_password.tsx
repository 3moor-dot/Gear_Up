import { Link } from "react-router-dom";
import Footer from "../../components/Footer/footer";

const ForgotPassword = () => {
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
        <div
          className="
            w-full max-w-md
            bg-[#EAF4FF] dark:bg-[#137FEC0F]
            border border-[#137FEC]
            rounded-2xl
            p-8
            space-y-6
          "
        >
          {/* TITLE */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">هل نسيت كلمة السر</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              أدخل عنوان البريد الإلكتروني أو اسم المستخدم المرتبط بحسابك،
              وسنرسل إليك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.
            </p>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="block font-medium">
              عنوان البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="e.g. yourname@example.com"
              className="
                w-full h-12 rounded-xl
                bg-white dark:bg-[#137FEC1A]
                border border-gray-200 dark:border-gray-600
                px-4
                outline-none
                focus:ring-2 focus:ring-[#137FEC]
              "
            />
          </div>

          {/* BUTTON */}
          <button
            className="
              w-full h-12
              bg-[#137FEC]
              hover:bg-blue-700
              transition
              rounded-xl
              text-white
              font-semibold
            "
          >
            إرسال كود التحقق
          </button>

          {/* BACK TO LOGIN */}
          <p className="text-center text-sm">
            هل تذكرت كلمة المرور؟
            <Link
              to="/login"
              className="text-[#137FEC] mr-1 font-medium hover:underline"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default ForgotPassword;
