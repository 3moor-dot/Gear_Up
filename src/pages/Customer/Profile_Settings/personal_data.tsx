import { useState, useEffect } from "react";
import { MdSave, MdCloudUpload, MdEdit, MdClose } from "react-icons/md";

interface PersonalDataProps {
    profileImage: string | null;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputStyle: string;
}

export const PersonalData = ({ profileImage, handleImageUpload, inputStyle }: PersonalDataProps) => {
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // حالة لتخزين بيانات المستخدم
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        profilePhotoUrl: null
    });

    // 1. جلب البيانات عند فتح الصفحة
    useEffect(() => {
        const fetchProfile = async () => {
            const token = sessionStorage.getItem("userToken");
            try {
                const response = await fetch("http://gearupapp.runasp.net/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error("خطأ في جلب البيانات:", error);
            }
        };
        fetchProfile();
    }, []);

    // 2. دالة حفظ التعديلات وإرسالها للباك اند
    const handleSave = async () => {
        setLoading(true);
        const token = sessionStorage.getItem("userToken");
        
        try {
            const response = await fetch("http://gearupapp.runasp.net/api/users/profile", {
                method: "POST", // حسب لينك Postman المرسل
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...userData,
                    profilePhotoUrl: profileImage // نرسل الصورة المحدثة إذا وجدت
                })
            });

            if (response.ok) {
                alert("تم تحديث البيانات بنجاح");
                setIsEditable(false);
            } else {
                alert("حدث خطأ أثناء الحفظ");
            }
        } catch (error) {
            alert("فشل الاتصال بالسيرفر");
        } finally {
            setLoading(false);
        }
    };

    const toggleEdit = () => setIsEditable(!isEditable);

    // دالة لتحديث الحالة محلياً عند الكتابة في الحقول
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setUserData({ ...userData, [field]: e.target.value });
    };

    return (
        <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-gray-700">
                <h2 className="text-[#137FEC] text-2xl font-black text-right">البيانات الشخصية الأساسية</h2>

                {!isEditable && (
                    <button
                        onClick={toggleEdit}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md"
                    >
                        <MdEdit size={18} /> تعديل البيانات
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* قسم الصورة */}
                <div className="lg:col-span-3 flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-[#E5F1FD] bg-[#FDEBD0] overflow-hidden flex items-center justify-center">
                            {profileImage || userData.profilePhotoUrl ? (
                                <img src={profileImage || userData.profilePhotoUrl || ""} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400">صورة</div>
                            )}
                        </div>
                        {isEditable && (
                            <label htmlFor="userPhoto" className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2 rounded-full shadow-lg cursor-pointer">
                                <MdCloudUpload size={20} />
                            </label>
                        )}
                    </div>
                    {isEditable && (
                        <div className="text-center">
                            <p className="text-blue-500 font-bold text-sm">تحميل صورة الملف الشخصي</p>
                            <input type="file" id="userPhoto" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    )}
                </div>

                {/* قسم الحقول */}
                <div className="lg:col-span-9 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-gray-500 mr-2 text-right">الاسم الأول</label>
                            <input
                                type="text"
                                value={userData.firstName}
                                onChange={(e) => handleChange(e, "firstName")}
                                className={`${inputStyle} bg-[#4A90E2] text-white placeholder:text-blue-100 border-none text-right font-bold py-4 px-6 rounded-2xl w-full transition-all ${!isEditable ? 'opacity-90 cursor-default' : 'ring-2 ring-blue-300'}`}
                                disabled={!isEditable}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-gray-500 mr-2 text-right">اسم العائلة</label>
                            <input
                                type="text"
                                value={userData.lastName}
                                onChange={(e) => handleChange(e, "lastName")}
                                className={`${inputStyle} bg-[#4A90E2] text-white placeholder:text-blue-100 border-none text-right font-bold py-4 px-6 rounded-2xl w-full transition-all ${!isEditable ? 'opacity-90 cursor-default' : 'ring-2 ring-blue-300'}`}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-500 mr-2 text-right">رقم الهاتف</label>
                        <input
                            type="text"
                            value={userData.phone}
                            onChange={(e) => handleChange(e, "phone")}
                            className={`${inputStyle} bg-[#4A90E2] text-white placeholder:text-blue-100 border-none text-right font-bold py-4 px-6 rounded-2xl w-full transition-all ${!isEditable ? 'opacity-90 cursor-default' : 'ring-2 ring-blue-300'}`}
                            disabled={!isEditable}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-500 mr-2 text-right">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={userData.email}
                            onChange={(e) => handleChange(e, "email")}
                            className={`${inputStyle} bg-[#4A90E2] text-white placeholder:text-blue-100 border-none text-right font-bold py-4 px-6 rounded-2xl w-full transition-all ${!isEditable ? 'opacity-90 cursor-default' : 'ring-2 ring-blue-300'}`}
                            disabled={!isEditable}
                        />
                    </div>
                </div>
            </div>

            {isEditable && (
                <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-bottom-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-[#137FEC] text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                        <MdSave size={20} /> {loading ? "جاري الحفظ..." : "حفظ التغيرات"}
                    </button>
                    <button
                        onClick={() => setIsEditable(false)}
                        className="bg-gray-200 text-gray-700 px-10 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center gap-2"
                    >
                        <MdClose size={20} /> إلغاء
                    </button>
                </div>
            )}
        </div>
    );
};