import { useState, useEffect } from "react";
import { MdCloudUpload, MdEdit, MdDelete, MdAdd, MdSave, MdKeyboardArrowDown, MdKeyboardArrowUp, MdClose } from "react-icons/md";

interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    plateNumber: string;
    carPhotoUrl: string;
}

export const MyCars = ({ }: { inputStyle: string }) => {
    const [cars, setCars] = useState<Car[]>([]);
    const [expandedCarId, setExpandedCarId] = useState<string | null>(null);
    const [editModeId, setEditModeId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [newCar, setNewCar] = useState({ brand: "", model: "", year: "", plateNumber: "" });
    const [newCarPhoto, setNewCarPhoto] = useState<File | null>(null);

    const [editData, setEditData] = useState<Car | null>(null);
    const [editCarPhoto, setEditCarPhoto] = useState<File | null>(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

    const token = sessionStorage.getItem("userToken");
    const BASE_URL = "https://gearupapp.runasp.net/api/customers/cars";

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await fetch(BASE_URL, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCars(data.cars);
            }
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    };
    const activeInputStyle = "w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-400 ring-2 ring-blue-100 shadow-sm focus:outline-none";

    const handleAddCar = async () => {
        if (!newCar.brand || !newCar.model || !newCarPhoto) return alert("يرجى ملء البيانات وصورة السيارة");
        setLoading(true);
        const formData = new FormData();
        formData.append("Brand", newCar.brand);
        formData.append("Model", newCar.model);
        formData.append("Year", newCar.year);
        formData.append("PlateNumber", newCar.plateNumber);
        formData.append("CarPhoto", newCarPhoto);

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            if (response.ok) {
                alert("تمت إضافة السيارة بنجاح");
                setNewCar({ brand: "", model: "", year: "", plateNumber: "" });
                setNewCarPhoto(null);
                fetchCars();
            }
        } catch (error) {
            alert("فشل إضافة السيارة");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCar = async () => {
        if (!editData) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("Brand", editData.brand);
        formData.append("Model", editData.model);
        formData.append("Year", editData.year.toString());
        formData.append("PlateNumber", editData.plateNumber);
        if (editCarPhoto) formData.append("CarPhoto", editCarPhoto);

        try {
            const response = await fetch(`${BASE_URL}/${editData.id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            if (response.ok) {
                alert("تم تحديث بيانات السيارة بنجاح");
                setEditModeId(null);
                setEditCarPhoto(null);
                setEditPreviewUrl(null);
                fetchCars();
            }
        } catch (error) {
            alert("حدث خطأ في الاتصال بالسيرفر");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("هل أنت متأكد من حذف هذه السيارة؟")) return;
        try {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setCars(cars.filter(c => c.id !== id));
            }
        } catch (error) {
            alert("فشل الحذف");
        }
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setEditCarPhoto(file);
            setEditPreviewUrl(URL.createObjectURL(file));
        }
    };
    return (
        <div className="bg-white dark:bg-primary_BGD border border-gray-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl">
            <h2 className="text-gray-800 dark:text-white text-2xl font-black mb-8 text-right border-b pb-4 dark:border-gray-700">بيانات سياراتي</h2>

            <div className="space-y-12">
                {/* --- قسم إضافة سيارة جديدة --- */}
                <div className="bg-white dark:bg-transparent border border-dashed border-blue-200 dark:border-gray-700 rounded-[32px] p-8 mb-12 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 text-[#137FEC]">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <MdAdd size={24} />
                        </div>
                        <h3 className="text-xl font-black">إضافة مركبة جديدة</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* رفع الصورة الشخصية للسيارة */}
                        <div className="lg:col-span-3 flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl border-4 border-blue-50 dark:border-gray-700 bg-gray-50 overflow-hidden shadow-inner flex items-center justify-center">
                                    {newCarPhoto ? (
                                        <img src={URL.createObjectURL(newCarPhoto)} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-4">
                                            <MdCloudUpload size={40} className="text-blue-200 mx-auto mb-1" />
                                            <p className="text-[10px] text-gray-400 font-bold">ارفع صورة</p>
                                        </div>
                                    )}
                                </div>
                                <label htmlFor="newCarPhoto" className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2.5 rounded-full shadow-xl cursor-pointer hover:scale-110 transition-transform">
                                    <MdCloudUpload size={20} />
                                </label>
                            </div>
                            <input type="file" id="newCarPhoto" className="hidden" accept="image/*" onChange={(e) => setNewCarPhoto(e.target.files?.[0] || null)} />
                        </div>

                        {/* مدخلات البيانات بنفس ستايل PersonalData */}
                        <div className="lg:col-span-9 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                                <div className="space-y-2">
                                    <label className="text-sm font-extrabold text-[#137FEC] pr-1">ماركة السيارة (Brand)</label>
                                    <input
                                        type="text"
                                        placeholder="مثلاً: تويوتا، هيونداي..."
                                        className="w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-400 ring-2 ring-blue-100 shadow-sm focus:outline-none"
                                        value={newCar.brand}
                                        onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-extrabold text-[#137FEC] pr-1">الموديل (Model)</label>
                                    <input
                                        type="text"
                                        placeholder="مثلاً: كورولا، إلنترا..."
                                        className="w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-400 ring-2 ring-blue-100 shadow-sm focus:outline-none"
                                        value={newCar.model}
                                        onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-extrabold text-[#137FEC] pr-1">سنة الصنع (Year)</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="2024"
                                        className="w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-400 ring-2 ring-blue-100 shadow-sm focus:outline-none"
                                        value={newCar.year}
                                        onChange={(e) => setNewCar({ ...newCar, year: e.target.value.replace(/\D/g, '') })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-extrabold text-[#137FEC] pr-1">رقم اللوحة (Plate Number)</label>
                                    <input
                                        type="text"
                                        placeholder="أ ب ج 1 2 3"
                                        className="w-full text-right font-semibold py-3 px-4 rounded-2xl transition-all duration-200 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-400 ring-2 ring-blue-100 shadow-sm focus:outline-none"
                                        value={newCar.plateNumber}
                                        onChange={(e) => setNewCar({ ...newCar, plateNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={handleAddCar}
                                    disabled={loading}
                                    className="bg-[#137FEC] hover:bg-blue-600 text-white px-12 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <MdAdd size={24} /> {loading ? "جاري الإضافة..." : "تأكيد إضافة السيارة"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 my-8"></div>

                {/* --- قائمة السيارات --- */}
                <div className="space-y-4">
                    {cars.map((car) => (
                        <div key={car.id} className="overflow-hidden border border-gray-100 dark:border-gray-700 rounded-[32px] transition-all bg-white dark:bg-transparent shadow-sm">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-6 cursor-pointer flex-1" onClick={() => setExpandedCarId(expandedCarId === car.id ? null : car.id)}>
                                    <div className="w-16 h-10 rounded-xl overflow-hidden border border-white dark:border-gray-700 bg-gray-200">
                                        <img src={car.carPhotoUrl} alt="Car" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-gray-800 dark:text-white font-black text-lg flex items-center gap-2">
                                        {car.brand} {car.model}
                                        {expandedCarId === car.id ? <MdKeyboardArrowUp className="text-[#137FEC]" /> : <MdKeyboardArrowDown className="text-gray-400" />}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    {!editModeId && (
                                        <button onClick={() => { setEditModeId(car.id); setEditData(car); setExpandedCarId(car.id); }} className="bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 text-sm transition-all active:scale-95">
                                            <MdEdit size={18} /> تعديل
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(car.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-full transition-all active:scale-95">
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            </div>

                            {expandedCarId === car.id && (
                                <div className="p-8 border-t border-gray-50 dark:border-gray-700">
                                    {editModeId === car.id ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                            <div className="lg:col-span-3 flex flex-col items-center gap-4">
                                                <div className="relative group">
                                                    <div className="w-32 h-32 rounded-3xl border-4 border-blue-50 dark:border-gray-600 bg-gray-50 overflow-hidden shadow-inner flex items-center justify-center">
                                                        <img src={editPreviewUrl || editData?.carPhotoUrl} className="w-full h-full object-cover" alt="Preview" />
                                                    </div>
                                                    <label htmlFor="editCarPhoto" className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2.5 rounded-full shadow-xl cursor-pointer hover:scale-110 transition-transform">
                                                        <MdCloudUpload size={20} />
                                                    </label>
                                                    <input type="file" id="editCarPhoto" className="hidden" accept="image/*" onChange={handleEditImageChange} />
                                                </div>
                                            </div>

                                            <div className="lg:col-span-9 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2 text-right">
                                                        <label className="text-sm font-extrabold text-[#137FEC] pr-1">الماركة (Brand)</label>
                                                        <input value={editData?.brand} onChange={(e) => setEditData({ ...editData!, brand: e.target.value })} className={activeInputStyle} />
                                                    </div>
                                                    <div className="space-y-2 text-right">
                                                        <label className="text-sm font-extrabold text-[#137FEC] pr-1">الموديل (Model)</label>
                                                        <input value={editData?.model} onChange={(e) => setEditData({ ...editData!, model: e.target.value })} className={activeInputStyle} />
                                                    </div>
                                                    <div className="space-y-2 text-right">
                                                        <label className="text-sm font-extrabold text-[#137FEC] pr-1">سنة الصنع</label>
                                                        <input type="text" inputMode="numeric" value={editData?.year} onChange={(e) => setEditData({ ...editData!, year: parseInt(e.target.value.replace(/\D/g, '')) || 0 })} className={activeInputStyle} />
                                                    </div>
                                                    <div className="space-y-2 text-right">
                                                        <label className="text-sm font-extrabold text-[#137FEC] pr-1">رقم اللوحة</label>
                                                        <input value={editData?.plateNumber} onChange={(e) => setEditData({ ...editData!, plateNumber: e.target.value })} className={activeInputStyle} />
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-3 pt-6 border-t dark:border-gray-700">
                                                    <button onClick={handleUpdateCar} disabled={loading} className="bg-[#137FEC] hover:bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50">
                                                        <MdSave size={20} /> {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                                                    </button>
                                                    <button onClick={() => { setEditModeId(null); setEditPreviewUrl(null); }} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2">
                                                        <MdClose size={20} /> إلغاء
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent dark:border-gray-700">
                                                <p className="text-xs text-gray-400 font-bold mb-1">الماركة والموديل</p>
                                                <p className="font-bold text-gray-700 dark:text-gray-200">{car.brand} - {car.model}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent dark:border-gray-700">
                                                <p className="text-xs text-gray-400 font-bold mb-1">سنة الصنع</p>
                                                <p className="font-bold text-gray-700 dark:text-gray-200">{car.year}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent dark:border-gray-700">
                                                <p className="text-xs text-gray-400 font-bold mb-1">رقم اللوحة</p>
                                                <p className="font-bold text-gray-700 dark:text-gray-200">{car.plateNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};