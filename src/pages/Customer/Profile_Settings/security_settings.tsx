import { MdSave } from "react-icons/md";

const SecuritySettings = ({ inputStyle }: { inputStyle: string }) => {
    return (
        <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl animate-in fade-in slide-in-from-right-4 duration-500">
            {/* العنوان */}
            <h2 className="text-[#137FEC] text-2xl font-black mb-8 text-right border-b pb-4 dark:border-gray-700">كلمة المرور</h2>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* حقل كلمة المرور الحالية */}
                <div className="space-y-2">
                    <label className="block text-right text-sm font-bold text-gray-500 mr-2">كلمة المرور الحالية</label>
                    <input
                        type="password"
                        placeholder="كلمة المرور الحالية"
                        className={inputStyle}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">

                    {/* حقل كلمة المرور الجديدة - يأخذ مساحة كاملة أو نصف مساحة حسب التصميم */}
                    <div className="space-y-2">
                        <label className="block text-right text-sm font-bold text-gray-500 mr-2">كلمة المرور الجديدة</label>
                        <input
                            type="password"
                            placeholder="كلمة المرور الجديدة"
                            className={inputStyle}
                        />
                    </div>
                    {/* حقل تأكيد كلمة المرور الجديدة - يظهر في اليمين (أو تحت في الموبايل) */}
                    <div className="md:col-start-2space-y-2">
                        <label className="block text-right text-sm font-bold text-gray-500 mr-2">تأكيد كلمة المرور الجديدة</label>
                        <input
                            type="password"
                            placeholder="تأكيد كلمة المرور الجديدة"
                            className={inputStyle}
                        />
                    </div>

                </div>
                
                {/* زر حفظ التغييرات */}
                <div className="flex justify-center pt-10">
                    <button className="bg-[#137FEC] text-white px-20 py-4 rounded-2xl font-black text-xl shadow-xl shadow-blue-500/30 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                        <MdSave size={24} /> حفظ التغيرات
                    </button>
                </div>
            </div>

            {/* ملاحظة أمنية إضافية (اختياري لتعزيز الشكل) */}
            <div className="mt-12 p-4 bg-blue-50 dark:bg-[#137FEC0D] rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                    * تأكد من اختيار كلمة مرور قوية تحتوي على رموز وأرقام لحماية حسابك بشكل أفضل.
                </p>
            </div>
        </div>
    );
};

export default SecuritySettings;