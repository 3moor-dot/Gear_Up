import React from "react";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import { FaStar } from "react-icons/fa";

const MachineDashboard = () => {
  const { dark } = useTheme();

  // بيانات تجريبية
  const stats = [
    {
      title: "طلبات الحجز الجديدة",
      value: "4",
      change: "+2 عن الأمس",
      positive: true,
    },
    {
      title: "مواعيد اليوم",
      value: "7",
      change: "+1 عن الأمس",
      positive: true,
    },
    {
      title: "متوسط التقييم",
      value: "4.8",
      change: "0+ هذا الشهر",
      positive: true,
    },
  ];

  const bookings = [
    {
      id: 1,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "pending",
    },
    {
      id: 2,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "pending",
    },
    {
      id: 3,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "pending",
    },
  ];

  const appointments = [
    {
      id: 1,
      client: "مالك جونسون",
      time: "09:00 AM",
      service: "فرع طريق الملك عبدالله - الخدمة السنوية",
      status: "confirmed",
    },
    {
      id: 2,
      client: "مالك جونسون",
      time: "09:00 AM",
      service: "فرع طريق الملك عبدالله - الخدمة السنوية",
      status: "confirmed",
    },
    {
      id: 3,
      client: "مالك جونسون",
      time: "09:00 AM",
      service: "فرع طريق الملك عبدالله - الخدمة السنوية",
      status: "in-progress",
    },
  ];

  const reviews = [
    {
      id: 1,
      client: "مالك جونسون",
      rating: 5,
      comment:
        "خدمة ممتازة! كان جون مهريًا، ومهنيًا، وجعلها جاهزة للاستلام الأسعار أعجب به أشد",
      time: "منذ ساعة",
    },
    {
      id: 2,
      client: "مالك جونسون",
      rating: 5,
      comment:
        "خدمة ممتازة! كان جون مهريًا، ومهنيًا، وجعلها جاهزة للاستلام الأسعار أعجب به أشد",
      time: "منذ ساعة",
    },
  ];

  return (
    <div
      dir="rtl"
      className={`
        flex min-h-screen transition-colors duration-500
        ${!dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"}
      `}
    >
      <MachineSidebar />
      <main className="flex-1 p-4 md:p-8 space-y-8 w-full overflow-x-hidden">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-14 lg:mt-0">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold mb-1 transition-colors ${
                !dark ? "text-black" : "text-white"
              }`}
            >
              لوحة التحكم
            </h1>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto bg-gray-50 dark:bg-white/5 p-2 rounded-2xl sm:bg-transparent sm:dark:bg-transparent">
            <NotificationBell size={22} />
            <ThemeToggle />
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl transition-all ${
                !dark
                  ? "bg-white shadow-md hover:shadow-lg"
                  : "bg-gradient-to-br from-[#1a2332] to-[#0d1629] hover:from-[#1e2840] hover:to-[#0f1a2d]"
              }`}
            >
              <p
                className={`text-sm mb-2 ${
                  !dark ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {stat.title}
              </p>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p
                className={`text-xs ${
                  stat.positive ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* BOOKINGS TABLE */}
        <div
          className={`rounded-xl overflow-hidden ${
            !dark ? "bg-white shadow-md" : "bg-[#0d1629]"
          }`}
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">طلبات الحجز الجديدة</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`text-right text-sm ${
                    !dark ? "bg-gray-50" : "bg-[#131c2f]"
                  }`}
                >
                  <th className="p-4 font-medium">عميل</th>
                  <th className="p-4 font-medium">عربة</th>
                  <th className="p-4 font-medium">خدمة</th>
                  <th className="p-4 font-medium">التاريخ والمطلوب</th>
                  <th className="p-4 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`border-b ${
                      !dark ? "border-gray-200" : "border-gray-800"
                    }`}
                  >
                    <td className="p-4">{booking.client}</td>
                    <td className="p-4 text-gray-400">{booking.car}</td>
                    <td className="p-4 text-gray-400">{booking.service}</td>
                    <td className="p-4 text-gray-400">{booking.date}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition">
                          موافقة
                        </button>
                        <button className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition">
                          رفض
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* APPOINTMENTS & REVIEWS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* المواعيد القادمة */}
          <div
            className={`rounded-xl overflow-hidden ${
              !dark ? "bg-white shadow-md" : "bg-[#0d1629]"
            }`}
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold">المواعيد القادمة</h2>
            </div>
            <div className="p-6 space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`p-4 rounded-lg border ${
                    !dark
                      ? "bg-gray-50 border-gray-200"
                      : "bg-[#131c2f] border-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{apt.client}</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {apt.service}
                      </p>
                    </div>
                    <span className="text-blue-400 font-semibold text-sm">
                      {apt.time}
                    </span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === "confirmed"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-yellow-600/20 text-yellow-400"
                    }`}
                  >
                    {apt.status === "confirmed" ? "مؤكد" : "قيد التنفيذ"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* المراجعات الأخيرة */}
          <div
            className={`rounded-xl overflow-hidden ${
              !dark ? "bg-white shadow-md" : "bg-[#0d1629]"
            }`}
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold">المراجعات الأخيرة</h2>
            </div>
            <div className="p-6 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`p-4 rounded-lg border ${
                    !dark
                      ? "bg-gray-50 border-gray-200"
                      : "bg-[#131c2f] border-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{review.client}</h4>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-sm" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {review.comment}
                  </p>
                  <span className="text-xs text-gray-500">{review.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MachineDashboard;