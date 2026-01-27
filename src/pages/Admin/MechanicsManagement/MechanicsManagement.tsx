
import React from 'react';
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { FaEye } from "react-icons/fa";
import { useTheme } from "../../../contexts/ThemeContext";

interface Mechanic {
  id: number;
  name: string;
  status: 'نشط' | 'معلق' | 'مرفوض';
  phone: string;
  email: string;
  regDate: string;
}

const MechanicsManagement: React.FC = () => {
  const { dark } = useTheme();

  const mechanics: Mechanic[] = [
    { id: 1, name: 'John Doe', status: 'نشط', phone: '01098563624', email: 'john.doe@example.com', regDate: '2023-10-26' },
    { id: 2, name: 'John Doe', status: 'معلق', phone: '01098563614', email: 'john.doe@example.com', regDate: '2023-10-26' },
    { id: 3, name: 'John Doe', status: 'مرفوض', phone: '01068593214', email: 'john.doe@example.com', regDate: '2023-10-26' },
    { id: 4, name: 'John Doe', status: 'مرفوض', phone: '01068593214', email: 'john.doe@example.com', regDate: '2023-10-26' },
    { id: 5, name: 'John Doe', status: 'مرفوض', phone: '01068593214', email: 'john.doe@example.com', regDate: '2023-10-26' },
    { id: 6, name: 'John Doe', status: 'مرفوض', phone: '01068593214', email: 'john.doe@example.com', regDate: '2023-10-26' },
    { id: 7, name: 'John Doe', status: 'مرفوض', phone: '01068593214', email: 'john.doe@example.com', regDate: '2023-10-26' },
    { id: 8, name: 'John Doe', status: 'مرفوض', phone: '01068593214', email: 'john.doe@example.com', regDate: '2023-10-26' },
    { id: 9, name: 'John Doe', status: 'مرفوض', phone: '01068593214', email: 'john.doe@example.com', regDate: '2023-10-26' },
    { id: 10, name: 'John Doe', status: 'مرفوض', phone: '01068593214', email: 'john.doe@example.com', regDate: '2023-10-26' },
  ];

  const getStatusStyle = (status: Mechanic['status']) => {
    switch (status) {
      case 'نشط':
        return 'bg-[#ecfdf5] text-[#10b981] dark:bg-[#064e3b]/30 dark:text-[#34d399]';
      case 'معلق':
        return 'bg-[#fffbeb] text-[#f59e0b] dark:bg-[#451a03]/30 dark:text-[#fbbf24]';
      case 'مرفوض':
        return 'bg-[#fef2f2] text-[#ef4444] dark:bg-[#7f1d1d]/30 dark:text-[#f87171]';
    }
  };

  const inputButtonBg = 'bg-[#137FEC1A] dark:bg-[#137FEC1A]';

  return (
    <div className="flex min-h-screen bg-white dark:bg-primary_BGD text-[#1e293b] dark:text-white" dir="rtl">
      <AdminSidebar />

      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-x-hidden w-full mt-12 lg:mt-0">
        
        {/* Header - Stacks on small screens */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">إدارة الميكانيكيين</h1>
            <p className="text-[#64748b] dark:text-gray-400 text-sm">عرض وبحث وإدارة جميع الميكانيكيين المسجلين.</p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* Filters Section - Flexible Grid */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 mb-6">
          <div className={`flex-1 rounded-xl ${inputButtonBg}`}>
            <input 
              type="text" 
              placeholder="ابحث حسب الاسم أو البريد الإلكتروني..." 
              className="w-full p-3 rounded-xl bg-transparent text-right dark:text-white text-sm placeholder:text-[#94a3b8] outline-none border border-transparent focus:border-[#137FEC] transition-all"
            />
          </div>

          <div className="flex gap-3">
            <button className={`flex-1 lg:flex-none px-6 py-3 rounded-xl ${inputButtonBg} text-[#1e293b] dark:text-gray-300 text-xs font-bold whitespace-nowrap`}>
              حالة الحساب: الكل
            </button>
            <button className={`flex-1 lg:flex-none px-6 py-3 rounded-xl ${inputButtonBg} text-[#1e293b] dark:text-gray-300 text-xs font-bold whitespace-nowrap`}>
              تاريخ التسجيل
            </button>
          </div>
        </div>

        {/* Table Section - Horizontal Scroll protection */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[850px]">
              <thead className={`${inputButtonBg}`}>
                <tr className="text-[#1e293b] dark:text-white text-sm border-b border-gray-50 dark:border-gray-800 font-bold">
                  <th className="p-4">الاسم</th>
                  <th className="p-4 text-center">الحالة</th>
                  <th className="p-4 text-center">رقم الهاتف</th>
                  <th className="p-4 text-center">البريد</th>
                  <th className="p-4 text-center">تاريخ التسجيل</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-sm">
                {mechanics.map((mechanic) => (
                  <tr key={mechanic.id} className="hover:bg-[#EFF6FFCC] dark:hover:bg-[#FFFFFF0D] transition-colors cursor-pointer group">
                    <td className="p-4 font-bold whitespace-nowrap">{mechanic.name}</td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`px-4 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(mechanic.status)}`}>
                        {mechanic.status}
                      </span>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap font-medium">{mechanic.phone}</td>
                    <td className="p-4 text-center text-[#64748b] dark:text-gray-400 whitespace-nowrap">{mechanic.email}</td>
                    <td className="p-4 text-center text-[#94a3b8] dark:text-gray-500 whitespace-nowrap">{mechanic.regDate}</td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-4">
                        <button className="p-2 hover:bg-[#137FEC1A] rounded-lg transition-transform hover:scale-110">
                          <FaEye size={18} color={dark ? "#E5E7EB" : "#1E293B"} />
                        </button>
                        <button className="text-xl font-bold opacity-50 hover:opacity-100 px-2">⋮</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer / Pagination - Stacks on mobile */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4">
          <div className="text-[#94a3b8] text-xs order-2 md:order-1">عرض 1 إلى 10 من 2,345 ميكانيكي</div>
          <div className="flex items-center gap-2 order-1 md:order-2">
            {[1, 2, 3, '....', 10].map((item, idx) => (
              <button 
                key={idx}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                  ${item === 1 
                    ? 'bg-[#137FEC] text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-[#137FEC1A] text-[#137FEC] hover:bg-[#137FEC] hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default MechanicsManagement;