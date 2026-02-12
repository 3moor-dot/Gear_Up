import { MdSave, MdCloudUpload } from "react-icons/md";

interface PersonalDataProps {
    profileImage: string | null;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputStyle: string;
}

export const PersonalData = ({ profileImage, handleImageUpload, inputStyle }: PersonalDataProps) => (
    <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl animate-in fade-in duration-500">
        <h2 className="text-[#137FEC] text-2xl font-black mb-8 text-right">البيانات الشخصية الأساسية</h2>
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
                    <label htmlFor="userPhoto" className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2 rounded-full shadow-lg cursor-pointer">
                        <MdCloudUpload size={20} />
                    </label>
                </div>
                <div className="text-center">
                    <p className="text-blue-500 font-bold text-sm">تحميل صورة الملف الشخصي</p>
                    <input type="file" id="userPhoto" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <label htmlFor="userPhoto" className="mt-4 inline-block bg-[#3B82F6] text-white px-6 py-2 rounded-lg text-sm font-bold cursor-pointer">
                        تحميل الصورة
                    </label>
                </div>
            </div>
            {/* قسم الحقول */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="الاسم الكامل" className={inputStyle} />
                <input type="text" placeholder="رقم الهاتف" className={inputStyle} />
                <input type="email" placeholder="البريد الإلكتروني" className={inputStyle} />
                <input type="text" placeholder="العنوان بالتفصيل" className={inputStyle} />
                <input type="text" placeholder="البلد" className={inputStyle} />
                <input type="text" placeholder="المدينة" className={inputStyle} />
                <div className="md:col-span-2">
                    <input type="text" placeholder="رمز بريدي" className={inputStyle} />
                </div>
            </div>
        </div>
        {/* أزرار الحفظ */}
        <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
            <button className="bg-[#137FEC] text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                <MdSave size={20} /> حفظ التغيرات
            </button>
            <button className="bg-[#2D3342] text-white px-10 py-3 rounded-xl font-bold">إلغاء</button>
        </div>
    </div>
);