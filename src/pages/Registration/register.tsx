
// import { useState } from "react";
// import {
//   FaUser, FaPhone, FaEnvelope, FaLock, FaUserTie, FaTools
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import Swal from "sweetalert2"; // 1. استيراد المكتبة

// /* ---- validation helpers ---- */
// const validateStep1 = (fields: {
//   firstName: string; lastName: string;
//   phone: string; email: string; password: string;
// }) => {
//   const errs: Record<string, string> = {};
//   if (!fields.firstName.trim())              errs.firstName = "الاسم الأول مطلوب";
//   else if (/\d/.test(fields.firstName))      errs.firstName = "الاسم لا يجب أن يحتوي على أرقام";
//   if (!fields.lastName.trim())               errs.lastName  = "اسم العائلة مطلوب";
//   else if (/\d/.test(fields.lastName))       errs.lastName  = "الاسم لا يجب أن يحتوي على أرقام";
//   if (!fields.phone.trim())                  errs.phone     = "رقم الهاتف مطلوب";
//   else if (!/^\+?\d{7,15}$/.test(fields.phone.replace(/\s/g, "")))
//                                              errs.phone     = "رقم الهاتف غير صحيح";
//   if (!fields.email.trim())                  errs.email     = "البريد الإلكتروني مطلوب";
//   else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
//                                              errs.email     = "البريد الإلكتروني غير صحيح";
//   if (!fields.password)                      errs.password  = "كلمة المرور مطلوبة";
//   else if (fields.password.length < 8)       errs.password  = "كلمة المرور 8 أحرف على الأقل";
//   return errs;
// };

// /* ---- FormInput Component ---- */
// const FormInput = ({
//   label, icon, placeholder, type = "text", value, onChange, error,
// }: {
//   label: string; icon: React.ReactNode; placeholder: string;
//   type?: string; value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   error?: string;
// }) => {
//   const [showPass, setShowPass] = useState(false);
//   const isPassword = type === "password";
//   const inputType  = isPassword ? (showPass ? "text" : "password") : type;

//   return (
//     <div className="w-full text-right">
//       <label className="block mb-1.5 font-bold dark:text-white text-xs">{label}</label>
//       <div className="relative">
//         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
//         <input
//           type={inputType}
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           className={`w-full bg-white dark:bg-[#137FEC1A] border pr-11 py-3 rounded-xl outline-none text-sm text-gray-800 dark:text-gray-200 transition-all ${
//             isPassword ? "pl-11" : ""
//           } ${
//             error
//               ? "border-red-400 ring-2 ring-red-200 dark:ring-red-900/40"
//               : "border-gray-200 dark:border-transparent focus:ring-2 focus:ring-blue-500"
//           }`}
//         />
//         {isPassword && (
//           <button
//             type="button"
//             onClick={() => setShowPass(!showPass)}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#137FEC] transition-colors"
//           >
//             {showPass ? (
//                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//              </svg>
//             ) : (
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.38-4.152M9.878 9.878a3 3 0 104.243 4.243M3 3l18 18" />
//               </svg>
//             )}
//           </button>
//         )}
//       </div>
//       {error && (
//         <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
//           <span>⚠</span> {error}
//         </p>
//       )}
//     </div>
//   );
// };

// /* ---- Register Component ---- */
// const Register: React.FC = () => {
//   const [role, setRole]       = useState<"client" | "mechanic">("client");
//   const [step, setStep]       = useState<1 | 2>(1);
//   const [loading, setLoading] = useState(false);
//   const [, setApiError] = useState<string | null>(null);

//   const [firstName, setFirstName] = useState("");
//   const [lastName,  setLastName]  = useState("");
//   const [phone,     setPhone]     = useState("");
//   const [email,     setEmail]     = useState("");
//   const [password,  setPassword]  = useState("");

//   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

//   const isDarkMode = () => document.documentElement.classList.contains('dark');

//   const handleNext = () => {
//     const errs = validateStep1({ firstName, lastName, phone, email, password });
//     if (Object.keys(errs).length > 0) {
//       setFieldErrors(errs);
//       // تنبيه بوب اب عند وجود أخطاء في الحقول
//       Swal.fire({
//         icon: "warning",
//         title: "بيانات غير مكتملة",
//         text: "يرجى التحقق من الحقول الموضحة باللون الأحمر",
//         confirmButtonText: "موافق",
//         confirmButtonColor: "#137FEC",
//         background: isDarkMode() ? '#1B1F2D' : '#fff',
//         color: isDarkMode() ? '#fff' : '#000',
//       });
//       return;
//     }
//     setFieldErrors({});
//     setApiError(null);
//     setStep(2);
//   };

//   const clearErr = (key: string) =>
//     setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });

//   const handleSubmit = async () => {
//     setLoading(true);
//     setApiError(null);
//     const roleNumber = role === "client" ? 1 : 2;
//     const body = {
//       firstName, lastName, email, password, phone,
//       role: roleNumber,
//       customerLocation: { latitude: 0, longitude: 0 },
//       mechanicLocation: { latitude: 0, longitude: 0 },
//     };
//     try {
//       const res  = await fetch("https://gearupapp.runasp.net/api/users/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const data = await res.json().catch(() => null);
      
//       if (!res.ok) {
//         const msg = data?.errors
//           ? Object.values(data.errors).flat().join(" | ")
//           : data?.message || data?.title || `فشل التسجيل (${res.status})`;
//         throw new Error(msg as string);
//       }

//       // رسالة نجاح احترافية
//       Swal.fire({
//         icon: "success",
//         title: "تم إنشاء الحساب!",
//         text: "أهلاً بك في GearUp",
//         timer: 3000,
//         showConfirmButton: false,
//         background: isDarkMode() ? '#1B1F2D' : '#fff',
//         color: isDarkMode() ? '#fff' : '#000',
//       });

//       setTimeout(() => {
//         // window.location.href = "/login";
//         if (roleNumber === 2) {
//           // ميكانيكي → روح رفع الترخيص
//           const userId = data?.id; // مهم جدًا لازم يرجع من الـ API
        
//           localStorage.setItem("pendingMechanicId", userId);
        
//           window.location.href = "/upload-license";
//         } else {
//           // عميل → login عادي
//           window.location.href = "/login";
//         }
//       }, 3000);

//     } catch (err: any) {
//       setApiError(err.message || "حدث خطأ، حاول مجدداً");
//       // تنبيه بوب اب للخطأ القادم من السيرفر
//       Swal.fire({
//         icon: "error",
//         title: "خطأ في التسجيل",
//         text: err.message,
//         confirmButtonText: "حاول مرة أخرى",
//         confirmButtonColor: "#137FEC",
//         background: isDarkMode() ? '#1B1F2D' : '#fff',
//         color: isDarkMode() ? '#fff' : '#000',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen py-10 flex items-center justify-center px-4 bg-gradient-to-br from-[#EAF4FF] to-white dark:from-[#0F1323] dark:to-[#101922] transition-colors duration-500"
//       dir="rtl"
//     >
//       <div className="dark:bg-[#1B1F2D] max-w-xl w-full bg-[#EAF4FF] rounded-3xl p-8 sm:p-10 shadow-xl border border-white/20">

//         <h1 className="text-3xl font-bold text-center mb-2 dark:text-white">إنشاء حسابك</h1>
//         <p className="text-center text-gray-500 mb-8 text-sm">
//           {step === 1 ? "بياناتك الأساسية" : "اختر نوع الحساب لإتمام العملية"}
//         </p>

//         <div className="flex items-center justify-center gap-2 mb-8">
//           {[1, 2].map((s) => (
//             <div key={s} className={`h-2 rounded-full transition-all duration-300 ${
//               s === step ? "w-8 bg-[#137FEC]" : "w-4 bg-gray-300 dark:bg-gray-600"
//             }`} />
//           ))}
//         </div>

//         <AnimatePresence mode="wait">
//           {step === 1 && (
//             <motion.div
//               key="step1"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-4"
//             >
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <FormInput
//                   label="الاسم الأول" icon={<FaUser />} placeholder="الاسم الأول"
//                   value={firstName} error={fieldErrors.firstName}
//                   onChange={(e) => { setFirstName(e.target.value); clearErr("firstName"); }}
//                 />
//                 <FormInput
//                   label="اسم العائلة" icon={<FaUser />} placeholder="اسم العائلة"
//                   value={lastName} error={fieldErrors.lastName}
//                   onChange={(e) => { setLastName(e.target.value); clearErr("lastName"); }}
//                 />
//               </div>
//               <FormInput
//                 label="رقم الهاتف" icon={<FaPhone />} placeholder="+20xxxxxxxx"
//                 value={phone} error={fieldErrors.phone}
//                 onChange={(e) => { setPhone(e.target.value); clearErr("phone"); }}
//               />
//               <FormInput
//                 label="البريد الإلكتروني" icon={<FaEnvelope />} placeholder="example@mail.com"
//                 value={email} error={fieldErrors.email}
//                 onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
//               />
//               <FormInput
//                 label="كلمة المرور" icon={<FaLock />} placeholder="8 أحرف على الأقل"
//                 type="password" value={password} error={fieldErrors.password}
//                 onChange={(e) => { setPassword(e.target.value); clearErr("password"); }}
//               />
//             </motion.div>
//           )}

//           {step === 2 && (
//             <motion.div
//               key="step2"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="py-6"
//             >
//               <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
//                 <button
//                   onClick={() => setRole("client")}
//                   className={`flex flex-col items-center justify-center gap-4 p-7 sm:p-8 rounded-3xl border-2 transition-all duration-300 ${
//                     role === "client"
//                       ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-2xl scale-105"
//                       : "border-gray-200 dark:border-gray-700 text-gray-400 bg-transparent"
//                   }`}
//                 >
//                   <FaUserTie size={36} />
//                   <span className="font-bold text-base sm:text-lg">سجل كعميل</span>
//                 </button>
//                 <button
//                   onClick={() => setRole("mechanic")}
//                   className={`flex flex-col items-center justify-center gap-4 p-7 sm:p-8 rounded-3xl border-2 transition-all duration-300 ${
//                     role === "mechanic"
//                       ? "border-[#137FEC] bg-[#137FEC] text-white shadow-2xl scale-105"
//                       : "border-gray-200 dark:border-gray-700 text-gray-400 bg-transparent"
//                   }`}
//                 >
//                   <FaTools size={36} />
//                   <span className="font-bold text-base sm:text-lg">سجل كميكانيكي</span>
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className="flex gap-3 mt-8">
//           {step === 2 && (
//             <button
//               onClick={() => setStep(1)}
//               className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
//             >
//               السابق
//             </button>
//           )}
//           <button
//             onClick={step === 1 ? handleNext : handleSubmit}
//             disabled={loading}
//             className="flex-[2] bg-[#137FEC] text-white py-4 rounded-xl text-base sm:text-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
//           >
//             {loading ? "جارٍ الإنشاء..." : step === 1 ? "متابعة" : "إنشاء الحساب الآن"}
//           </button>
//         </div>

//         <p className="text-center mt-6 dark:text-white text-sm">
//           لديك حساب؟{" "}
//           <span
//             onClick={() => (window.location.href = "/login")}
//             className="text-[#137FEC] font-bold cursor-pointer hover:underline"
//           >
//             تسجيل الدخول
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;

import { useState, useRef, useEffect } from "react";
import { FaUser, FaPhone, FaEnvelope, FaLock, FaUserTie, FaTools } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

/* ---- validation helpers ---- */
const validateStep1 = (fields: {
  firstName: string; lastName: string;
  phone: string; email: string; password: string;
}) => {
  const errs: Record<string, string> = {};
  if (!fields.firstName.trim())           errs.firstName = "الاسم الأول مطلوب";
  else if (/\d/.test(fields.firstName))   errs.firstName = "الاسم لا يجب أن يحتوي على أرقام";
  if (!fields.lastName.trim())            errs.lastName  = "اسم العائلة مطلوب";
  else if (/\d/.test(fields.lastName))    errs.lastName  = "الاسم لا يجب أن يحتوي على أرقام";
  if (!fields.phone.trim())               errs.phone     = "رقم الهاتف مطلوب";
  else if (!/^\+?\d{7,15}$/.test(fields.phone.replace(/\s/g, "")))
                                          errs.phone     = "رقم الهاتف غير صحيح";
  if (!fields.email.trim())               errs.email     = "البريد الإلكتروني مطلوب";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
                                          errs.email     = "البريد الإلكتروني غير صحيح";
  if (!fields.password)                   errs.password  = "كلمة المرور مطلوبة";
  else if (fields.password.length < 8)    errs.password  = "كلمة المرور 8 أحرف على الأقل";
  return errs;
};

/* ---- FormInput Component ---- */
const FormInput = ({
  label, icon, placeholder, type = "text", value, onChange, error,
}: {
  label: string; icon: React.ReactNode; placeholder: string;
  type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword ? (showPass ? "text" : "password") : type;

  return (
    <div className="w-full text-right">
      <label className="block mb-1.5 font-bold dark:text-white text-xs">{label}</label>
      <div className="relative">
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-white dark:bg-[#137FEC1A] border pr-11 py-3 rounded-xl outline-none text-sm text-gray-800 dark:text-gray-200 transition-all ${
            isPassword ? "pl-11" : ""
          } ${
            error
              ? "border-red-400 ring-2 ring-red-200 dark:ring-red-900/40"
              : "border-gray-200 dark:border-transparent focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#137FEC] transition-colors"
          >
            {showPass ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.38-4.152M9.878 9.878a3 3 0 104.243 4.243M3 3l18 18" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

/* ---- OTP Input Component ---- */
const OtpInput = ({
  otp,
  onChange,
}: {
  otp: string[];
  onChange: (otp: string[]) => void;
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    onChange(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    onChange(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-3 my-6" dir="ltr">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
            bg-[#1e2540] text-white
            ${digit
              ? "border-[#137FEC] shadow-[0_0_12px_#137FEC55]"
              : "border-[#2e3555] focus:border-[#137FEC]"
            }
          `}
        />
      ))}
    </div>
  );
};

/* ---- Countdown Timer Hook ---- */
const useCountdown = (initial: number) => {
  const [seconds, setSeconds] = useState(initial);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!active || seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [active, seconds]);

  const reset = () => { setSeconds(initial); setActive(true); };
  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return { seconds, formatted, reset, done: seconds <= 0 };
};

/* ---- Main Register Component ---- */
// Steps: 1=بيانات, 2=OTP, 3=نوع الحساب
type Step = 1 | 2 | 3;

const Register: React.FC = () => {
  const [step, setStep]       = useState<Step>(1);
  const [role, setRole]       = useState<"client" | "mechanic">("client");
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [phone,     setPhone]     = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");

  const [otp, setOtp]           = useState<string[]>(Array(6).fill(""));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const countdown = useCountdown(59);

  const isDarkMode = () => document.documentElement.classList.contains("dark");

  const clearErr = (key: string) =>
    setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });

  /* Step 1 → call OTP endpoint → move to Step 2 */
  const handleNext = async () => {
    const errs = validateStep1({ firstName, lastName, phone, email, password });
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      Swal.fire({
        icon: "warning",
        title: "بيانات غير مكتملة",
        text: "يرجى التحقق من الحقول الموضحة باللون الأحمر",
        confirmButtonText: "موافق",
        confirmButtonColor: "#137FEC",
        background: isDarkMode() ? "#1B1F2D" : "#fff",
        color: isDarkMode() ? "#fff" : "#000",
      });
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const res = await fetch("https://gearupapp.runasp.net/api/users/user-registration-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.message || data?.title || `فشل إرسال الرمز (${res.status})`;
        throw new Error(msg);
      }
      countdown.reset();
      setStep(2);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: err.message || "حدث خطأ، حاول مجدداً",
        confirmButtonText: "حاول مرة أخرى",
        confirmButtonColor: "#137FEC",
        background: isDarkMode() ? "#1B1F2D" : "#fff",
        color: isDarkMode() ? "#fff" : "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  /* Step 2 → verify OTP → move to Step 3 */
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "أدخل الرمز كاملاً",
        text: "يرجى إدخال جميع خانات الرمز",
        confirmButtonText: "موافق",
        confirmButtonColor: "#137FEC",
        background: isDarkMode() ? "#1B1F2D" : "#fff",
        color: isDarkMode() ? "#fff" : "#000",
      });
      return;
    }
    setStep(3);
  };

  /* Step 3 → final register */
  const handleSubmit = async () => {
    setLoading(true);
    const roleNumber = role === "client" ? 1 : 2;
    const body = {
      firstName, lastName, email, password, phone,
      role: roleNumber,
      otp: otp.join(""),
      customerLocation: { latitude: 0, longitude: 0 },
      mechanicLocation: { latitude: 0, longitude: 0 },
    };
    try {
      const res  = await fetch("https://gearupapp.runasp.net/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = data?.errors
          ? Object.values(data.errors).flat().join(" | ")
          : data?.message || data?.title || `فشل التسجيل (${res.status})`;
        throw new Error(msg as string);
      }
      Swal.fire({
        icon: "success",
        title: "تم إنشاء الحساب!",
        text: "أهلاً بك في GearUp",
        timer: 3000,
        showConfirmButton: false,
        background: isDarkMode() ? "#1B1F2D" : "#fff",
        color: isDarkMode() ? "#fff" : "#000",
      });
      setTimeout(() => {
        if (roleNumber === 2) {
          const userId = data?.id;
          localStorage.setItem("pendingMechanicId", userId);
          window.location.href = "/upload-license";
        } else {
          window.location.href = "/login";
        }
      }, 3000);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "خطأ في التسجيل",
        text: err.message,
        confirmButtonText: "حاول مرة أخرى",
        confirmButtonColor: "#137FEC",
        background: isDarkMode() ? "#1B1F2D" : "#fff",
        color: isDarkMode() ? "#fff" : "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 3;
  const stepTitles: Record<Step, string> = {
    1: "بياناتك الأساسية",
    2: "التحقق من حسابك",
    3: "اختر نوع الحساب لإتمام العملية",
  };

  return (
    <div
      className="min-h-screen py-10 flex items-center justify-center px-4 bg-gradient-to-br from-[#EAF4FF] to-white dark:from-[#0F1323] dark:to-[#101922] transition-colors duration-500"
      dir="rtl"
    >
      <div className="dark:bg-[#1B1F2D] max-w-xl w-full bg-[#EAF4FF] rounded-3xl p-8 sm:p-10 shadow-xl border border-white/20">

        <h1 className="text-3xl font-bold text-center mb-2 dark:text-white">
          {step === 2 ? "التحقق من حسابك" : "إنشاء حسابك"}
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">{stepTitles[step]}</p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 rounded-full transition-all duration-300 ${
              s === step ? "w-8 bg-[#137FEC]" : s < step ? "w-4 bg-[#137FEC]/50" : "w-4 bg-gray-300 dark:bg-gray-600"
            }`} />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ─── Step 1: Basic Info ─── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="الاسم الأول" icon={<FaUser />} placeholder="الاسم الأول"
                  value={firstName} error={fieldErrors.firstName}
                  onChange={(e) => { setFirstName(e.target.value); clearErr("firstName"); }}
                />
                <FormInput
                  label="اسم العائلة" icon={<FaUser />} placeholder="اسم العائلة"
                  value={lastName} error={fieldErrors.lastName}
                  onChange={(e) => { setLastName(e.target.value); clearErr("lastName"); }}
                />
              </div>
              <FormInput
                label="رقم الهاتف" icon={<FaPhone />} placeholder="+20xxxxxxxx"
                value={phone} error={fieldErrors.phone}
                onChange={(e) => { setPhone(e.target.value); clearErr("phone"); }}
              />
              <FormInput
                label="البريد الإلكتروني" icon={<FaEnvelope />} placeholder="example@mail.com"
                value={email} error={fieldErrors.email}
                onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
              />
              <FormInput
                label="كلمة المرور" icon={<FaLock />} placeholder="8 أحرف على الأقل"
                type="password" value={password} error={fieldErrors.password}
                onChange={(e) => { setPassword(e.target.value); clearErr("password"); }}
              />
            </motion.div>
          )}

          {/* ─── Step 2: OTP ─── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="py-2"
            >
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                لضمان سلامتك، يرجى إدخال الرمز المكون من 6 أرقام<br />
                الذي أرسلناه إلى عنوان بريدك الإلكتروني للمتابعة.
              </p>

              <OtpInput otp={otp} onChange={setOtp} />

              {/* Timer & resend */}
              <div className="flex items-center justify-between px-2 mt-2 text-sm" dir="rtl">
                <span className="text-gray-500 dark:text-gray-400">
                  لم تستلم الرمز؟{" "}
                  <button
                    disabled={!countdown.done}
                    onClick={() => {
                      if (countdown.done) {
                        // Re-call OTP endpoint
                        fetch("https://gearupapp.runasp.net/api/users/user-registration-otp", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email }),
                        });
                        countdown.reset();
                      }
                    }}
                    className={`font-bold transition-colors ${
                      countdown.done
                        ? "text-[#137FEC] hover:underline cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    أعد الإرسال
                  </button>
                </span>
                <span className={`font-mono font-bold ${countdown.done ? "text-red-400" : "text-gray-700 dark:text-gray-300"}`}>
                  {countdown.formatted}
                </span>
              </div>
            </motion.div>
          )}

          {/* ─── Step 3: Role Selection ─── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-6"
            >
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <button
                  onClick={() => setRole("client")}
                  className={`flex flex-col items-center justify-center gap-4 p-7 sm:p-8 rounded-3xl border-2 transition-all duration-300 ${
                    role === "client"
                      ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-2xl scale-105"
                      : "border-gray-200 dark:border-gray-700 text-gray-400 bg-transparent"
                  }`}
                >
                  <FaUserTie size={36} />
                  <span className="font-bold text-base sm:text-lg">سجل كعميل</span>
                </button>
                <button
                  onClick={() => setRole("mechanic")}
                  className={`flex flex-col items-center justify-center gap-4 p-7 sm:p-8 rounded-3xl border-2 transition-all duration-300 ${
                    role === "mechanic"
                      ? "border-[#137FEC] bg-[#137FEC] text-white shadow-2xl scale-105"
                      : "border-gray-200 dark:border-gray-700 text-gray-400 bg-transparent"
                  }`}
                >
                  <FaTools size={36} />
                  <span className="font-bold text-base sm:text-lg">سجل كميكانيكي</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              السابق
            </button>
          )}
          <button
            onClick={
              step === 1 ? handleNext :
              step === 2 ? handleVerifyOtp :
              handleSubmit
            }
            disabled={loading}
            className="flex-[2] bg-[#137FEC] text-white py-4 rounded-xl text-base sm:text-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "جارٍ المعالجة..."
              : step === 1 ? "متابعة"
              : step === 2 ? "التحقق من الحساب"
              : "إنشاء الحساب الآن"
            }
          </button>
        </div>

        <p className="text-center mt-6 dark:text-white text-sm">
          لديك حساب؟{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            className="text-[#137FEC] font-bold cursor-pointer hover:underline"
          >
            تسجيل الدخول
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
