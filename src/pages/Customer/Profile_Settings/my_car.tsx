import { useState, useEffect } from "react";
import {
  MdCloudUpload, MdEdit, MdDelete, MdAdd, MdSave,
  MdKeyboardArrowDown, MdKeyboardArrowUp, MdClose, MdDirectionsCar
} from "react-icons/md";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  carPhotoUrl: string;
}

const FIELD_CLASS = "w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-400 ring-2 ring-blue-100 dark:ring-blue-900/40 shadow-sm focus:outline-none";

const InfoCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700">
    <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-wide">{label}</p>
    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{value}</p>
  </div>
);

const PhotoUploader = ({
  id, previewSrc, onChange,
}: {
  id: string;
  previewSrc?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex justify-center flex-shrink-0">
    <div className="relative">
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl border-4 border-blue-50 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
        {previewSrc ? (
          <img src={previewSrc} className="w-full h-full object-cover" alt="preview" />
        ) : (
          <div className="text-center p-2">
            <MdCloudUpload size={28} className="text-blue-200 mx-auto mb-1" />
            <p className="text-[10px] text-gray-400 font-bold">ارفع صورة</p>
          </div>
        )}
      </div>
      <label
        htmlFor={id}
        className="absolute -bottom-2 -right-2 bg-[#137FEC] hover:bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110"
      >
        <MdCloudUpload size={15} />
      </label>
    </div>
    <input type="file" id={id} className="hidden" accept="image/*" onChange={onChange} />
  </div>
);

export const MyCars = ({ }: { inputStyle: string }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [expandedCarId, setExpandedCarId] = useState<string | null>(null);
  const [editModeId, setEditModeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newCar, setNewCar] = useState({ brand: "", model: "", year: "", plateNumber: "" });
  const [newCarPhoto, setNewCarPhoto] = useState<File | null>(null);

  const [editData, setEditData] = useState<Car | null>(null);
  const [editCarPhoto, setEditCarPhoto] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

  const token = sessionStorage.getItem("userToken");
  const BASE_URL = "https://gearupapp.runasp.net/api/customers/cars";

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch(BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setCars(d.cars); }
    } catch (e) { console.error(e); }
  };

  const handleAddCar = async () => {
    if (!newCar.brand || !newCar.model || !newCarPhoto) return alert("يرجى ملء البيانات وإضافة صورة السيارة");
    setLoading(true);
    const fd = new FormData();
    fd.append("Brand", newCar.brand);
    fd.append("Model", newCar.model);
    fd.append("Year", newCar.year);
    fd.append("PlateNumber", newCar.plateNumber);
    fd.append("CarPhoto", newCarPhoto);
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd
      });
      if (res.ok) {
        setNewCar({ brand: "", model: "", year: "", plateNumber: "" });
        setNewCarPhoto(null);
        setShowAddForm(false);
        fetchCars();
      } else alert("فشل إضافة السيارة");
    } catch { alert("فشل الاتصال بالسيرفر"); }
    finally { setLoading(false); }
  };

  const handleUpdateCar = async () => {
    if (!editData) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("Brand", editData.brand);
    fd.append("Model", editData.model);
    fd.append("Year", editData.year.toString());
    fd.append("PlateNumber", editData.plateNumber);
    if (editCarPhoto) fd.append("CarPhoto", editCarPhoto);
    try {
      const res = await fetch(`${BASE_URL}/${editData.id}`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: fd
      });
      if (res.ok) {
        setEditModeId(null); setEditCarPhoto(null); setEditPreviewUrl(null);
        fetchCars();
      } else alert("فشل التحديث");
    } catch { alert("فشل الاتصال بالسيرفر"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه السيارة؟")) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCars(cars.filter(c => c.id !== id));
    } catch { alert("فشل الحذف"); }
  };

  const cancelEdit = () => {
    setEditModeId(null);
    setEditCarPhoto(null);
    setEditPreviewUrl(null);
  };

  const fields = [
    { label: "الماركة (Brand)",  key: "brand",        placeholder: "مثلاً: تويوتا"  },
    { label: "الموديل (Model)",  key: "model",        placeholder: "مثلاً: كورولا"  },
    { label: "سنة الصنع",        key: "year",         placeholder: "2024", numeric: true },
    { label: "رقم اللوحة",       key: "plateNumber",  placeholder: "أ ب ج 1 2 3"   },
  ];

  return (
    <div className="bg-white dark:bg-primary_BGD border border-gray-100 dark:border-gray-700 rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 md:p-10 shadow-xl" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 border-b pb-4 dark:border-gray-700">
        <h2 className="text-[#137FEC] text-lg sm:text-2xl font-black flex items-center gap-2">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-1.5 sm:p-2 rounded-xl">
            <MdDirectionsCar size={22} className="text-[#137FEC]" />
          </div>
          سياراتي
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 ${
            showAddForm
              ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              : "bg-[#137FEC] hover:bg-blue-600 text-white shadow-md"
          }`}
        >
          {showAddForm
            ? <><MdClose size={15} /> إلغاء</>
            : <><MdAdd size={15} /> <span>إضافة سيارة</span></>
          }
        </button>
      </div>

      {/* فورم الإضافة */}
      {showAddForm && (
        <div className="mb-5 border border-dashed border-blue-200 dark:border-blue-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-blue-50/30 dark:bg-blue-900/10">
          <h3 className="text-sm font-extrabold text-[#137FEC] mb-4 flex items-center gap-2">
            <MdAdd size={16} /> تفاصيل السيارة الجديدة
          </h3>

          {/* صورة فوق دايمًا على موبايل */}
          <div className="flex flex-col gap-5">
            <PhotoUploader
              id="newCarPhoto"
              previewSrc={newCarPhoto ? URL.createObjectURL(newCarPhoto) : null}
              onChange={(e) => setNewCarPhoto(e.target.files?.[0] || null)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {fields.map(({ label, key, placeholder, numeric }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-extrabold text-[#137FEC]">{label}</label>
                  <input
                    type="text"
                    inputMode={numeric ? "numeric" : "text"}
                    placeholder={placeholder}
                    className={FIELD_CLASS}
                    value={(newCar as any)[key]}
                    onChange={(e) => setNewCar({
                      ...newCar,
                      [key]: numeric ? e.target.value.replace(/\D/g, "") : e.target.value
                    })}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleAddCar}
              disabled={loading}
              className="w-full bg-[#137FEC] hover:bg-blue-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 text-sm"
            >
              <MdAdd size={18} /> {loading ? "جاري الإضافة..." : "تأكيد الإضافة"}
            </button>
          </div>
        </div>
      )}

      {/* قائمة السيارات */}
      {cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center px-4">
          <MdDirectionsCar size={44} className="text-gray-200 dark:text-gray-700 mb-3" />
          <p className="font-bold text-gray-400 mb-1 text-sm">لا توجد سيارات مضافة بعد</p>
          <p className="text-xs text-gray-300 dark:text-gray-600">اضغط "إضافة سيارة" للبدء</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {cars.map((car) => {
            const isExpanded = expandedCarId === car.id;
            const isEditMode = editModeId === car.id;

            return (
              <div
                key={car.id}
                className="overflow-hidden border border-gray-100 dark:border-gray-700/70 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/30 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Row header */}
                <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                  <div
                    className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-1 min-w-0"
                    onClick={() => !isEditMode && setExpandedCarId(isExpanded ? null : car.id)}
                  >
                    <div className="w-12 h-9 sm:w-16 sm:h-11 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-100 flex-shrink-0">
                      <img src={car.carPhotoUrl} alt={car.brand} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-gray-800 dark:text-white truncate text-sm sm:text-base">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-[11px] sm:text-xs text-gray-400 truncate">{car.year} · {car.plateNumber}</p>
                    </div>
                    {!isEditMode && (
                      <span className="text-gray-400 flex-shrink-0">
                        {isExpanded
                          ? <MdKeyboardArrowUp size={20} className="text-[#137FEC]" />
                          : <MdKeyboardArrowDown size={20} />}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                    {!editModeId && (
                      <button
                        onClick={() => { setEditModeId(car.id); setEditData(car); setExpandedCarId(car.id); }}
                        className="flex items-center gap-1 bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95"
                      >
                        <MdEdit size={14} />
                        <span className="hidden xs:inline sm:inline">تعديل</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="p-1.5 sm:p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700/50 p-4 sm:p-6">
                    {isEditMode ? (
                      <div className="flex flex-col gap-5">
                        <PhotoUploader
                          id={`editPhoto-${car.id}`}
                          previewSrc={editPreviewUrl || editData?.carPhotoUrl}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) { setEditCarPhoto(f); setEditPreviewUrl(URL.createObjectURL(f)); }
                          }}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {fields.map(({ label, key, numeric }) => (
                            <div key={key} className="space-y-1.5">
                              <label className="text-xs sm:text-sm font-extrabold text-[#137FEC]">{label}</label>
                              <input
                                type="text"
                                inputMode={numeric ? "numeric" : "text"}
                                value={(editData as any)?.[key] ?? ""}
                                onChange={(e) => setEditData({
                                  ...editData!,
                                  [key]: numeric ? parseInt(e.target.value.replace(/\D/g, "")) || 0 : e.target.value
                                })}
                                className={FIELD_CLASS}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button
                            onClick={handleUpdateCar}
                            disabled={loading}
                            className="flex-1 bg-[#137FEC] hover:bg-blue-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 text-sm"
                          >
                            <MdSave size={16} /> {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 sm:flex-none bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                          >
                            <MdClose size={16} /> إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <InfoCard label="الماركة والموديل" value={`${car.brand} - ${car.model}`} />
                        <InfoCard label="سنة الصنع" value={car.year} />
                        <InfoCard label="رقم اللوحة" value={car.plateNumber} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};