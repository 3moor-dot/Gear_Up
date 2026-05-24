
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaEdit, FaSave, FaSpinner, FaLocationArrow, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
// --- Map Component ---
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
  isAvailable: boolean; // New: Added Availability state
  workingHoursFrom: string;
  workingHoursTo: string;
  experience: string;
  workshopLicenseUrl?: string;
  status?: number;
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
  isAvailable: false,
  workingHoursFrom: "08:00",
  workingHoursTo: "18:00",
  experience: "",
  workshopLicenseUrl: undefined,
  status: 0,
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
  // Sync Selects with Data
  // useEffect(() => {
  //   if (data?.mainSpecialty?.length && data.mainSpecialty[0]) {
  //     setSelectedMain(String(data.mainSpecialty[0]));
  //   } else {
  //     setSelectedMain("");
  //   }
   
  //   if (data?.subSpecialty) {
  //     setSelectedSub(String(data.subSpecialty));
  //   } else {
  //     setSelectedSub("");
  //   }
  // }, [data]);
    // Sync Selects with Data + Smart Fallback
    useEffect(() => {
      // 1. Set Main Specialty
      // بنشوف هل الـ ID اللي جاي من الـ data موجود فـ الـ list اللي جبناها من API التخصصات
      if (data?.mainSpecialty?.length && specializations.length > 0) {
        const mainId = String(data.mainSpecialty[0]);
        const mainExists = specializations.some((s) => String(s.id) === mainId);
        
        if (mainExists) {
          setSelectedMain(mainId);
        }
      }
  
      // 2. Set Sub Specialty (Smart Logic)
      // بنشوف هل التخصص الفرعي اللي جاي موجود جوه التخصص الرئيسي المختار
      if (selectedMain && specializations.length > 0) {
        const mainObj = specializations.find(
          (s) => String(s.id) === String(selectedMain)
        );
        
        const currentSubList = mainObj?.subSpecializations || [];
  
        if (data?.subSpecialty) {
          const apiSubId = String(data.subSpecialty);
          
          // هل الـ ID موجود بالفعل؟
          const subExists = currentSubList.some((sub) => String(sub.id) === apiSubId);
  
          if (subExists) {
            // موجود تمام، نختاره
            setSelectedSub(apiSubId);
          } else {
            // مش موجود (تغير الـ ID من الباك اند)
            // لو فيه خيار واحد بس، ناخده عشان يظهر في الدروب داون
            if (currentSubList.length === 1) {
              setSelectedSub(String(currentSubList[0].id));
            } else {
              // لو فيه أكتر من خيار، نفضي الاختيار عشان المستخدم يختار الصح
              setSelectedSub("");
            }
          }
        } else {
          setSelectedSub("");
        }
      }
    }, [data, specializations, selectedMain]); // أضفنا specializations و selectedMain هنا عشان يعمل تحديث صحيح
  // Fetch Specializations
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
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          "https://gearupapp.runasp.net/api/mechanics/my/profile/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
 
        const apiData = res.data;
 
        setData((prev) => ({
          ...prev,
 
          status: apiData.status,
 
          workshopLicenseUrl:
            apiData.workshopLicenseUrl ??
            prev.workshopLicenseUrl,
 
          latitude:
            apiData.latitude ??
            prev.latitude,
 
          longitude:
            apiData.longitude ??
            prev.longitude,
 
          fieldVisit:
            apiData.supportsFieldVisit ??
            prev.fieldVisit,
 
          isAvailable:
            apiData.isAvailable ??
            prev.isAvailable,
 
          workingHoursFrom:
            apiData.workStartTime
              ?.slice(0, 5) ??
            prev.workingHoursFrom,
 
          workingHoursTo:
            apiData.workEndTime
              ?.slice(0, 5) ??
            prev.workingHoursTo,
 
          mainSpecialty:
            apiData.primarySpecialization?.id
              ? [apiData.primarySpecialization.id]
              : prev.mainSpecialty,
 
          subSpecialty:
            apiData.subSpecializations?.[0]?.id ??
            prev.subSpecialty,
        }));
 
      } catch (err) {
        console.log("Error fetching summary:", err);
      }
    };
 
    fetchSummary();
  }, []);
  // Fetch Summary (License)
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
          status: apiData.status,
        }));
 
      } catch (err) {
        console.log("Error fetching summary:", err);
      }
    };
 
    fetchSummary();
  }, []);
  // const selectedMainObj = specializations.find((s) => s.id === selectedMain);
  const selectedMainObj = specializations.find(
    (s) => String(s.id) === String(selectedMain)
  );
  const subList = selectedMainObj?.subSpecializations || [];
  const canEnableAvailability = () => {
    return !!data.workshopLicenseUrl && data.status === 1;
  };
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
    // 1. Validation
    if (!selectedMain) {
      setError("يرجى اختيار التخصص الرئيسي");
      setIsSaving(false);
      return;
    }
    if (!data.latitude || !data.longitude) {
      setError("يرجى تحديد الموقع بدقة على الخريطة (انقر على تحديد موقعي)");
      setIsSaving(false);
      return;
    }
    // Validate Working Hours
if (data.workingHoursTo <= data.workingHoursFrom) {
  setError("وقت نهاية العمل يجب أن يكون بعد وقت بداية العمل");
  setIsSaving(false);
  return;
}
    try {
      const token = sessionStorage.getItem("userToken") || "";
      // 2. Prepare Payloads
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
      // --- 3. API CALLS ---
      // Update Location
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/location", payloadLocation, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update Specialization
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/profile/complete", payloadSpecialization, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update Field Visit
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/field-visit", payloadFieldVisit, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update Working Hours
      await axios.put("https://gearupapp.runasp.net/api/mechanics/my/working-hours", payloadWorkingHours, {
        headers: { Authorization: `Bearer ${token}` },
      });
if (!data.isAvailable || canEnableAvailability()) {
  try {
    await axios.put(
      "https://gearupapp.runasp.net/api/mechanics/availability",
      data.isAvailable,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (availErr: any) {
    console.error("Availability Error:", availErr);
  }
} else {
  setError(
    "تم حفظ باقي البيانات، لكن لا يمكن تفعيل حالة التوفر إلا بعد مراجعة الرخصة من الإدارة"
  );
}
      // Upload License File (if exists)
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
      // 4. Save to LocalStorage and Update UI
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
     
      // --- Enhanced Error Handling ---
      let errorMessage = "حصل خطأ غير متوقع";
     
      if (err?.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
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
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-50">
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
      {success && <div className="p-3 bg-green-500/10 text-green-500 text-center text-sm font-medium">{success}</div>}
      {error && <div className="p-3 bg-red-500/10 text-red-500 text-center text-sm font-medium">{error}</div>}
      {/* ================= WORKSHOP LICENSE ================= */}
      <div className={`p-4 rounded-xl border ${!dark ? "bg-white border-gray-200" : "bg-[#131c2f] border-gray-700"}`}>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-bold flex items-center gap-2">
            رخصة الورشة <span className="text-red-500">*</span>
          </label>
          {data.workshopLicenseUrl && !isEditing && (
            <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center gap-1">
              <FaCheckCircle /> مرفقة
            </span>
          )}
        </div>
        <div
          className={`relative w-full flex flex-col items-center justify-center min-h-[240px] rounded-xl transition-all duration-300 border-2 overflow-hidden group
            ${displayImage
              ? "border-solid border-gray-200 dark:border-gray-600 bg-transparent"
              : "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1a253a]"
            }
            ${!isEditing && !displayImage ? "opacity-60 cursor-not-allowed" : isEditing && !displayImage ? "cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" : "cursor-default"}
          `}
        >
          {displayImage && displayImage.trim() !== "" ? (
            <>
              <img
                src={displayImage}
                alt=""
                className="max-h-[300px] w-full object-contain"
              />
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
            isEditing ? (
              <label htmlFor="license-upload" className="cursor-pointer flex flex-col items-center gap-3 p-6">
                <div className={`p-4 rounded-full transition-transform duration-300 group-hover:scale-110 ${dark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <FaCloudUploadAlt className="text-4xl" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold block mb-1">اضغط لرفع صورة الرخصة</span>
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
        {isEditing && (
          <div className="mt-3 text-center">
             <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
              يرجى إرفاق صورة واضحة لرخصة ورشة العمل الخاصة بك.
            </p>
          </div>
        )}
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
          <label className="text-sm font-bold">موقع الورشة <span className="text-red-500">*</span></label>
          {isEditing && (
            <button onClick={handleGetMyLocation} className="text-blue-500 flex gap-2 items-center text-sm hover:underline">
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
          <label className="text-sm font-bold">التخصص الرئيسي <span className="text-red-500">*</span></label>
          <select
            disabled={!isEditing}
            value={selectedMain}
            // onChange={(e) => { setSelectedMain(e.target.value); setSelectedSub(""); }}
            onChange={(e) => {
              const value = e.target.value;
           
              setSelectedMain(value);
              setSelectedSub("");
           
              setData((prev) => ({
                ...prev,
                mainSpecialty: value ? [value] : [],
                subSpecialty: "",
              }));
            }}
            className={`w-full px-4 py-3 rounded-xl border outline-none ${!dark ? "bg-gray-50 border-gray-300 text-gray-900" : "bg-[#131c2f] border-gray-700 text-white"} ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <option value="">اختر التخصص الرئيسي</option>
            {/* {specializations.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))} */}
            {specializations.map((s) => (
  <option key={s.id} value={String(s.id)}>
    {s.name}
  </option>
))}
          </select>
        </div>
        {subList.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-bold">التخصص الفرعي</label>
            <select
              disabled={!isEditing}
              value={selectedSub}
              // onChange={(e) => setSelectedSub(e.target.value)}
              onChange={(e) => {
                const value = e.target.value;
             
                setSelectedSub(value);
             
                setData((prev) => ({
                  ...prev,
                  subSpecialty: value,
                }));
              }}
              className={`w-full px-4 py-3 rounded-xl border outline-none ${!dark ? "bg-gray-50 border-gray-300 text-gray-900" : "bg-[#131c2f] border-gray-700 text-white"} ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
            >
              <option value="">اختر التخصص الفرعي</option>
              {/* {subList.map((sub: any) => (<option key={sub.id} value={sub.id}>{sub.name}</option>))} */}
              {subList.map((sub: any) => (
  <option key={sub.id} value={String(sub.id)}>
    {sub.name}
  </option>
))}
            </select>
          </div>
        )}
      </div>
      {/* ================= SETTINGS GRID ================= */}
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
        {/* AVAILABILITY (NEW) */}
        <div className={`flex items-center justify-between p-3 rounded-xl border ${
          !dark ? "bg-gray-50 border-gray-200" : "bg-[#131c2f] border-gray-700"
        }`}>
          <div>
            <label className="text-sm font-bold">حالة التوفر</label>
            <p className={`text-xs mt-0.5 ${!dark ? "text-gray-500" : "text-gray-400"}`}>
              قبول الطلبات الجديدة
            </p>
          </div>
         
          <div
            onClick={() => {
              if (!isEditing) return;
           
              // لو بيحاول يشغل التوفر
              if (!data.isAvailable) {
           
                if (!canEnableAvailability()) {
                  setError(
                    "لا يمكن تعيين التوفر إلا بعد إرفاق صورة رخصة الورشة وتأكيدها من الإدارة"
                  );
                  return;
                }
              }
           
              setError("");
           
              setData((prev) => ({
                ...prev,
                isAvailable: !prev.isAvailable,
              }));
            }}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer shrink-0 ${
              data.isAvailable ? "bg-blue-600" : (dark ? "bg-gray-600" : "bg-gray-300")
            } ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
              data.isAvailable ? "translate-x-5" : "translate-x-0"
            }`} />
          </div>
        </div>
        {/* WORKING HOURS */}
        <div className={`p-3 rounded-xl border md:col-span-2 ${
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
                !dark ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1629] border-gray-600 text-white [color-scheme:dark]"
              } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
            />
            <span className={`text-sm font-bold ${!dark ? "text-gray-500" : "text-gray-400"}`}>إلى</span>
            <input
              type="time"
              value={data.workingHoursTo}
              onChange={(e) => setData((prev) => ({ ...prev, workingHoursTo: e.target.value }))}
              disabled={!isEditing}
              className={`w-full px-3 py-1.5 rounded-lg border outline-none text-sm ${
                !dark ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1629] border-gray-600 text-white [color-scheme:dark]"
              } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdditionalTab;