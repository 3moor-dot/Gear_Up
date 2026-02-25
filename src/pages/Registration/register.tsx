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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        // 0=user, 1=mechanic
        const roleNumber = role === "client" ? 1 : 2;

        const body = {
            firstName,
            lastName,
            email,
            password,
            phone,
            role: roleNumber,
            customerLocation: { latitude: 0, longitude: 0 },
            mechanicLocation: { latitude: 0, longitude: 0 },
        };

        try {
            console.log("Sending body:", JSON.stringify(body));

            const res = await fetch("http://gearupapp.runasp.net/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await res.json().catch(() => null);
            console.log("Response status:", res.status);
            console.log("Response body:", JSON.stringify(data));

            if (!res.ok) {
                // Try to extract the most descriptive error message
                const msg =
                    data?.errors
                        ? Object.values(data.errors).flat().join(" | ")
                        : data?.message ||
                          data?.title ||
                          (typeof data === "string" ? data : null) ||
                          `فشل التسجيل (${res.status})`;
                throw new Error(msg);
            }

            alert("تم إنشاء الحساب بنجاح!");
            window.location.href = "/login";
        } catch (err: any) {
            setError(err.message || "حدث خطأ، حاول مجدداً");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen py-10 flex items-center justify-center px-4 bg-gradient-to-br from-[#EAF4FF] to-white dark:from-[#0F1323] dark:to-[#101922] transition-colors duration-500"
            dir="rtl"
        >
            <div className="dark:bg-[#1B1F2D] max-w-xl w-full bg-[#EAF4FF] rounded-3xl p-10 shadow-xl">
                {/* TITLE */}
                <h1 className="text-3xl font-bold text-center mb-2 dark:text-white">
                    إنشاء حسابك
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    {step === 1
                        ? "بياناتك الأساسية"
                        : "اختر نوع الحساب لإتمام العملية"}
                </p>

                <AnimatePresence mode="wait">
                    {/* الخطوة الأولى */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="الاسم الأول"
                                    icon={<FaUser />}
                                    placeholder="الاسم الأول"
                                    value={firstName}
                                    onChange={(e: any) => setFirstName(e.target.value)}
                                />
                                <FormInput
                                    label="اسم العائلة"
                                    icon={<FaUser />}
                                    placeholder="اسم العائلة"
                                    value={lastName}
                                    onChange={(e: any) => setLastName(e.target.value)}
                                />
                            </div>
                            <FormInput
                                label="رقم الهاتف"
                                icon={<FaPhone />}
                                placeholder="20xxxxxxxx+"
                                value={phone}
                                onChange={(e: any) => setPhone(e.target.value)}
                            />
                            <FormInput
                                label="البريد الإلكتروني"
                                icon={<FaEnvelope />}
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                            />
                            <FormInput
                                label="كلمة المرور"
                                icon={<FaLock />}
                                placeholder="********"
                                type="password"
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                            />
                        </motion.div>
                    )}

                    {/* الخطوة الثانية */}
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
                                {role === "client"
                                    ? "ستتمكن من طلب خدمات الصيانة فوراً"
                                    : "سنطلب منك بيانات ورشتك في الخطوة القادمة داخل التطبيق"}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* رسالة الخطأ */}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

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
                        onClick={() =>
                            step === 1 ? setStep(2) : handleSubmit()
                        }
                        disabled={loading}
                        className="flex-[2] bg-[#137FEC] text-white py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "جارٍ الإنشاء..."
                            : step === 1
                            ? "متابعة"
                            : "إنشاء الحساب الآن"}
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

/* ---------------- المكونات المساعدة ---------------- */

const FormInput = ({ label, icon, placeholder, type = "text", value, onChange }: any) => (
    <div className="w-full">
        <label className="block mb-1.5 font-bold dark:text-white text-xs">{label}</label>
        <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
            </span>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-white dark:bg-[#137FEC1A] border border-gray-200 dark:border-transparent text-gray-800 dark:text-gray-200 pr-11 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
        </div>
    </div>
);