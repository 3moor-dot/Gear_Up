import { useState } from "react";
import { 
    MdSave, MdLockOutline, MdCheckCircleOutline, 
    MdErrorOutline, MdVisibility, MdVisibilityOff 
} from "react-icons/md";

interface SecuritySettingsProps {
    inputStyle: string;
}

const SecuritySettings = ({}: SecuritySettingsProps) => {
    // حالات المدخلات
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // حالات الرؤية (العين) لكل حقل
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // حالات النظام
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

    const token = sessionStorage.getItem("userToken");
    const BASE_URL = "http://gearupapp.runasp.net/api/auth/change-password";

    // ستايل الحقول الموحد (نفس صفحة السيارات)
    const activeInputStyle = "w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-400 ring-2 ring-blue-100 shadow-sm focus:outline-none pr-12";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: null, message: "" });

        if (passwords.newPassword !== passwords.confirmPassword) {
            return setStatus({ type: 'error', message: "كلمة المرور الجديدة غير متطابقة" });
        }

        setLoading(true);
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                })
            });

            const data = await response.json();
            if (response.ok) {
                setStatus({ type: 'success', message: data.message || "تم تغيير كلمة المرور بنجاح" });
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setStatus({ type: 'error', message: data.message || "فشل التغيير، تأكد من كلمة المرور الحالية" });
            }
        } catch (error) {
            setStatus({ type: 'error', message: "حدث خطأ في الاتصال بالسيرفر" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl animate-in fade-in slide-in-from-right-4 duration-500" dir="rtl">
            <h2 className="text-[#137FEC] text-2xl font-black mb-10 text-right border-b pb-6 dark:border-gray-700 flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-xl text-[#137FEC]"><MdLockOutline size={28} /></div>
                كلمة المرور
            </h2>

            <form onSubmit={handleChangePassword} className="max-w-4xl mx-auto space-y-8">
                
                {status.type && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold transition-all ${
                        status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                        {status.type === 'success' ? <MdCheckCircleOutline size={20} /> : <MdErrorOutline size={20} />}
                        {status.message}
                    </div>
                )}

                {/* كلمة المرور الحالية */}
                <div className="space-y-2">
                    <label className="block text-right text-sm font-extrabold text-[#137FEC] pr-1">كلمة المرور الحالية</label>
                    <div className="relative">
                        <input
                            name="currentPassword"
                            type={showCurrent ? "text" : "password"}
                            placeholder="••••••••"
                            className={activeInputStyle}
                            value={passwords.currentPassword}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#137FEC] transition-colors">
                            {showCurrent ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* كلمة المرور الجديدة */}
                    <div className="space-y-2">
                        <label className="block text-right text-sm font-extrabold text-[#137FEC] pr-1">كلمة المرور الجديدة</label>
                        <div className="relative">
                            <input
                                name="newPassword"
                                type={showNew ? "text" : "password"}
                                placeholder="••••••••"
                                className={activeInputStyle}
                                value={passwords.newPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#137FEC] transition-colors">
                                {showNew ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* تأكيد كلمة المرور */}
                    <div className="space-y-2">
                        <label className="block text-right text-sm font-extrabold text-[#137FEC] pr-1">تأكيد كلمة المرور الجديدة</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                placeholder="••••••••"
                                className={activeInputStyle}
                                value={passwords.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#137FEC] transition-colors">
                                {showConfirm ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* زر الحفظ */}
                <div className="flex justify-center pt-6">
                    <button 
                        type="submit"
                        disabled={loading}
                        className="bg-[#137FEC] text-white px-16 py-4 rounded-2xl font-black text-xl shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            <MdSave size={24} />
                        )}
                        {loading ? "جاري الحفظ..." : "تأكيد التغيير"}
                    </button>
                </div>
            </form>

            <div className="mt-12 p-5 bg-blue-50 dark:bg-gray-800/50 rounded-[24px] border border-blue-100 dark:border-gray-700">
                <p className="text-center text-sm text-blue-600 dark:text-blue-400 font-bold leading-relaxed">
                    ملاحظة أمنية: يفضل أن تحتوي كلمة المرور على 8 أحرف على الأقل، بما في ذلك أرقام ورموز خاصة لضمان حماية حسابك.
                </p>
            </div>
        </div>
    );
};

export default SecuritySettings;