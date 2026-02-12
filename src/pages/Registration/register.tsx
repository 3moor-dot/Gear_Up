import { useState } from "react";
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaLock,
    FaUserTie,
    FaTools
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
                    {step === 1 ? "بياناتك الأساسية" : "اختر نوع الحساب لإتمام العملية"}
                </p>

                <AnimatePresence mode="wait">
                    {/* الخطوة الأولى: البيانات الأساسية فقط */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="الاسم الأول" icon={<FaUser />} placeholder="الاسم الأول" />
                                <FormInput label="اسم العائلة" icon={<FaUser />} placeholder="اسم العائلة" />
                            </div>
                            <FormSection
                                fields={[
                                    { label: "رقم الهاتف", icon: <FaPhone />, placeholder: "20xxxxxxxx+" },
                                    { label: "البريد الإلكتروني", icon: <FaEnvelope />, placeholder: "example@mail.com" },
                                    { label: "كلمة المرور", icon: <FaLock />, placeholder: "********", type: "password" },
                                ]}
                            />
                        </motion.div>
                    )}

                    {/* الخطوة الثانية: اختيار النوع فقط */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="py-10"
                        >
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <button
                                    onClick={() => setRole("client")}
                                    className={`flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 transition-all duration-300 ${
                                        role === "client" 
                                        ? "border-black bg-black text-white shadow-2xl scale-105" 
                                        : "border-gray-200 dark:border-gray-700 text-gray-400 bg-transparent"
                                    }`}
                                >
                                    <FaUserTie size={40} />
                                    <span className="font-bold text-lg">سجل كعميل</span>
                                </button>

                                <button
                                    onClick={() => setRole("mechanic")}
                                    className={`flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 transition-all duration-300 ${
                                        role === "mechanic" 
                                        ? "border-[#137FEC] bg-[#137FEC] text-white shadow-2xl scale-105" 
                                        : "border-gray-200 dark:border-gray-700 text-gray-400 bg-transparent"
                                    }`}
                                >
                                    <FaTools size={40} />
                                    <span className="font-bold text-lg">سجل كميكانيكي</span>
                                </button>
                            </div>
                            <p className="text-center mt-8 text-sm text-gray-400">
                                {role === "client" ? "ستتمكن من طلب خدمات الصيانة فوراً" : "سنطلب منك بيانات ورشتك في الخطوة القادمة داخل التطبيق"}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* الأزرار */}
                <div className="flex gap-3 mt-8">
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                        >
                            السابق
                        </button>
                    )}
                    <button
                        onClick={() => step === 1 ? setStep(2) : alert("تم إنشاء الحساب بنجاح!")}
                        className="flex-[2] bg-[#137FEC] text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg"
                    >
                        {step === 1 ? "متابعة" : "إنشاء الحساب الآن"}
                    </button>
                </div>

                <p className="text-center mt-6 dark:text-white text-sm">
                    لديك حساب؟{" "}
                    <span onClick={() => window.location.href = "/login"} className="text-[#137FEC] font-bold cursor-pointer hover:underline">
                        تسجيل الدخول
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;

/* ---------------- المكونات المساعدة ---------------- */

const FormInput = ({ label, icon, placeholder, type = "text" }: any) => (
    <div className="w-full">
        <label className="block mb-1.5 font-bold dark:text-white text-xs">{label}</label>
        <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
            </span>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-white dark:bg-[#137FEC1A] border border-gray-200 dark:border-transparent text-gray-800 dark:text-gray-200 pr-11 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
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