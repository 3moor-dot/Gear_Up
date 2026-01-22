
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
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0b1120] overflow-hidden" dir="rtl">
      <AdminSidebar />

      <main className="flex-1 flex flex-col p-6 overflow-y-auto overflow-x-hidden gap-6 bg-white dark:bg-primary_BGD">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="text-right">
            <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">إدارة الميكانيكيين</h1>
            <p className="text-[#64748b] dark:text-gray-400 text-[13px]">عرض وبحث وإدارة جميع الميكانيكيين المسجلين.</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-3 flex-wrap justify-between">
          <div className={`flex-1 max-w-md order-1 rounded-lg ${inputButtonBg}`}>
            <input 
              type="text" 
              placeholder="ابحث حسب الاسم أو البريد الإلكتروني......." 
              className="w-full p-2.5 rounded-lg bg-transparent text-right dark:text-white text-sm placeholder:text-[#94a3b8] outline-none border border-transparent focus:border-blue-300 transition-all"
            />
          </div>

          <div className="flex gap-3 order-2">
            <button className={`px-5 py-2.5 rounded-lg ${inputButtonBg} text-[#1e293b] dark:text-gray-300 text-xs font-semibold`}>
              حالة الحساب: الكل
            </button>
            <button className={`px-5 py-2.5 rounded-lg ${inputButtonBg} text-[#1e293b] dark:text-gray-300 text-xs font-semibold`}>
              تاريخ التسجيل
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className={`${inputButtonBg}`}>
                <tr className="text-[#1e293b] dark:text-white text-[14px] border-b border-gray-50 dark:border-gray-800 uppercase tracking-wider font-semibold">
                  <th className="p-4">الاسم</th>
                  <th className="p-4 text-center">الحالة</th>
                  <th className="p-4 text-center">رقم الهاتف</th>
                  <th className="p-4 text-center">البريد</th>
                  <th className="p-4 text-center">تاريخ التسجيل</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {mechanics.map((mechanic) => (
                  <tr key={mechanic.id} className="hover:bg-[#EFF6FFCC] dark:hover:bg-[#FFFFFF0D] transition-colors cursor-pointer">
                    <td className="p-3 text-[#1e293b] dark:text-gray-200 text-sm font-medium">{mechanic.name}</td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(mechanic.status)}`}>
                        {mechanic.status}
                      </span>
                    </td>
                    <td className="p-3 text-center text-[#1e293b] dark:text-gray-300 text-sm font-medium">{mechanic.phone}</td>
                    <td className="p-3 text-center text-[#64748b] dark:text-gray-500 text-xs">{mechanic.email}</td>
                    <td className="p-3 text-center text-[#94a3b8] dark:text-gray-500 text-xs">{mechanic.regDate}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button className="hover:opacity-80 transition-opacity">
                          <FaEye size={18} color={dark ? "white" : "black"} />
                        </button>
                        <span className={dark ? "text-white" : "text-black"}>⋮</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-5">
          <div className="text-[#94a3b8] text-[11px]">عرض 1 إلى 10 من 2,345 ميكانيكي</div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '....', 10].map((item, idx) => (
              <button 
                key={idx}
                className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium transition-colors
                  ${item === 1 ? 'bg-[#e2e8f0] dark:bg-[#1e293b] text-[#1e293b] dark:text-white' : 'text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-gray-800'}`}
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
