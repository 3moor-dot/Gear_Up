
import { useState } from "react";
import axios from "axios";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaEdit, FaSave, FaSpinner, FaLocationArrow } from "react-icons/fa";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// --- مكون الخريطة المصغر ---
function MapPicker({ latitude, longitude, setLocation, isEditing, dark }: any) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDjiprEoUGZU_uofuYeW5qEkOa1HEEvE5w", 
  });

  if (loadError) return <div className="text-red-500 text-sm">خطأ في تحميل الخريطة</div>;
  if (!isLoaded) return <div className="h-[250px] flex items-center justify-center animate-pulse bg-gray-200 rounded-xl">جاري تحميل الخريطة...</div>;

  // لو مفيش إحداثيات، بنخليه يفتح على القاهرة مثلاً كوضع افتراضي
  const center = latitude && longitude
  ? { lat: Number(latitude), lng: Number(longitude) }
  : null;
    console.log("MAP DATA =>", latitude, longitude);

  return (
    <div className={`rounded-xl overflow-hidden border ${dark ? "border-gray-700" : "border-gray-300"}`} style={{ height: "250px", width: "100%" }}>
      {/* <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={latitude ? 17 : 12} // 17 بيخلي الخريطة قريبة جداً فالدبوس يبان بوضوح
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
      > */}

<GoogleMap
  mapContainerStyle={{ width: "100%", height: "100%" }}
  center={center || { lat: 0, lng: 0 }} // fallback داخلي فقط لتفادي crash
  zoom={latitude ? 17 : 2}
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


        {/* الدبوس (الـ Marker) */}
        {latitude && longitude && (
          <Marker 
            position={{ lat: Number(latitude), lng: Number(longitude) }} 
            // حركة "Drop" بتخلي الدبوس ينزل من فوق أول ما يظهر، وده بيعرف المستخدم مكانه
            animation={window.google?.maps?.Animation?.DROP} 
          />
        )}
      </GoogleMap>
    </div>
  );
}

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

const specialties = ["ميكانيكا عامة", "كهرباء سيارات", "ضبط زوايا", "التروس / السرعات"];

const AdditionalTab = () => {
  const { dark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);


  const token = sessionStorage.getItem("userToken");
  console.log("TOKEN =>", token);

  const [isSaving, setIsSaving] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [data, setData] = useState<AdditionalData>(() => {
    const saved = localStorage.getItem("mechanic_data");
    return saved ? JSON.parse(saved) : {
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
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("متصفحك لا يدعم خاصية تحديد الموقع");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationState(latitude, longitude);
        setIsGettingLocation(false);
        setSuccess("تم تحديد موقعك بدقة 📍");
        setTimeout(() => setSuccess(""), 3000);
      },
      () => {
        setIsGettingLocation(false);
        setError("فشل الحصول على الموقع. تأكد من إعطاء الصلاحية.");
      }
    );
  };

  const setLocationState = (lat: number, lng: number) => {
    setData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: `تم تحديد الموقع بنجاح`
    }));
  };

  const update = (field: keyof AdditionalData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialty = (item: string) => {
    setData((prev) => ({
      ...prev,
      mainSpecialty: prev.mainSpecialty.includes(item)
        ? prev.mainSpecialty.filter((s) => s !== item)
        : [...prev.mainSpecialty, item],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
       localStorage.setItem("mechanic_data", JSON.stringify(data));
      // await axios.post(
      //   "https://gearupapp.runasp.net/api/mechanic/profile",
      //   data,
      //   {
      //     headers: { Authorization: `Bearer ${token}` }
      //   }
      // );

      // await axios.post(
      //   "https://gearupapp.runasp.net/api/mechanic/profile",
      //   data,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json"
      //     }
      //   }
      // );
      await axios.post(
        "http://gearupapp.runasp.net/api/mechanics/complete-profile",
        {
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          mainSpecialty: data.mainSpecialty,
          subSpecialty: data.subSpecialty,
          fieldVisit: data.fieldVisit,
          workingHoursFrom: data.workingHoursFrom,
          workingHoursTo: data.workingHoursTo,
          experience: data.experience
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );



      await new Promise((r) => setTimeout(r, 800));
      setSuccess("تم حفظ البيانات بنجاح ✅");
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setError("تعذر الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all ${
    !dark ? "bg-gray-50 border-gray-300" : "bg-[#131c2f] border-gray-700 text-white"
  } ${isEditing ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" : "cursor-not-allowed"}`;

  return (
    <div className={`rounded-2xl border p-6 space-y-6 ${!dark ? "bg-white border-gray-200 shadow-md" : "bg-[#0d1629] border-blue-900/30"}`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">البيانات الإضافية</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className={`px-4 py-2 rounded-xl text-sm font-medium ${!dark ? "bg-gray-200" : "bg-gray-700 text-white"}`}>إلغاء</button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-50">
                {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} حفظ
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"><FaEdit /> تعديل</button>
          )}
        </div>
      </div>

      {/* Messages */}
      {success && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm text-center font-bold">{success}</div>}
      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center font-bold">{error}</div>}

      {/* الموقع الجغرافي */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <label className={`block text-sm font-bold ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                موقع الورشة / المركز
            </label>
            {isEditing && (
                <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    className="flex items-center gap-2 text-sm text-blue-500 font-bold hover:underline"
                >
                    {isGettingLocation ? <FaSpinner className="animate-spin" /> : <FaLocationArrow />}
                    تحديد موقعي التلقائي
                </button>
            )}
        </div>

        {/* عرض الخريطة بدلاً من الـ Input النصي */}
        <MapPicker 
            latitude={data.latitude} 
            longitude={data.longitude} 
            setLocation={setLocationState} 
            isEditing={isEditing}
            dark={dark}
        />
        
        {!data.latitude && !isEditing && (
            <p className="text-sm text-gray-500 italic text-center">الموقع لم يحدد بعد</p>
        )}
      </div>

      {/* التخصص الرئيسي */}
      <div>
        <label className={`block text-sm mb-3 ${!dark ? "text-gray-600" : "text-gray-400"}`}>التخصص الرئيسي</label>
        <div className="flex flex-wrap gap-3">
          {specialties.map((item) => {
            const selected = data.mainSpecialty.includes(item);
            return (
              <button
                key={item}
                onClick={() => isEditing && toggleSpecialty(item)}
                disabled={!isEditing}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selected ? "bg-blue-600 text-white shadow-lg scale-105" : !dark ? "bg-gray-200 text-gray-700" : "bg-gray-700 text-gray-300"
                } ${!isEditing && "opacity-60 cursor-not-allowed"}`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* التخصص الفرعي */}
      <div>
        <label className={`block text-sm mb-2 ${!dark ? "text-gray-600" : "text-gray-400"}`}>التخصص الفرعي</label>
        <input type="text" value={data.subSpecialty} onChange={(e) => update("subSpecialty", e.target.value)} readOnly={!isEditing} placeholder="التخصص الفرعي" className={inputClass} />
      </div>

      {/* سنوات الخبرة */}
      <div>
        <label className={`block text-sm mb-2 ${!dark ? "text-gray-600" : "text-gray-400"}`}>سنوات الخبرة</label>
        <input type="text" value={data.experience} onChange={(e) => update("experience", e.target.value)} readOnly={!isEditing} placeholder="مثال: 5 سنوات" className={inputClass} />
      </div>

      {/* الزيارة الميدانية وساعات العمل (نفس كودك القديم مع تحسين بسيط) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm mb-2 ${!dark ? "text-gray-600" : "text-gray-400"}`}>إمكانية الزيارة الميدانية</label>
            <select value={data.fieldVisit ? "true" : "false"} onChange={(e) => update("fieldVisit", e.target.value === "true")} disabled={!isEditing} className={inputClass}>
              <option value="true">نعم</option>
              <option value="false">لا</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm mb-2 ${!dark ? "text-gray-600" : "text-gray-400"}`}>ساعات العمل</label>
            <div className="flex gap-2">
                <input type="time" value={data.workingHoursFrom} onChange={(e) => update("workingHoursFrom", e.target.value)} readOnly={!isEditing} className={inputClass} />
                <input type="time" value={data.workingHoursTo} onChange={(e) => update("workingHoursTo", e.target.value)} readOnly={!isEditing} className={inputClass} />
            </div>
          </div>
      </div>
    </div>
  );
};

export default AdditionalTab;