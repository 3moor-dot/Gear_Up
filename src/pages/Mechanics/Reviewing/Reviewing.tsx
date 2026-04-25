import { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { FaStar } from "react-icons/fa";

// تعريف الـ Types
interface Reply {
  text: string;
  date: string;
  author: string;
}

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
  reply: Reply | null;
}

const Reviewing = () => {
  const { dark } = useTheme();
  const [openReply, setOpenReply] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "جون دوج",
      date: "March 12, 2024",
      rating: 5,
      comment:
        "خدمة ممتازة وسريعة، الشغل احترافي جدًا والسعر مناسب. أكيد هتعامل معاهم تاني.",
      avatar: "https://i.pravatar.cc/100?img=11",
      reply: null,
    },
    {
      id: 2,
      name: "أحمد علي",
      date: "March 10, 2024",
      rating: 4,
      comment: "التجربة كانت كويسة جدًا، بس اتأخروا شوية في التسليم.",
      avatar: "https://i.pravatar.cc/100?img=12",
      reply: null,
    },
    {
      id: 3,
      name: "سارة محمد",
      date: "March 8, 2024",
      rating: 5,
      comment:
        "تعامل راقي جدًا وسرعة في التنفيذ، أنصح بالتعامل معاهم بدون تردد.",
      avatar: "https://i.pravatar.cc/100?img=13",
      reply: null,
    },
  ]);

  const handleSendReply = (reviewId: number) => {
    if (replyText.trim() === "") return;

    const currentDate = new Date().toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              reply: {
                text: replyText,
                date: currentDate,
                author: "Mechanic Name",
              },
            }
          : review
      )
    );

    setReplyText("");
    setOpenReply(null);
  };

  return (
    <div
      dir="rtl"
      className={`flex min-h-screen transition-colors duration-500
        ${dark ? "bg-[#0B1220] text-white" : "bg-gray-50 text-[#1E3A5F]"}
      `}
    >
      <MachineSidebar />

      <div className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-14 lg:mt-0">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">المراجعات</h1>
          <div className="flex items-center gap-3 self-end sm:self-auto bg-gray-50 dark:bg-white/5 p-2 rounded-2xl sm:bg-transparent sm:dark:bg-transparent">
            <NotificationBell size={25} />
            <ThemeToggle />
          </div>
        </div>

        {/* Title */}
        <div
          className={`rounded-xl px-4 md:px-6 py-4 md:py-5
            ${dark ? "bg-[#0d1629]" : "bg-white shadow border"}
          `}
        >
          <h2 className="text-lg font-bold">التقييمات والمراجعات</h2>
          <p className="text-sm text-gray-400">
            عرض تقييمات العملاء والرد عليها
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Reviews */}
          <div
            className={`lg:col-span-2 rounded-xl p-4 md:p-6
              ${dark ? "bg-[#0d1629]" : "bg-white shadow border"}
            `}
          >
            <h3 className="font-bold mb-4">جميع المراجعات ({reviews.length})</h3>

            <div className="space-y-4 md:space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`p-4 rounded-xl border
                    ${
                      dark
                        ? "border-gray-800 bg-[#0f1a2f]"
                        : "border-gray-200 bg-gray-50"
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-sm md:text-base">{review.name}</p>
                        <span className="text-xs text-gray-400">
                          {review.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1 text-yellow-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} size={14} />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-3">
                    {review.comment}
                  </p>

                  {/* عرض الرد إذا كان موجود */}
                  {review.reply && (
                    <div
                      className={`mt-4 p-4 rounded-xl border-r-4 ${
                        dark
                          ? "bg-[#0d1629] border-blue-500"
                          : "bg-blue-50 border-blue-600"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          M
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{review.reply.author}</p>
                          <span className="text-xs text-gray-400">
                            {review.reply.date}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm mr-10 ${dark ? "text-gray-300" : "text-gray-700"}`}>
                        {review.reply.text}
                      </p>
                    </div>
                  )}

                  {/* زر الرد */}
                  {!review.reply && (
                    <button
                      onClick={() =>
                        setOpenReply(
                          openReply === review.id ? null : review.id
                        )
                      }
                      className="text-sm text-blue-500 hover:underline"
                    >
                      رد على المراجعة
                    </button>
                  )}

                  {/* نموذج الرد */}
                  {openReply === review.id && (
                    <div
                      className={`mt-4 p-4 rounded-xl
                        ${dark ? "bg-[#0d1629]" : "bg-blue-50"}
                      `}
                    >
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="اكتب ردك على المراجعة..."
                        rows={3}
                        className={`w-full mb-3 px-4 py-3 rounded-lg text-sm outline-none resize-none
                          ${
                            dark
                              ? "bg-[#131c2f] border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                              : "bg-white border border-gray-300 text-gray-800 focus:border-blue-500"
                          }
                        `}
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setOpenReply(null);
                            setReplyText("");
                          }}
                          className={`px-4 py-2 rounded-lg text-sm transition
                            ${
                              dark
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-gray-200 hover:bg-gray-300"
                            }
                          `}
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={() => handleSendReply(review.id)}
                          className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                          إرسال الرد
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-sm font-medium transition
                    ${
                      num === 1
                        ? "bg-blue-600 text-white"
                        : dark
                        ? "bg-[#1a2332] text-white hover:bg-[#243044]"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4 md:space-y-6">
            {/* Rating Summary */}
            <div
              className={`rounded-xl p-4 md:p-6 h-fit
                ${dark ? "bg-[#0d1629]" : "bg-white shadow border"}
              `}
            >
              <h3 className="font-bold mb-4">التقييم العام</h3>

              <div className="text-center mb-6">
                <p className="text-3xl md:text-4xl font-bold">4.8</p>
                <div className="flex justify-center gap-1 text-yellow-400 my-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  بناءً على {reviews.length} مراجعة
                </p>
              </div>

              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={star} className="flex items-center gap-3 mb-3 text-sm">
                  <span className="w-4">{star}</span>
                  <FaStar className="text-yellow-400" size={14} />
                  <div
                    className={`flex-1 h-2 rounded overflow-hidden
                      ${dark ? "bg-gray-800" : "bg-gray-200"}
                    `}
                  >
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${[82, 50, 20, 5, 1][index]}%`,
                      }}
                    />
                  </div>
                  <span className="w-10 text-xs text-gray-400">
                    {[82, 50, 20, 5, 1][index]}%
                  </span>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div
              className={`rounded-xl p-4 md:p-6 space-y-4 md:space-y-6
                ${dark ? "bg-[#0d1629]" : "bg-white shadow border"}
              `}
            >
              <div>
                <p className="text-sm font-semibold mb-2">
                  تصفية حسب التقييم
                </p>
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition
                    ${dark ? "bg-[#134b8a] hover:bg-[#1a5a9e]" : "bg-blue-600 hover:bg-blue-700"}
                  `}
                >
                  <span className="text-sm text-white">كل التقييمات</span>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">الترتيب حسب</p>
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition
                    ${dark ? "bg-[#134b8a] hover:bg-[#1a5a9e]" : "bg-blue-600 hover:bg-blue-700"}
                  `}
                >
                  <span className="text-sm text-white">
                    الأحدث أولاً
                  </span>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviewing;