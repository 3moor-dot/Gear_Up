import { MdClose, MdSave, MdEventNote } from "react-icons/md";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const CreateReminderModal = ({ isOpen, onClose }: Props) => {
    if (!isOpen) return null;

    const inputStyle = "w-full  dark:bg-[#1A233A] dark:text-white border border-gray-700 rounded-xl p-3 text-right outline-none focus:border-[#137FEC] transition-all placeholder-gray-500";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
            <div className=" bg-[#E5F1FD] dark:bg-primary_BGD w-full max-w-2xl rounded-[30px] shadow-2xl border border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-300">
                
                {/* الرأس */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#137FEC0D]">
                    <div className="text-right">
                        <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                            <MdEventNote className="text-black dark:text-[#137FEC]" /> تذكير جديد بالصيانة
                        </h2>
                        <p className="text-gray-400 text-xs mt-1">قم بإعداد تنبيه مخصص لحالة سيارتك.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <MdClose size={28} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* اختر مركبة */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold dark:text-gray-300 block">اختر مركبة</label>
                            <select className={inputStyle}>
                                <option>2021 Tesla Model 3</option>
                                <option>2022 Toyota RAV4</option>
                            </select>
                        </div>

                        {/* عنوان التذكير */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold dark:text-gray-300 block">عنوان التذكير</label>
                            <input type="text" placeholder="على سبيل المثال: تغيير الزيت..." className={inputStyle} />
                        </div>
                    </div>

                    {/* خيارات التكرار والتاريخ */}
                    <div className="bg-[#137FEC0D] p-5 rounded-2xl border border-[#137FEC33] space-y-4">
                        <label className="text-sm font-bold text-[#137FEC] block mb-2">تاريخ التذكير</label>
                        
                        <div className="space-y-3">
                            {[
                                { id: "once", label: "لمرة واحدة فقط" },
                                { id: "repeat", label: "يتكرر" },
                                { id: "period", label: "يتكرر لفترة محددة", checked: true }
                            ].map((option) => (
                                <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="radio" name="repeat" defaultChecked={option.checked} className="w-4 h-4 accent-[#137FEC]" />
                                    <span className="dark:text-gray-300 text-sm group-hover:text-blue-500 transition-colors">{option.label}</span>
                                </label>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <input type="date" defaultValue="2025-02-20" className={inputStyle} />
                            <input type="time" defaultValue="00:00" className={inputStyle} />
                        </div>
                    </div>

                    {/* ملاحظات إضافية */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold dark:text-gray-300 block">ملاحظات إضافية</label>
                        <textarea 
                            rows={3} 
                            placeholder="أضف أي تفاصيل محددة أو أرقام قطع غيار..." 
                            className={`${inputStyle} resize-none`}
                        ></textarea>
                    </div>
                </div>

                {/* الأزرار السفلية */}
                <div className="p-6 border-t border-gray-800 flex justify-center gap-4 dark:bg-primary_BGD">
                    <button onClick={onClose} className="px-8 py-2.5 rounded-xl font-bold text-gray-400 hover:bg-gray-800 transition-all">إلغاء</button>
                    <button className="bg-[#137FEC] text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
                        <MdSave size={20} /> حفظ التذكير
                    </button>
                </div>
            </div>
        </div>
    );
};
export default CreateReminderModal;