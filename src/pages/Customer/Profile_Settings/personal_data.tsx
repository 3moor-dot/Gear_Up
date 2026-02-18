import { useState } from "react";
import { MdSave, MdCloudUpload, MdEdit, MdClose } from "react-icons/md";

interface PersonalDataProps {
    profileImage: string | null;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputStyle: string;
}

export const PersonalData = ({ profileImage, handleImageUpload, inputStyle }: PersonalDataProps) => {
    // حالة للتحكم في هل الحقول قابلة للتعديل أم لا
    const [isEditable, setIsEditable] = useState(false);

    // دالة لتبديل حالة التعديل
    const toggleEdit = () => {
        setIsEditable(!isEditable);
    };

    return (
        <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-gray-700">
                <h2 className="text-[#137FEC] text-2xl font-black text-right">البيانات الشخصية الأساسية</h2>

                {/* زر التعديل */}
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
                {/* قسم رفع الصورة */}
                <div className="lg:col-span-3 flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-[#E5F1FD] bg-[#FDEBD0] overflow-hidden flex items-center justify-center">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400">صورة</div>
                            )}
                        </div>
                        {/* لا يسمح برفع صورة إلا في وضع التعديل */}
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

                {/* قسم الحقول - تم حذف العنوان والبلد والمدينة والرمز البريدي */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">الاسم الأول</label>
                                <input
                                    type="text"
                                    placeholder="الاسم الأول"
                                    className={inputStyle}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">اسم العائلة</label>
                                <input
                                    type="text"
                                    placeholder="اسم العائلة"
                                    className={inputStyle}
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">رقم الهاتف</label>
                            <input
                                type="text"
                                placeholder="رقم الهاتف"
                                className={`${inputStyle} ${!isEditable ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}
                                disabled={!isEditable}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                className={`${inputStyle} ${!isEditable ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}`}
                                disabled={!isEditable}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* أزرار الحفظ والإلغاء تظهر فقط عند التعديل */}
            {isEditable && (
                <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-bottom-4">
                    <button
                        onClick={() => {
                            // منطق الحفظ هنا
                            setIsEditable(false);
                        }}
                        className="bg-[#137FEC] text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-all"
                    >
                        <MdSave size={20} /> حفظ التغيرات
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