import Footer from "../../components/Footer/footer";

const ResetPassword = () => {
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
            w-full max-w-xl 
            bg-[#E8F3FF] dark:bg-[#137FEC0D] 
            border border-[#137FEC40] 
            p-10 rounded-[30px] shadow-sm
          "
        >
          {/* Header */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold">إعادة تعيين كلمة المرور</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              أدخل كلمة المرور الجديدة لتأمين حسابك
            </p>
          </div>

          <div className="space-y-6">
            {/* NEW PASSWORD FIELD */}
            <div className="space-y-2">
              <label className="block font-medium text-right px-1">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                placeholder="e.g., yourname@example.com"
                className="
                  w-full h-12 rounded-xl px-4
                  bg-white dark:bg-[#137FEC1A]
                  border-none outline-none
                  focus:ring-2 focus:ring-[#137FEC]
                  placeholder-gray-400 text-sm
                "
              />
            </div>

            {/* CONFIRM PASSWORD FIELD */}
            <div className="space-y-2">
              <label className="block font-medium text-right px-1">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                placeholder="e.g., yourname@example.com"
                className="
                  w-full h-12 rounded-xl px-4
                  bg-white dark:bg-[#137FEC1A]
                  border-none outline-none
                  focus:ring-2 focus:ring-[#137FEC]
                  placeholder-gray-400 text-sm
                "
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              className="
                w-full h-12 mt-4
                bg-[#137FEC] hover:bg-blue-600 
                text-white font-bold rounded-xl 
                transition-all duration-300
                shadow-md
              "
            >
              إرسال
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default ResetPassword;