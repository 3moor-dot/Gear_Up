import Sidebar from "../../components/Customer/customer_sidebar";
import Header from "../../components/Customer/customer_header";
import { MdSearch, MdFilterList, MdFileDownload, MdTrendingUp, MdEvent, MdAccessTime } from "react-icons/md";

const ServiceHistory = () => {
  // بيانات الجدول التجريبية
  const historyData = Array(9).fill({
    date: "Oct 26, 2:00 PM",
    type: "Oil Change",
    mechanic: "Alice Martin",
    notes: "تم استبدال وسادات الفرامل...",
    cost: "250 EGP"
  });

  return (
    <div className="flex min-h-screen dark:bg-primary_BGD" dir="rtl">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-4 md:p-8 space-y-6">
          {/* العنوان واختيار السيارة */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-right">
              <h2 className="text-2xl font-bold dark:text-white text-gray-800">تاريخ الخدمة</h2>
              <p className="text-gray-400 text-sm">تتبع أعمال الصيانة والإصلاحات الخاصة بسيارتك <span className="text-blue-500 font-bold">تويوتا RAV4 موديل 2022.</span></p>
            </div>
            <div className="bg-[#137FEC] text-white px-4 py-2 rounded-lg flex items-center gap-3 text-sm shadow-md">
               <span className="bg-white/20 p-1 rounded">🚗</span>
               <span>2022 Toyota RAV4</span>
               <span className="text-xs">▼</span>
            </div>
          </div>

          {/* بطاقات الملخص الإحصائي */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* إجمالي الإنفاق */}
            <div className="bg-[#137FEC1A] dark:bg-[#137FEC0D] p-6 rounded-[25px] shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-gray-400 font-bold">إجمالي الإنفاق (منذ بداية العام)</span>
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg text-xl"><MdTrendingUp /></div>
               </div>
               <div className="text-right">
                  <h3 className="text-2xl font-black dark:text-white">1,245.00 EGP</h3>
                  <p className="text-green-500 text-[10px] mt-1 font-bold">↑ 12% مقارنة بالعام الماضي</p>
               </div>
            </div>

            {/* الخدمة الأخيرة */}
            <div className="bg-[#137FEC1A] dark:bg-[#137FEC0D] p-6 rounded-[25px] shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-gray-400 font-bold">الخدمة الأخيرة</span>
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg text-xl"><MdEvent /></div>
               </div>
               <div className="text-right">
                  <h3 className="text-2xl font-black dark:text-white">25 أكتوبر 2023</h3>
                  <p className="text-gray-400 text-[10px] mt-1 font-bold">استبدال وسادة الفرامل</p>
               </div>
            </div>

            {/* القادمة */}
            <div className="bg-[#137FEC1A] dark:bg-[#137FEC0D] p-6 rounded-[25px] shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-gray-400 font-bold">القادمة</span>
                  <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg text-xl"><MdAccessTime /></div>
               </div>
               <div className="text-right">
                  <h3 className="text-2xl font-black dark:text-white">تغيير الزيت</h3>
                  <p className="text-yellow-500 text-[10px] mt-1 font-bold">الموعد سوف يكون غداً</p>
               </div>
            </div>
          </div>

          {/* أدوات البحث والفلترة */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="سجل البحث..." 
                  className="w-full bg-white dark:bg-[#137FEC0D] border border-gray-200 dark:border-gray-800 rounded-xl py-2 px-10 text-right text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <MdSearch className="absolute right-3 top-2.5 text-gray-400 text-xl" />
             </div>
             <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#137FEC] text-white px-6 py-2 rounded-xl text-sm font-bold">
                   <MdFilterList /> فلتر
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-[#137FEC] text-[#137FEC] px-6 py-2 rounded-xl text-sm font-bold">
                   <MdFileDownload /> يصدر
                </button>
             </div>
          </div>

          {/* جدول الخدمة */}
          <div className="bg-white dark:bg-[#137FEC0D] rounded-[30px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                   <thead>
                      <tr className="bg-[#137FEC1A] dark:bg-white/5 dark:text-white text-black font-bold">
                         <th className="p-4">تاريخ الخدمة</th>
                         <th className="p-4">نوع الخدمة</th>
                         <th className="p-4">ميكانيكي</th>
                         <th className="p-4">ملحوظات</th>
                         <th className="p-4">التكلفة</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {historyData.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                           <td className="p-4 font-bold dark:text-white">{row.date}</td>
                           <td className="p-4 text-gray-500">{row.type}</td>
                           <td className="p-4 text-gray-500">{row.mechanic}</td>
                           <td className="p-4 text-gray-500">{row.notes}</td>
                           <td className="p-4 font-black dark:text-white">{row.cost}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServiceHistory;