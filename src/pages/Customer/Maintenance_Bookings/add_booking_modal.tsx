import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  MdCalendarMonth,
  MdAccessTime,
  MdKeyboardArrowDown,
  MdClose,
  MdDirectionsCar,
  MdBuild,
  MdPerson,
} from "react-icons/md";

interface MechanicOption {
  id: string;
  name: string;
}

interface CarApiItem {
  id: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  carPhotoUrl: string;
}

interface CarOption {
  id: string;
  name: string;
}

interface PricedServiceOption {
  id: string;
  name: string;
  price: number;
  subSpecializationId: string;
}

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
   mechanicId?: string; 
  preselectedMechanicId?: string; // الجديد: لتلقي ID الميكانيكي المحدد
}

const API_BASE_URL = "https://gearupapp.runasp.net/api";

const AddBookingModal = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedMechanicId, // استقبال الـ ID
}: AddBookingModalProps) => {
  const [mechanicId, setMechanicId] = useState("");
  const [carId, setCarId] = useState("");
  const [mechanicServiceId, setMechanicServiceId] = useState("");
  const [date, setDate] = useState("");
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const [cars, setCars] = useState<CarOption[]>([]);
  const [mechanics, setMechanics] = useState<MechanicOption[]>([]);
  const [pricedServices, setPricedServices] = useState<PricedServiceOption[]>([]);

  const [loadingCars, setLoadingCars] = useState(false);
  const [loadingMechanics, setLoadingMechanics] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const inputStyle =
    "w-full bg-[#DDEEFF] dark:bg-[#137FEC22] text-gray-800 dark:text-white rounded-2xl px-5 py-3.5 outline-none appearance-none transition-all border border-[#BFDBFE] dark:border-white/10 focus:border-[#137FEC] dark:focus:border-[#60A5FA] hover:bg-[#cfe7ff] dark:hover:bg-[#137FEC33]";

  const labelStyle =
    "text-right font-bold text-gray-700 dark:text-gray-200 mb-2 block text-sm pr-1";

  const minDate = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const getToken = () => sessionStorage.getItem("userToken");

  const getAuthHeaders = () => {
    const token = getToken();
    if (!token) return { Accept: "*/*" };

    return {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
    };
  };

  const fetchCars = async () => {
    try {
      const token = getToken();
      if (!token) { setCars([]); return; }
      setLoadingCars(true);
      const response = await axios.get(`${API_BASE_URL}/customers/cars`, {
        headers: getAuthHeaders(),
      });
      const carsData: CarApiItem[] = response?.data?.cars ?? [];
      const mappedCars: CarOption[] = carsData.map((car) => ({
        id: car.id,
        name: `${car.brand} ${car.model} - ${car.year}`,
      }));
      setCars(mappedCars);
    } catch (error: any) {
      console.error("Fetch cars error:", error);
      setCars([]);
    } finally {
      setLoadingCars(false);
    }
  };

  const fetchMechanics = async () => {
    try {
      setLoadingMechanics(true);
      const response = await axios.get(`${API_BASE_URL}/mechanics`, {
        headers: { Accept: "*/*" },
      });
      const mechanicsData = response?.data?.data || [];
      const mappedMechanics: MechanicOption[] = mechanicsData
        .filter((item: any) => item.mechanicProfileId)
        .map((item: any) => ({
          id: item.id,
          name: `${item.firstName} ${item.lastName}`,
        }));
      setMechanics(mappedMechanics);
    } catch (error: any) {
      console.error("Fetch mechanics error:", error);
      setMechanics([]);
    } finally {
      setLoadingMechanics(false);
    }
  };

  const fetchMechanicServices = async (selectedMechanicId: string) => {
    try {
      if (!selectedMechanicId) {
        setPricedServices([]);
        setMechanicServiceId("");
        return;
      }
      setLoadingServices(true);
      setPricedServices([]);
      setMechanicServiceId("");

      const response = await axios.get(
        `${API_BASE_URL}/specializations/mechanic/${selectedMechanicId}/priced-services`,
        { headers: getAuthHeaders() }
      );

      const servicesData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      const mappedServices: PricedServiceOption[] = servicesData.map(
        (item: any) => ({
          id: item.id,
          name: item.subSpecializationName,
          price: Number(item.price ?? 0),
          subSpecializationId: item.subSpecializationId,
        })
      );
      setPricedServices(mappedServices);
    } catch (error: any) {
      console.error("Fetch services error:", error);
      setPricedServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchCars();
    fetchMechanics();

    // التعديل هنا: التحقق من وجود ميكانيكي محدد مسبقًا
    if (preselectedMechanicId) {
      setMechanicId(preselectedMechanicId);
      fetchMechanicServices(preselectedMechanicId);
    } else {
      setMechanicId("");
      setPricedServices([]);
    }

    setCarId("");
    setMechanicServiceId("");
    setDate("");
    setSlotStart("");
    setSlotEnd("");
  }, [isOpen, preselectedMechanicId]);

  if (!isOpen) return null;

  const resetForm = () => {
    setMechanicId("");
    setCarId("");
    setMechanicServiceId("");
    setPricedServices([]);
    setDate("");
    setSlotStart("");
    setSlotEnd("");
  };

  const closeModal = () => {
    resetForm();
    onClose();
  };

  const toApiTimeFormat = (time: string) => {
    if (!time) return "";
    return time.length === 5 ? `${time}:00` : time;
  };

  const handleSubmit = async () => {
    if (!mechanicId || !carId || !mechanicServiceId || !date || !slotStart || !slotEnd) {
      Swal.fire({
        icon: "warning", title: "تنبيه", text: "من فضلك املي كل البيانات المطلوبة.",
        confirmButtonColor: "#f59e0b", confirmButtonText: "حسنًا",
      });
      return;
    }

    if (slotEnd <= slotStart) {
      Swal.fire({
        icon: "warning", title: "تنبيه", text: "وقت النهاية لازم يكون بعد وقت البداية.",
        confirmButtonColor: "#f59e0b", confirmButtonText: "حسنًا",
      });
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        Swal.fire({ icon: "warning", title: "تنبيه", text: "انتهت الجلسة. الرجاء تسجيل الدخول مرة أخرى.", confirmButtonColor: "#f59e0b", confirmButtonText: "حسنًا" });
        return;
      }

      setLoading(true);
      const payload = {
        mechanicId, carId, mechanicServiceId, date,
        slotStart: toApiTimeFormat(slotStart),
        slotEnd: toApiTimeFormat(slotEnd),
      };

      await axios.post(`${API_BASE_URL}/bookings`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "*/*" },
      });

      Swal.fire({
        icon: "success", title: "تم بنجاح", text: "تم إضافة الحجز بنجاح!",
        confirmButtonText: "حسنًا", confirmButtonColor: "#137FEC",
      });

      setTimeout(async () => { await onSuccess?.(); resetForm(); onClose(); }, 500);
    } catch (error: any) {
      console.error("Create booking error:", error);
      Swal.fire({ icon: "error", title: "خطأ", text: "حدث خطأ أثناء إنشاء الحجز.", confirmButtonColor: "#dc2626", confirmButtonText: "حسنًا" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative w-full max-w-3xl bg-[#F8FBFF] dark:bg-[#0B1020] rounded-[32px] shadow-2xl overflow-hidden border border-[#dbeafe] dark:border-white/10 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={closeModal} className="absolute top-5 left-5 text-gray-500 hover:text-red-500 transition-colors z-10"><MdClose size={28} /></button>
        <div className="px-6 md:px-10 py-8 md:py-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">إضافة حجز جديد</h2>
            <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-300">اختار الميكانيكي والخدمة والسيارة وحدد الموعد المناسب</p>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="text-right">
                <label className={labelStyle}>الميكانيكي</label>
                <div className="relative">
                  <select value={mechanicId} onChange={(e) => { setMechanicId(e.target.value); fetchMechanicServices(e.target.value); }} className={`${inputStyle} pr-12`} dir="rtl">
                    <option value="" hidden>{loadingMechanics ? "جاري تحميل الميكانيكيين..." : "اختر الميكانيكي..."}</option>
                    {mechanics.map((mechanic) => ( <option key={mechanic.id} value={mechanic.id} className="bg-white text-black">{mechanic.name}</option> ))}
                  </select>
                  <MdPerson className="absolute right-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                  <MdKeyboardArrowDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none" />
                </div>
              </div>
              <div className="text-right">
                <label className={labelStyle}>نوع الخدمة</label>
                <div className="relative">
                  <select value={mechanicServiceId} onChange={(e) => setMechanicServiceId(e.target.value)} className={`${inputStyle} pr-12`} dir="rtl" disabled={!mechanicId || loadingServices || pricedServices.length === 0}>
                    <option value="" disabled>{!mechanicId ? "اختاري الميكانيكي أولًا..." : loadingServices ? "جاري تحميل خدمات الميكانيكي..." : pricedServices.length === 0 ? "لا توجد خدمات لهذا الميكانيكي" : "اختر الخدمة..."}</option>
                    {pricedServices.map((service) => ( <option key={service.id} value={service.id} className="bg-white text-black">{service.name} - {service.price} EGP</option> ))}
                  </select>
                  <MdBuild className="absolute right-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                  <MdKeyboardArrowDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <label className={labelStyle}>اختيار السيارة</label>
              <div className="relative">
                <select value={carId} onChange={(e) => setCarId(e.target.value)} className={`${inputStyle} pr-12`} dir="rtl" disabled={loadingCars || cars.length === 0}>
                  <option value="" disabled>{loadingCars ? "جاري تحميل السيارات..." : cars.length === 0 ? "لا توجد سيارات" : "اختر السيارة..."}</option>
                  {cars.map((car) => ( <option key={car.id} value={car.id} className="bg-white text-black">{car.name}</option> ))}
                </select>
                <MdDirectionsCar className="absolute right-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                <MdKeyboardArrowDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-2xl pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="text-right">
                <label className={labelStyle}>التاريخ</label>
                <div className="relative">
                  <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className={`${inputStyle} custom-date-input pr-4 pl-12 text-center md:text-right`} dir="rtl" />
                  <MdCalendarMonth className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                </div>
              </div>
              <div className="text-right">
                <label className={labelStyle}>وقت البداية</label>
                <div className="relative">
                  <input type="time" value={slotStart} onChange={(e) => setSlotStart(e.target.value)} className={`${inputStyle} custom-time-input pr-4 pl-12 text-center md:text-right`} dir="rtl" />
                  <MdAccessTime className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                </div>
              </div>
              <div className="text-right">
                <label className={labelStyle}>وقت النهاية</label>
                <div className="relative">
                  <input type="time" value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} className={`${inputStyle} custom-time-input pr-4 pl-12 text-center md:text-right`} dir="rtl" />
                  <MdAccessTime className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137FEC] text-xl pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-center" dir="rtl">
                <button type="button" onClick={closeModal} disabled={loading} className="sm:min-w-[160px] bg-white dark:bg-[#111827] text-gray-700 dark:text-white px-8 py-3.5 rounded-2xl font-black text-base border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#1f2937] transition-all disabled:opacity-60">إلغاء</button>
                <button type="button" onClick={handleSubmit} disabled={loading} className="sm:min-w-[220px] bg-[#137FEC] text-white px-8 py-3.5 rounded-2xl font-black text-base shadow-lg hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100">{loading ? "جاري إرسال الحجز..." : "إرسال طلب الحجز"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.custom-date-input::-webkit-calendar-picker-indicator,.custom-time-input::-webkit-calendar-picker-indicator{background:transparent;bottom:0;color:transparent;cursor:pointer;height:auto;left:0;position:absolute;right:0;top:0;width:auto;}`}</style>
    </div>
  );
};

export default AddBookingModal;
