import { MdClose } from "react-icons/md";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CancelBookingModal = ({ isOpen, onClose }: CancelBookingModalProps) => {
  if (!isOpen) return null;

  // التنسيق الموحد للحقول الداكنة (بناءً على ستايل الكود الذي قدمته)
  const textareaStyle = "w-full bg-[#0F132380] border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none cursor-text hover:bg-[#1e293b] transition-all focus:border-red-500/50 min-h-[150px] resize-none";
  const labelStyle = "text-right font-bold text-white mb-4 block text-lg pr-1";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* الخلفية المعتمة مع Blur خفيف */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* نافذة البوب أب */}
      <div className="relative w-full max-w-2xl bg-[#137FEC5C] rounded-[40px] shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-300">
        
        {/* زر الإغلاق X */}
        <button 
          onClick={onClose} 
          className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors z-10"
        >
          <MdClose size={32} />
        </button>

        <div className="p-8 md:p-12">
          {/* عنوان البوب أب بجهة اليمين */}
          <h2 className="text-3xl font-black text-white text-right mb-10">إلغاء الطلب</h2>

          <div className="space-y-6">
            
            {/* حقل سبب الإلغاء */}
            <div className="text-right">
              <label className={labelStyle}>سبب إلغاء الطلب</label>
              <textarea
                placeholder="اكتب سبب الإلغاء هنا..."
                className={textareaStyle}
                dir="rtl"
              />
            </div>

            {/* زر الإلغاء النهائي (أحمر) في المنتصف */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                className="bg-[#EF444433] text-[#EF4444] px-16 py-4 rounded-2xl font-black text-xl border border-[#EF444455] hover:bg-[#EF4444] hover:text-white transition-all active:scale-95 shadow-lg shadow-red-900/20"
                onClick={() => {
                  alert("تم إلغاء الطلب بنجاح");
                  onClose();
                }}
              >
                الغاء الطلب الان
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;