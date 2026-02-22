import { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaEdit, FaSave, FaSpinner } from "react-icons/fa";

interface ServiceData {
  id?: string;
  name: string;
  minPrice: number;
  maxPrice: number;
}

const ServicesTab = () => {
  const { dark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [services, setServices] = useState<ServiceData[]>([]);

  const addService = () => {
    setServices((prev) => [...prev, { name: "", minPrice: 0, maxPrice: 0 }]);
  };

  const updateService = (index: number, field: keyof ServiceData, value: string | number) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const deleteService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      console.log("Saving services:", services);
      // TODO: ربط بالـ API لما يكون جاهز
      await new Promise((r) => setTimeout(r, 800));
      setSuccess("تم حفظ الخدمات بنجاح ✅");
      setIsEditing(false);
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (extra = "") =>
    `w-full px-4 py-3 rounded-xl border outline-none transition-all ${
      !dark ? "bg-white border-gray-300" : "bg-[#0B1220] border-gray-600 text-white"
    } ${isEditing ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" : "cursor-not-allowed"} ${extra}`;

  return (
    <div className={`rounded-2xl border p-6 space-y-6 ${!dark ? "bg-white border-gray-200 shadow-md" : "bg-[#0d1629] border-blue-900/30"}`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">الخدمات والأسعار</h3>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={addService}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              <span className="text-lg">＋</span>
              إضافة خدمة
            </button>
          )}
          {isEditing ? (
            <>
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
                {isSaving ? <><FaSpinner className="animate-spin" /><span>جاري الحفظ...</span></> : <><FaSave /><span>حفظ</span></>}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
            >
              <FaEdit /><span>تعديل الخدمات</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {success && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm text-center">{success}</div>}
      {error   && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center">{error}</div>}

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>لا توجد خدمات مضافة بعد</p>
            {!isEditing && (
              <p className="text-sm mt-2">اضغط على "تعديل الخدمات" ثم أضف خدمة جديدة</p>
            )}
          </div>
        ) : (
          services.map((service, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${!dark ? "bg-gray-50 border-gray-200" : "bg-[#131c2f] border-gray-700"}`}
            >
              <div className="space-y-4">
                {/* اسم الخدمة */}
                <div>
                  <label className={`block text-sm mb-2 ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                    اسم الخدمة
                  </label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateService(index, "name", e.target.value)}
                    readOnly={!isEditing}
                    placeholder="مثال: تغيير الزيت"
                    className={inputClass()}
                  />
                </div>

                {/* الأسعار */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "الحد الأدنى",  field: "minPrice" as keyof ServiceData },
                    { label: "الحد الأقصى", field: "maxPrice" as keyof ServiceData },
                  ].map(({ label, field }) => (
                    <div key={field} className="relative">
                      <label className={`block text-sm mb-2 ${!dark ? "text-gray-600" : "text-gray-400"}`}>
                        {label}
                      </label>
                      <input
                        type="number"
                        value={(service[field] as number) || ""}
                        onChange={(e) => updateService(index, field, parseFloat(e.target.value) || 0)}
                        readOnly={!isEditing}
                        placeholder="0"
                        className={inputClass("pr-14")}
                      />
                      <span className="absolute right-4 top-[42px] text-xs font-bold text-blue-500">EGP</span>
                    </div>
                  ))}
                </div>

                {/* Delete */}
                {isEditing && (
                  <button
                    onClick={() => deleteService(index)}
                    className="w-full py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition text-sm"
                  >
                    حذف الخدمة
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesTab;
