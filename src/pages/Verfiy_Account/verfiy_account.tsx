import { useState, useEffect } from "react";
import Footer from "../../components/Footer/footer";

const Verification = () => {
  const [timer, setTimer] = useState(60);

  // عداد تنازلي لإعادة الإرسال
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // تنسيق الوقت ليظهر بشكل 00:59
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-xl bg-[#E8F3FF] dark:bg-[#137FEC0D] border border-[#137FEC40] p-10 rounded-[30px] shadow-sm">
          
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">التحقق من حسابك</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              لضمان سلامتك، يرجى إدخال الرمز المكون من 6 أرقام <br />
              الذي أرسلناه إلى عنوان بريدك الإلكتروني للمتابعة.
            </p>
          </div>

          {/* OTP INPUTS */}
          <div className="flex justify-center gap-2 my-8" dir="ltr">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="
                  w-10 h-12 md:w-12 md:h-14 
                  text-center text-xl font-bold
                  rounded-lg border-none
                  bg-white dark:bg-gray-500
                  focus:ring-2 focus:ring-[#137FEC] outline-none
                  shadow-sm dark:text-white
                "
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button 
            className="
              w-full h-12 
              bg-[#137FEC] hover:bg-blue-600 
              text-white font-semibold rounded-xl 
              transition-all duration-300
            "
          >
            التحقق من الحساب
          </button>

          {/* RESEND SECTION */}
          <div className="flex justify-between items-center mt-6 px-2">
            <p className="text-sm">
              لم تستلم الرمز؟ 
              <button 
                disabled={timer > 0}
                className={`mr-1 font-bold ${timer > 0 ? 'text-[#137FEC]' : 'text-[#137FEC] hover:underline'}`}
              >
                أعد الإرسال
              </button>
            </p>
            <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
              {formatTime(timer)}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Verification;