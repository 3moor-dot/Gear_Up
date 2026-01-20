import { MdEdit, MdCalendarMonth } from "react-icons/md";

interface StepProgressProps {
    currentStep: number;
    onStepChange: (step: number) => void; // إضافة هذه الخاصية
}

const StepProgress = ({ currentStep, onStepChange }: StepProgressProps) => {
    return (
        <div dir="rtl">
            {/* العنوان المتغير */}
            <div className="mb-10 text-right">
                <h1 className="text-3xl font-black dark:text-white text-gray-800">
                    {currentStep === 1 ? "طلب صيانة" : "حجز صيانة"}
                </h1>
                <p className="text-gray-400 text-sm mt-2 font-bold">
                    قم بإنشاء ومتابعة طلبات الصيانة لسيارتك بسهولة
                </p>
            </div>

            {/* مؤشر الخطوات */}
            <div className="flex items-center justify-between gap-4 md:gap-8 mb-10">
                
                {/* الخطوة 1 */}
                <div 
                    onClick={() => onStepChange(1)} // التغيير هنا
                    className={`flex items-center gap-3 p-4 rounded-2xl w-56 h-24 transition-all cursor-pointer ${currentStep === 1 ? 'bg-[#137FEC] text-white shadow-lg shadow-blue-500/30' : 'bg-[#2D3342] text-gray-400 hover:bg-[#363d4e]'}`}
                >
                    <div className={`p-2 rounded-lg ${currentStep === 1 ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-400'}`}>
                        <MdEdit size={24} />
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold">الخطوة 1</p>
                        <p className="text-xs opacity-80 mt-1">تفاصيل الخدمة</p>
                    </div>
                </div>

                {/* الخطوة 2 */}
                <div 
                    onClick={() => onStepChange(2)} // التغيير هنا
                    className={`flex items-center gap-3 p-4 rounded-2xl w-56 h-24 transition-all cursor-pointer ${currentStep === 2 ? 'bg-[#137FEC] text-white shadow-lg shadow-blue-500/30' : 'bg-[#2D3342] text-gray-400 hover:bg-[#363d4e]'}`}
                >
                    <div className={`p-2 rounded-lg ${currentStep === 2 ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-400'}`}>
                        <MdCalendarMonth size={24} />
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold">الخطوة 2</p>
                        <p className="text-xs opacity-80 mt-1">جدول</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepProgress;