
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaEdit, FaSave, FaSpinner, FaLocationArrow, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// --- Map ---
function MapPicker({ latitude, longitude, setLocation, isEditing, dark }: any) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.tst,
  });

  if (loadError)
    return <div className="text-red-500 text-sm">خطأ في تحميل الخريطة</div>;

  if (!isLoaded)
    return (
      <div className="h-[250px] flex items-center justify-center animate-pulse bg-gray-200 rounded-xl">
        جاري تحميل الخريطة...
      </div>
    );

  const defaultCenter = { lat: 26.8206, lng: 30.8025 }; // مصر

  const center =
    latitude && longitude
      ? { lat: Number(latitude), lng: Number(longitude) }
      : defaultCenter;

  return (
    <div
      className={`rounded-xl overflow-hidden border ${
        dark ? "border-gray-700" : "border-gray-300"
      }`}
      style={{ height: "250px", width: "100%" }}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={latitude ? 17 : 6}
        onClick={(e) => {
          if (isEditing && e.latLng) {
            setLocation(e.latLng.lat(), e.latLng.lng());
          }
        }}
        options={{
          draggable: isEditing,
          clickableIcons: isEditing,
          scrollwheel: true,
        }}
      >
        {latitude && longitude && (
          <Marker
            position={{ lat: Number(latitude), lng: Number(longitude) }}
            animation={window.google?.maps?.Animation?.DROP}
          />
        )}
      </GoogleMap>
    </div>
  );
}

// ---------------- TYPE ----------------
interface AdditionalData {
  location: string;
  latitude?: number;
  longitude?: number;
  mainSpecialty: string[];
  subSpecialty: string;
  fieldVisit: boolean;
  workingHoursFrom: string;
  workingHoursTo: string;
  experience: string;
  workshopLicenseUrl?: string; 
}

const getUserIdFromToken = () => {
  const token = sessionStorage.getItem("userToken");
  if (!token) return "";
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.sub || payload.nameid || "";
  } catch {
    return "";
  }
};

const getStorageKey = () => {
  const token = sessionStorage.getItem("userToken");
  if (!token) return "mechanic_data_guest";

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    const userId = payload.nameid || payload.sub || payload.id || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    
    return `mechanic_data_${userId}`;
  } catch {
    return `mechanic_data_${token}`;
  }
};

const defaultData: AdditionalData = {
  location: "",
  latitude: undefined,
  longitude: undefined,
  mainSpecialty: [],
  subSpecialty: "",
  fieldVisit: false,
  workingHoursFrom: "08:00",
  workingHoursTo: "18:00",
  experience: "",
  workshopLicenseUrl: undefined,
};

// ---------------- COMPONENT ----------------
const AdditionalTab = () => {
  const { dark } = useTheme();
  const token = sessionStorage.getItem("userToken") || "";

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [specializations, setSpecializations] = useState<any[]>([]);
  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const [data, setData] = useState<AdditionalData>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      return saved ? JSON.parse(saved) : defaultData;
    } catch {
      return defaultData;
    }
  });

  useEffect(() => {
    if (data?.mainSpecialty?.length && data.mainSpecialty[0]) {
      setSelectedMain(String(data.mainSpecialty[0]));
    } else {
      setSelectedMain("");
    }
    
    if (data?.subSpecialty) {
      setSelectedSub(String(data.subSpecialty));
    } else {
      setSelectedSub("");
    }
  }, [data]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await axios.get(
          "https://gearupapp.runasp.net/api/specializations",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const rawData: any[] = res.data;
        const namesWithSubs = new Set(
          rawData.filter((i: any) => i.subSpecializations.length > 0).map((i: any) => i.name)
        );
        
        const filteredRaw = rawData.filter((item: any) => {
          if (item.subSpecializations.length === 0 && namesWithSubs.has(item.name)) {
            return false;
          }
          return true; 
        });

        const mergedMap = new Map<string, any>();
        filteredRaw.forEach((item: any) => {
          if (mergedMap.has(item.name)) {
            const existing = mergedMap.get(item.name);
            existing.subSpecializations.push(...item.subSpecializations);
          } else {
            mergedMap.set(item.name, {
              ...item,
              subSpecializations: [...item.subSpecializations]
            });
          }
        });

        const cleanedData = Array.from(mergedMap.values()).map((main: any) => ({
          ...main,
          subSpecializations: Array.from(
            new Map(main.subSpecializations.map((sub: any) => [sub.name, sub])).values()
          )
        }));

        setSpecializations(cleanedData);

      } catch (err) {
        console.log(err);
      }
    };

    fetchSpecializations();
  }, []);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const res = await axios.get(
          "https://gearupapp.runasp.net/api/mechanics/my/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const apiData = res.data;
  
        setData((prev) => ({
          ...prev,
          location: apiData.location || "",
          latitude: apiData.latitude,
          longitude: apiData.longitude,
          mainSpecialty: apiData.primarySpecializationId ? [apiData.primarySpecializationId] : [],
          subSpecialty: apiData.subSpecializationId || "",
          fieldVisit: apiData.supportsFieldVisit || false,
          workingHoursFrom: apiData.workStartTime || "08:00",
          workingHoursTo: apiData.workEndTime || "18:00",
          experience: "",
        }));
  
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchMyData();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          "https://gearupapp.runasp.net/api/mechanics/my/profile/summary",
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const apiData = res.data;
        setData((prev) => ({
          ...prev,
          workshopLicenseUrl: apiData.workshopLicenseUrl,
        }));
  
      } catch (err) {
        console.log("Error fetching summary:", err);
      }
    };
  
    fetchSummary();
  }, []);

  const selectedMainObj = specializations.find((s) => s.id === selectedMain);
  const subList = selectedMainObj?.subSpecializations || [];

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم تحديد الموقع");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setError("");
        setData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      (err) => {
        setError("خطأ في تحديد الموقع، تأكد من تفعيل خدمة الموقع من إعدادات المتصفح");
        console.error(err);
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };


  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    // ... (كود التحقق من المدخلات كما هو - بدون تغيير) ...
    if (!selectedMain) {
      setError("يرجى اختيار التخصص الرئيسي");
      setIsSaving(false);
      return;
    }

    if (!data.latitude || !data.longitude) {
      setError("يرجى تحديد الموقع بدقة على الخريطة (انقر على الموقع)");
      setIsSaving(false);
      return;
    }

    if (data.workingHoursFrom >= data.workingHoursTo) {
      setError("يجب أن يكون وقت نهاية العمل بعد وقت البداية");
      setIsSaving(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("userToken") || "";

      // 1. تجهيز البيانات
      const payloadLocation = {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        location: data.location || "تم التحديد عبر الخريطة",
      };

      const payloadSpecialization = {
        primarySpecializationId: selectedMain,
        subSpecializationId: selectedSub || null,
      };

      const payloadFieldVisit = {
        supportsFieldVisit: data.fieldVisit,
      };

      const payloadWorkingHours = {
        workStartTime: data.workingHoursFrom,
        workEndTime: data.workingHoursTo,
      };

      // 2. إرسال الطلبات بشكل متتابع (Sequential) بدلاً من Promise.all
      // هذا يمنع الـ Deadlock لأننا لا نعدل نفس المستخدم في نفس الوقت
      
      // تحديث الموقع
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/location", payloadLocation, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // تحديث التخصصات
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/profile/complete", payloadSpecialization, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // تحديث الزيارات الميدانية
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/field-visit", payloadFieldVisit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // تحديث ساعات العمل
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/working-hours", payloadWorkingHours, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // رفع الملف (إن وجد)
      if (licenseFile) {
        const formData = new FormData();
        formData.append("File", licenseFile);
        formData.append("IsWorkshopLicense", "true");

        const isUpdate = !!data.workshopLicenseUrl;

        if (isUpdate) {
          await axios.put("https://gearupapp.runasp.net/api/mechanics/documents/workshop-license", formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
          });
        } else {
          const userId = getUserIdFromToken();
          if (!userId) {
            throw new Error("لا يمكن تحديد معرف المستخدم");
          }
          formData.append("UserId", userId);

          await axios.post("https://gearupapp.runasp.net/api/mechanics/documents", formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
          });
        }
      }

      // 3. حفظ في الـ LocalStorage وعرض رسالة النجاح
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify({
          ...data,
          mainSpecialty: [selectedMain],
          subSpecialty: selectedSub,
        })
      );

      if (licenseFile) {
         setData(prev => ({
           ...prev,
           workshopLicenseUrl: URL.createObjectURL(licenseFile)
         }));
      }

      setSuccess("تم الحفظ بنجاح");
      setIsEditing(false);
      setLicenseFile(null);
      setTimeout(() => setSuccess(""), 2500);

    } catch (err: any) {
      console.error("Save Error:", err);
      // ملاحظة: إذا حدث Deadlock مرة أخرى (نادر جداً بعد هذا التعديل)، السيرفر يجب أن يعيد المحاولة
      const serverMessage = err?.response?.data?.message || err?.response?.data || "حصل خطأ أثناء الحفظ";
      setError(typeof serverMessage === 'string' ? serverMessage : "حصل خطأ غير متوقع");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLicenseFile(null);
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch {
        // ignore error
    }
  };

  const displayImage = licenseFile ? URL.createObjectURL(licenseFile) : data.workshopLicenseUrl;

  return (
    <div
      dir="rtl"
      className="bg-white dark:bg-[#0d1629] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 md:p-6 space-y-6 md:space-y-8"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">البيانات الإضافية</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تعديل التخصصات، أوقات العمل ورخصة الورشة</p>
        </div>

        <div className="w-full md:w-auto">
          {isEditing ? (
            <div className="flex gap-2 w-full">
              <button onClick={handleCancel} className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all bg-gray-100 dark:bg-[#131c2f] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800">إلغاء</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#137FEC] hover:bg-blue-600 text-white text-sm font-bold transition-all active:scale-95 shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none disabled:bg-gray-400">
                {isSaving ? <><FaSpinner className="animate-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ التغييرات</>}
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#137FEC] hover:bg-blue-600 text-white text-sm font-bold transition-all active:scale-95 shadow-md shadow-blue-500/20">
              <FaEdit /> تعديل البيانات
            </button>
          )}
        </div>
      </div>

      {/* messages */}
      {success && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm text-center font-medium">{success}</div>}
      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center font-medium">{error}</div>}

      <div className="space-y-6">

      {/* ================= WORKSHOP LICENSE (New UI) ================= */}
      <div className={`p-4 sm:p-6 rounded-2xl border transition-all ${!dark ? "bg-white border-gray-100" : "bg-[#131c2f] border-gray-800"}`}>
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs sm:text-sm font-extrabold text-[#137FEC] flex items-center gap-2">
            رخصة الورشة <span className="text-red-500">*</span>
          </label>
          {/* Status Badge */}
          {data.workshopLicenseUrl && !isEditing && (
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <FaCheckCircle /> مرفقة
            </span>
          )}
        </div>

        {/* Modern Upload Area */}
        <div
          className={`relative w-full flex flex-col items-center justify-center min-h-[240px] rounded-xl transition-all duration-300 border-2 overflow-hidden group
            ${displayImage
              ? "border-solid border-gray-200 dark:border-gray-600 bg-transparent"
              : "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1a253a]"
            }
            ${!isEditing && !displayImage ? "opacity-60 cursor-not-allowed" : isEditing && !displayImage ? "cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" : "cursor-default"}
          `}
        >
          {displayImage ? (
            // --- Image State ---
            <>
              <img
                src={displayImage}
                alt="Workshop License"
                className="max-h-[300px] w-full object-contain"
              />
              
              {/* Overlay on Hover for Editing */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                  <label
                    htmlFor="license-upload"
                    className="bg-white text-gray-900 px-5 py-2.5 rounded-lg font-bold cursor-pointer hover:bg-gray-100 shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    <FaCloudUploadAlt /> تغيير الصورة
                  </label>
                </div>
              )}
            </>
          ) : (
            // --- Empty State ---
            isEditing ? (
              <label htmlFor="license-upload" className="cursor-pointer flex flex-col items-center gap-3 p-6">
                <div className={`p-4 rounded-full transition-transform duration-300 group-hover:scale-110 ${dark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <FaCloudUploadAlt className="text-4xl" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold block mb-1">اضغط لرفع صورة الرخصة</span>
                  {/* <span className="text-xs text-gray-400">JPG, PNG (Max 5MB)</span> */}
                </div>
              </label>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <FaCloudUploadAlt className="text-3xl opacity-50" />
                <span className="text-sm">لا توجد صورة مرفقة</span>
              </div>
            )
          )}
        </div>

        {/* Instruction Text (Below) */}
        {isEditing && (
          <div className="mt-3 text-center">
             <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
              يرجى إرفاق صورة واضحة لرخصة ورشة العمل الخاصة بك.
            </p>
          </div>
        )}

        {/* Hidden Input */}
        <input
          type="file"
          id="license-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* ================= LOCATION ================= */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs sm:text-sm font-extrabold text-[#137FEC]">موقع الورشة <span className="text-red-500">*</span></label>
          {isEditing && (
            <button onClick={handleGetMyLocation} className="text-[#137FEC] flex gap-2 items-center text-sm font-bold hover:underline">
              <FaLocationArrow /> تحديد موقعي
            </button>
          )}
        </div>

        <div className={`rounded-2xl overflow-hidden border ${!dark ? "border-gray-200 shadow-sm" : "border-gray-700"} p-1`}>
          <MapPicker
            latitude={data.latitude}
            longitude={data.longitude}
            setLocation={(lat: number, lng: number) => setData((p) => ({ ...p, latitude: lat, longitude: lng }))}
            isEditing={isEditing}
            dark={dark}
          />
        </div>
      </div>

      {/* ================= SPECIALIZATION ================= */}
      <div className={`grid grid-cols-1 ${subList.length > 0 ? "md:grid-cols-2" : ""} gap-4 sm:gap-6`}>
        <div className="space-y-2">
          {isEditing ? (
            <>
              <label className="text-xs sm:text-sm font-extrabold text-[#137FEC] block">التخصص الرئيسي <span className="text-red-500">*</span></label>
              <select
                value={selectedMain}
                onChange={(e) => { setSelectedMain(e.target.value); setSelectedSub(""); }}
                className={`w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border outline-none ${
                  !dark
                    ? "bg-white border-blue-400 ring-2 ring-blue-100 text-gray-900 shadow-sm"
                    : "bg-gray-800 border-blue-400 ring-2 ring-blue-900/40 text-white"
                }`}
              >
                <option value="">اختر التخصص الرئيسي</option>
                {specializations.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </>
          ) : (
            <div className="rounded-2xl bg-gray-50 dark:bg-[#131c2f] border border-gray-200 dark:border-gray-800 px-4 py-3">
              <p className="text-xs font-bold text-[#137FEC] mb-1">التخصص الرئيسي</p>
              <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                {specializations.find((s) => s.id === selectedMain)?.name || "—"}
              </p>
            </div>
          )}
        </div>

        {subList.length > 0 && (
          <div className="space-y-2">
            {isEditing ? (
              <>
                <label className="text-xs sm:text-sm font-extrabold text-[#137FEC] block">التخصص الفرعي</label>
                <select
                  value={selectedSub}
                  onChange={(e) => setSelectedSub(e.target.value)}
                  className={`w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border outline-none ${
                    !dark
                      ? "bg-white border-blue-400 ring-2 ring-blue-100 text-gray-900 shadow-sm"
                      : "bg-gray-800 border-blue-400 ring-2 ring-blue-900/40 text-white"
                  }`}
                >
                  <option value="">اختر التخصص الفرعي</option>
                  {subList.map((sub: any) => (<option key={sub.id} value={sub.id}>{sub.name}</option>))}
                </select>
              </>
            ) : (
              <div className="rounded-2xl bg-gray-50 dark:bg-[#131c2f] border border-gray-200 dark:border-gray-800 px-4 py-3">
                <p className="text-xs font-bold text-[#137FEC] mb-1">التخصص الفرعي</p>
                <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                  {subList.find((s: any) => s.id === selectedSub)?.name || "—"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= FIELD VISIT & WORKING HOURS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* FIELD VISIT */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
          !dark ? "bg-white border-gray-100 shadow-sm" : "bg-[#131c2f] border-gray-800"
        }`}>
          <div>
            <label className="text-xs sm:text-sm font-extrabold text-[#137FEC] block">الزيارة الميدانية</label>
            <p className={`text-xs mt-1 font-bold ${!dark ? "text-gray-500" : "text-gray-400"}`}>
              تقديم الخدمة في الموقع
            </p>
          </div>
          
          <div
            onClick={() => { if (isEditing) setData((prev) => ({ ...prev, fieldVisit: !prev.fieldVisit })); }}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer shrink-0 ${
              data.fieldVisit ? "bg-[#137FEC]" : (dark ? "bg-gray-600" : "bg-gray-300")
            } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
              data.fieldVisit ? "translate-x-6" : "translate-x-0"
            }`} />
          </div>
        </div>

        {/* WORKING HOURS */}
        <div className={`p-4 rounded-2xl border transition-all ${
          !isEditing ? "bg-gray-50 dark:bg-[#131c2f] border-gray-200 dark:border-gray-800" : !dark ? "bg-white border-gray-200 shadow-sm" : "bg-[#131c2f] border-gray-800"
        }`}>
          <label className="text-xs sm:text-sm font-extrabold text-[#137FEC] block mb-1">ساعات العمل</label>
          
          {!isEditing ? (
            <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mt-2">
              من {data.workingHoursFrom} إلى {data.workingHoursTo}
            </p>
          ) : (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="time"
                value={data.workingHoursFrom}
                onChange={(e) => setData((prev) => ({ ...prev, workingHoursFrom: e.target.value }))}
                className={`flex-1 px-3 py-2 rounded-xl border outline-none text-sm font-bold text-center transition-all ${
                  !dark ? "bg-white border-blue-400 text-gray-900 ring-2 ring-blue-100" : "bg-gray-800 border-blue-400 text-white ring-2 ring-blue-900/40 [color-scheme:dark]"
                }`}
              />
              <span className={`text-sm font-bold ${!dark ? "text-gray-500" : "text-gray-400"}`}>إلى</span>
              <input
                type="time"
                value={data.workingHoursTo}
                onChange={(e) => setData((prev) => ({ ...prev, workingHoursTo: e.target.value }))}
                className={`flex-1 px-3 py-2 rounded-xl border outline-none text-sm font-bold text-center transition-all ${
                  !dark ? "bg-white border-blue-400 text-gray-900 ring-2 ring-blue-100" : "bg-gray-800 border-blue-400 text-white ring-2 ring-blue-900/40 [color-scheme:dark]"
                }`}
              />
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdditionalTab;
