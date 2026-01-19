import Header from "../../components/Customer/customer_header";
import Sidebar from "../../components/Customer/customer_sidebar";

const Dashboard = () => {
    return (
        <div className="flex min-h-screen dark:bg-primary_BGD" dir="rtl">
            {/* 1. استدعاء السايد بار مباشرة بدون div مقيد */}
            {/* هو سيتولى مسألة الاختفاء في الموبايل والظهور في الديسكتوب داخلياً */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* 2. الهيدر */}
                <Header />

                {/* 3. المحتوى الرئيسي مع مراعاة الهوامش للموبايل */}
                <main className="p-4 md:p-8 space-y-6 md:space-y-8 mt-12 lg:mt-0">
                    
                    {/* Welcome Text */}
                    <div className="text-right">
                        <h2 className="text-xl md:text-2xl font-bold dark:text-white">أهلاً بعودتك يا جون!</h2>
                        <p className="text-gray-400 text-xs md:text-sm">إليك نظرة عامة سريعة على حالة سيارتك.</p>
                    </div>

                    {/* Grid System */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* المحتوى الأيمن (الرئيسي): السيارة والمواعيد */}
                        <div className="col-span-1 lg:col-span-8 space-y-6">
                            
                            {/* كارت السيارة - متجاوب */}
                            <div className="bg-[#137FEC1A] dark:bg-[#137FEC33] rounded-[25px] md:rounded-[30px] p-6 flex flex-col md:flex-row items-center justify-between border border-blue-50/10 gap-6">
                                <div className="space-y-4 text-center md:text-right w-full md:w-auto">
                                    <h3 className="text-lg md:text-xl font-bold italic dark:text-white">2022 Toyota RAV4</h3>
                                    <p className="text-[10px] text-gray-500 break-all md:break-normal">JTMRDMBA0N0000000 :رقم تعريف المركبة</p>
                                    <button className="bg-[#137FEC] text-white w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                                        <span>تبديل المركبة</span> ⇅
                                    </button>
                                </div>
                                <img src="/car_rav4.png" className="h-32 md:h-48 object-contain" alt="Car" />
                            </div>

                            {/* الصيانة القادمة */}
                            <div className="bg-[#137FEC1A] dark:bg-[#137FEC33] rounded-[25px] md:rounded-[30px] p-6 md:p-8 shadow-sm">
                                <h4 className="text-[#137FEC] font-bold border-b-2 border-[#137FEC] inline-block mb-6">الصيانة القادمة</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                    {/* كارت صيانة 1 */}
                                    <div className="bg-[#93C5FD] dark:bg-[#0F132380] p-4 rounded-2xl flex items-center gap-4 text-white">
                                        <div className="bg-[#137FEC] p-3 rounded-full text-lg shrink-0">🛢️</div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm md:text-base">تغيير الزيت</p>
                                            <p className="text-[10px] opacity-80">15 ديسمبر 2023</p>
                                        </div>
                                    </div>
                                    {/* كارت صيانة 2 */}
                                    <div className="bg-[#93C5FD] dark:bg-[#0F132380] p-4 rounded-2xl flex items-center gap-4 text-white">
                                        <div className="bg-[#137FEC] p-3 rounded-full text-lg shrink-0">🛞</div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm md:text-base">دوران الإطارات</p>
                                            <p className="text-[10px] opacity-80">15 ديسمبر 2023</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* المحتوى الأيسر (الجانبي): ميكانيكي والتاريخ */}
                        <div className="col-span-1 lg:col-span-4 space-y-6">
                            
                            {/* العثور على ميكانيكي */}
                            <div className="bg-[#137FECE5] dark:bg-[#137FEC33] rounded-[25px] md:rounded-[30px] p-6 text-white">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold">العثور على ميكانيكي</h4>
                                    <button className="text-[10px] underline opacity-80">عرض الكل</button>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="bg-white/10 p-3 rounded-2xl flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-full shrink-0"></div>
                                            <div className="text-right flex-1 min-w-0">
                                                <p className="text-xs font-bold truncate">خبراء العناية بالسيارات</p>
                                                <p className="text-[10px] text-yellow-400">★ 4.9</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* تاريخ الخدمة */}
                            <div className="bg-[#137FEC1A] dark:bg-[#137FEC33] rounded-[25px] md:rounded-[30px] p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-gray-700 dark:text-white">تاريخ الخدمة</h4>
                                    <button className="text-[10px] text-[#137FEC] underline">عرض الكل</button>
                                </div>
                                <div className="space-y-2">
                                    {["استبدال وسادة الفرامل", "تغيير الزيت والفلتر"].map((item, i) => (
                                        <div key={i} className="p-3 flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                            <p className="text-xs font-bold text-gray-700 dark:text-white">{item}</p>
                                            <span className="text-[9px] text-gray-400">25 أكتوبر 2023 - 250$</span>
                                        </div> 
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;