import Header from "../../components/Customer/Customer_Header/customer_header";
import Sidebar from "../../components/Customer/Customer_Sidebar/customer_sidebar";

const Dashboard = () => {
    return (
        <div className="flex min-h-screen dark:bg-primary_BGD" dir="rtl">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8 space-y-8">
                    {/* Welcome Text */}
                    <div className="text-right">
                        <h2 className="text-2xl font-bold dark:text-white">أهلاً بعودتك يا جون!</h2>
                        <p className="text-gray-400 text-sm">إليك نظرة عامة سريعة على حالة سيارتك.</p>
                    </div>

                    <div className="grid grid-cols-12 gap-6">

                        {/* المحتوى الأيمن: السيارة والمواعيد */}
                        <div className="col-span-8 space-y-6">
                            {/* كارت السيارة */}
                            <div className="bg-[#137FEC1A] dark:bg-[#137FEC33] rounded-[30px] p-6 flex items-center justify-between border border-blue-50">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold italic dark:text-white">2022 Toyota RAV4</h3>
                                    <p className="text-[10px] text-gray-500">JTMRDMBA0N0000000 :رقم تعريف المركبة</p>
                                    <button className="bg-[#137FEC] text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                        <span>تبديل المركبة</span> ⇅
                                    </button>
                                </div>
                                <img src="/car_rav4.png" className=" h-48 object-contain" alt="Car" />
                            </div>

                            {/* الصيانة القادمة */}
                            <div className="bg-[#137FEC1A] dark:bg-[#137FEC33] rounded-[30px] p-8 shadow-sm">
                                <h4 className="text-[#137FEC] font-bold border-b-2 border-[#137FEC] inline-block mb-6">الصيانة القادمة</h4>
                                <div className="space-y-4">
                                    <div className="bg-[#93C5FD] dark:bg-[#0F132380] p-5 rounded-2xl flex justify-start items-center gap-4 text-white">
                                        {/* الأيقونة ستكون على اليمين */}
                                        <div className="bg-[#137FEC] dark:bg-[#0F132380] p-3 rounded-full text-xl flex items-center justify-center">
                                            🛢️
                                        </div>

                                        {/* النصوص ستكون بجانبها مباشرة */}
                                        <div className="text-right">
                                            <p className="font-bold text-lg">تغيير الزيت</p>
                                            <p className="text-[10px] opacity-80">موعد التسليم: 15 ديسمبر 2023</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#93C5FD] dark:bg-[#0F132380] p-5 rounded-2xl flex justify-start items-center gap-4 text-white">
                                        <div className="bg-[#137FEC] dark:bg-[#0F132380] p-3 rounded-full text-xl">🛞</div>
                                        <div className="text-right">
                                            <p className="font-bold">دوران الإطارات</p>
                                            <p className="text-[10px] opacity-80">موعد التسليم: 15 ديسمبر 2023</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* المحتوى الأيسر: ميكانيكي وتاريخ الخدمة */}
                        <div className="col-span-4 space-y-6">
                            {/* العثور على ميكانيكي */}
                            <div className="bg-[#137FECE5] dark:bg-[#137FEC33] rounded-[30px] p-6 text-white">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold">العثور على ميكانيكي</h4>
                                    <button className="text-[10px] underline opacity-80 dark:text-[#137FEC]">عرض الكل</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-3 rounded-2xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full"></div>
                                        <div className="text-right flex-1">
                                            <p className="text-xs font-bold">خبراء العناية بالسيارات</p>
                                            <p className="text-[10px] text-yellow-400">★ 4.9 (120 تقييمًا)</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-2xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full"></div>
                                        <div className="text-right flex-1">
                                            <p className="text-xs font-bold">لحن الدقة</p>
                                            <p className="text-[10px] text-yellow-400">★ 3.9 (100 تقييمًا)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* تاريخ الخدمة */}
                            <div className="bg-[#137FEC1A] dark:bg-[#137FEC33] rounded-[30px] p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-gray-700 dark:text-white">تاريخ الخدمة</h4>
                                    <button className="text-[10px] text-[#137FEC] underline">عرض الكل</button>
                                </div>
                                <div className="space-y-4">
                                    {["استبدال وسادة الفرامل", "تغيير الزيت والفلتر", "استبدال فلتر الهواء"].map((item, i) => (
                                        <div key={i} className="p-3 rounded-xl flex flex-col justify-center items-start gap-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                            {/* اسم الخدمة في الأعلى */}
                                            <p className="text-[13px] font-bold text-gray-700 dark:text-white">
                                                {item}
                                            </p>

                                            {/* التاريخ والمبلغ في الأسفل مباشرة */}
                                            <span className="text-[10px] text-gray-400 italic">
                                                25 أكتوبر 2023 - 250.00 دولارًا
                                            </span>
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