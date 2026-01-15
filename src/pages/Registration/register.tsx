import { useState } from "react";
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaLock,
    FaUserTie,
    FaCar,
    FaCalendarAlt,
    FaIdCard,
    FaMapMarkerAlt,
    FaTools,
    FaCheckCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Register: React.FC = () => {
    const [role, setRole] = useState<"client" | "mechanic">("client");
    const [step, setStep] = useState<1 | 2>(1);

    return (
        <div className="
    p-20 flex items-center justify-center px-4
    bg-gradient-to-br
    from-[#EAF4FF] to-white
    dark:from-[#0F1323] dark:to-[#101922]
    transition-colors duration-500
" dir="rtl">

            <div className="dark:bg-[#1B1F2D] max-w-xl bg-[#EAF4FF] rounded-3xl p-10 shadow-xl">

                {/* TITLE */}
                <h1 className="text-3xl font-bold text-center mb-2 dark:text-white">
                    إنشاء حسابك
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    تحكم في صيانة سيارتك باستخدام الرؤى المدعومة بالذكاء الاصطناعي
                </p>

                {/* ROLE SWITCH */}
                <div className="flex justify-center gap-4 mb-10">

                    {/* MECHANIC */}
                    <button
                        onClick={() => setRole("mechanic")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
            ${role === "mechanic"
                                ? "bg-[#137FEC] text-white scale-105"
                                : "bg-[#8FC1FF] text-white"
                            }`}
                    >
                        <FaTools />
                        ميكانيكي
                    </button>

                    {/* CLIENT */}
                    <button
                        onClick={() => setRole("client")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
            ${role === "client"
                                ? "bg-black text-white scale-105"
                                : "bg-gray-400 text-white"
                            }`}
                    >
                        <FaUserTie />
                        عميل
                    </button>

                </div>

                {/* STEP 1 – BASIC INFO */}
                {step === 1 && (
                    <FormSection
                        fields={[
                            { label: "الاسم بالكامل", icon: <FaUser />, placeholder: "أدخل الاسم بالكامل" },
                            { label: "رقم الهاتف", icon: <FaPhone />, placeholder: "أدخل رقم الهاتف" },
                            { label: "البريد الإلكتروني", icon: <FaEnvelope />, placeholder: "أدخل بريدك الإلكتروني" },
                            { label: "كلمة المرور", icon: <FaLock />, placeholder: "أدخل كلمة المرور", type: "password" },
                            { label: "تأكيد كلمة المرور", icon: <FaLock />, placeholder: "أعد إدخال كلمة المرور", type: "password" },
                        ]}
                    />
                )}

                {/* STEP 2 – CLIENT */}
                <AnimatePresence mode="wait">
                    {step === 2 && role === "client" && (
                        <motion.div
                            key="client"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.35 }}
                        >
                            <FormSection
                                fields={[
                                    { label: "ماركة السيارة", icon: <FaCar />, placeholder: "أدخل ماركة السيارة" },
                                    { label: "طراز السيارة", icon: <FaCar />, placeholder: "أدخل طراز السيارة" },
                                    { label: "سنة الصنع", icon: <FaCalendarAlt />, placeholder: "أدخل سنة التصنيع" },
                                    { label: "رقم اللوحة", icon: <FaIdCard />, placeholder: "أدخل رقم اللوحة" },
                                ]}
                            />
                        </motion.div>
                    )}

                    {step === 2 && role === "mechanic" && (
                        <motion.div
                            key="mechanic"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.35 }}
                        >
                            <FormSection
                                fields={[
                                    { label: "موقع الورشة", icon: <FaMapMarkerAlt />, placeholder: "أدخل موقع الورشة" },
                                    { label: "التخصص الرئيسي", icon: <FaTools />, placeholder: "ميكانيكي / كهربائي / كليهما" },
                                    { label: "التخصص الفرعي", icon: <FaTools />, placeholder: "ألماني / كوري / ياباني" },
                                    { label: "إمكانية الزيارة الميدانية", icon: <FaCheckCircle />, placeholder: "نعم / لا" },
                                ]}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* BUTTON */}
                <button
                    onClick={() => step === 1 ? setStep(2) : alert("تم الإنهاء")}
                    className="w-full bg-[#137FEC] text-white py-3 rounded-xl mt-8 text-lg font-semibold hover:bg-blue-700 transition"
                >
                    {step === 1 ? "التالي" : "إنهاء"}
                </button>

                {/* LOGIN */}
                <p className="text-center mt-2  dark:text-white">
                    هل لديك حساب بالفعل؟{" "}
                    <span className="text-[#137FEC] font-semibold cursor-pointer hover:underline">
                        تسجيل الدخول
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;

/* ---------------- COMPONENT ---------------- */

const FormSection = ({ fields }: any) => (
    <div className="space-y-6">
        {fields.map((field: any, i: number) => (
            <div key={i}>
                <label className="block mb-2 font-semibold dark:text-white">{field.label}</label>
                <div className="relative">
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F132333] dark:text-gray-400">
                        {field.icon}
                    </span>
                    <input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        className="
                            w-full
                            bg-[#D6E9FF]  
                            dark:bg-[#137FEC1A]

                            text-[#0F132333] dark:text-gray-200
                            placeholder-[#0F132333] dark:placeholder-gray-400
                            pr-12 py-3 rounded-xl outline-none

                            focus:ring-2 focus:ring-blue-500
                            transition-colors duration-300
                        "
                    />
                </div>
            </div>
        ))}
    </div>
);