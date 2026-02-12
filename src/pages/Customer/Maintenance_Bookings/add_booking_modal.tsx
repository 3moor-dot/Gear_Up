import { MdCalendarMonth, MdAccessTime, MdKeyboardArrowDown, MdClose } from "react-icons/md";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBookingModal = ({ isOpen, onClose }: AddBookingModalProps) => {
  if (!isOpen) return null;

  // التنسيق الموحد للحقول التفاعلية
  const inputStyle = "w-full bg-[#93C5FD] dark:bg-[#137FEC33] rounded-2xl px-5 py-3 text-white font-bold outline-none cursor-pointer appearance-none hover:bg-blue-400 transition-all border border-transparent focus:border-white/50";
  const labelStyle = "text-right font-bold text-gray-700 dark:text-gray-200 mb-2 block text-sm pr-1";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-[#E5F1FD] dark:bg-[#0B1020] rounded-[40px] shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 left-6 text-gray-500 hover:text-red-500 transition-colors z-10">
          <MdClose size={30} />
        </button>

        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-black dark:text-white text-gray-800 text-center mb-10">اضافة حجز جديد</h2>

          <div className="space-y-6">
            {/* الحقول المنسدلة (Dropdowns) */}
            {[
              { label: "الميكانيكي", options: ["علي جمال", "أحمد محمد", "محمود حسن"] },
              { label: "الخدمة", options: ["تغيير زيت", "فحص فرامل", "صيانة دورية"] },
              { label: "اختيار السيارة", options: ["Toyota RAV4 2022", "Honda Civic 2021"] }
            ].map((item, index) => (
              <div key={index} className="relative">
                <label className={labelStyle}>{item.label}</label>
                <div className="relative">
                  <select className={inputStyle} dir="rtl">
                    <option value="" hidden>اختر من القائمة...</option>
                    {item.options.map(opt => <option key={opt} value={opt} className="bg-blue-600 text-white">{opt}</option>)}
                  </select>
                  <MdKeyboardArrowDown className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl pointer-events-none" />
                </div>
              </div>
            ))}

            {/* التاريخ */}
            <div className="text-right">
              <label className={labelStyle}>التاريخ</label>
              <div className="relative">
                <input
                  type="date"
                  className={`${inputStyle} custom-date-input pl-12 text-center md:text-right`}
                  dir="rtl"
                />
                {/* تم تثبيت الأيقونة في أقصى اليسار مع وجود مسافة padding-left في الـ input */}
                <MdCalendarMonth className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl pointer-events-none" />
              </div>
            </div>

            {/* التوقيت */}
            <div className="text-right">
              <label className={labelStyle}>التوقيت</label>
              <div className="relative">
                <input
                  type="time"
                  className={`${inputStyle} custom-time-input pl-12 text-center md:text-right`}
                  dir="rtl"
                />
                <MdAccessTime className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl pointer-events-none" />
              </div>
            </div>
            {/* زر الإرسال */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                className="bg-[#137FEC] text-white px-16 py-3.5 rounded-2xl font-black text-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
                onClick={() => {
                  alert("تم إرسال طلبك بنجاح!");
                  onClose();
                }}
              >
                ارسال طلب جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* تنسيق بسيط لإخفاء أيقونات المتصفح الافتراضية وجعلها متناسقة */}
      <style>{`
        .custom-date-input::-webkit-calendar-picker-indicator,
        .custom-time-input::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
    </div>
  );
};

export default AddBookingModal;