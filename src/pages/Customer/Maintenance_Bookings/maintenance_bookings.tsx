import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import { MdAdd, MdMoreVert } from "react-icons/md";
import AddBookingModal from "./add_booking_modal";
import { useState, useEffect, useRef } from "react";
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
  actions: boolean;
}

const statusLabels: Record<string, string> = {
  Pending: "قيد الانتظار",
  Confirmed: "مؤكد",
  Accepted: "مقبول",
  Cancelled: "ملغي",
  Rejected: "مرفوض",
  Completed: "مكتمل",
};

const ActionMenu = ({
  status,
  booking,
  isOpen,
  onToggle,
  onClose,
  onReschedule,
  onCancel,
}: any) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggle}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-white"
      >
        <MdMoreVert size={20} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-44 bg-white dark:bg-[#1E293B] border dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {status === "Pending" ? (
            <>
              <button
                onClick={() => {
                  onReschedule(booking);
                  onClose();
                }}
                className="block w-full text-right px-4 py-2.5 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                تغيير الموعد
              </button>
              <button
                onClick={() => {
                  onCancel(booking);
                  onClose();
                }}
                className="block w-full text-right px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                إلغاء الحجز
              </button>
            </>
          ) : (
            <span className="block w-full text-right px-4 py-2.5 text-sm text-gray-400">
              لا توجد إجراءات
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const MaintenanceBookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("الكل");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: BookingResponse[] = await res.json();

      const mapped: Booking[] = data.map((b) => {
        let statusColor = "";

        switch (b.status) {
          case "Pending":
            statusColor =
              "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300";
            break;
          case "Confirmed":
          case "Accepted":
            statusColor =
              "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
            break;
          case "Cancelled":
          case "Rejected":
            statusColor =
              "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
            break;
          case "Completed":
            statusColor =
              "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
            break;
          default:
            statusColor =
              "bg-gray-100 text-gray-700 dark:bg-gray-600/20 dark:text-gray-300";
        }

        return {
          ...b,
          time: `${b.slotStart.slice(0, 5)} - ${b.slotEnd.slice(0, 5)}`,
          statusColor,
          actions: b.status === "Pending",
        };
      });

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

  // ================= التعديل هنا =================
  const filteredBookings = bookings
    .filter((booking) => {
      const statusMatch =
        selectedStatus === "الكل" ||
        statusLabels[booking.status] === selectedStatus;

      const bookingDate = new Date(`${booking.date.split('T')[0]}T${booking.slotStart.slice(0, 5)}`);
      const now = new Date();

      let timeMatch = true;

      if (selectedTimeFilter === "اليوم") {
        timeMatch = bookingDate.toDateString() === now.toDateString();
      }
      if (selectedTimeFilter === "هذا الأسبوع") {
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        timeMatch = bookingDate >= now && bookingDate <= nextWeek;
      }
      if (selectedTimeFilter === "هذا الشهر") {
        timeMatch =
          bookingDate.getMonth() === now.getMonth() &&
          bookingDate.getFullYear() === now.getFullYear();
      }

      return statusMatch && timeMatch;
    })
    .sort((a, b) => {
      // الترتيب من المستقبل إلى الماضي (تنازلي)
      const dateAString = a.date.split('T')[0];
      const dateBString = b.date.split('T')[0];
      
      // دمج التاريخ مع الوقت
      const fullDateA = new Date(`${dateAString}T${a.slotStart.slice(0, 5)}`).getTime();
      const fullDateB = new Date(`${dateBString}T${b.slotStart.slice(0, 5)}`).getTime();

      // ترتيب تنازلي: الأكبر (المستقبل) يظهر أولاً
      return fullDateB - fullDateA;
    });
  // ===============================================

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="flex h-screen overflow-hidden dark:bg-primary_BGD bg-gray-50"
      dir="rtl"
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-right">
              <h2 className="text-2xl font-bold dark:text-white text-gray-800">
                حجوزات الصيانة
              </h2>
              <p className="text-[#94A3B8] text-sm mt-1">
                تتبع أعمال الصيانة والإصلاحات الخاصة بسيارتك
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#137FEC] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <MdAdd size={22} /> حجز جديد
            </button>
          </div>

          {/* Filters Section */}
          <div className="bg-white dark:bg-[#0F172A] border dark:border-white/10 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 block">
                  التوقيت
                </label>
                <select
                  value={selectedTimeFilter}
                  onChange={(e) => {
                    setSelectedTimeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-50 dark:bg-[#1E293B] text-gray-800 dark:text-white border border-gray-200 dark:border-[#334155] rounded-xl py-2.5 px-4 outline-none cursor-pointer text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="الكل">كل الوقت</option>
                  <option value="اليوم">اليوم</option>
                  <option value="هذا الأسبوع">هذا الأسبوع</option>
                  <option value="هذا الشهر">هذا الشهر</option>
                </select>
              </div>

              <div className="flex-1 w-full">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 block">
                  الحالة
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-50 dark:bg-[#1E293B] text-gray-800 dark:text-white border border-gray-200 dark:border-[#334155] rounded-xl py-2.5 px-4 outline-none cursor-pointer text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="الكل">الكل</option>
                  <option value="قيد الانتظار">قيد الانتظار</option>
                  <option value="مقبول">مقبول</option>
                  <option value="ملغي">ملغي</option>
                  <option value="مرفوض">مرفوض</option>
                  <option value="مكتمل">مكتمل</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#0F172A] rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">
                لا توجد حجوزات بهذه المعايير
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white dark:bg-[#0F172A] rounded-xl overflow-hidden shadow-sm border dark:border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-[#131c2f] text-gray-600 dark:text-gray-300 text-sm">
                        <th className="p-4 text-right font-semibold">الميكانيكي</th>
                        <th className="p-4 text-right font-semibold">الخدمة</th>
                        <th className="p-4 text-right font-semibold">التاريخ</th>
                        <th className="p-4 text-right font-semibold">التوقيت</th>
                        <th className="p-4 text-right font-semibold">الحالة</th>
                        <th className="p-4 text-right font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#131c2f] transition-colors"
                        >
                          <td className="p-4 font-medium text-gray-800 dark:text-white text-sm">
                            {booking.mechanicName}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                            {booking.subSpecializationName}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                            {formatDisplayDate(booking.date)}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                            {booking.time}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-normal ${booking.statusColor}`}
                            >
                              {statusLabels[booking.status] || booking.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <ActionMenu
                              status={booking.status}
                              booking={booking}
                              isOpen={openMenuId === booking.id}
                              onToggle={() =>
                                setOpenMenuId(
                                  openMenuId === booking.id ? null : booking.id
                                )
                              }
                              onClose={() => setOpenMenuId(null)}
                              onReschedule={(b: Booking) => {
                                setSelectedBooking(b);
                                setIsRescheduleOpen(true);
                              }}
                              onCancel={(b: Booking) => {
                                setSelectedBooking(b);
                                setIsCancelModalOpen(true);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - Desktop */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    عرض {(currentPage - 1) * itemsPerPage + 1} إلى{" "}
                    {Math.min(currentPage * itemsPerPage, filteredBookings.length)} من{" "}
                    {filteredBookings.length} حجز
                  </p>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1E293B] dark:text-gray-300 dark:hover:bg-[#334155]"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {paginatedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white dark:bg-[#0F172A] rounded-xl p-4 shadow-sm border dark:border-white/5 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">
                          {booking.mechanicName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.subSpecializationName}
                        </p>
                      </div>
                      <span
                        className={`px-1.5 py-.5 rounded-md text-xs font-normal ${booking.statusColor}`}
                      >
                        {statusLabels[booking.status] || booking.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 border-t dark:border-gray-800 pt-3">
                      <div>
                        <span className="font-semibold ml-1">التاريخ:</span>
                        {formatDisplayDate(booking.date)}
                      </div>
                      <div>
                        <span className="font-semibold ml-1">الوقت:</span>
                        {booking.time}
                      </div>
                    </div>

                    {booking.status === "Pending" && (
                      <div className="flex gap-2 pt-3 border-t dark:border-gray-800">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsRescheduleOpen(true);
                          }}
                          className="flex-1 bg-slate-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                        >
                          تغيير الموعد
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsCancelModalOpen(true);
                          }}
                          className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          إلغاء الحجز
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Pagination - Mobile */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 border border-gray-200 dark:bg-[#1E293B] dark:text-gray-300 dark:border-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchBookings()}
      />

      <RescheduleModal
        isOpen={isRescheduleOpen}
        booking={selectedBooking}
        onClose={() => setIsRescheduleOpen(false)}
        onSuccess={() => fetchBookings()}
      />

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