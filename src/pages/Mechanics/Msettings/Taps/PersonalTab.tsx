import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaEdit, FaSave, FaSpinner, FaCamera } from "react-icons/fa";

interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhotoUrl: string | null;
}

const BASE_URL = "https://gearupapp.runasp.net/api";
const getToken = () => sessionStorage.getItem("userToken");

const PersonalTab = () => {
  const { dark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [data, setData] = useState<PersonalData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePhotoUrl: null,
  });

  // لرفع الصورة
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ======= FETCH =======
  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      console.log("GET profile status:", res.status);
      if (!res.ok) throw new Error("Failed");

      const json = await res.json();
      console.log("Profile data:", json);

      setData({
        firstName: json.firstName || "",
        lastName: json.lastName || "",
        email: json.email || "",
        phone: json.phone || "",
        profilePhotoUrl: json.profilePhotoUrl || null,
      });
    } catch {
      setError("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ======= اختيار صورة =======
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ======= SAVE =======
  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      // الـ API بتاخد multipart/form-data
      const formData = new FormData();
      formData.append("FirstName", data.firstName);
      formData.append("LastName", data.lastName);
      formData.append("Phone", data.phone);
      if (selectedPhoto) {
        formData.append("ProfilePhoto", selectedPhoto);
      }

      console.log("Saving as FormData:", {
        FirstName: data.firstName,
        LastName: data.lastName,
        Phone: data.phone,
        ProfilePhoto: selectedPhoto?.name || "none",
      });

      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          // ⚠️ لا تحط Content-Type - المتصفح بيحطه تلقائي مع boundary
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const json = await res.json().catch(() => null);
      console.log("PUT response:", json);

      if (!res.ok) {
        setError(json?.message || "حدث خطأ أثناء الحفظ");
        return;
      }

      setSuccess("تم حفظ التغييرات بنجاح ✅");
      setIsEditing(false);
      setSelectedPhoto(null);
      setPreviewUrl(null);
      setTimeout(() => window.location.reload(), 1000); // ✅
      fetchData();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedPhoto(null);
    setPreviewUrl(null);
    fetchData();
  };

  const update = (field: keyof PersonalData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass = `w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border outline-none ${
    !dark
      ? "bg-white border-blue-400 ring-2 ring-blue-100 text-gray-900 shadow-sm"
      : "bg-gray-800 border-blue-400 ring-2 ring-blue-900/40 text-white"
  }`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="bg-white dark:bg-[#0d1629] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 md:p-6"
    >
      {/* Avatar + Edit Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-gray-200 dark:border-gray-800 mb-6">
        
        {/* Photo & Info Section */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative shrink-0">
            <img
              src={
                previewUrl ||
                data.profilePhotoUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  `${data.firstName} ${data.lastName}`.trim() || "User"
                )}&background=2563eb&color=fff&font-size=0.33`
              }
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#137FEC] object-cover shadow-sm"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 left-0 w-8 h-8 bg-[#137FEC] hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition shadow-lg border-2 border-white dark:border-[#0d1629]"
              >
                <FaCamera className="text-xs" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-medium mb-1 text-gray-900 dark:text-white">
              {data.firstName} {data.lastName}
            </h3>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">ميكانيكي محترف</p>
            {selectedPhoto && (
              <p className="text-xs text-[#137FEC] mt-1 truncate max-w-[200px]">
                📷 {selectedPhoto.name}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={isSaving}
          className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
            isSaving ? "bg-gray-400 cursor-wait text-white shadow-none" : "bg-[#137FEC] hover:bg-blue-600 text-white shadow-blue-500/20"
          }`}
        >
          {isSaving ? (
            <><FaSpinner className="animate-spin" /><span>جاري الحفظ...</span></>
          ) : isEditing ? (
            <><FaSave /><span>حفظ التغييرات</span></>
          ) : (
            <><FaEdit /><span>تعديل البيانات</span></>
          )}
        </button>
      </div>

      {/* Fields */}
      <div>
        <div className="mb-6">
          <h2 className="text-md md:text-xl font-black text-gray-700 dark:text-white">البيانات الشخصية الأساسية</h2>
         </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm text-center font-medium">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "الاسم الأول",      field: "firstName" as keyof PersonalData, type: "text"  },
            { label: "الاسم الأخير",      field: "lastName"  as keyof PersonalData, type: "text"  },
            { label: "رقم الهاتف",        field: "phone"     as keyof PersonalData, type: "tel"   },
          ].map(({ label, field, type }) => (
            <div key={field}>
              {isEditing ? (
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-extrabold text-[#137FEC] block">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={data[field] as string}
                    onChange={(e) => update(field, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm font-extrabold text-[#137FEC] block">{label}</p>
                  <div className="rounded-2xl bg-gray-50 dark:bg-[#131c2f] border border-gray-200 dark:border-gray-800 px-4 py-3">
                    <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                      {data[field] || "—"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* البريد الإلكتروني - للعرض فقط */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-extrabold text-[#137FEC] block">البريد الإلكتروني</p>
            <div className="rounded-2xl bg-gray-50 dark:bg-[#131c2f] border border-gray-200 dark:border-gray-800 px-4 py-3">
              <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                {data.email || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="mt-8 w-full md:w-auto px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-[#131c2f] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 font-bold text-sm transition-all hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            إلغاء
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonalTab;
