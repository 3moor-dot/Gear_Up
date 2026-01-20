import { MdStar } from "react-icons/md";

const MechanicSelection = () => {
    const mechanics = [
        { id: 1, name: "كراج مايك الأوروبي", rate: 4.9, reviews: 142, price: "180 EGP - 220 EGP", image: "/img1.png", tags: ["الفرامل", "تعليق", "سيارات أوروبية"] },
        { id: 2, name: "كراج مايك الأوروبي", rate: 4.9, reviews: 142, price: "180 EGP - 220 EGP", image: "/img2.png", tags: ["الفرامل", "تعليق", "سيارات أوروبية"] },
        { id: 3, name: "كراج مايك الأوروبي", rate: 4.9, reviews: 142, price: "180 EGP - 220 EGP", image: "/img3.png", tags: ["الفرامل", "تعليق", "سيارات أوروبية"] },
        { id: 4, name: "كراج مايك الأوروبي", rate: 4.9, reviews: 142, price: "180 EGP - 220 EGP", image: "/img4.png", tags: ["الفرامل", "تعليق", "سيارات أوروبية"] },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir="rtl">
            {/* القائمة الجانبية للفلاتر */}
            <div className="lg:col-span-3 space-y-6 text-right">
                <div className="flex justify-between items-center">
                    <h3 className="text-gray-400 font-bold">فرز حسب</h3>
                    <button className="text-blue-500 text-sm font-bold">إعادة ضبط</button>
                </div>
                <div className="space-y-4">
                    {["موصى به", "أدنى سعر", "الأعلى تقييماً"].map((filter) => (
                        <label key={filter} className="flex items-center justify-start gap-3 cursor-pointer group">
                            <input type="radio" name="sort" className="w-5 h-5 accent-blue-500" />
                            <span className="text-gray-700 dark:text-white font-bold">{filter}</span>
                        </label>
                    ))}
                </div>
                <h3 className="text-gray-400 font-bold pt-4 border-t border-gray-200">التوفر</h3>
                <div className="space-y-4">
                    {["اليوم", "آخر الاسبوع"].map((time) => (
                        <label key={time} className="flex items-center justify-start gap-3 cursor-pointer group">
                            <input type="radio" name="availability" className="w-5 h-5 accent-blue-500" />
                            <span className="text-gray-700 dark:text-white font-bold">{time}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* قائمة الميكانيكيين */}
            <div className="lg:col-span-9 space-y-4">
                <h2 className="text-right font-black text-xl mb-4 dark:text-white">وجدنا 12 ميكانيكيًا بالقرب منك</h2>
                {mechanics.map((mech) => (
                    <div key={mech.id} className="bg-[#D6E9FF] dark:bg-[#137FEC1A] rounded-[30px] p-4 flex flex-col md:flex-row gap-6 items-center border border-blue-100 dark:border-blue-900/30 shadow-sm">
                        <img src={mech.image} className="w-full md:w-48 h-32 rounded-2xl object-cover" alt="workshop" />
                        <div className="flex-1 text-right space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-black text-blue-600 dark:text-blue-400">{mech.name}</h3>
                                <span className="text-gray-500 font-bold">{mech.price}</span>
                            </div>
                            <div className="flex justify-end items-center gap-1 text-yellow-500">
                                <span className="text-gray-400 text-xs">({mech.reviews} تقييماً)</span>
                                <span className="font-bold">{mech.rate}</span>
                                <MdStar size={18} />
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">متخصصون في سيارات أودي وفولكس فاجن. فنيون معتمدون بخبرة تزيد عن 15 عاماً.</p>
                            <div className="flex justify-start gap-2 mt-3">
                                {mech.tags.map(tag => (
                                    <span key={tag} className="bg-black text-white text-[10px] px-3 py-1 rounded-full">{tag}</span>
                                ))}
                            </div>
                            <button className="bg-black text-white w-full md:w-44 py-2 rounded-xl font-bold mt-4 hover:bg-gray-800 transition-colors">
                                اختيار الميكانيكي
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MechanicSelection;