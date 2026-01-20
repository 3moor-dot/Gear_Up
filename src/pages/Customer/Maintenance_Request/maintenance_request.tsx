import { useState } from "react";
import { MdCalendarMonth, MdAccessTime, MdImage, MdCheckCircle, MdLocationOn, MdClose } from "react-icons/md";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import StepProgress from "./step_progress";
import MechanicSelection from "./mechanic_selection";

const MaintenanceRequest = () => {
    // حالة للتحكم في الخطوة الحالية (1 أو 2)
    const [currentStep, setCurrentStep] = useState(1);

    const [serviceType, setServiceType] = useState("التشخيص");
    const [location, setLocation] = useState("في الورشة");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const inputStyle = "w-full bg-[#137FEC1A] dark:bg-[#137FEC33] border border-blue-500/20 rounded-xl p-4 text-right outline-none text-blue-500 font-bold focus:border-blue-500 transition-all";
    const sectionTitleStyle = "text-lg font-bold mb-4 dark:text-white text-gray-800 text-right";

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setSelectedImage(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
    };

    return (
        <div className="flex min-h-screen dark:bg-primary_BGD bg-gray-50" dir="rtl">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="p-4 md:p-8 mt-12 lg:mt-0 max-w-5xl mx-auto w-full pb-20 text-right">

                    {/* المكون العلوي يظهر في كل الخطوات ويغير العنوان تلقائياً */}
                    <StepProgress
                        currentStep={currentStep}
                        onStepChange={(step) => setCurrentStep(step)}
                    />

                    {/* عرض المحتوى بناءً على رقم الخطوة */}
                    {currentStep === 1 ? (
                        <div className="space-y-12 animate-in fade-in duration-500">
                            {/* --- قسم اختيار المركبة --- */}
                            <section>
                                <h3 className={sectionTitleStyle}>اختر مركبة</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <VehicleCard name="تسلا موديل 3" details="XYZ 1234 • 2022" selected={true} />
                                    <VehicleCard name="فورد إف-150" details="ABC 5678 • 2019" selected={false} />
                                </div>
                            </section>

                            {/* --- قسم نوع الخدمة --- */}
                            <section>
                                <h3 className={sectionTitleStyle}>نوع الخدمة</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ServiceTypeCard title="خدمة طارئة" desc="تتطلب تدخل سريع" selected={true} />
                                    <ServiceTypeCard title="خدمة مجدولة" desc="في وقت محدد مسبقاً" selected={false} />
                                </div>
                            </section>

                            {/* --- قسم التاريخ والوقت المفضّل --- */}
                            <section>
                                <h3 className={sectionTitleStyle}>التوقيت المفضل</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="block text-right text-xs text-gray-500 mb-2 mr-1">التاريخ المفضل</label>
                                        <input type="date" className={inputStyle} dir="rtl" />
                                        <MdCalendarMonth className="absolute left-4 bottom-4 text-blue-400" size={24} />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-right text-xs text-gray-500 mb-2 mr-1">الوقت المفضل</label>
                                        <input type="time" className={inputStyle} dir="rtl" />
                                        <MdAccessTime className="absolute left-4 bottom-4 text-blue-400" size={24} />
                                    </div>
                                </div>
                            </section>

                            {/* --- قسم وصف المشكلة --- */}
                            <section>
                                <h3 className={sectionTitleStyle}>المشكلة</h3>
                                <textarea
                                    placeholder="صف المشكلة التي تواجهها..."
                                    className="w-full bg-[#137FEC1A] dark:bg-[#137FEC33] border border-blue-500/20 rounded-2xl p-6 text-right outline-none min-h-[120px] dark:text-white"
                                />

                                <div className="flex flex-col items-end mt-4 gap-4">
                                    <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    <label htmlFor="imageUpload" className="bg-[#137FEC] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold cursor-pointer shadow-md">
                                        <MdImage size={24} /> تحميل صورة المشكلة
                                    </label>

                                    {selectedImage && (
                                        <div className="relative group">
                                            <div style={{ width: '116px', height: '65px' }} className="rounded-xl overflow-hidden border-2 border-[#137FEC]">
                                                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <button onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                                                <MdClose size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* --- قسم الخدمات المطلوبة --- */}
                            <section>
                                <h3 className={sectionTitleStyle}>الخدمة المطلوبة</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <ServiceIconCard title="تغيير الزيت" icon="🛢️" active={serviceType === "تغيير الزيت"} onClick={() => setServiceType("تغيير الزيت")} />
                                    <ServiceIconCard title="إصلاح الجسم" icon="🔨" active={serviceType === "إصلاح الجسم"} onClick={() => setServiceType("إصلاح الجسم")} />
                                    <ServiceIconCard title="الإطارات" icon="🛞" active={serviceType === "الإطارات"} onClick={() => setServiceType("الإطارات")} />
                                    <ServiceIconCard title="التشخيص" icon="🛠️" active={serviceType === "التشخيص"} onClick={() => setServiceType("التشخيص")} />
                                </div>
                            </section>

                            {/* --- قسم موقع الخدمة --- */}
                            <section>
                                <h3 className={sectionTitleStyle}>موقع الخدمة</h3>
                                <div className="flex justify-end gap-2 bg-gray-200 dark:bg-[#1F2937] p-1.5 rounded-2xl w-fit mr-0 ml-auto mb-6">
                                    <button onClick={() => setLocation("في الورشة")} className={`px-10 py-3 rounded-xl font-bold transition-all ${location === "في الورشة" ? 'bg-[#137FEC] text-white' : 'text-gray-500'}`}>في الورشة</button>
                                    <button onClick={() => setLocation("ميكانيكي متنقل")} className={`px-10 py-3 rounded-xl font-bold transition-all ${location === "ميكانيكي متنقل" ? 'bg-[#137FEC] text-white' : 'text-gray-500'}`}>ميكانيكي متنقل</button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                    <div className="lg:col-span-7 space-y-6">
                                        <div className="dark:bg-[#1F2937] bg-white p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                                            <h4 className="font-bold dark:text-white mb-4 flex items-center gap-2">
                                                <MdLocationOn className="text-[#137FEC]" size={22} /> العنوان الحالي
                                            </h4>
                                            <div className="bg-blue-50 dark:bg-[#111827] p-4 rounded-xl text-sm dark:text-gray-300">
                                                456 شارع أوك، سان فرانسيسكو، كاليفورنيا
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-5 rounded-[35px] overflow-hidden h-72 border-4 border-white dark:border-gray-800 shadow-2xl">
                                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1634567890123" className="w-full h-full" style={{ border: 0 }}></iframe>
                                    </div>
                                </div>
                            </section>

                            {/* --- أزرار التحكم --- */}
                            <div className="flex flex-col md:flex-row-reverse justify-between gap-4 pt-10 border-t border-gray-200 dark:border-gray-800">
                                <button onClick={() => setCurrentStep(2)} className="bg-[#137FEC] text-white px-20 py-4 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-600 transition-all">
                                    الخطوة التالية
                                </button>
                                <button className="bg-gray-200 dark:bg-[#1F2937] text-gray-700 dark:text-white px-20 py-4 rounded-2xl font-black text-xl hover:bg-gray-300 transition-all">
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-left duration-500">
                            {/* شاشة الخطوة الثانية (اختيار الميكانيكي) */}
                            <MechanicSelection />

                            <div className="flex justify-between mt-10">
                                <button onClick={() => setCurrentStep(1)} className="bg-gray-700 text-white px-12 py-3 rounded-xl font-bold">رجوع</button>
                                <button className="bg-[#137FEC] text-white px-12 py-3 rounded-xl font-bold">تأكيد الطلب</button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

/* المكونات الفرعية المساعدة */
const VehicleCard = ({ name, details, selected }: any) => (
    <div className={`p-5 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer ${selected ? 'bg-[#137FEC1A] border-[#137FEC]' : 'bg-white dark:bg-[#1F2937] border-transparent shadow-sm'}`}>
        <div className="text-right">
            <p className="font-bold text-sm dark:text-white">{name}</p>
            <p className="text-[10px] text-gray-400 mt-1">{details}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#137FEC] bg-[#137FEC]' : 'border-gray-300'}`}>
            {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
        </div>
    </div>
);

const ServiceTypeCard = ({ title, desc, selected }: any) => (
    <div className={`p-5 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer ${selected ? 'bg-[#137FEC1A] border-[#137FEC]' : 'bg-white dark:bg-[#1F2937] border-transparent shadow-sm'}`}>
        <div className="text-right">
            <p className="font-bold text-sm dark:text-white">{title}</p>
            <p className="text-[10px] text-gray-400 mt-1">{desc}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#137FEC] bg-[#137FEC]' : 'border-gray-300'}`}>
            {selected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
        </div>
    </div>
);

const ServiceIconCard = ({ title, icon, active, onClick }: any) => (
    <div onClick={onClick} className={`p-6 rounded-[30px] flex flex-col items-center gap-4 transition-all cursor-pointer border-2 ${active ? 'bg-white border-[#137FEC] text-[#137FEC]' : 'bg-[#137FEC] text-white border-transparent'}`}>
        <div className="relative text-4xl">
            {icon}
            {active && <MdCheckCircle className="absolute -top-2 -right-5 text-blue-600 bg-white rounded-full" size={20} />}
        </div>
        <p className="font-black text-sm">{title}</p>
    </div>
);

export default MaintenanceRequest;