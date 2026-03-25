import { useState, useRef, useEffect } from "react";
import { MdClose } from "react-icons/md";
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

    const startDateObj = new Date(formData.startDate);
    const fixedDate = new Date(
      startDateObj.getTime() + 12 * 60 * 60 * 1000
    ).toISOString();

    const payload = {
      carId: carObj.id,
      name: formData.name.trim(),
      description: formData.description || "",
      startDate: fixedDate,
      endDate: formData.endDate
        ? new Date(
            new Date(formData.endDate).getTime() + 12 * 60 * 60 * 1000
          ).toISOString()
        : null,
      preferredNotificationTime: formData.preferredNotificationTime,
      frequencyType: frequencyType === "4" ? 5 : Number(frequencyType),
      intervalValue: frequencyType === "4" ? Number(formData.intervalValue) : 0,
      intervalUnit: frequencyType === "4" ? Number(formData.intervalUnit) : 0,
    };

    try {
      const token = sessionStorage.getItem("userToken");

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
      toast.error(
        "فشل الحفظ: " + (error.response?.data?.error || "تأكد من البيانات المطلوبة")
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full dark:bg-[#1A233A] bg-white dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-right outline-none focus:border-[#137FEC] focus:ring-1 focus:ring-[#137FEC] transition-all";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-[#F8FAFC] dark:bg-primary_BGD w-full max-w-2xl rounded-[30px] shadow-2xl overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-[#137FEC0D]">
          <h2 className="text-xl font-bold dark:text-white">إنشاء تذكير جديد</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500"
            type="button"
          >
            <MdClose size={28} />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              المركبة المستهدفة *
            </label>
            <select
              className={inputStyle}
              value={selectedCar}
              onChange={(e) => setSelectedCar(e.target.value)}
            >
              <option value="" disabled>
                اختر المركبة
              </option>
              {cars.map((car, i) => (
                <option key={i} value={`${car.year} ${car.brand} ${car.model}`}>
                  {`${car.year} ${car.brand} ${car.model}`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              عنوان التذكير *
            </label>
            <input
              required
              type="text"
              placeholder="مثال: تغيير الزيت"
              className={inputStyle}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                تاريخ البدء *
              </label>
              <input
                required
                type="date"
                className={inputStyle}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                تاريخ الانتهاء
              </label>
              <input
                type="date"
                className={inputStyle}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                وقت الإشعار
              </label>
              <input
                type="time"
                className={inputStyle}
                value={formData.preferredNotificationTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredNotificationTime: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                نظام التكرار
              </label>
              <select
                className={inputStyle}
                value={frequencyType}
                onChange={(e) => setFrequencyType(e.target.value)}
              >
                <option value="0">مرة واحدة فقط</option>
                <option value="1">كل يوم</option>
                <option value="2">كل أسبوع</option>
                <option value="3">كل شهر</option>
                <option value="4">تكرار مخصص</option>
              </select>
            </div>
          </div>

          {frequencyType === "4" && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/50 dark:bg-gray-800/50 rounded-2xl border border-blue-100 dark:border-gray-700 transition-all duration-300">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  كل (الرقم)
                </label>
                <input
                  type="number"
                  min="1"
                  className={inputStyle}
                  value={formData.intervalValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      intervalValue: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  الوحدة
                </label>
                <select
                  className={inputStyle}
                  value={formData.intervalUnit}
                  onChange={(e) =>
                    setFormData({ ...formData, intervalUnit: e.target.value })
                  }
                >
                  <option value="0">أيام</option>
                  <option value="1">أسابيع</option>
                  <option value="2">شهور</option>
                  <option value="3">سنوات</option>
                </select>
              </div>
            </div>
          )}
        </form>

        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl font-bold text-gray-500"
            type="button"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => formRef.current?.requestSubmit()}
            className="bg-[#137FEC] text-white px-10 py-3 rounded-xl font-bold disabled:opacity-60"
          >
            {loading ? "جاري الحفظ..." : "إضافة التذكير"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReminderModal;