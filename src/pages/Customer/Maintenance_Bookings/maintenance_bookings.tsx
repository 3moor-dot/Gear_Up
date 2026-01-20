import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import { MdAdd } from "react-icons/md";
import AddBookingModal from "./add_booking_modal";
import { useState } from "react";

const MaintenanceBookings = () => {
    // 1. حالة التحكم في فتح وإغلاق البوب أب
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. بيانات الحجوزات
    const bookings = [
        {
            id: 1,
            mechanic: "علي جمال",
            service: "تغيير زيت",
            date: "15/12/2025",
            time: "10:30 AM",
            status: "مكتمل",
            statusColor: "bg-[#0BDA651A] text-[#0BDA65]",
            borderColor: "border-r-green-500"
        },
        {
            id: 2,
            mechanic: "علي جمال",
            service: "تغيير زيت",
            date: "15/12/2025",
            time: "10:30 AM",
            status: "قيد الانتظار",
            statusColor: "bg-[#EAB3081A] text-[#EAB308]",
            borderColor: "border-r-yellow-500",
            actions: true 
        },
        {
            id: 3,
            mechanic: "علي جمال",
            service: "تغيير زيت",
            date: "15/12/2025",
            time: "10:30 AM",
            status: "ملغي",
            statusColor: "bg-[#EF444433] text-[#EF4444]",
            borderColor: "border-r-red-500"
        }
    ];

    return (
        <div className="flex min-h-screen dark:bg-primary_BGD" dir="rtl">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="p-4 md:p-8 space-y-6">
                    {/* رأس الصفحة وزر حجز جديد */}
                    <div className="flex justify-between items-center">
                        <div className="text-right">
                            <h2 className="text-2xl font-bold dark:text-white text-gray-800">حجوزات الصيانة</h2>
                            <p className="text-[#0F132380] text-sm italic">تتبع أعمال الصيانة والإصلاحات والتكاليف الخاصة بسيارتك</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#137FEC] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                        >
                            <MdAdd size={24} /> حجز جديد
                        </button>
                    </div>

                    {/* شريط الفلترة */}
                    <div className="bg-[#0F1323E3] dark:bg-[#137FEC33] rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-white text-sm block px-2">التوقيت</label>
                            <select className="w-full bg-[#0F132380] text-white border-none rounded-xl py-2 px-4 outline-none appearance-none cursor-pointer">
                                <option>كل الوقت</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-white text-sm block px-2">الحالة</label>
                            <select className="w-full bg-[#0F132380] text-white border-none rounded-xl py-2 px-4 outline-none appearance-none cursor-pointer">
                                <option>كل الحالات</option>
                            </select>
                        </div>
                    </div>

                    {/* قائمة الحجوزات */}
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="relative">
                                <div className={`bg-[#E5F1FD] dark:bg-[#137FEC33] rounded-2xl p-6 border-r-[6px] ${booking.borderColor} shadow-sm flex flex-col gap-4`}>
                                    
                                    <div className="flex justify-between items-start w-full">
                                        {/* بيانات الحجز */}
                                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-right">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[#137FEC] font-bold text-sm shrink-0">الميكانيكي:</p>
                                                <p className="font-bold dark:text-white text-gray-800 truncate">{booking.mechanic}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[#137FEC] font-bold text-sm shrink-0">الخدمة:</p>
                                                <p className="font-bold dark:text-white text-gray-800 truncate">{booking.service}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[#137FEC] font-bold text-sm shrink-0">التاريخ:</p>
                                                <p className="font-bold dark:text-white text-gray-800">{booking.date}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[#137FEC] font-bold text-sm shrink-0">التوقيت:</p>
                                                <p className="font-bold dark:text-white text-gray-800">{booking.time}</p>
                                            </div>
                                        </div>

                                        {/* الحالة */}
                                        <div className="shrink-0">
                                            <span className={`px-8 py-2 rounded-xl text-sm font-bold shadow-sm ${booking.statusColor}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* الأزرار (تظهر في حالة قيد الانتظار) */}
                                    {booking.actions && (
                                        <div className="flex justify-center items-center gap-4 mt-2 pt-4 border-t border-blue-200/30">
                                            <button className="bg-[#EF4444] text-white px-10 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-red-600 transition-all">
                                                إلغاء الحجز
                                            </button>
                                            <button className="bg-[#94A3B8] text-white px-10 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-gray-500 transition-all">
                                                تغيير الموعد
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* بوب أب إضافة حجز جديد */}
            <AddBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default MaintenanceBookings;