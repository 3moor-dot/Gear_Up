
// import React from "react";

// interface AddSupervisorProps {
//   dark: boolean;
//   onClose: () => void;
// }

// const AddSupervisor: React.FC<AddSupervisorProps> = ({ dark, onClose }) => {
//   const inputClasses = `
//     w-full rounded-lg px-5 py-3
//     ${dark ? "bg-[#122b4d]" : "bg-[#dbeafe]"}
//     border border-transparent
//     placeholder-gray-500 dark:placeholder-gray-400
//     outline-none
//     focus:border-blue-500 focus:shadow-md
//     transition duration-200 ease-in-out
//     hover:scale-105 hover:shadow-md
//   `;

//   const buttonPrimary = `
//     px-7 py-2.5 rounded-lg
//     bg-[#137FEC] text-white
//     transition duration-200 ease-in-out
//     hover:opacity-90 hover:scale-105 hover:shadow-lg
//   `;

//   const buttonSecondary = `
//     px-7 py-2.5 rounded-lg
//     bg-black text-white
//     transition duration-200 ease-in-out
//     hover:opacity-80 hover:scale-105 hover:shadow-lg
//   `;

//   return (
//     <div
//       dir="rtl"
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//     >
//       <div
//         className={`w-full max-w-3xl min-h-[540px] rounded-2xl overflow-hidden
//           ${dark ? "bg-[#0b1d33] text-white" : "bg-[#eef5ff] text-gray-900"}
//           shadow-xl
//         `}
//       >
//         {/* Header */}
//         <div
//           className={`px-8 py-6 border-b flex items-center justify-between ${
//             dark ? "border-blue-900" : "border-blue-500"
//           }`}
//         >
//           <div>
//             <h2 className="text-xl font-bold">إضافة مسؤول جديد</h2>
//             <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>
//               قم بملء التفاصيل أدناه لإنشاء حساب مسؤول جديد
//             </p>
//           </div>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             ✕
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-8 py-8 space-y-6">
//           <div>
//             <label className="block mb-2 text-sm font-bold">الاسم بالكامل</label>
//             <input type="text" placeholder="أدخل الاسم الكامل للمسؤول" className={inputClasses} />
//           </div>

//           <div>
//             <label className="block mb-2 text-sm font-bold">عنوان البريد الإلكتروني</label>
//             <input type="email" placeholder="alex.johnson@example.com" className={inputClasses} />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block mb-2 text-sm font-bold">كلمة المرور</label>
//               <input type="password" placeholder="أدخل كلمة مرور آمنة" className={inputClasses} />
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-bold">تأكيد كلمة المرور</label>
//               <input type="password" placeholder="أعد إدخال كلمة المرور" className={inputClasses} />
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-8 py-6 flex justify-start gap-4 border-t" 
//           style={{ borderColor: dark ? "#1E2A44" : "#DCEEFF" }}
//         >
//           <button className={buttonPrimary}>إضافة مشرف جديد</button>
//           <button onClick={onClose} className={buttonSecondary}>إلغاء</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSupervisor;


import React from "react";

interface AddSupervisorProps {
  dark: boolean;
  onClose: () => void;
}

const AddSupervisor: React.FC<AddSupervisorProps> = ({ dark, onClose }) => {
  const inputClasses = `
    w-full rounded-lg px-5 py-3
    ${dark ? "bg-[#122b4d]" : "bg-[#dbeafe]"}
    border border-transparent
    placeholder-gray-500 dark:placeholder-gray-400
    outline-none
    focus:border-blue-500 focus:shadow-md
    transition duration-200 ease-in-out
    hover:scale-105 hover:shadow-md
  `;

  const buttonPrimary = `
    px-7 py-2.5 rounded-lg
    bg-[#137FEC] text-white
    transition duration-200 ease-in-out
    hover:opacity-90 hover:scale-105 hover:shadow-lg
  `;

  const buttonSecondary = `
    px-7 py-2.5 rounded-lg
    bg-black text-white
    transition duration-200 ease-in-out
    hover:opacity-80 hover:scale-105 hover:shadow-lg
  `;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        className={`w-full max-w-3xl min-h-[540px] rounded-2xl overflow-hidden
          ${dark ? "bg-[#0b1d33] text-white" : "bg-[#eef5ff] text-gray-900"}
          shadow-xl
        `}
      >
        {/* Header */}
        <div
          className={`px-8 py-6 border-b flex items-center justify-between ${
            dark ? "border-blue-900" : "border-blue-500"
          }`}
        >
          <div>
            <h2 className="text-xl font-bold">إضافة مسؤول جديد</h2>
            <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>
              قم بملء التفاصيل أدناه لإنشاء حساب مسؤول جديد
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-6">
          <div>
            <label className="block mb-2 text-sm font-bold">الاسم بالكامل</label>
            <input type="text" placeholder="أدخل الاسم الكامل للمسؤول" className={inputClasses} />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold">عنوان البريد الإلكتروني</label>
            <input type="email" placeholder="alex.johnson@example.com" className={inputClasses} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-bold">كلمة المرور</label>
              <input type="password" placeholder="أدخل كلمة مرور آمنة" className={inputClasses} />
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold">تأكيد كلمة المرور</label>
              <input type="password" placeholder="أعد إدخال كلمة المرور" className={inputClasses} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex justify-start gap-4 border-t" 
          style={{ borderColor: dark ? "#1E2A44" : "#DCEEFF" }}
        >
          <button className={buttonPrimary}>إضافة مشرف جديد</button>
          <button onClick={onClose} className={buttonSecondary}>إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default AddSupervisor;

