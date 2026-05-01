
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaEdit, FaSave, FaSpinner, FaLocationArrow } from "react-icons/fa";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// --- Map ---
function MapPicker({ latitude, longitude, setLocation, isEditing, dark }: any) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBX8_y6ZtDBv722QljpxUubkpQQQG4sTQ0",
  });

  if (loadError)
    return <div className="text-red-500 text-sm">خطأ في تحميل الخريطة</div>;

  if (!isLoaded)
    return (
      <div className="h-[250px] flex items-center justify-center animate-pulse bg-gray-200 rounded-xl">
        جاري تحميل الخريطة...
      </div>
    );

  // ✅ تعديل: إحداثيات افتراضية لمصر (القاهرة)
  const defaultCenter = { lat: 26.8206, lng: 30.8025 };

  const center =
    latitude && longitude
      ? { lat: Number(latitude), lng: Number(longitude) }
      : defaultCenter; // ✅ استخدام مصر كنقطة بداية بدلاً من 0,0

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
        // ✅ تعديل: تغيير الزوم من 2 (عالم) إلى 6 (دولة)
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
}

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
  } catch  { // 🔥 حل مشكلة Empty block statement
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

  // ---------------- DATA ----------------
  const [data, setData] = useState<AdditionalData>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      return saved ? JSON.parse(saved) : defaultData;
    } catch { // 🔥 حل مشكلة Empty block statement
      return defaultData;
    }
  });

  useEffect(() => {
    if (data?.mainSpecialty?.length) {
      setSelectedMain(data.mainSpecialty[0]);
    } else {
      setSelectedMain("");
    }
    setSelectedSub(data?.subSpecialty || "");
  }, [data]);

  // ---------------- FETCH SPECIALIZATIONS ----------------
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await axios.get(
          "https://gearupapp.runasp.net/api/specializations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const rawData: any[] = res.data; // 🔥 حددنا النوع هنا
        const namesWithSubs = new Set(
          rawData.filter((i: any) => i.subSpecializations.length > 0).map((i: any) => i.name) // 🔥 أضفنا any
        );
        
        const filteredRaw = rawData.filter((item: any) => { // 🔥 أضفنا any
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

  // ---------------- FETCH MECHANIC DATA ----------------
  useEffect(() => {
    const fetchMechanicData = async () => {
      try {
        const res = await axios.get(
          "https://gearupapp.runasp.net/api/mechanics/my/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = res.data;
        
        const apiData: AdditionalData = {
          location: json.location || "",
          latitude: json.latitude || undefined,
          longitude: json.longitude || undefined,
          mainSpecialty: json.primarySpecializationId ? [json.primarySpecializationId] : [],
          subSpecialty: json.subSpecializationId || "",
          fieldVisit: json.supportsFieldVisit || json.fieldVisit || false,
          workingHoursFrom: json.workStartTime || json.workingHoursFrom || "08:00",
          workingHoursTo: json.workEndTime || json.workingHoursTo || "18:00",
          experience: json.experience || "",
        };

        setData(apiData);
        localStorage.setItem(getStorageKey(), JSON.stringify(apiData));

      } catch  { // 🔥 حل مشكلة Empty block statement
        console.log("API fetch skipped, using localStorage data");
      }
    };

    fetchMechanicData();
  }, []);

  const selectedMainObj = specializations.find((s) => s.id === selectedMain);
  const subList = selectedMainObj?.subSpecializations || [];

  // ---------------- تحديد موقعي ----------------
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      setError("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setError("جاري البحث عن موقعك...");

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

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
  
    try {
      const profilePromise = axios.put(
        "https://gearupapp.runasp.net/api/mechanics/my/profile/complete",
        {
          latitude: data.latitude,
          longitude: data.longitude,
          primarySpecializationId: selectedMain,
          subSpecializationId: selectedSub || null,
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      const fieldVisitPromise = axios.put(
        "https://gearupapp.runasp.net/api/mechanics/my/field-visit",
        { supportsFieldVisit: data.fieldVisit },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      const workingHoursPromise = axios.put(
        "https://gearupapp.runasp.net/api/mechanics/my/working-hours",
        { 
          workStartTime: data.workingHoursFrom, 
          workEndTime: data.workingHoursTo 
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      await Promise.all([profilePromise, fieldVisitPromise, workingHoursPromise]);
  
      const newData = {
        ...data,
        mainSpecialty: [selectedMain],
        subSpecialty: selectedSub,
      };
  
      setData(newData);
      localStorage.setItem(getStorageKey(), JSON.stringify(newData));
  
      setSuccess("تم الحفظ بنجاح");
      setIsEditing(false);
  
      setTimeout(() => { setSuccess(""); }, 3000);
  
    } catch (err: any) {
      console.log(err);
      setError(err?.response?.data?.message || "حصل خطأ أثناء الحفظ");
      setTimeout(() => { setError(""); }, 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- إلغاء ----------------
  const handleCancel = () => {
    setIsEditing(false);
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch  {} // 🔥 حل مشكلة Empty block statement
  };

  // ---------------- UI ----------------
  return (
    <div
      className={`rounded-2xl border p-6 space-y-6 ${
        !dark
          ? "bg-white border-gray-200 shadow-md"
          : "bg-[#0d1629] border-blue-900/30"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">البيانات الإضافية</h3>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className={`px-4 py-2 rounded-xl text-sm font-medium ${!dark ? "bg-gray-200" : "bg-gray-700 text-white"}`}>إلغاء</button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium">
                {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} حفظ
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium">
              <FaEdit /> تعديل
            </button>
          )}
        </div>
      </div>

      {/* messages */}
      {success && <div className="p-3 bg-green-500/10 text-green-500 text-center">{success}</div>}
      {error && <div className="p-3 bg-red-500/10 text-red-500 text-center">{error}</div>}

      {/* ================= LOCATION ================= */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="text-sm font-bold">موقع الورشة</label>
          {isEditing && (
            <button onClick={handleGetMyLocation} className="text-blue-500 flex gap-2">
              <FaLocationArrow /> تحديد موقعي
            </button>
          )}
        </div>

        <MapPicker
          latitude={data.latitude}
          longitude={data.longitude}
          setLocation={(lat: number, lng: number) => setData((p) => ({ ...p, latitude: lat, longitude: lng }))}
          isEditing={isEditing}
          dark={dark}
        />
      </div>

      {/* ================= SPECIALIZATION ================= */}
      <div className={`grid grid-cols-1 ${subList.length > 0 ? "md:grid-cols-2" : ""} gap-4`}>
        <div className="space-y-2">
          <label className="text-sm font-bold">التخصص الرئيسي</label>
          <select
            disabled={!isEditing}
            value={selectedMain}
            onChange={(e) => { setSelectedMain(e.target.value); setSelectedSub(""); }}
            className={`w-full px-4 py-3 rounded-xl border outline-none ${!dark ? "bg-gray-50 border-gray-300 text-gray-900" : "bg-[#131c2f] border-gray-700 text-white"} ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <option value="">اختر التخصص الرئيسي</option>
            {specializations.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
          </select>
        </div>

        {subList.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-bold">التخصص الفرعي</label>
            <select
              disabled={!isEditing}
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none ${!dark ? "bg-gray-50 border-gray-300 text-gray-900" : "bg-[#131c2f] border-gray-700 text-white"} ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <option value="">اختر التخصص الفرعي</option>
              {subList.map((sub: any) => (<option key={sub.id} value={sub.id}>{sub.name}</option>))}
            </select>
          </div>
        )}
      </div>

      {/* ================= FIELD VISIT & WORKING HOURS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* FIELD VISIT */}
        <div className={`flex items-center justify-between p-3 rounded-xl border ${
          !dark ? "bg-gray-50 border-gray-200" : "bg-[#131c2f] border-gray-700"
        }`}>
          <div>
            <label className="text-sm font-bold">الزيارة الميدانية</label>
            <p className={`text-xs mt-0.5 ${!dark ? "text-gray-500" : "text-gray-400"}`}>
              تقديم الخدمة في الموقع
            </p>
          </div>
          
          <div
            onClick={() => { if (isEditing) setData((prev) => ({ ...prev, fieldVisit: !prev.fieldVisit })); }}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer shrink-0 ${
              data.fieldVisit ? "bg-blue-600" : (dark ? "bg-gray-600" : "bg-gray-300")
            } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
              data.fieldVisit ? "translate-x-5" : "translate-x-0"
            }`} />
          </div>
        </div>

        {/* WORKING HOURS */}
        <div className={`p-3 rounded-xl border ${
          !dark ? "bg-gray-50 border-gray-200" : "bg-[#131c2f] border-gray-700"
        }`}>
          <label className="text-sm font-bold">ساعات العمل</label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="time"
              value={data.workingHoursFrom}
              onChange={(e) => setData((prev) => ({ ...prev, workingHoursFrom: e.target.value }))}
              disabled={!isEditing}
              className={`w-full px-3 py-1.5 rounded-lg border outline-none text-sm ${
                !dark ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1629] border-gray-700 text-white"
              } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
            />
            <span className={`text-sm font-bold ${!dark ? "text-gray-500" : "text-gray-400"}`}>إلى</span>
            <input
              type="time"
              value={data.workingHoursTo}
              onChange={(e) => setData((prev) => ({ ...prev, workingHoursTo: e.target.value }))}
              disabled={!isEditing}
              className={`w-full px-3 py-1.5 rounded-lg border outline-none text-sm ${
                !dark ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1629] border-gray-700 text-white"
              } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdditionalTab;