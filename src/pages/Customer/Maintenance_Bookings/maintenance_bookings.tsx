import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import { MdAdd } from "react-icons/md";
import AddBookingModal from "./add_booking_modal";
import { useState, useEffect } from "react";
import RescheduleModal from "./reschedule_modal";
import CancelBookingModal from "./cancel_booking_modal";

const API_URL = "https://gearupapp.runasp.net/api/bookings/my";

interface BookingResponse {
  id: string;
  customerId: string;
  mechanicId: string;
  carId: string;
  subSpecializationId: string;
  customerName: string;
  mechanicName: string;
  carInfo: string;
  subSpecializationName: string;
  date: string;
  slotStart: string;
  slotEnd: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

interface Booking extends BookingResponse {
  time: string;
  statusColor: string;
  borderColor: string;
  actions: boolean;
}

const MaintenanceBookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // فلتر الحالة
  const [selectedStatus, setSelectedStatus] = useState("All");
const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const token = sessionStorage.getItem("userToken");

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: BookingResponse[] = await res.json();

      const mapped: Booking[] = data.map((b) => ({
        ...b,

        time: `${b.slotStart.slice(0, 5)} - ${b.slotEnd.slice(0, 5)}`,

        statusColor:
          b.status === "Completed"
            ? "bg-[#0BDA651A] text-[#16a34a]"
            : b.status === "Pending"
            ? "bg-[#EAB3081A] text-[#a16207]"
            : b.status === "Cancelled"
            ? "bg-[#EF444433] text-[#dc2626]"
            : "bg-gray-200 text-gray-700",

        borderColor:
          b.status === "Completed"
            ? "border-r-green-500"
            : b.status === "Pending"
            ? "border-r-yellow-500"
            : b.status === "Cancelled"
            ? "border-r-red-500"
            : "border-r-gray-400",

        actions: b.status === "Pending",
      }));

      setBookings(mapped);
    } catch (err) {
      console.error("فشل تحميل الحجوزات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // الفلترة حسب الحالة
const filteredBookings = bookings
  .filter((booking) => {
    // فلتر الحالة
    const statusMatch =
      selectedStatus === "All" || booking.status === selectedStatus;
    
    // فلتر الوقت
    const bookingDate = new Date(`${booking.date}T${booking.slotStart}`);
    
    const now = new Date();

    let timeMatch = true;

    if (selectedTimeFilter === "Today") {
      timeMatch =
        bookingDate.toDateString() === now.toDateString();
    }

    if (selectedTimeFilter === "Week") {
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);

      timeMatch =
        bookingDate >= now && bookingDate <= nextWeek;
    }

    if (selectedTimeFilter === "Month") {
      timeMatch =
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear();
    }

    return statusMatch && timeMatch;
  })
  .sort((a, b) => {
    // ترتيب الأقرب أولًا
    const dateA = new Date(`${a.date}T${a.slotStart}`);
    const dateB = new Date(`${b.date}T${b.slotStart}`);

    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="flex min-h-screen dark:bg-primary_BGD" dir="rtl">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-4 md:p-8 space-y-6">
          {/* رأس الصفحة */}
          <div className="flex justify-between items-center">
            <div className="text-right">
              <h2 className="text-2xl font-bold dark:text-white text-gray-800">
                حجوزات الصيانة
              </h2>
              <p className="text-[#94A3B8] text-sm mt-1">
                تتبع أعمال الصيانة والإصلاحات والتكاليف الخاصة بسيارتك
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#137FEC] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <MdAdd size={22} /> حجز جديد
            </button>
          </div>

          {/* شريط الفلترة */}
         
<div className="bg-[#0F172A] border border-white/10 rounded-2xl p-2 shadow-lg">
  <div className="flex flex-col md:flex-row gap-5 items-end">

    {/* فلتر التوقيت */}
    <div className="flex-1 w-full">
      <label className="text-white text-sm font-bold mb-2 block text-right">
        التوقيت
      </label>
      <div className="relative">
       <select
  value={selectedTimeFilter}
  onChange={(e) => setSelectedTimeFilter(e.target.value)}
  className="w-full bg-[#1E293B] text-white border border-[#334155] rounded-2xl py-3 px-4 pr-4 outline-none cursor-pointer text-sm font-medium hover:border-[#137FEC] focus:border-[#137FEC] transition-all"
>
  <option value="All">كل الوقت</option>
  <option value="Today">اليوم</option>
  <option value="Week">هذا الأسبوع</option>
  <option value="Month">هذا الشهر</option>
</select>
      </div>
    </div>

    {/* فلتر الحالة */}
    <div className="flex-1 w-full">
      <label className="text-white text-sm font-bold mb-2 block text-right">
        الحالة
      </label>
      <div className="relative">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full bg-[#1E293B] text-white border border-[#334155] rounded-2xl py-3 px-4 outline-none cursor-pointer text-sm font-medium hover:border-[#137FEC] focus:border-[#137FEC] transition-all shadow-sm"
        >
          <option value="All">All  </option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>

  </div>
</div>

          {/* قائمة الحجوزات */}
          {loading ? (
            <p className="text-center text-gray-400 py-10">جاري التحميل...</p>
          ) : filteredBookings.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              لا توجد حجوزات بهذه الحالة
            </p>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`bg-white dark:bg-[#137FEC1A] rounded-2xl p-5 border border-gray-100 dark:border-white/10 border-r-[5px] ${booking.borderColor} shadow-sm`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                      <div className="flex items-center gap-2">
                        <p className="text-[#137FEC] font-bold text-sm">
                          الميكانيكي:
                        </p>
                        <p className="font-semibold dark:text-white text-gray-800 text-sm">
                          {booking.mechanicName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-[#137FEC] font-bold text-sm">
                          الخدمة:
                        </p>
                        <p className="font-semibold dark:text-white text-gray-800 text-sm">
                          {booking.subSpecializationName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-[#137FEC] font-bold text-sm">
                          التاريخ:
                        </p>
                        <p className="font-semibold dark:text-white text-gray-800 text-sm">
                          {booking.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-[#137FEC] font-bold text-sm">
                          التوقيت:
                        </p>
                        <p className="font-semibold dark:text-white text-gray-800 text-sm">
                          {booking.time}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-5 py-1.5 rounded-lg text-xs font-bold shrink-0 ${booking.statusColor}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {booking.actions && (
                    <div className="flex justify-center items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsCancelModalOpen(true);
                        }}
                        className="bg-[#ef4444] text-white px-8 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-all"
                      >
                        إلغاء الحجز
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsRescheduleOpen(true);
                        }}
                        className="bg-[#94A3B8] text-white px-8 py-2 rounded-xl text-sm font-bold hover:bg-slate-500 transition-all"
                      >
                        تغيير الموعد
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Booking */}
      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchBookings()}
      />

      {/* Reschedule */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        booking={selectedBooking}
        onClose={() => setIsRescheduleOpen(false)}
        onSuccess={() => fetchBookings()}
      />

      {/* Cancel */}
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        booking={selectedBooking}
        token={token ?? undefined}
        onSuccess={() => fetchBookings()}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};

export default MaintenanceBookings;