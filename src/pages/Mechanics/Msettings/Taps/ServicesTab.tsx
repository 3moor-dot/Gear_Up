import { useEffect, useState, useRef } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FaEdit, FaSave, FaSpinner, FaChevronDown } from "react-icons/fa";

// --- 1. تعريف الواجهات (Interfaces) في البداية ---

interface SubSpecialization {
  id: string;
  name: string;
}

interface ServiceData {
  id?: string;
  subSpecializationId: string;
  subSpecializationName?: string;
  price: string;
  isNew?: boolean;
}

// --- 2. المكون المخصص (Custom Component) ---

interface CustomSelectProps {
  options: SubSpecialization[];
  value: string;
  onChange: (id: string, name: string) => void; // تمرير الاسم والمعرف معاً
  placeholder: string;
  dark: boolean;
}

const CustomServiceSelect = ({
  options,
  value,
  onChange,
  placeholder,
  dark,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // تحديد نوع الـ ref بشكل صحيح لتجنب الأخطاء
  const dropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* زر العرض */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border outline-none flex items-center justify-between
          ${
            !dark
              ? "bg-white border-blue-400 ring-2 ring-blue-100 text-gray-900 shadow-sm"
              : "bg-gray-800 border-blue-400 ring-2 ring-blue-900/40 text-white"
          }`}
      >
        <span className={selectedOption ? "text-current" : "text-gray-400"}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <FaChevronDown
          className={`text-[#137FEC] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-2 rounded-2xl border shadow-xl overflow-hidden transition-all duration-200 origin-top
            ${
              !dark
                ? "bg-white border-gray-200 shadow-gray-200/50"
                : "bg-[#1a253a] border-gray-700 shadow-black/50"
            }`}
        >
          <ul className="max-h-[340px] overflow-y-auto custom-scrollbar">
            {options && options.length > 0 ? (
              options.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    onChange(item.id, item.name); // تمرير البيانات للكبار
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 cursor-pointer text-sm font-semibold transition-colors hover:bg-[#137FEC] hover:text-white
                    ${
                      value === item.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-[#137FEC]"
                        : !dark
                        ? "text-gray-700"
                        : "text-gray-300"
                    }`}
                >
                  {item.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-gray-500 text-sm">لا توجد خدمات متاحة</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- 3. المكون الرئيسي (Main Component) ---

const ServicesTab = () => {
  const { dark } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [services, setServices] = useState<ServiceData[]>([]);
  const [subSpecializations, setSubSpecializations] = useState<SubSpecialization[]>([]);

  const token = sessionStorage.getItem("userToken");

  const fetchSubSpecializations = async () => {
    setIsLoadingOptions(true);
    setError(""); // مسح أي أخطاء سابقة

    try {
      if (!token) throw new Error("No token found");

      const response = await fetch(
        "https://gearupapp.runasp.net/api/specializations/sub-specializations",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GET sub-specializations failed: ${response.status}`);
      }

      const data = await response.json();

      const items: SubSpecialization[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setSubSpecializations(items);
    } catch (err) {
      console.error("fetchSubSpecializations error:", err);
      setError("تعذر تحميل قائمة الخدمات");
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const fetchMyServices = async () => {
    setIsLoadingServices(true);
    try {
      if (!token) throw new Error("No token found");

      const response = await fetch(
        "https://gearupapp.runasp.net/api/mechanics/my/services",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GET my services failed: ${response.status}`);
      }

      const data = await response.json();

      setServices(
        (Array.isArray(data) ? data : []).map((item: any) => ({
          id: item.id,
          subSpecializationId: item.subSpecializationId,
          subSpecializationName: item.subSpecializationName,
          price: String(item.price ?? ""),
          isNew: false,
        }))
      );
    } catch (err) {
      console.error("fetchMyServices error:", err);
      setError("تعذر تحميل الخدمات الحالية");
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    setError("");
    fetchSubSpecializations();
    fetchMyServices();
  }, []);

  const addService = () => {
    setServices((prev) => [
      {
        subSpecializationId: "",
        subSpecializationName: "",
        price: "",
        isNew: true,
      },
      ...prev,
    ]);
  };

  const updateService = (
    index: number,
    field: keyof ServiceData,
    value: string
  ) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      )
    );
  };

  const deleteServiceFromState = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteService = async (service: ServiceData, index: number) => {
    setError("");
    setSuccess("");

    try {
      if (!token) {
        throw new Error("No token found");
      }

      if (service.isNew || !service.id) {
        deleteServiceFromState(index);
        return;
      }

      const confirmed = window.confirm("متأكدة إنك عايزة تحذفي الخدمة دي؟");
      if (!confirmed) return;

      const response = await fetch(
        `https://gearupapp.runasp.net/api/mechanics/my/services/${service.subSpecializationId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DELETE error:", response.status, errorText);
        throw new Error(`DELETE failed: ${response.status} - ${errorText}`);
      }

      await fetchMyServices();
      setSuccess("تم حذف الخدمة بنجاح ✅");
    } catch (err) {
      console.error("handleDeleteService error:", err);
      setError("تعذر حذف الخدمة");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!token) {
        throw new Error("No token found");
      }

      const validServices = services.filter(
        (service) =>
          service.subSpecializationId.trim() !== "" &&
          service.price.trim() !== "" &&
          Number(service.price) > 0
      );

      if (validServices.length === 0) {
        setError("لازم يكون فيه خدمة واحدة على الأقل بسعر صحيح");
        return;
      }

      for (const service of validServices) {
        const payload = {
          subSpecializationId: service.subSpecializationId,
          price: Number(service.price),
        };

        if (service.isNew || !service.id) {
          const response = await fetch(
            "https://gearupapp.runasp.net/api/mechanics/my/services",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("POST error:", response.status, errorText);
            throw new Error(`POST failed: ${response.status} - ${errorText}`);
          }
        } else {
          const response = await fetch(
            `https://gearupapp.runasp.net/api/mechanics/my/services/${service.subSpecializationId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("PUT error:", response.status, errorText);
            throw new Error(`PUT failed: ${response.status} - ${errorText}`);
          }
        }
      }

      await fetchMyServices();
      setSuccess("تم حفظ الخدمات بنجاح ✅");
      setIsEditing(false);
    } catch (err) {
      console.error("handleSave error:", err);
      setError("تعذر حفظ الخدمات");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (extra = "") =>
    `w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border outline-none ${
      isEditing
        ? !dark
          ? "bg-white border-blue-400 ring-2 ring-blue-100 text-gray-900 shadow-sm"
          : "bg-gray-800 border-blue-400 ring-2 ring-blue-900/40 text-white"
        : !dark
          ? "bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed select-none ring-0"
          : "bg-[#131c2f] border-gray-700 text-gray-300 cursor-not-allowed select-none ring-0"
    } ${extra}`;

  return (
    <div
      dir="rtl"
      className="bg-white dark:bg-[#0d1629] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 md:p-6"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-200 dark:border-gray-800 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">الخدمات والأسعار</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">إدارة الخدمات التي تقدمها وتحديد أسعارها</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {isEditing && (
            <button
              onClick={addService}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition shadow-md active:scale-95"
            >
              <span className="text-lg">＋</span>
              إضافة خدمة
            </button>
          )}

          {isEditing ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  setSuccess("");
                  fetchMyServices();
                }}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all bg-gray-100 dark:bg-[#131c2f] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                إلغاء
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#137FEC] hover:bg-blue-600 text-white text-sm font-bold transition-all active:scale-95 shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none disabled:bg-gray-400"
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>حفظ التغييرات</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                setError("");
                setSuccess("");
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#137FEC] hover:bg-blue-600 text-white text-sm font-bold transition-all active:scale-95 shadow-md shadow-blue-500/20"
            >
              <FaEdit />
              <span>تعديل الخدمات</span>
            </button>
          )}
        </div>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm text-center">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      {(isLoadingOptions || isLoadingServices) && (
        <div className="text-center py-3 text-gray-400">
          جاري تحميل الخدمات...
        </div>
      )}

     <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3">
  {services.length === 0 ? (
    <div className="text-center py-12 text-gray-400">
      <p>لا توجد خدمات مضافة بعد</p>
      {!isEditing && (
        <p className="text-sm mt-2">
          اضغط على تعديل الخدمات ثم أضف خدمة جديدة
        </p>
      )}
    </div>
  ) : (
    services.map((service, index) => (
      <div
        key={service.id || `${service.subSpecializationId}-${index}`}
        className={`p-4 sm:p-6 rounded-2xl border transition-all ${
          !dark
            ? "bg-white border-gray-100 shadow-sm"
            : "bg-[#131c2f] border-gray-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="w-full flex-1">
            <label
              className="text-xs sm:text-sm font-extrabold text-[#137FEC] block mb-2"
            >
              الخدمة
            </label>

            {/* استخدام المكون المخصص مع تمرير البيانات بشكل مبسط */}
            {isEditing && (service.isNew || !service.id) ? (
              <CustomServiceSelect
                options={subSpecializations}
                value={service.subSpecializationId}
                onChange={(id, name) => {
                  updateService(index, "subSpecializationId", id);
                  updateService(index, "subSpecializationName", name);
                }}
                placeholder="اختر خدمة"
                dark={dark}
              />
            ) : !isEditing ? (
              <div className="rounded-2xl bg-gray-50 dark:bg-[#131c2f] border border-gray-200 dark:border-gray-800 px-4 py-3">
                <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                  {service.subSpecializationName || "—"}
                </p>
              </div>
            ) : (
              <input
                type="text"
                value={service.subSpecializationName || ""}
                readOnly
                className={inputClass()}
              />
            )}
          </div>

        <div className="w-full sm:w-48">
          <label className="text-xs sm:text-sm font-extrabold text-[#137FEC] block mb-2">
            السعر
          </label>

          {!isEditing ? (
            <div className="relative rounded-2xl bg-gray-50 dark:bg-[#131c2f] border border-gray-200 dark:border-gray-800 px-4 py-3 pl-14">
              <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white text-right">
                {service.price || "0"}
              </p>

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#137FEC] pointer-events-none">
                EGP
              </span>
            </div>
          ) : (
            <div className="relative">
              <input
                type="number"
                value={service.price}
                onChange={(e) => updateService(index, "price", e.target.value)}
                placeholder="0"
                className={`${inputClass()} !pl-14 text-right`}
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-xs font-bold text-[#137FEC] pointer-events-none">
                EGP
              </span>
            </div>
          )}
        </div>
        </div>

        {isEditing && (
          <button
            onClick={() => handleDeleteService(service, index)}
            className="w-full mt-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition text-sm"
          >
            حذف الخدمة
          </button>
        )}
      </div>
    ))
  )}
</div>
    </div>
  );
};

export default ServicesTab;