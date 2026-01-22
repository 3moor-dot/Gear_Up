
import React from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import { useTheme } from "../../../contexts/ThemeContext";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";

import { FaSearch, FaChevronDown, FaEllipsisH, FaStar } from "react-icons/fa";

/* ---------- Types & Mock Data ---------- */
type Review = {
  client: string;
  clientAvatar: string;
  mechanic: string;
  mechanicAvatar: string;
  date: string;
  rating: number;
  comment: string;
};

const mockReviews: Review[] = [
  {
    client: "أحمد محمد",
    clientAvatar: "https://i.pravatar.cc/40?img=1",
    mechanic: "محمد علي",
    mechanicAvatar: "https://i.pravatar.cc/40?img=2",
    date: "2026-01-10",
    rating: 5,
    comment: "خدمة ممتازة جدًا وتعامل راقي، أنصح به بشدة."
  },
  {
    client: "سارة حسن",
    clientAvatar: "https://i.pravatar.cc/40?img=3",
    mechanic: "كريم محمود",
    mechanicAvatar: "https://i.pravatar.cc/40?img=4",
    date: "2026-01-08",
    rating: 4,
    comment: "شغل نظيف بس التأخير كان بسيط."
  },
  {
    client: "يوسف إبراهيم",
    clientAvatar: "https://i.pravatar.cc/40?img=33",
    mechanic: "مصطفى كامل",
    mechanicAvatar: "https://i.pravatar.cc/40?img=17",
    date: "2026-01-15",
    rating: 5,
    comment: "الميكانيكي محترف جدًا وفاهم شغله، السيارة رجعت كأنها جديدة."
  },
  {
    client: "ليلى محمود",
    clientAvatar: "https://i.pravatar.cc/40?img=26",
    mechanic: "هاني شاكر",
    mechanicAvatar: "https://i.pravatar.cc/40?img=21",
    date: "2026-01-12",
    rating: 3,
    comment: "الخدمة جيدة لكن السعر كان مرتفع قليلاً مقارنة بالسوق."
  },
  {
    client: "عمر خالد",
    clientAvatar: "https://i.pravatar.cc/40?img=13",
    mechanic: "خالد يوسف",
    mechanicAvatar: "https://i.pravatar.cc/40?img=44",
    date: "2026-01-10",
    rating: 5,
    comment: "من أفضل التجارب التي مررت بها، سرعة ودقة في التنفيذ."
  },
  {
    client: "مريم علي",
    clientAvatar: "https://i.pravatar.cc/40?img=41",
    mechanic: "سامح حسين",
    mechanicAvatar: "https://i.pravatar.cc/40?img=52",
    date: "2026-01-08",
    rating: 4,
    comment: "تعامل محترم جدًا، الميكانيكي شرح لي كل الأعطال بوضوح."
  },
  {
    client: "عبد الله سعيد",
    clientAvatar: "https://i.pravatar.cc/40?img=60",
    mechanic: "أحمد عز",
    mechanicAvatar: "https://i.pravatar.cc/40?img=61",
    date: "2026-01-05",
    rating: 2,
    comment: "للأسف لم يتم حل المشكلة من المرة الأولى واضطررت للعودة مرة أخرى."
  },
  {
    client: "نورا جمال",
    clientAvatar: "https://i.pravatar.cc/40?img=45",
    mechanic: "ياسر جلال",
    mechanicAvatar: "https://i.pravatar.cc/40?img=55",
    date: "2026-01-02",
    rating: 5,
    comment: "خدمة فوق الممتازة، شكراً جزيلاً لفريق العمل."
  }
];

/* ---------- Main Component ---------- */
const Reviews: React.FC = () => {
  const { dark } = useTheme();

  return (
    <div dir="rtl" className={`flex min-h-screen font-sans ${dark ? "bg-primary_BGD" : "bg-white"}`}>
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-6">
       
          <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-[#1E2A44]"}`}>
            جميع آراء العملاء
          </h1>

        
          <div className="flex items-center gap-4">
            <NotificationBell size={24} />
            <ThemeToggle />
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-6">
  <input
    type="text"
    placeholder="ابحث حسب المراجع أو الميكانيكي أو الكلمة الرئيسية..."
    className={`w-full py-3 px-12 rounded-xl outline-none transition-all duration-300 ${
      dark 
        ? "bg-[#137FEC1A] text-white border border-[#1E2A44] placeholder-gray-500" 
        : "bg-[#137FEC1A] text-gray-700 border border-[#E2E8F0] placeholder-gray-400"
    }`}
  />
  <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
</div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 mb-8">
          <FilterButton label="التقييم: الكل" dark={dark} />
          <FilterButton label="الحالة: نشط" dark={dark} />
          <FilterButton label="الترتيب حسب: الأحدث أولاً" dark={dark} />
          <FilterButton label="نطاق التاريخ" dark={dark} />
        </div>

        {/* Reviews Table */}
        <div className={`rounded-2xl overflow-hidden border ${dark ? "border-[#1E2A44]" : "border-[#E2E8F0]"}`}>
          <table className="w-full text-right border-collapse">
        
            <thead className={`text-sm ${
  dark 
    ? "bg-[#137FEC1A] text-gray-400" 
    : "bg-[#137FEC1A] text-gray-500"
}`}>
  <tr>
    <th className="p-4 font-medium">العميل</th>
    <th className="p-4 font-medium">الميكانيكي</th>
    <th className="p-4 font-medium">التاريخ</th>
    <th className="p-4 font-medium">التقييم</th>
    <th className="p-4 font-medium">التعليق</th>
    <th className="p-4 font-medium">الاجراءات</th>
  </tr>
</thead>

            <tbody className={`${dark ? "bg-[#0B1020] divide-[#1E2A44]" : "bg-white divide-[#F1F5F9]"} divide-y`}>
              {mockReviews.map((review, idx) => (
                <ReviewRow key={idx} review={review} dark={dark} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          
          <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            عرض 1 إلى 5 من 2,345 تقييم
          </p>


          <div className="flex gap-2">
            {[1, 2, 3, "...", 10].map((page, i) => (
              <button
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  page === 1 
                    ? "bg-[#137FEC] text-white" 
                    : dark ? "bg-[#1E2A44] text-white" : "bg-[#EDF5FF] text-[#137FEC]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const FilterButton = ({ label, dark }: { label: string; dark: boolean }) => (
    <button
      className={`flex items-center gap-3 px-6 py-2 rounded-xl border transition-all ${
        dark 
          ? "bg-[#137FEC1A] border-[#1E2A44] text-white hover:bg-[#137FEC33]" // دارك: 10% شفافية + hover 20%
          : "bg-[#137FEC80] border-transparent text-white hover:bg-[#137FEC99]" // لايت: 50% شفافية + hover 60%
      }`}
    >
      <FaChevronDown className="text-xs text-white" />
      <span className="text-sm font-medium text-white">{label}</span>
    </button>
  );
  

const ReviewRow = ({ review, dark }: { review: Review; dark: boolean }) => (
  <tr className={`transition-colors hover:bg-opacity-50 ${dark ? "hover:bg-[#1E2A44]" : "hover:bg-blue-50"}`}>
    <td className="p-4">
      <div className="flex items-center gap-3">
        <img src={review.clientAvatar} alt="" className="w-8 h-8 rounded-full border border-gray-600" />
        <span className={dark ? "text-white" : "text-gray-800"}>{review.client}</span>
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-3">
        <img src={review.mechanicAvatar} alt="" className="w-8 h-8 rounded-full border border-gray-600" />
        <span className={dark ? "text-white" : "text-gray-800"}>{review.mechanic}</span>
      </div>
    </td>
    <td className={`p-4 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{review.date}</td>
    <td className="p-4">
      <div className="flex gap-1 text-yellow-500">
        {Array(review.rating).fill(0).map((_, i) => <FaStar key={i} size={14} />)}
      </div>
    </td>
    <td className="p-4">
      <p className={`text-xs max-w-[200px] leading-relaxed ${dark ? "text-gray-300" : "text-gray-600"}`}>
        {review.comment}
      </p>
    </td>
    <td className="p-4">
      <button className={`${dark ? "text-white" : "text-gray-400"} hover:text-[#137FEC]`}>
        <FaEllipsisH />
      </button>
    </td>
  </tr>
);

export default Reviews;
