import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import { FaSearch } from "react-icons/fa";

const Booking = () => {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // البيانات التجريبية
  const allBookings = [
    {
      id: 1,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "new",
    },
    {
      id: 2,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "new",
    },
    {
      id: 3,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "new",
    },
    {
      id: 4,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "pending",
    },
    {
      id: 5,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "confirmed",
    },
    {
      id: 6,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "confirmed",
    },
    {
      id: 7,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "confirmed",
    },
    {
      id: 8,
      client: "Alice Martin",
      car: "Toyota Camry",
      service: "Oil Change",
      date: "Oct 26, 2:00 PM",
      status: "confirmed",
    },
  ];

  // حساب العدد الفعلي لكل حالة
  const getCount = (status: string) => {
    if (status === "all") return allBookings.length;
    return allBookings.filter((b) => b.status === status).length;
  };

  const tabs = [
    { id: "all", label: "الجميع", count: getCount("all") },
    { id: "new", label: "جديد", count: getCount("new") },
    { id: "pending", label: "في انتظار الموافقة", count: getCount("pending") },
    { id: "confirmed", label: "موافقة", count: getCount("confirmed") },
  ];

  // تصفية البيانات حسب التاب والبحث
  const filteredBookings = allBookings.filter((booking) => {
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    const matchesSearch =
      booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // الانتقال لصفحة التفاصيل
  const handleViewDetails = (bookingId: number) => {
    navigate(`/mechanics/booking/mbookingdetails/${bookingId}`);
  };

  // معالجة الموافقة
  const handleAccept = (bookingId: number) => {
    console.log("تم قبول الحجز:", bookingId);
    // هنا تضيف API call
  };

  // معالجة الرفض
  const handleReject = (bookingId: number) => {
    console.log("تم رفض الحجز:", bookingId);
    // هنا تضيف API call
  };

  const getStatusButton = (status: string, bookingId: number) => {
    switch (status) {
      case "new":
        return (
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleAccept(bookingId)}
              className="px-3 md:px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs md:text-sm transition font-medium whitespace-nowrap"
            >
              موافقة
            </button>
            <button 
              onClick={() => handleReject(bookingId)}
              className="px-3 md:px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs md:text-sm transition font-medium whitespace-nowrap"
            >
              رفض
            </button>
            <button 
              onClick={() => handleViewDetails(bookingId)}
              className="px-3 md:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm transition font-medium whitespace-nowrap"
            >
              عرض تفاصيل
            </button>
          </div>
        );
      case "pending":
        return (
          <div className="flex flex-wrap gap-2">
            <span className="inline-block px-3 md:px-4 py-1.5 bg-yellow-600/20 text-yellow-400 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap">
              في انتظار الموافقة
            </span>
            <button 
              onClick={() => handleViewDetails(bookingId)}
              className="px-3 md:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm transition font-medium whitespace-nowrap"
            >
              عرض
            </button>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex flex-wrap gap-2">
            <span className="inline-block px-3 md:px-4 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap">
              موافقة
            </span>
            <button 
              onClick={() => handleViewDetails(bookingId)}
              className="px-3 md:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm transition font-medium whitespace-nowrap"
            >
              عرض
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-block px-2.5 md:px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-medium whitespace-nowrap">
            جديد
          </span>
        );
      case "pending":
        return (
          <span className="inline-block px-2.5 md:px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-lg text-xs font-medium whitespace-nowrap">
            في انتظار
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-block px-2.5 md:px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs font-medium whitespace-nowrap">
            موافقة
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      dir="rtl"
      className={`
        flex min-h-screen transition-colors duration-500
        ${!dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"}
      `}
    >
      <MachineSidebar />
      <main className="flex-1 p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 w-full overflow-x-hidden">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6 mt-14 lg:mt-0">
          <div>
            <h1
              className={`text-xl md:text-2xl lg:text-3xl font-bold transition-colors ${
                !dark ? "text-black" : "text-white"
              }`}
            >
              الحجوزات
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4 self-end sm:self-auto bg-gray-50 dark:bg-white/5 p-2 rounded-2xl sm:bg-transparent sm:dark:bg-transparent">
            <NotificationBell size={20} />
            <ThemeToggle />
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="w-full">
          <div
            className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl ${
              !dark
                ? "bg-white shadow-md border border-gray-200"
                : "bg-[#0d1629] border border-gray-800"
            }`}
          >
            <FaSearch
              className={`text-base md:text-lg ${!dark ? "text-gray-400" : "text-gray-500"}`}
            />
            <input
              type="text"
              placeholder="البحث حسب العميل أو السيارة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 bg-transparent outline-none text-sm md:text-base ${
                !dark ? "text-gray-900" : "text-white"
              } placeholder-gray-500`}
            />
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : !dark
                  ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  : "bg-[#0d1629] text-gray-300 hover:bg-[#131c2f] border border-gray-800"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* TABLE - Desktop & Tablet */}
        <div
          className={`hidden md:block rounded-xl overflow-hidden ${
            !dark ? "bg-white shadow-md" : "bg-[#0d1629]"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr
                  className={`text-right text-xs lg:text-sm ${
                    !dark
                      ? "bg-gray-50 text-gray-700"
                      : "bg-[#131c2f] text-gray-300"
                  }`}
                >
                  <th className="p-3 lg:p-4 font-semibold">عميل</th>
                  <th className="p-3 lg:p-4 font-semibold">عربة</th>
                  <th className="p-3 lg:p-4 font-semibold">الحالة</th>
                  <th className="p-3 lg:p-4 font-semibold">خدمة</th>
                  <th className="p-3 lg:p-4 font-semibold">التاريخ والمطلوب</th>
                  <th className="p-3 lg:p-4 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`border-b transition-colors ${
                      !dark
                        ? "border-gray-200 hover:bg-gray-50"
                        : "border-gray-800 hover:bg-[#131c2f]"
                    }`}
                  >
                    <td className="p-3 lg:p-4 font-medium text-xs lg:text-sm">
                      {booking.client}
                    </td>
                    <td
                      className={`p-3 lg:p-4 text-xs lg:text-sm ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {booking.car}
                    </td>
                    <td className="p-3 lg:p-4">{getStatusBadge(booking.status)}</td>
                    <td
                      className={`p-3 lg:p-4 text-xs lg:text-sm ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {booking.service}
                    </td>
                    <td
                      className={`p-3 lg:p-4 text-xs lg:text-sm ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {booking.date}
                    </td>
                    <td className="p-3 lg:p-4">
                      {getStatusButton(booking.status, booking.id)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t ${
              !dark ? "border-gray-200" : "border-gray-800"
            }`}
          >
            <p
              className={`text-xs md:text-sm ${
                !dark ? "text-gray-600" : "text-gray-400"
              }`}
            >
              عرض 1 إلى {filteredBookings.length} من {allBookings.length} حجز
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition ${
                  currentPage === 1
                    ? "bg-blue-600 text-white"
                    : !dark
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                }`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition ${
                  currentPage === 2
                    ? "bg-blue-600 text-white"
                    : !dark
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                }`}
              >
                2
              </button>
              <button
                onClick={() => setCurrentPage(3)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition ${
                  currentPage === 3
                    ? "bg-blue-600 text-white"
                    : !dark
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                }`}
              >
                3
              </button>
              <span className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 text-xs md:text-sm">
                ...
              </span>
              <button
                onClick={() => setCurrentPage(10)}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition ${
                  currentPage === 10
                    ? "bg-blue-600 text-white"
                    : !dark
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                }`}
              >
                10
              </button>
            </div>
          </div>
        </div>

        {/* CARDS VIEW - Mobile */}
        <div className="md:hidden space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className={`p-4 rounded-xl ${
                !dark
                  ? "bg-white shadow-md border border-gray-200"
                  : "bg-[#0d1629] border border-gray-800"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm mb-1">{booking.client}</h3>
                  <p className={`text-xs ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                    {booking.car}
                  </p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className={!dark ? "text-gray-600" : "text-gray-400"}>
                    الخدمة:
                  </span>
                  <span className="font-medium">{booking.service}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={!dark ? "text-gray-600" : "text-gray-400"}>
                    الموعد:
                  </span>
                  <span className="font-medium">{booking.date}</span>
                </div>
              </div>

              {getStatusButton(booking.status, booking.id)}
            </div>
          ))}

          {/* Mobile Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                currentPage === 1
                  ? "bg-blue-600 text-white"
                  : !dark
                  ? "bg-white text-gray-700 border border-gray-200"
                  : "bg-[#131c2f] text-gray-300 border border-gray-800"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                currentPage === 2
                  ? "bg-blue-600 text-white"
                  : !dark
                  ? "bg-white text-gray-700 border border-gray-200"
                  : "bg-[#131c2f] text-gray-300 border border-gray-800"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                currentPage === 3
                  ? "bg-blue-600 text-white"
                  : !dark
                  ? "bg-white text-gray-700 border border-gray-200"
                  : "bg-[#131c2f] text-gray-300 border border-gray-800"
              }`}
            >
              3
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;