import { useState, useRef, useEffect } from "react";
import { MdClose, MdDirectionsCar, MdCalendarMonth, MdAccessTime, MdTitle, MdDescription, MdRefresh } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

interface ReminderPrefillData {
  title?: string;
  description?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  preferredNotificationTime?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cars: any[];
  selectedCar: string;
  setSelectedCar: (car: string) => void;
  onSuccess: () => void;
  initialData?: ReminderPrefillData | null;
}

const CreateReminderModal = ({
  isOpen,
  onClose,
  cars,
  selectedCar,
  setSelectedCar,
  onSuccess,
  initialData,
}: Props) => {
  const [frequencyType, setFrequencyType] = useState("0");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    preferredNotificationTime: "09:00",
    intervalValue: 1,
    intervalUnit: "0",
  });

  const mapFrequencyToType = (frequency?: string) => {
    if (!frequency) return "0";
    const value = frequency.trim().toLowerCase();
    if (
      value.includes("مرة واحدة") ||
      value.includes("one time") ||
      value.includes("once")
    ) {
      return "0";
    }
    if (
      value.includes("كل يوم") ||
      value.includes("يومي") ||
      value.includes("daily")
    ) {
      return "1";
    }
    if (
      value.includes("كل أسبوع") ||
      value.includes("أسبوع") ||
      value.includes("weekly")
    ) {
      return "2";
    }
    if (
      value.includes("كل شهر") ||
      value.includes("شهري") ||
      value.includes("شهريًا") ||
      value.includes("monthly")
    ) {
      return "3";
    }
    return "0";
  };
  const normalizeDate = (date?: string) => {
    if (!date) return "";
    return date.replace(/\//g, "-");
  };

  const normalizeTime = (time?: string) => {
    if (!time) return "09:00";
    const trimmed = time.trim();
    if (/^\d{2}:\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return "09:00";
    let hour = Number(match[1]);
    const minute = match[2];
    const period = match[3].toUpperCase();
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${minute}`;
  };

  const handleReset = () => {
    setFormData({
      name: initialData?.title || "",
      description: initialData?.description || "",
      startDate: normalizeDate(initialData?.startDate),
      endDate: normalizeDate(initialData?.endDate),
      preferredNotificationTime: normalizeTime(initialData?.preferredNotificationTime),
      intervalValue: 1,
      intervalUnit: "0",
    });
    setFrequencyType(mapFrequencyToType(initialData?.frequency));
  };

  useEffect(() => {
    if (isOpen) {
      handleReset();
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("يرجى إدخال عنوان التذكير.");
      return false;
    }
    if (!selectedCar) {
      toast.error("يرجى اختيار المركبة المستهدفة.");
      return false;
    }
    if (!formData.startDate) {
      toast.error("يرجى اختيار تاريخ البدء.");
      return false;
    }
    const now = new Date();
    const [year, month, day] = formData.startDate.split("-").map(Number);
    const [hours, minutes] = formData.preferredNotificationTime.split(":").map(Number);
    const startDateTime = new Date(year, month - 1, day, hours, minutes);
    if (frequencyType === "0" && startDateTime < now) {
      toast.error("لا يمكن إنشاء تذكير في وقت سابق للوقت الحالي.");
      return false;
    }
    if (formData.endDate) {
      const end = new Date(formData.endDate);
      const start = new Date(formData.startDate);
      if (end < start) {
        toast.error("تاريخ الانتهاء يجب أن يكون يوم البدء أو بعده.");
        return false;
      }
    }
    if (frequencyType === "4" && formData.intervalValue < 1) {
      toast.error("قيمة التكرار المخصص يجب أن تكون أكبر من أو تساوي 1.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const carObj = cars.find(
      (c) => `${c.year} ${c.brand} ${c.model}` === selectedCar
    );

    if (!carObj?.id) {
      toast.error("تعذر تحديد السيارة المختارة.");
      setLoading(false);
      return;
    }

    // تحضير التاريخ والوقت
    const startCombined = `${formData.startDate}T${formData.preferredNotificationTime}:00`;
    const finalStartDate = new Date(startCombined).toISOString();

    let finalEndDate = null;
    if (formData.endDate) {
      const endCombined = `${formData.endDate}T${formData.preferredNotificationTime}:00`;
      finalEndDate = new Date(endCombined).toISOString();
    }

    const isCustom = frequencyType === "4";

    const payload: any = {
      carId: carObj.id,
      name: formData.name.trim(),
      description: formData.description || "",
      startDate: finalStartDate,
      endDate: finalEndDate,
      preferredNotificationTime: formData.preferredNotificationTime,
      frequencyType: isCustom ? 5 : Number(frequencyType),
    };

    if (isCustom) {
      payload.intervalValue = Number(formData.intervalValue);
      payload.intervalUnit = Number(formData.intervalUnit);
    }

    try {
      const token = sessionStorage.getItem("userToken");
      console.log("Sending Payload:", payload);

      await axios.post("https://gearupapp.runasp.net/api/Reminder", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("تم إنشاء التذكير بنجاح");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Server Error:", error.response?.data);
      toast.error(
        "فشل الحفظ: " + (error.response?.data?.message || error.response?.data?.error || "تأكد من البيانات المطلوبة")
      );
    } finally {
      setLoading(false);
    }
  };
  
  const labelStyle = "text-right font-bold text-gray-700 dark:text-white mb-2 block text-sm pr-1";
  const inputStyle = "w-full bg-gray-100 dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-800 dark:text-blue-400 font-bold outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-[#0F172A] transition-all focus:border-blue-500/50";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] rounded-[40px] shadow-2xl border border-gray-200 dark:border-blue-500/20 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button type="button" onClick={onClose} className="absolute top-6 left-6 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors z-10">
          <MdClose size={30} />
        </button>

        <div className="p-8 md:p-12">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">إنشاء تذكير جديد</h2>
            <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-300">قم بإضافة تذكير للصيانة أو تجديد الرخصة أو غيرها من الخدمات</p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* المركبة */}
              <div className="text-right">
                <label className={labelStyle}>المركبة المستهدفة *</label>
                <div className="relative">
                  <select
                    className={`${inputStyle} pl-12 appearance-none`}
                    value={selectedCar}
                    onChange={(e) => setSelectedCar(e.target.value)}
                    dir="rtl"
                  >
                    <option value="" disabled>اختر المركبة...</option>
                    {cars.map((car, i) => (
                      <option key={i} value={`${car.year} ${car.brand} ${car.model}`}>
                        {`${car.year} ${car.brand} ${car.model}`}
                      </option>
                    ))}
                  </select>
                  <MdDirectionsCar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                </div>
              </div>

              {/* عنوان التذكير */}
              <div className="text-right">
                <label className={labelStyle}>عنوان التذكير *</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="مثال: تغيير الزيت"
                    className={`${inputStyle} pl-12`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    dir="rtl"
                  />
                  <MdTitle className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                </div>
              </div>
            </div>

            {/* وصف التذكير */}
            <div className="text-right">
              <label className={labelStyle}>وصف التذكير</label>
              <div className="relative">
                <input
                  type="text"
                  className={`${inputStyle} pl-12`}
                  placeholder="اكتب وصف التذكير..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  dir="rtl"
                />
                <MdDescription className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="text-right">
                <label className={labelStyle}>تاريخ البدء *</label>
                <div className="relative">
                  <input
                    required
                    type="date"
                    className={`${inputStyle} custom-date-input pl-12 text-center md:text-right`}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    dir="rtl"
                  />
                  <MdCalendarMonth className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                </div>
              </div>

              <div className="text-right">
                <label className={labelStyle}>تاريخ الانتهاء</label>
                <div className="relative">
                  <input
                    type="date"
                    className={`${inputStyle} custom-date-input pl-12 text-center md:text-right`}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    dir="rtl"
                  />
                  <MdCalendarMonth className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="text-right">
                <label className={labelStyle}>وقت الإشعار</label>
                <div className="relative">
                  <input
                    type="time"
                    className={`${inputStyle} custom-time-input pl-12 text-center md:text-right`}
                    value={formData.preferredNotificationTime}
                    onChange={(e) => setFormData({ ...formData, preferredNotificationTime: e.target.value })}
                    dir="rtl"
                  />
                  <MdAccessTime className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                </div>
              </div>

              <div className="text-right">
                <label className={labelStyle}>نظام التكرار</label>
                <div className="relative">
                  <select
                    className={`${inputStyle} pl-12 appearance-none`}
                    value={frequencyType}
                    onChange={(e) => setFrequencyType(e.target.value)}
                    dir="rtl"
                  >
                    <option value="0">مرة واحدة فقط</option>
                    <option value="1">كل يوم</option>
                    <option value="2">كل أسبوع</option>
                    <option value="3">كل شهر</option>
                    <option value="4">تكرار مخصص</option>
                  </select>
                  <MdRefresh className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                </div>
              </div>
            </div>

            {frequencyType === "4" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                <div className="text-right">
                  <label className={labelStyle}>القيمة</label>
                  <input
                    type="number"
                    min="1"
                    className={`${inputStyle} text-center md:text-right`}
                    value={formData.intervalValue}
                    onChange={(e) => setFormData({ ...formData, intervalValue: Number(e.target.value) })}
                    dir="rtl"
                  />
                </div>

                <div className="text-right">
                  <label className={labelStyle}>الوحدة</label>
                  <select
                    className={`${inputStyle} appearance-none`}
                    value={formData.intervalUnit}
                    onChange={(e) => setFormData({ ...formData, intervalUnit: e.target.value })}
                    dir="rtl"
                  >
                    <option value="0">أيام</option>
                    <option value="1">أسابيع</option>
                    <option value="2">شهور</option>
                    <option value="3">سنوات</option>
                  </select>
                </div>
              </div>
            )}

            {/* الأزرار */}
            <div className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-center" dir="rtl">
                <button type="button" onClick={onClose} disabled={loading}
                  className="sm:min-w-[160px] bg-gray-100 text-gray-700 dark:bg-[#0F1323] dark:text-white px-8 py-4 rounded-2xl font-black text-lg border border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-[#1e293b] transition-all disabled:opacity-60">
                  إلغاء
                </button>
                <button type="button" disabled={loading} onClick={() => formRef.current?.requestSubmit()}
                  className="sm:min-w-[220px] bg-[#137FEC] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:hover:scale-100">
                  {loading ? "جاري الحفظ..." : "إضافة التذكير"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .custom-date-input::-webkit-calendar-picker-indicator,
        .custom-time-input::-webkit-calendar-picker-indicator {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          background: transparent; cursor: pointer; opacity: 0;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CreateReminderModal;