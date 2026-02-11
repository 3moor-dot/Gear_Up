import { useState } from "react";
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaLock,
    FaUserTie,
    FaMapMarkerAlt,
    FaTools,
    FaCheckCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Register: React.FC = () => {
    const [role, setRole] = useState<"client" | "mechanic">("client");
    const [step, setStep] = useState<1 | 2>(1);

    return (
        <div className="min-h-screen py-10 flex items-center justify-center px-4 bg-gradient-to-br from-[#EAF4FF] to-white dark:from-[#0F1323] dark:to-[#101922] transition-colors duration-500" dir="rtl">

            <div className="dark:bg-[#1B1F2D] max-w-xl w-full bg-[#EAF4FF] rounded-3xl p-10 shadow-xl">

                {/* TITLE */}
                <h1 className="text-3xl font-bold text-center mb-2 dark:text-white">
                    إنشاء حسابك
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    {step === 1 ? "ابدأ بإدخال بياناتك الأساسية" : "اختر نوع الحساب لإكمال التسجيل"}
                </p>

                <AnimatePresence mode="wait">
                    {/* STEP 1 – BASIC INFO */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="الاسم الأول" icon={<FaUser />} placeholder="الاسم الأول" />
                                <FormInput label="اسم العائلة" icon={<FaUser />} placeholder="اسم العائلة" />
                            </div>
                            <FormSection
                                fields={[
                                    { label: "رقم الهاتف", icon: <FaPhone />, placeholder: "أدخل رقم الهاتف" },
                                    { label: "البريد الإلكتروني", icon: <FaEnvelope />, placeholder: "أدخل بريدك الإلكتروني" },
                                    { label: "كلمة المرور", icon: <FaLock />, placeholder: "أدخل كلمة المرور", type: "password" },
                                    { label: "تأكيد كلمة المرور", icon: <FaLock />, placeholder: "أعد إدخال كلمة المرور", type: "password" },
                                ]}
                            />
                        </motion.div>
                    )}

                    {/* STEP 2 – ROLE SELECTION & MECHANIC DATA */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* ROLE SWITCH INSIDE STEP 2 */}
                            <div className="flex justify-center gap-4 mb-8">
                                <button
                                    onClick={() => setRole("client")}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${role === "client" ? "bg-black text-white scale-105 shadow-lg" : "bg-gray-400 text-white"}`}
                                >
                                    <FaUserTie />
                                    عميل
                                </button>
                                <button
                                    onClick={() => setRole("mechanic")}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${role === "mechanic" ? "bg-[#137FEC] text-white scale-105 shadow-lg" : "bg-[#8FC1FF] text-white"}`}
                                >
                                    <FaTools />
                                    ميكانيكي
                                </button>
                            </div>

                            {/* SHOW MECHANIC FIELDS ONLY IF MECHANIC IS SELECTED */}
                            <AnimatePresence mode="wait">
                                {role === "mechanic" ? (
                                    <motion.div
                                        key="mechanic-fields"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30"
                                    >
                                        <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">بيانات الورشة والعمل:</h3>
                                        <FormSection
                                            fields={[
                                                { label: "موقع الورشة", icon: <FaMapMarkerAlt />, placeholder: "أدخل موقع الورشة" },
                                                { label: "التخصص الرئيسي", icon: <FaTools />, placeholder: "ميكانيكي / كهربائي / كليهما" },
                                                { label: "التخصص الفرعي", icon: <FaTools />, placeholder: "ألماني / كوري / ياباني" },
                                                { label: "إمكانية الزيارة الميدانية", icon: <FaCheckCircle />, placeholder: "نعم / لا" },
                                            ]}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }}
                                        className="text-center py-10 text-gray-500 dark:text-gray-400 italic"
                                    >
                                        سيتم إنشاء حسابك كعميل، يمكنك إضافة بيانات سيارتك لاحقاً من لوحة التحكم.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* NAVIGATION BUTTONS */}
                <div className="flex gap-3 mt-8">
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-300 transition"
                        >
                            السابق
                        </button>
                    )}
                    <button
                        onClick={() => step === 1 ? setStep(2) : alert("تم التسجيل بنجاح")}
                        className="flex-[2] bg-[#137FEC] text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-md"
                    >
                        {step === 1 ? "التالي" : "إنهاء التسجيل"}
                    </button>
                </div>

                {/* LOGIN LINK */}
                <p className="text-center mt-6 dark:text-white">
                    هل لديك حساب بالفعل؟{" "}
                    <span
                        onClick={() => window.location.href = "/login"}
                        className="text-[#137FEC] font-semibold cursor-pointer hover:underline">
                        تسجيل الدخول
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;

/* ---------------- HELPER COMPONENTS ---------------- */

const FormInput = ({ label, icon, placeholder, type = "text" }: any) => (
    <div className="w-full">
        <label className="block mb-2 font-semibold dark:text-white text-sm">{label}</label>
        <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F132333] dark:text-gray-400">
                {icon}
            </span>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-[#D6E9FF] dark:bg-[#137FEC1A] text-gray-800 dark:text-gray-200 placeholder-[#0F132366] dark:placeholder-gray-500 pr-11 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-sm"
            />
        </div>
    </div>
);

const FormSection = ({ fields }: any) => (
    <div className="space-y-4">
        {fields.map((field: any, i: number) => (
            <FormInput key={i} {...field} />
        ))}
    </div>
);