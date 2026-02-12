import { MdCalendarMonth, MdAccessTime, MdClose } from "react-icons/md";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RescheduleModal = ({ isOpen, onClose }: RescheduleModalProps) => {
  if (!isOpen) return null;

  // التنسيق الموحد للحقول الداكنة (بناءً على ستايل الكود الثاني)
  const inputStyle = "w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 text-blue-400 font-bold outline-none cursor-pointer hover:bg-[#1e293b] transition-all focus:border-blue-500/50";
  const labelStyle = "text-right font-bold text-white mb-2 block text-sm pr-1";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* الخلفية المعتمة */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* نافذة البوب أب - هيكلة الكود الثاني مع ألوان الكود الأول */}
      <div className="relative w-full max-w-2xl bg-[#137FEC5C] rounded-[40px] shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-300">
        
        {/* زر الإغلاق */}
        <button 
          onClick={onClose} 
          className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors z-10"
        >
          <MdClose size={30} />
        </button>

        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-black text-white text-right mb-10">تغير موعد</h2>

          <div className="space-y-6">
            
            {/* التاريخ والوقت جنباً إلى جنب (Grid) مثل تصميم الصورة */}
            <div className="grid grid-cols-2 gap-4">
              {/* التاريخ */}
              <div className="text-right">
                <label className={labelStyle}>التاريخ</label>
                <div className="relative">
                  <input
                    type="date"
                    className={`${inputStyle} custom-date-input pl-12`}
                    dir="rtl"
                  />
                  <MdCalendarMonth className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl pointer-events-none " />
                </div>
              </div>

              {/* التوقيت */}
              <div className="text-right">
                <label className={labelStyle}>التوقيت</label>
                <div className="relative">
                  <input
                    type="time"
                    className={`${inputStyle} custom-time-input pl-12`}
                    dir="rtl"
                  />
                  <MdAccessTime className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl pointer-events-none" />
                </div>
              </div>
            </div>

            {/* أزرار التحكم - ترتيب الأزرار مثل الصورة */}
            <div className="flex gap-4 pt-6" dir="rtl">
              
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#0F1323] text-white py-4 rounded-2xl font-black text-lg border border-white/5 hover:bg-[#1e293b] transition-all"
              >
                الغاء
              </button>
              <button
                type="button"
                className="flex-1 bg-[#137FEC] text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all"
                onClick={() => {
                  alert("تم تغيير الموعد بنجاح!");
                  onClose();
                }}
              >
                تغير الموعد
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* تنسيق أيقونات المتصفح الافتراضية */}
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
          filter: invert(1);
        }
      `}</style>
    </div>
  );
};

export default RescheduleModal;