import React, { useState } from "react";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Schedule = () => {
  const { dark } = useTheme();
  const [selectedView, setSelectedView] = useState("week"); // day, week, month
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 5)); // October 5, 2023

  // مواعيد اليوم
  const todayAppointments = [
    {
      id: 1,
      client: "جون دو - تويوتا كامري",
      service: "تغيير الزيت",
      time: "9:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      client: "سارة سميث - فورد إف-150",
      service: "فحص الفرامل",
      time: "11:00 AM",
      status: "confirmed",
    },
    {
      id: 3,
      client: "ألكس جونسون - هوندا سيفيك",
      service: "فحص المحرك",
      time: "1:30 PM",
      status: "pending",
    },
    {
      id: 4,
      client: "ماريا غارسيا - نيسان روج",
      service: "غسيل وتلميع",
      time: "3:00 PM",
      status: "completed",
    },
  ];

  // أيام الأسبوع
  const weekDays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  // الحصول على أيام الشهر
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // إضافة الأيام الفارغة في البداية
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // إضافة أيام الشهر
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthDays = getDaysInMonth(currentDate);

  const getMonthName = (date: Date) => {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    return months[date.getMonth()];
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400";
      case "pending":
        return "text-blue-400";
      case "completed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "pending":
        return "قيد الانتظار";
      case "completed":
        return "مكتمل";
      default:
        return "";
    }
  };

  return (
    <div
      dir="rtl"
      className={`flex min-h-screen transition-colors duration-500 ${
        !dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"
      }`}
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
              جدول المواعيد
            </h1>
            <p className={`text-sm mt-1 ${!dark ? "text-gray-600" : "text-gray-400"}`}>
              عرض جدول المواعيد
            </p>
          </div>

          <div className="flex items-center gap-3 md:gap-4 self-end sm:self-auto bg-gray-50 dark:bg-white/5 p-2 rounded-2xl sm:bg-transparent sm:dark:bg-transparent">
            <NotificationBell size={20} />
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* View Selector & Month Navigation */}
            <div
              className={`rounded-xl p-4 ${
                !dark 
                  ? "bg-white shadow-lg" 
                  : "bg-[#0d1629] shadow-2xl shadow-blue-900/20"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* View Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedView("day")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedView === "day"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                        : !dark
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                    }`}
                  >
                    اليوم
                  </button>
                  <button
                    onClick={() => setSelectedView("week")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedView === "week"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                        : !dark
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                    }`}
                  >
                    الأسبوع
                  </button>
                  <button
                    onClick={() => setSelectedView("month")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedView === "month"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                        : !dark
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                    }`}
                  >
                    الشهر
                  </button>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevMonth}
                    className={`p-2 rounded-lg transition ${
                      !dark
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-[#131c2f] hover:bg-[#1a2332]"
                    }`}
                  >
                    <FaChevronLeft size={16} />
                  </button>
                  <span className="font-semibold text-lg min-w-[150px] text-center">
                    {getMonthName(currentDate)} {currentDate.getFullYear()}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className={`p-2 rounded-lg transition ${
                      !dark
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-[#131c2f] hover:bg-[#1a2332]"
                    }`}
                  >
                    <FaChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid - مع Shadow مميز */}
            <div
              className={`rounded-xl p-6 ${
                !dark 
                  ? "bg-white shadow-xl border border-gray-100" 
                  : "bg-gradient-to-br from-[#0d1629] to-[#0a1120] shadow-2xl shadow-blue-900/30 border border-blue-900/20"
              }`}
            >
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className={`text-center text-sm font-semibold py-2 ${
                      !dark ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition cursor-pointer ${
                      day === null
                        ? "invisible"
                        : day === 5
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/50 scale-105"
                        : !dark
                        ? "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"
                        : "bg-[#1a2332] text-gray-300 hover:bg-[#243044] hover:shadow-lg hover:shadow-blue-900/20"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div
            className={`rounded-xl overflow-hidden ${
              !dark 
                ? "bg-white shadow-xl border border-gray-100" 
                : "bg-gradient-to-br from-[#0d1629] to-[#0a1120] shadow-2xl shadow-blue-900/30 border border-blue-900/20"
            }`}
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-bold">مواعيد اليوم</h2>
            </div>
            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`p-4 rounded-lg border transition hover:scale-[1.02] ${
                    !dark
                      ? "bg-gray-50 border-gray-200 hover:shadow-lg"
                      : "bg-[#131c2f] border-gray-800 hover:shadow-xl hover:shadow-blue-900/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">
                        {appointment.client}
                      </h4>
                      <p
                        className={`text-xs ${
                          !dark ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {appointment.service}
                      </p>
                    </div>
                    <span className="text-sm font-bold">{appointment.time}</span>
                  </div>
                  <span
                    className={`text-xs font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusText(appointment.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;