import { useState, useEffect } from "react";
import { MdSave, MdCloudUpload, MdEdit, MdClose } from "react-icons/md";
import Swal from "sweetalert2"; // استيراد مكتبة التنبيهات

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
    profilePhotoUrl: null as string | null,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isDarkMode = () => document.documentElement.classList.contains('dark');

  // دالة موحدة لإظهار التنبيهات بشكل احترافي
  const showAlert = (icon: 'success' | 'error' | 'warning', title: string, text?: string) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#137FEC',
      background: isDarkMode() ? '#1B1F2D' : '#fff',
      color: isDarkMode() ? '#fff' : '#000',
      timer: icon === 'success' ? 2000 : undefined,
      showConfirmButton: icon !== 'success',
    });
  };

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    const token = sessionStorage.getItem("userToken");
    try {
      const res = await fetch("https://gearupapp.runasp.net/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUserData(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("userToken");
    const fd = new FormData();
    fd.append("FirstName", userData.firstName);
    fd.append("LastName", userData.lastName);
    fd.append("Phone", userData.phone);
    if (selectedImage) fd.append("ProfilePhoto", selectedImage);

    try {
      const res = await fetch("https://gearupapp.runasp.net/api/users/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (res.ok) {
        showAlert('success', 'تم التحديث!', 'تم حفظ بياناتك الشخصية بنجاح.');
        setIsEditable(false);
        fetchProfile();
      } else {
        const err = await res.json();
        showAlert('error', 'فشل التحديث', err.message || "حدث خطأ غير متوقع");
      }
    } catch { 
      showAlert('error', 'خطأ في الاتصال', 'تعذر الوصول إلى السيرفر، يرجى المحاولة لاحقاً.');
    } finally { 
      setLoading(false); 
    }
  };

  const cancelEdit = () => {
    setIsEditable(false);
    setPreviewUrl(null);
    setSelectedImage(null);
    fetchProfile();
  };

  const inputClasses = `w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border ${
    isEditable
      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-400 ring-2 ring-blue-100 shadow-sm"
      : "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-transparent cursor-not-allowed"
  }`;

  return (
    <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 md:p-10 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 border-b pb-5 dark:border-gray-700">
        <h2 className="text-[#137FEC] text-lg sm:text-2xl font-black">البيانات الشخصية</h2>
        {!isEditable && (
          <button
            onClick={() => setIsEditable(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <MdEdit size={16} /> تعديل البيانات
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 sm:grid sm:grid-cols-12 sm:gap-8 sm:items-start">
        {/* ملف الصورة */}
        <div className="sm:col-span-3 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[#E5F1FD] dark:border-gray-600 bg-gray-100 overflow-hidden shadow-inner">
              <img
                src={previewUrl || userData.profilePhotoUrl || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=137FEC&color=fff`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditable && (
              <label htmlFor="userPhoto" className="absolute bottom-1 right-1 bg-[#137FEC] hover:bg-blue-600 text-white p-2 sm:p-2.5 rounded-full shadow-xl cursor-pointer transition-transform hover:scale-110">
                <MdCloudUpload size={18} />
              </label>
            )}
          </div>
          <input type="file" id="userPhoto" className="hidden" accept="image/*" onChange={handleImageChange} disabled={!isEditable} />
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">الصورة الشخصية</p>
        </div>

        {/* حقول الإدخال */}
        <div className="sm:col-span-9 w-full space-y-4" dir="rtl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-extrabold text-[#137FEC] pr-1">الاسم الأول</label>
              <input type="text" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} className={inputClasses} disabled={!isEditable} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-extrabold text-[#137FEC] pr-1">اسم العائلة</label>
              <input type="text" value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} className={inputClasses} disabled={!isEditable} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-extrabold text-[#137FEC] pr-1">رقم الهاتف</label>
            <input type="text" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} className={inputClasses} disabled={!isEditable} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-extrabold text-gray-400 pr-1">البريد الإلكتروني (للعرض فقط)</label>
            <input type="email" value={userData.email} className="w-full text-right font-semibold py-3 px-4 rounded-2xl bg-gray-100 dark:bg-gray-800/30 text-gray-400 dark:text-gray-500 border border-transparent cursor-not-allowed" disabled />
          </div>
        </div>
      </div>

      {/* أزرار الإجراءات */}
      {isEditable && (
        <div className="flex flex-col sm:flex-row-reverse justify-center gap-3 mt-8 pt-6 border-t dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto bg-[#137FEC] hover:bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <MdSave size={18} /> {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
          <button
            onClick={cancelEdit}
            className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <MdClose size={18} /> إلغاء
          </button>
        </div>
      )}
    </div>
  );
};