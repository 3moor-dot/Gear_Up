
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaEdit, FaSave, FaSpinner, FaLocationArrow, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// --- Map Component ---
interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  setLocation: (lat: number, lng: number) => void;
  isEditing: boolean;
  dark: boolean;
}

function MapPicker({ latitude, longitude, setLocation, isEditing, dark }: MapPickerProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  if (loadError) return <div className="text-red-500 text-sm">خطأ في تحميل الخريطة</div>;
  if (!isLoaded) return (
    <div className="h-[250px] flex items-center justify-center animate-pulse bg-gray-200 rounded-xl">
      جاري تحميل الخريطة...
    </div>
  );

  const center = (latitude && longitude) ? { lat: Number(latitude), lng: Number(longitude) } : { lat: 26.8206, lng: 30.8025 };
  return (
    <div className={`rounded-xl overflow-hidden border ${dark ? "border-gray-700" : "border-gray-300"}`} style={{ height: "250px", width: "100%" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={latitude ? 17 : 6}
        onClick={(e) => { if (isEditing && e.latLng) setLocation(e.latLng.lat(), e.latLng.lng()); }}
        options={{ draggable: isEditing, clickableIcons: isEditing, scrollwheel: true }}
      >
        {latitude && longitude && <Marker position={{ lat: Number(latitude), lng: Number(longitude) }} animation={window.google?.maps?.Animation?.DROP} />}
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
  // subSpecialty: string; // <-- تم الحذف
  fieldVisit: boolean;
  isAvailable: boolean;
  workingHoursFrom: string;
  workingHoursTo: string;
  workshopLicenseUrl?: string;
  status?: number;
  savedPrimarySpec?: { id: string; name: string };
  // savedSubSpec?: { id: string; name: string }; // <-- تم الحذف
}

// ---------------- HELPERS ----------------
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
  } catch { return ""; }
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
    const userId = payload.nameid || payload.sub || payload.id;
    return `mechanic_data_${userId}`;
  } catch { return `mechanic_data_${token}`; }
};

const defaultData: AdditionalData = {
  location: "", latitude: undefined, longitude: undefined, mainSpecialty: [], fieldVisit: false,
  isAvailable: false, workingHoursFrom: "08:00", workingHoursTo: "18:00",
  workshopLicenseUrl: undefined, status: 0,
};

// ---------------- COMPONENT ----------------
const AdditionalTab = () => {
  const { dark } = useTheme();
  const token = sessionStorage.getItem("userToken") || "";
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // قائمة التخصصات العامة من الـ API
  const [specializationsList, setSpecializationsList] = useState<any[]>([]);
  
  const [selectedMain, setSelectedMain] = useState("");
  // const [selectedSub, setSelectedSub] = useState(""); // <-- تم الحذف
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  
  const [data, setData] = useState<AdditionalData>(() => {
    try { const saved = localStorage.getItem(getStorageKey()); return saved ? JSON.parse(saved) : defaultData; } 
    catch { return defaultData; }
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("https://gearupapp.runasp.net/api/mechanics/my/profile/summary", { headers: { Authorization: `Bearer ${token}` } });
        const apiData = res.data;
        
        const primary = apiData.primarySpecialization;
        // const sub = apiData.subSpecializations?.[0]; // <-- تم الحذف

        setData((prev) => {
          const finalPrimaryId = primary?.id || prev.mainSpecialty?.[0] || "";
          // const finalSubId = sub?.id || prev.subSpecialty || ""; // <-- تم الحذف

          if (finalPrimaryId) setSelectedMain(finalPrimaryId);
          // if (finalSubId) setSelectedSub(finalSubId); // <-- تم الحذف

          return {
            ...prev,
            status: apiData.status,
            workshopLicenseUrl: apiData.workshopLicenseUrl ?? prev.workshopLicenseUrl,
            latitude: apiData.latitude ?? prev.latitude,
            longitude: apiData.longitude ?? prev.longitude,
            fieldVisit: apiData.supportsFieldVisit ?? prev.fieldVisit,
            isAvailable: apiData.isAvailable ?? prev.isAvailable,
            workingHoursFrom: apiData.workStartTime?.slice(0, 5) ?? prev.workingHoursFrom,
            workingHoursTo: apiData.workEndTime?.slice(0, 5) ?? prev.workingHoursTo, 
            mainSpecialty: finalPrimaryId ? [finalPrimaryId] : [],
            // subSpecialty: finalSubId, // <-- تم الحذف
            savedPrimarySpec: primary || prev.savedPrimarySpec,
            // savedSubSpec: sub || prev.savedSubSpec, // <-- تم الحذف
          };
        });

      } catch (err) { console.log("Error fetching summary:", err); }
    };
    fetchSummary();
  }, [token]);

  // 2. جلب القائمة العامة للتخصصات
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await axios.get("https://gearupapp.runasp.net/api/specializations", { headers: { Authorization: `Bearer ${token}` } });
        setSpecializationsList(res.data || []);
      } catch (err) { console.log("Error fetching specializations:", err); }
    };
    fetchSpecializations();
  }, [token]);

  // تم حذف الـ Effect الخاص بالتحقق من التخصص الفرعي عند تغيير الرئيسي
  
  // تم حذف دالة getDisplaySubList
  
  const canEnableAvailability = () => !!data.workshopLicenseUrl && data.status === 1;

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) { setError("المتصفح لا يدعم تحديد الموقع"); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => { setError(""); setData((p) => ({ ...p, latitude: position.coords.latitude, longitude: position.coords.longitude })); },
      (err) => { setError("خطأ في تحديد الموقع"); console.error(err); }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setLicenseFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setIsSaving(true); setError(""); setSuccess("");
    if (!selectedMain) { setError("يرجى اختيار التخصص الرئيسي"); setIsSaving(false); return; }
    if (!data.latitude || !data.longitude) { setError("يرجى تحديد الموقع"); setIsSaving(false); return; }
    if (data.workingHoursTo <= data.workingHoursFrom) { setError("وقت نهاية العمل يجب أن يكون بعد وقت بداية العمل"); setIsSaving(false); return; }
    
    try {
      const payloadLocation = { latitude: Number(data.latitude), longitude: Number(data.longitude), location: data.location || "تم التحديد عبر الخريطة" };
      const payloadSpecialization = { primarySpecializationId: selectedMain }; // <-- تم حذف subSpecializationId
      const payloadFieldVisit = { supportsFieldVisit: data.fieldVisit };
      const payloadWorkingHours = { workStartTime: data.workingHoursFrom, workEndTime: data.workingHoursTo };

      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/location", payloadLocation, { headers: { Authorization: `Bearer ${token}` } });
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/profile/complete", payloadSpecialization, { headers: { Authorization: `Bearer ${token}` } });
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/field-visit", payloadFieldVisit, { headers: { Authorization: `Bearer ${token}` } });
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/working-hours", payloadWorkingHours, { headers: { Authorization: `Bearer ${token}` } });

      if (!data.isAvailable || canEnableAvailability()) {
        try { await axios.put("https://gearupapp.runasp.net/api/mechanics/availability", data.isAvailable, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }); } 
        catch (availErr: any) { console.error("Availability Error:", availErr); }
      } else {
        setError("تم الحفظ، لكن لا يمكن تفعيل التوفر إلا بعد اعتماد الرخصة");
      }

      if (licenseFile) {
        const formData = new FormData(); formData.append("File", licenseFile); formData.append("IsWorkshopLicense", "true");
        if (data.workshopLicenseUrl) {
          await axios.put("https://gearupapp.runasp.net/api/mechanics/documents/workshop-license", formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
        } else {
          const userId = getUserIdFromToken();
          if (!userId) throw new Error("User ID missing");
          formData.append("UserId", userId);
          await axios.post("https://gearupapp.runasp.net/api/mechanics/documents", formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
        }
      }

      const newData = { ...data, mainSpecialty: [selectedMain], isAvailable: data.isAvailable }; // <-- تم حذف subSpecialty
      setData(newData);
      localStorage.setItem(getStorageKey(), JSON.stringify(newData));
      if (licenseFile) setData(prev => ({ ...prev, workshopLicenseUrl: URL.createObjectURL(licenseFile) }));
      
      setSuccess("تم الحفظ بنجاح"); setIsEditing(false); setLicenseFile(null); setTimeout(() => setSuccess(""), 2500);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "حدث خطأ أثناء الحفظ");
    } finally { setIsSaving(false); }
  };

  const handleCancel = () => {
    setIsEditing(false); setLicenseFile(null);
    try { 
      const saved = localStorage.getItem(getStorageKey()); 
      if (saved) setData(JSON.parse(saved)); 
    } catch (err) { 
      console.error("Error restoring data:", err); 
    }
  };

  const displayImage = licenseFile ? URL.createObjectURL(licenseFile) : data.workshopLicenseUrl;

  return (
    <div className={`rounded-2xl border p-6 space-y-6 ${!dark ? "bg-white border-gray-200 shadow-md" : "bg-[#0d1629] border-blue-900/30"}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">البيانات الإضافية</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className={`px-4 py-2 rounded-xl text-sm font-medium ${!dark ? "bg-gray-200" : "bg-gray-700 text-white"}`}>إلغاء</button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-50">
                {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} حفظ
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium"><FaEdit /> تعديل</button>
          )}
        </div>
      </div>

      {success && <div className="p-3 bg-green-500/10 text-green-500 text-center text-sm font-medium">{success}</div>}
      {error && <div className="p-3 bg-red-500/10 text-red-500 text-center text-sm font-medium">{error}</div>}

      {/* WORKSHOP LICENSE */}
      <div className={`p-4 rounded-xl border ${!dark ? "bg-white border-gray-200" : "bg-[#131c2f] border-gray-700"}`}>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-bold flex items-center gap-2">رخصة الورشة <span className="text-red-500">*</span></label>
          {data.workshopLicenseUrl && !isEditing && <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1"><FaCheckCircle /> مرفقة</span>}
        </div>
        <div className={`relative w-full flex flex-col items-center justify-center min-h-[240px] rounded-xl transition-all duration-300 border-2 overflow-hidden group ${displayImage ? "border-solid border-gray-200 dark:border-gray-600" : "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1a253a]"} ${!isEditing && !displayImage ? "opacity-60 cursor-not-allowed" : isEditing && !displayImage ? "cursor-pointer hover:border-blue-400" : "cursor-default"}`}>
          {displayImage ? (
            <>
              <img src={displayImage} alt="" className="max-h-[300px] w-full object-contain" />
              {isEditing && <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"><label htmlFor="license-upload" className="bg-white text-gray-900 px-5 py-2.5 rounded-lg font-bold cursor-pointer hover:bg-gray-100 shadow-lg flex items-center gap-2"><FaCloudUploadAlt /> تغيير الصورة</label></div>}
            </>
          ) : (
            isEditing ? (
              <label htmlFor="license-upload" className="cursor-pointer flex flex-col items-center gap-3 p-6">
                <div className={`p-4 rounded-full transition-transform group-hover:scale-110 ${dark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}><FaCloudUploadAlt className="text-4xl" /></div>
                <div className="text-center"><span className="text-sm font-bold block mb-1">اضغط لرفع صورة الرخصة</span></div>
              </label>
            ) : <div className="flex flex-col items-center gap-2 text-gray-400"><FaCloudUploadAlt className="text-3xl opacity-50" /><span className="text-sm">لا توجد صورة</span></div>
          )}
        </div>
        {isEditing && <div className="mt-3 text-center"><p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>صورة واضحة لرخصة الورشة.</p></div>}
        <input type="file" id="license-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>

      {/* LOCATION */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold">موقع الورشة <span className="text-red-500">*</span></label>
          {isEditing && <button onClick={handleGetMyLocation} className="text-blue-500 flex gap-2 items-center text-sm hover:underline"><FaLocationArrow /> تحديد موقعي</button>}
        </div>
        <MapPicker latitude={data.latitude} longitude={data.longitude} setLocation={(lat: number, lng: number) => setData(p => ({ ...p, latitude: lat, longitude: lng }))} isEditing={isEditing} dark={dark} />
      </div>

      {/* SPECIALIZATION */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold">التخصص الرئيسي <span className="text-red-500">*</span></label>
          <select 
            disabled={!isEditing} 
            value={selectedMain} 
            onChange={(e) => { 
              const val = e.target.value; 
              setSelectedMain(val); 
              setData((prev) => ({ ...prev, mainSpecialty: val ? [val] : [] })); 
            }} 
            className={`w-full px-4 py-3 rounded-xl border outline-none ${!dark ? "bg-gray-50 border-gray-300 text-gray-900" : "bg-[#131c2f] border-gray-700 text-white"} ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <option value="">اختر التخصص الرئيسي</option>
            {specializationsList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* SETTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`flex items-center justify-between p-3 rounded-xl border ${!dark ? "bg-gray-50 border-gray-200" : "bg-[#131c2f] border-gray-700"}`}>
          <div><label className="text-sm font-bold">الزيارة الميدانية</label><p className={`text-xs mt-0.5 ${!dark ? "text-gray-500" : "text-gray-400"}`}>الخدمة في الموقع</p></div>
          <div onClick={() => { if (isEditing) setData(p => ({ ...p, fieldVisit: !p.fieldVisit })); }} className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer shrink-0 ${data.fieldVisit ? "bg-blue-600" : (dark ? "bg-gray-600" : "bg-gray-300")} ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${data.fieldVisit ? "translate-x-5" : "translate-x-0"}`} />
          </div>
        </div>
        <div className={`flex items-center justify-between p-3 rounded-xl border ${!dark ? "bg-gray-50 border-gray-200" : "bg-[#131c2f] border-gray-700"}`}>
          <div><label className="text-sm font-bold">حالة التوفر</label><p className={`text-xs mt-0.5 ${!dark ? "text-gray-500" : "text-gray-400"}`}>متاح لقبول طلبات جديدة</p></div>
          <div onClick={() => { if (!isEditing) return; if (!data.isAvailable && !canEnableAvailability()) { setError("يجب إرفاق الرخصة واعتمادها أولاً"); return; } setError(""); setData(p => ({ ...p, isAvailable: !p.isAvailable })); }} className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer shrink-0 ${data.isAvailable ? "bg-blue-600" : (dark ? "bg-gray-600" : "bg-gray-300")} ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${data.isAvailable ? "translate-x-5" : "translate-x-0"}`} />
          </div>
        </div>
        <div className={`p-3 rounded-xl border md:col-span-2 ${!dark ? "bg-gray-50 border-gray-200" : "bg-[#131c2f] border-gray-700"}`}>
          <label className="text-sm font-bold">ساعات العمل</label>
          <div className="flex items-center gap-2 mt-2">
            <input type="time" value={data.workingHoursFrom} onChange={(e) => setData(p => ({ ...p, workingHoursFrom: e.target.value }))} disabled={!isEditing} className={`w-full px-3 py-1.5 rounded-lg border outline-none text-sm ${!dark ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1629] border-gray-600 text-white [color-scheme:dark]"} ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`} />
            <span className={`text-sm font-bold ${!dark ? "text-gray-500" : "text-gray-400"}`}>إلى</span>
            <input type="time" value={data.workingHoursTo} onChange={(e) => setData(p => ({ ...p, workingHoursTo: e.target.value }))} disabled={!isEditing} className={`w-full px-3 py-1.5 rounded-lg border outline-none text-sm ${!dark ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1629] border-gray-600 text-white [color-scheme:dark]"} ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalTab;
