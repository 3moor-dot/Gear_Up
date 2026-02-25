import { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaEdit, FaSave, FaSpinner } from "react-icons/fa";

interface AdditionalData {
  location: string;
  mainSpecialty: string[];
  subSpecialty: string;
  fieldVisit: boolean;
  workingHoursFrom: string;
  workingHoursTo: string;
  experience: string;
}

const cities = [
  "القاهرة", "الجيزة", "الإسكندرية", "الشرقية",
  "الدقهلية", "المنوفية", "القليوبية", "البحيرة",
];

const specialties = [
  "ميكانيكا عامة",
  "كهرباء سيارات",
  "ضبط زوايا",
  "التروس / السرعات",
];

const AdditionalTab = () => {
  const { dark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [data, setData] = useState<AdditionalData>({
    location: "",
    mainSpecialty: [],
    subSpecialty: "",
    fieldVisit: false,
    workingHoursFrom: "08:00",
    workingHoursTo: "18:00",
    experience: "",
  });

  const update = (field: keyof AdditionalData, value: string | string[] | boolean) => {
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
    setError("");
    setSuccess("");
    try {
      console.log("Saving additional data:", data);
      // TODO: ربط بالـ API لما يكون جاهز
      await new Promise((r) => setTimeout(r, 800)); // simulate request
      setSuccess("تم حفظ البيانات الإضافية بنجاح ✅");
      setTimeout(() => window.location.reload(), 1000); // ✅
      setIsEditing(false);
    } catch {
      setError("تعذر الاتصال بالخادم");
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
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !dark ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-50"
            >
              {isSaving ? <><FaSpinner className="animate-spin" /><span>جاري الحفظ...</span></> : <><FaSave /><span>حفظ التغييرات</span></>}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
          >
            <FaEdit /><span>تعديل البيانات</span>
          </button>
        )}
      </div>

      {/* Messages */}
      {success && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm text-center">{success}</div>}
      {error   && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center">{error}</div>}

      {/* الموقع */}
      <div>
        <label className={`block text-sm mb-2 ${!dark ? "text-gray-600" : "text-gray-400"}`}>الموقع</label>
        <select
          value={data.location}
          onChange={(e) => update("location", e.target.value)}
          disabled={!isEditing}
          className={inputClass}
        >
          <option value="">اختر الموقع</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
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
                  selected
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : !dark ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } ${!isEditing && "cursor-not-allowed opacity-60"}`}
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
        <input
          type="text"
          value={data.subSpecialty}
          onChange={(e) => update("subSpecialty", e.target.value)}
          readOnly={!isEditing}
          placeholder="التخصص الفرعي"
          className={inputClass}
        />
      </div>

      {/* سنوات الخبرة */}
      <div>
        <label className={`block text-sm mb-2 ${!dark ? "text-gray-600" : "text-gray-400"}`}>سنوات الخبرة</label>
        <input
          type="text"
          value={data.experience}
          onChange={(e) => update("experience", e.target.value)}
          readOnly={!isEditing}
          placeholder="مثال: 5 سنوات"
          className={inputClass}
        />
      </div>

      {/* الزيارة الميدانية */}
      <div>
        <label className={`block text-sm mb-2 ${!dark ? "text-gray-600" : "text-gray-400"}`}>إمكانية الزيارة الميدانية</label>
        <select
          value={data.fieldVisit ? "true" : "false"}
          onChange={(e) => update("fieldVisit", e.target.value === "true")}
          disabled={!isEditing}
          className={inputClass}
        >
          <option value="true">نعم</option>
          <option value="false">لا</option>
        </select>
      </div>

      {/* ساعات العمل */}
      <div>
        <label className={`block text-sm mb-3 ${!dark ? "text-gray-600" : "text-gray-400"}`}>ساعات العمل</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "من", field: "workingHoursFrom" as keyof AdditionalData },
            { label: "إلى", field: "workingHoursTo"   as keyof AdditionalData },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block text-xs mb-1 text-gray-500">{label}</label>
              <input
                type="time"
                value={data[field] as string}
                onChange={(e) => update(field, e.target.value)}
                readOnly={!isEditing}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdditionalTab;
