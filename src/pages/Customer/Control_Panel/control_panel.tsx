import Header from "../../../components/Customer/customer_header";
import Sidebar from "../../../components/Customer/customer_sidebar";

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
                                    {[
                                        { name: "خبراء العناية بالسيارات", rating: "4.9", img: "/mechanic1.png" },
                                        { name: "لحن الدقة للمحركات", rating: "4.7", img: "/mechanic2.png" }
                                    ].map((mechanic, i) => (
                                        <div key={i} className="bg-white/10 p-3 rounded-2xl flex items-center gap-4 transition-hover hover:bg-white/20">
                                            {/* حاوية الصورة */}
                                            <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-white/30 shadow-sm">
                                                <img
                                                    src={mechanic.img}
                                                    alt={mechanic.name}
                                                    className="w-full h-full object-cover"
                                                    // هذا السطر يضمن ظهور خلفية بسيطة لو الصورة ممسوحة
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/150" }}
                                                />
                                            </div>

                                            {/* البيانات الشخصية للميكانيكي */}
                                            <div className="text-right flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate text-white">
                                                    {mechanic.name}
                                                </p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <span className="text-yellow-400 text-xs">★</span>
                                                    <span className="text-[10px] text-white/80 font-medium">
                                                        {mechanic.rating} (120 تقييمًا)
                                                    </span>
                                                </div>
                                            </div>

                                            {/* زر اختياري للمراسلة أو العرض */}
                                            <button className="text-white/50 hover:text-white transition-colors">
                                                ←
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* تاريخ الخدمة */}
                            {/* تاريخ الخدمة */}
                            <div className="bg-[#137FEC1A] dark:bg-[#137FEC33] rounded-[25px] md:rounded-[30px] p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-gray-700 dark:text-white">تاريخ الخدمة</h4>
                                    <button className="text-[10px] text-[#137FEC] underline">عرض الكل</button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { name: "استبدال وسادة الفرامل", icon: "/brake-icon.png" }, // ضع مسار صورك هنا
                                        { name: "تغيير الزيت والفلتر", icon: "/oil-icon.png" },
                                        { name: "استبدال فلتر الهواء", icon: "/air-filter-icon.png" }
                                    ].map((service, i) => (
                                        <div key={i} className="bg-[#0F132312] rounded-xl flex items-center gap-3 p-2 border-b border-gray-100 dark:border-gray-800 last:border-0">

                                            {/* مربع الصورة/الأيقونة */}
                                            <div className="w-12 h-12 shrink-0  rounded-xl flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={service.icon}
                                                    alt={service.name}
                                                    className="w-8 h-8 object-contain"
                                                    // في حال لم تجد الصورة، سيظهر لون الخلفية فقط
                                                    onError={(e) => (e.target as HTMLElement).style.display = 'none'}
                                                />
                                            </div>

                                            {/* النصوص (الاسم وتحته التاريخ) */}
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-[13px] font-bold text-gray-700 dark:text-white">
                                                    {service.name}
                                                </p>
                                                <span className="text-[10px] text-gray-400 italic">
                                                    25 أكتوبر 2023 - 250.00 دولارًا
                                                </span>
                                            </div>
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