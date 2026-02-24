import { useState, useEffect } from "react";
import { MdCloudUpload, MdEdit, MdDelete, MdAdd, MdSave, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface Car {
    id: string; 
    brand: string;
    model: string;
    year: number;
    plateNumber: string;
    carPhotoUrl: string;
}

export const MyCars = ({ inputStyle }: { inputStyle: string }) => {
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
    const BASE_URL = "http://gearupapp.runasp.net/api/customers/cars";

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
            
            // لا نرسل CarPhoto إلا إذا اختار المستخدم صورة جديدة فعلاً
            if (editCarPhoto) {
                formData.append("CarPhoto", editCarPhoto);
            }

            try {
                const response = await fetch(`${BASE_URL}/${editData.id}`, {
                    method: "PUT",
                    headers: { 
                        "Authorization": `Bearer ${token}`
                        
                    },
                    body: formData
                });

                if (response.ok) {
                    alert("تم تحديث بيانات السيارة بنجاح");
                    setEditModeId(null);
                    setEditCarPhoto(null);
                    setEditPreviewUrl(null);
                    fetchCars();
                } else {
                    const err = await response.json();
                    alert(err.message || "فشل التحديث، تأكد من صحة البيانات");
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

    // دالة لتغيير صورة السيارة في وضع التعديل
    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setEditCarPhoto(file);
            setEditPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl">
            <h2 className="text-[#137FEC] text-2xl font-black mb-8 text-right border-b pb-4 dark:border-gray-700">بيانات سياراتي</h2>

            <div className="space-y-12">
                {/* --- إضافة سيارة جديدة --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-3 flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-[#E5F1FD] bg-[#FDEBD0] overflow-hidden flex items-center justify-center">
                                {newCarPhoto ? (
                                    <img src={URL.createObjectURL(newCarPhoto)} className="w-full h-full object-cover" />
                                ) : (
                                    <img src="/car-placeholder.png" className="w-full h-full object-cover opacity-40" />
                                )}
                            </div>
                            <label htmlFor="carPhoto" className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2 rounded-full shadow-lg cursor-pointer">
                                <MdCloudUpload size={20} />
                            </label>
                        </div>
                        <input type="file" id="carPhoto" className="hidden" accept="image/*" onChange={(e) => setNewCarPhoto(e.target.files?.[0] || null)} />
                        <p className="text-blue-500 font-bold text-sm">إضافة صورة السيارة</p>
                    </div>

                    <div className="lg:col-span-9 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                            <input type="text" placeholder="ماركة السيارة (Brand)" className={inputStyle} value={newCar.brand} onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })} />
                            <input type="text" placeholder="الموديل (Model)" className={inputStyle} value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} />
                            {/* تم التغيير لـ input text مع inputMode لتعطيل الأسهم */}
                            <input type="text" inputMode="numeric" placeholder="سنة الصنع (Year)" className={inputStyle} value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value.replace(/\D/g, '') })} />
                            <input type="text" placeholder="رقم اللوحة (Plate Number)" className={inputStyle} value={newCar.plateNumber} onChange={(e) => setNewCar({ ...newCar, plateNumber: e.target.value })} />
                        </div>
                        <div className="flex justify-center">
                            <button onClick={handleAddCar} disabled={loading} className="bg-[#137FEC] text-white px-12 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50">
                                <MdAdd size={24} /> {loading ? "جاري الإضافة..." : "اضافة سيارة"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t-2 border-dotted border-blue-400 opacity-50 my-8"></div>

                {/* --- قائمة السيارات --- */}
                <div className="space-y-4" dir="rtl">
                    {cars.map((car) => (
                        <div key={car.id} className="overflow-hidden border border-blue-50 rounded-3xl transition-all">
                            <div className="bg-[#137FEC9C] dark:bg-[#137FEC33] p-4 flex items-center justify-between shadow-md">
                                <div className="flex items-center gap-6 cursor-pointer flex-1" onClick={() => setExpandedCarId(expandedCarId === car.id ? null : car.id)}>
                                    <div className="w-20 h-12 rounded-xl overflow-hidden border-2 border-white/30 bg-gray-200">
                                        <img src={car.carPhotoUrl} alt="Car" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-white font-black text-lg flex items-center gap-2">
                                        {car.brand} {car.model}
                                        {expandedCarId === car.id ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                    </span>
                                </div>
                                <div className="flex gap-3 px-4">
                                    <button 
                                        onClick={() => { 
                                            setEditModeId(car.id); 
                                            setEditData(car); 
                                            setExpandedCarId(car.id); 
                                            setEditPreviewUrl(null); 
                                        }} 
                                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm shadow-sm active:scale-95"
                                    >
                                        <MdEdit size={18} /> تعديل
                                    </button>
                                    <button onClick={() => handleDelete(car.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm shadow-sm active:scale-95">
                                        <MdDelete size={18} /> حذف
                                    </button>
                                </div>
                            </div>

                            {expandedCarId === car.id && (
                                <div className="p-8 bg-blue-50/30 dark:bg-gray-800/20">
                                    {editModeId === car.id ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                            {/* تعديل صورة السيارة داخل القسم المنبثق */}
                                            <div className="lg:col-span-3 flex flex-col items-center gap-3">
                                                <div className="relative group">
                                                    <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gray-100">
                                                        <img 
                                                            src={editPreviewUrl || editData?.carPhotoUrl} 
                                                            className="w-full h-full object-cover" 
                                                            alt="Preview" 
                                                        />
                                                    </div>
                                                    <label htmlFor="editCarPhoto" className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                                        <MdCloudUpload size={18} />
                                                    </label>
                                                    <input type="file" id="editCarPhoto" className="hidden" accept="image/*" onChange={handleEditImageChange} />
                                                </div>
                                                <span className="text-xs font-bold text-gray-400">تغيير الصورة</span>
                                            </div>

                                            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-sm text-[#137FEC] font-bold px-2">الماركة</label>
                                                    <input value={editData?.brand} onChange={(e) => setEditData({ ...editData!, brand: e.target.value })} className={inputStyle} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm text-[#137FEC] font-bold px-2">الموديل</label>
                                                    <input value={editData?.model} onChange={(e) => setEditData({ ...editData!, model: e.target.value })} className={inputStyle} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm text-[#137FEC] font-bold px-2">سنة الصنع</label>
                                                    <input type="text" inputMode="numeric" value={editData?.year} onChange={(e) => setEditData({ ...editData!, year: parseInt(e.target.value.replace(/\D/g, '')) || 0 })} className={inputStyle} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm text-[#137FEC] font-bold px-2">رقم اللوحة</label>
                                                    <input value={editData?.plateNumber} onChange={(e) => setEditData({ ...editData!, plateNumber: e.target.value })} className={inputStyle} />
                                                </div>
                                                <div className="md:col-span-2 flex justify-center mt-4 gap-4">
                                                    <button onClick={handleUpdateCar} disabled={loading} className="bg-green-600 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 shadow-md active:scale-95 disabled:opacity-50">
                                                        <MdSave size={20} /> {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                                                    </button>
                                                    <button onClick={() => {setEditModeId(null); setEditPreviewUrl(null);}} className="bg-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold active:scale-95">
                                                        إلغاء
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-4 bg-white dark:bg-gray-700 rounded-2xl border border-blue-100 shadow-sm">
                                                <p className="text-xs text-[#137FEC] font-bold">الماركة والموديل</p>
                                                <p className="font-bold text-gray-700 dark:text-gray-200">{car.brand} - {car.model}</p>
                                            </div>
                                            <div className="p-4 bg-white dark:bg-gray-700 rounded-2xl border border-blue-100 shadow-sm">
                                                <p className="text-xs text-[#137FEC] font-bold">سنة الصنع</p>
                                                <p className="font-bold text-gray-700 dark:text-gray-200">{car.year}</p>
                                            </div>
                                            <div className="p-4 bg-white dark:bg-gray-700 rounded-2xl border border-blue-100 shadow-sm">
                                                <p className="text-xs text-[#137FEC] font-bold">رقم اللوحة</p>
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