import { useState, useEffect } from "react";
import { MdSave, MdCloudUpload, MdEdit, MdClose } from "react-icons/md";

interface PersonalDataProps {
    inputStyle: string;
    profileImage: string | null; 
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

export const PersonalData = ({ }: PersonalDataProps) => {
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "", 
        phone: "",
        profilePhotoUrl: null as string | null
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = sessionStorage.getItem("userToken");
        try {
            const response = await fetch("https://gearupapp.runasp.net/api/users/profile", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        } catch (error) {
            console.error("خطأ في جلب البيانات:", error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const token = sessionStorage.getItem("userToken");
        const formData = new FormData();
        formData.append("FirstName", userData.firstName);
        formData.append("LastName", userData.lastName);
        formData.append("Phone", userData.phone);
        if (selectedImage) formData.append("ProfilePhoto", selectedImage);

        try {
            const response = await fetch("https://gearupapp.runasp.net/api/users/profile", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                alert("تم تحديث البيانات بنجاح");
                setIsEditable(false);
                fetchProfile(); 
            } else {
                const errorData = await response.json();
                alert(errorData.message || "حدث خطأ أثناء الحفظ");
            }
        } catch (error) {
            alert("فشل الاتصال بالسيرفر");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setUserData({ ...userData, [field]: e.target.value });
    };

    const cancelEdit = () => {
        setIsEditable(false);
        setPreviewUrl(null);
        setSelectedImage(null);
        fetchProfile(); 
    };

    // كلاسات موحدة للحقول لضمان وضوح النص
    const inputClasses = `
        w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border
        ${isEditable 
            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-400 ring-2 ring-blue-100 shadow-sm" 
            : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-transparent cursor-not-allowed"
        }
    `;

    return (
        <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl">
            <div className="flex justify-between items-center mb-10 border-b pb-6 dark:border-gray-700">
                <h2 className="text-[#137FEC] text-2xl font-black text-right">البيانات الشخصية الأساسية</h2>
                {!isEditable && (
                    <button 
                        onClick={() => setIsEditable(true)} 
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md active:scale-95"
                    >
                        <MdEdit size={18} /> تعديل البيانات
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* قسم الصورة الشخصية */}
                <div className="lg:col-span-3 flex flex-col items-center gap-5">
                    <div className="relative group">
                        <div className="w-36 h-36 rounded-full border-4 border-[#E5F1FD] dark:border-gray-600 bg-gray-100 overflow-hidden shadow-inner">
                            <img 
                                src={previewUrl || userData.profilePhotoUrl || "httpss://ui-avatars.com/api/?name=User&background=random"} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        {isEditable && (
                            <label htmlFor="userPhoto" className="absolute bottom-1 right-1 bg-[#137FEC] hover:bg-blue-600 text-white p-2.5 rounded-full shadow-xl cursor-pointer transition-transform hover:scale-110">
                                <MdCloudUpload size={22} />
                            </label>
                        )}
                    </div>
                    <input type="file" id="userPhoto" className="hidden" accept="image/*" onChange={handleImageChange} disabled={!isEditable} />
                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">الصورة الشخصية</p>
                </div>

                {/* قسم المدخلات */}
                <div className="lg:col-span-9 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right" dir="rtl">
                        <div className="space-y-2">
                            <label className="text-sm font-extrabold text-[#137FEC] pr-1">الاسم الأول</label>
                            <input
                                type="text"
                                value={userData.firstName}
                                onChange={(e) => handleChange(e, "firstName")}
                                className={inputClasses}
                                disabled={!isEditable}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-extrabold text-[#137FEC] pr-1">اسم العائلة</label>
                            <input
                                type="text"
                                value={userData.lastName}
                                onChange={(e) => handleChange(e, "lastName")}
                                className={inputClasses}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-right" dir="rtl">
                        <label className="text-sm font-extrabold text-[#137FEC] pr-1">رقم الهاتف</label>
                        <input
                            type="text"
                            value={userData.phone}
                            onChange={(e) => handleChange(e, "phone")}
                            className={inputClasses}
                            disabled={!isEditable}
                        />
                    </div>

                    <div className="space-y-2 text-right" dir="rtl">
                        <label className="text-sm font-extrabold text-gray-400 pr-1">البريد الإلكتروني (للعرض فقط)</label>
                        <input
                            type="email"
                            value={userData.email}
                            className="w-full text-right font-semibold py-3 px-4 rounded-2xl bg-gray-100 dark:bg-gray-800/30 text-gray-400 dark:text-gray-500 border border-transparent cursor-not-allowed"
                            disabled
                        />
                    </div>
                </div>
            </div>

            {isEditable && (
                <div className="flex flex-row-reverse justify-center gap-4 mt-12 pt-8 border-t dark:border-gray-700">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-[#137FEC] hover:bg-blue-600 text-white px-12 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <MdSave size={20} /> {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </button>
                    <button
                        onClick={cancelEdit}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-10 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2"
                    >
                        <MdClose size={20} /> إلغاء
                    </button>
                </div>
            )}
        </div>
    );
};