

// import React, { useState } from "react";
// import { FaPlus } from "react-icons/fa";
// import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
// import NotificationBell from "../../components/NotificationBell/notification_bell";
// import ThemeToggle from "../../components/ThemeToggle/theme_toggle";
// import { useTheme } from "../../contexts/ThemeContext";
// import AddSupervisor from "./Add_supervisor"; 

// const SupervisorManagement: React.FC = () => {
//   const { dark } = useTheme();
//   const [showAddModal, setShowAddModal] = useState(false); 
//   const supervisors = Array.from({ length: 9 });

//   return (
//     <div
//       dir="rtl"
//       className={`min-h-screen flex transition-colors duration-500
//         ${dark ? "bg-[#0B1020] text-white" : "bg-white text-[#1E3A5F]"}
//       `}
//     >
//       <AdminSidebar />

//       <main className="flex-1 p-8">
//         {/* HEADER */}
//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h1 className="text-3xl font-bold mb-1">إدارة المشرفين</h1>
//             <p className={`${dark ? "text-white/50" : "text-[#5C7AA5]"} text-sm`}>
//               إدارة الوصول والأذونات لمسؤولي النظام
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             <NotificationBell
//               onClick={() => console.log("Notifications clicked")}
//             />
//             <ThemeToggle />
//           </div>
//         </div>

//         {/* SEARCH & FILTERS */}
//         <div className="flex items-center gap-4 mb-6">
//           <input
//             placeholder="البحث حسب الاسم أو البريد الإلكتروني..."
//             className={`flex-1 h-[45px] py-3 rounded-xl text-sm outline-none transition-colors
//               ${
//                 dark
//                   ? "bg-[#0E162A] border border-[#1E2A44] text-white"
//                   : "bg-[#EEF6FF] border border-[#D6E9FF] text-[#1E3A5F]"
//               }`}
//           />

//           <select
//             className={`h-[45px] py-2 rounded-xl text-sm outline-none transition-colors
//               ${
//                 dark
//                   ? "bg-[#0E162A] border border-[#1E2A44] text-white"
//                   : "bg-[#EEF6FF] border border-[#D6E9FF] text-[#1E3A5F]"
//               }`}
//           >
//             <option>الحالة: نشط</option>
//             <option>الحالة: معطل</option>
//           </select>
//         </div>
//         {/* ADD BUTTON */}
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="flex items-center gap-2 bg-[#137FEC] hover:bg-[#0F6AD1] text-white px-5 py-3 rounded-xl mb-6 text-sm transition"
//         >
//           <FaPlus />
//           إضافة مسؤول جديد
//         </button>

//         {/* TABLE */}
//         <div
//           className={`rounded-2xl overflow-hidden transition-colors
//             ${
//               dark
//                 ? "bg-[#0E162A] border border-[#1E2A44]"
//                 : "bg-white border border-[#E3EEFF]"
//             }`}
//         >
//           <table className="w-full text-sm">
//             <thead
//               className={`${
//                 dark
//                   ? "bg-[#0B1020] text-white/60"
//                   : "bg-[#EAF4FF] text-[#5C7AA5]"
//               }`}
//             >
//               <tr>
//                 <th className="py-4 px-4 text-right">الاسم</th>
//                 <th className="py-4 px-4 text-right">البريد</th>
//                 <th className="py-4 px-4 text-right">الحالة</th>
//                 <th className="py-4 px-4 text-right">آخر تسجيل دخول</th>
//                 <th className="py-4 px-4 text-right">الإجراءات</th>
//               </tr>
//             </thead>

//             <tbody>
//               {supervisors.map((_, i) => (
//                 <tr
//                   key={i}
//                   className={`border-t transition
//                     ${
//                       dark
//                         ? "border-[#1E2A44] hover:bg-[#111B34]"
//                         : "border-[#E3EEFF] hover:bg-[#F5F9FF]"
//                     }`}
//                 >
//                   <td className="px-4 py-4">Jane Cooper</td>
//                   <td className="px-4 py-4 text-sm opacity-70">
//                     alex.j@gearup.ai
//                   </td>
//                   <td className="px-4 py-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium
//                         ${
//                           i === 1
//                             ? "bg-red-500/15 text-red-500"
//                             : "bg-green-500/15 text-green-500"
//                         }`}
//                     >
//                       {i === 1 ? "معطل" : "نشط"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 opacity-70">
//                     2023-10-27 10:30 AM
//                   </td>
//                   <td className="px-4 py-4 text-center">•••</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {/* Add Supervisor Modal */}
//       {showAddModal && (
//         <AddSupervisor onClose={() => setShowAddModal(false)} dark={dark} />
//       )}
//     </div>
//   );
// };

// export default SupervisorManagement;


import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../contexts/ThemeContext";
import AddSupervisor from "./add_supervisor";

const SupervisorManagement: React.FC = () => {
  const { dark } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const supervisors = Array.from({ length: 9 });

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex transition-colors duration-500
        ${dark ? "dark:bg-primary_BGD text-white" : "bg-white text-[#1E3A5F]"}
      `}
    >
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1
              className={`${
                dark ? "text-white" : "text-black"
              } text-3xl font-bold mb-1`}
            >
              إدارة المشرفين
            </h1>
            <p
              className={`${
                dark ? "text-white/50" : "text-black/50"
              } text-sm`}
            >
              إدارة الوصول والأذونات لمسؤولي النظام
            </p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell onClick={() => {}} />
            <ThemeToggle />
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-4">
          <input
            placeholder="البحث حسب الاسم أو البريد الإلكتروني..."
            className={`w-full h-[45px] px-4 rounded-xl text-sm outline-none transition-colors
              ${
                dark
                  ? "bg-[#0E162A] border border-[#1E2A44] text-white"
                  : "bg-[#EEF6FF] border border-[#D6E9FF] text-[#1E3A5F]"
              }`}
          />
        </div>

        {/* STATUS (RIGHT) & ADD BUTTON (LEFT) */}
        <div className="flex items-center justify-between mb-6">
          {/* STATUS */}
          <select
            className={`h-[45px] px-4 rounded-xl text-sm outline-none transition-colors
              ${
                dark
                  ? "bg-[#0E162A] border border-[#1E2A44] text-white"
                  : "bg-[#EEF6FF] border border-[#D6E9FF] text-[#0F132380]"
              }`}
          >
            <option>الحالة: نشط</option>
            <option>الحالة: معطل</option>
          </select>

          {/* ADD BUTTON */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#137FEC] hover:bg-[#0F6AD1] text-white px-5 py-3 rounded-xl text-sm transition"
          >
            <FaPlus />
            إضافة مسؤول جديد
          </button>
        </div>

        {/* TABLE */}
        <div
          className={`rounded-2xl overflow-hidden transition-colors
            ${
              dark
                ? "bg-[#0E162A] border border-[#1E2A44]"
                : "bg-white border border-[#E3EEFF]"
            }`}
        >
          <table className="w-full text-sm">
            <thead
              className={`${
                dark
                  ? "bg-primary_BGD text-white/60"
                  : "bg-[#EAF4FF] text-[#5C7AA5]"
              }`}
            >
              <tr>
                <th className="py-4 px-4 text-right">الاسم</th>
                <th className="py-4 px-4 text-right">البريد</th>
                <th className="py-4 px-4 text-right">الحالة</th>
                <th className="py-4 px-4 text-right">آخر تسجيل دخول</th>
                <th className="py-4 px-4 text-right">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {supervisors.map((_, i) => (
                <tr
                  key={i}
                  className={`border-t transition
                    ${
                      dark
                        ? "border-[#1E2A44] hover:bg-[#111B34]"
                        : "border-[#E3EEFF] hover:bg-[#F5F9FF]"
                    }`}
                >
                  <td className="px-4 py-4">Jane Cooper</td>
                  <td className="px-4 py-4 text-sm opacity-70">
                    alex.j@gearup.ai
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          i === 1
                            ? "bg-red-500/15 text-red-500"
                            : "bg-green-500/15 text-green-500"
                        }`}
                    >
                      {i === 1 ? "معطل" : "نشط"}
                    </span>
                  </td>
                  <td className="px-4 py-4 opacity-70">
                    2023-10-27 10:30 AM
                  </td>
                  <td className="px-4 py-4 text-center">•••</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showAddModal && (
        <AddSupervisor onClose={() => setShowAddModal(false)} dark={dark} />
      )}
    </div>
  );
};

export default SupervisorManagement;

