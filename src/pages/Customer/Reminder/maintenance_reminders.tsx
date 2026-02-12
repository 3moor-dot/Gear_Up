import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import CreateReminderModal from "./create_reminder_modal";
import { MdAdd, MdPhone, MdMap, MdCheckCircle } from "react-icons/md";
import { useState } from "react";

const MaintenanceReminders = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="flex min-h-screen dark:bg-primary_BGD bg-[#F8FAFC]" dir="rtl">
            {/* استدعاء السايد بار */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* استدعاء الهيدر */}
                <Header />

                <main className="p-4 md:p-8 space-y-6">
                    {/* رأس الصفحة */}
                    <div className="flex justify-between items-start">
                        <div className="text-right">
                            <h2 className="text-2xl font-bold dark:text-white text-gray-800">تذكيرات الصيانة</h2>
                            <p className="text-gray-400 text-sm">إدارة المهام القادمة وعرض سجل سيارتك.</p>
                        </div>
                        {/* زر اختيار السيارة */}
                        <div className="bg-[#137FEC] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-md">
                            <span>2022 Toyota RAV4</span>
                            <span className="text-xs">▼</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* القسم الأيمن: المهام والتذكيرات */}
                        <div className="col-span-1 lg:col-span-8 space-y-6">

                            {/* تبويبات الفلترة وزر الإنشاء */}
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    {["الجميع", "تأخرت", "القادمة"].map((tab, i) => (
                                        <button key={i} className={`px-6 py-2 rounded-full text-sm font-bold ${i === 0 ? 'bg-[#137FEC] text-white' : 'text-gray-400 border border-transparent hover:border-gray-200'}`}>
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#137FEC] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-100 transition-transform active:scale-95"
                                >
                                    <MdAdd size={20} /> إنشاء تذكير
                                </button>
                            </div>

                            {/* بطاقة "مطلوب الانتباه" (تغيير سائل الفرامل) */}
                            <div className="relative border-2 border-red-400 bg-white dark:bg-[#137FEC0D] rounded-[25px] p-6 shadow-sm overflow-hidden">
                                <div className="absolute top-0 right-0 bg-red-400 text-white text-[10px] px-4 py-1 rounded-bl-xl font-bold italic">
                                    ⚠️ مطلوب الانتباه
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/50 shadow-sm shrink-0">
                                            <img
                                                src="/red-car.png" // ضع مسار صورتك هنا
                                                alt="تنبيه صيانة"
                                                className="w-10 h-10 object-contain"
                                                // object-contain يضمن عدم قص أطراف الصورة
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                            />
                                        </div>
                                        <div className="text-right">
                                            <h3 className="font-bold text-lg dark:text-white">تغيير سائل الفرامل</h3>
                                            <p className="text-xs text-gray-400">يوصى بإجراء الصيانة كل سنتين أو 30,000 ميل.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold">اتمام العملية</button>
                                        <button className="bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-lg text-xs font-bold">حدد موعداً آخر</button>
                                    </div>
                                </div>
                            </div>

                            {/* المهام القادمة */}
                            <div className="bg-[#E5F1FD] dark:bg-[#137FEC1A] rounded-[30px] p-6 space-y-4">
                                <h4 className="font-bold text-[#137FEC] mb-4">المهام القادمة</h4>
                                {[
                                    { title: "تغيير الزيت", date: "12 نوفمبر", icon: "🛢️", color: "bg-blue-500" },
                                    { title: "دوران الإطارات", date: "12 نوفمبر", icon: "🛞", color: "bg-orange-400" },
                                    { title: "التفتيش الحكومي", date: "12 نوفمبر", icon: "🚗", color: "bg-red-400" },
                                ].map((task, i) => (
                                    <div key={i} className="bg-[#93C5FD] dark:bg-[#0F132380] p-4 rounded-2xl flex justify-between items-center text-white group cursor-pointer hover:scale-[1.01] transition-transform">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${task.color} rounded-full flex items-center justify-center text-xl shadow-inner`}>
                                                {task.icon}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{task.title}</p>
                                                <p className="text-[10px] opacity-80">التاريخ المتوقع: {task.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MdCheckCircle className="text-white/40 text-2xl group-hover:text-white" />
                                            <div className="text-[10px] bg-[#137FEC] px-3 py-1 rounded-lg">حدد موعداً آخر</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* القسم الأيسر: تاريخ مكتمل وميكانيكي */}
                        <div className="col-span-1 lg:col-span-4 space-y-6">

                            {/* تاريخ مكتمل */}
                            <div className="bg-[#137FEC1A] dark:bg-[#137FEC0D] rounded-[30px] p-6 shadow-sm border border-gray-50 dark:border-gray-800">
                                <h4 className="font-bold text-gray-800 dark:text-white mb-6">تاريخ مكتمل</h4>
                                <div className="space-y-6">
                                    {[
                                        { name: "استبدال فلتر الهواء", date: "20 أكتوبر 2023" },
                                        { name: "شفرات المساحات", date: "20 أكتوبر 2023" },
                                        { name: "تغيير الزيت", date: "20 أكتوبر 2023" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-start gap-4 items-center">
                                            <div className="text-green-500 text-2xl"><MdCheckCircle /></div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold dark:text-white">{item.name}</p>
                                                <p className="text-[10px] text-gray-400">{item.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* تذكيرات مخصصة */}
                            <div className="bg-[#137FEC] rounded-[30px] p-6 text-white relative overflow-hidden text-center space-y-4">
                                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-3xl">
                                    <MdAdd />
                                </div>
                                <h4 className="font-bold">تذكيرات مخصصة</h4>
                                <p className="text-[10px] opacity-80">لا تنس الأمور الصغيرة. اضبط تذكيرات دورية لتجديد التأمين، وغسيل السيارة، أو التسجيل.</p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-white text-[#137FEC] w-full py-2 rounded-xl font-bold text-sm shadow-inner"
                                >
                                    إنشاء تذكير جديد
                                </button>
                            </div>

                            {/* ميكانيكي */}
                            <div className="bg-[#E5F1FD] dark:bg-[#137FEC1A] rounded-[30px] p-6">
                                <h4 className="font-bold text-gray-700 dark:text-white mb-4">ميكانيكي</h4>
                                <div className="space-y-4">
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-16 bg-white rounded-full mx-auto overflow-hidden">
                                            <img src="/mechanic1.png" alt="logo" />
                                        </div>
                                        <p className="font-bold text-sm dark:text-white">خبراء العناية بالسيارات</p>
                                        <p className="text-yellow-500 text-xs">★ 4.9 (120 تقييماً)</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="bg-[#22C55E] text-white p-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold">
                                            <MdPhone /> يتصل
                                        </button>
                                        <button className="bg-[#3B82F6] text-white p-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold">
                                            <MdMap /> خريطة
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
            <CreateReminderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default MaintenanceReminders;