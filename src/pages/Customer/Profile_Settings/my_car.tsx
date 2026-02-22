import { useState } from "react";
import { MdCloudUpload, MdEdit, MdDelete, MdAdd, MdSave, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";


interface Car {
    id: number;
    name: string;
    model: string;
    year: string;
    plate: string;
    image: string;
}

export const MyCars = ({ inputStyle }: { inputStyle: string }) => {
    // قائمة السيارات (حالة وهمية للبداية)
    const [cars, setCars] = useState<Car[]>([
        { id: 1, name: "Toyota RAV4", model: "RAV4", year: "2022", plate: "1234 ABC", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop" }
    ]);

    const [expandedCarId, setExpandedCarId] = useState<number | null>(null); // للتحكم في فتح/إغلاق التفاصيل
    const [editModeId, setEditModeId] = useState<number | null>(null); // للتحكم في وضع التعديل
    const [editData, setEditData] = useState<Car | null>(null); // البيانات المؤقتة أثناء التعديل

    // دالة لتبديل فتح وإغلاق القائمة
    const toggleExpand = (id: number) => {
        setExpandedCarId(expandedCarId === id ? null : id);
        setEditModeId(null); // نغلق وضع التعديل عند التبديل
    };

    // بدء التعديل
    const handleEditClick = (car: Car) => {
        setEditModeId(car.id);
        setEditData({ ...car });
        setExpandedCarId(car.id); // نتأكد أنها مفتوحة
    };

    // حفظ التعديلات
    const handleSave = () => {
        if (editData) {
            setCars(cars.map(c => c.id === editData.id ? editData : c));
            setEditModeId(null);
            alert("تم حفظ البيانات بنجاح!");
        }
    };

    // حذف السيارة
    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`هل أنت متأكد من حذف السيارة: ${name}؟`)) {
            setCars(cars.filter(c => c.id !== id));
        }
    };

    return (
        <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl">
            <h2 className="text-[#137FEC] text-2xl font-black mb-8 text-right border-b pb-4 dark:border-gray-700">بيانات سياراتي</h2>

            <div className="space-y-12">
                {/* --- قسم إضافة سيارة جديدة (ثابت كما هو) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-3 flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-[#E5F1FD] bg-[#FDEBD0] overflow-hidden flex items-center justify-center">
                                <img src="/car-placeholder.png" alt="Car" className="w-full h-full object-cover opacity-40" />
                            </div>
                            <label htmlFor="carPhoto" className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2 rounded-full shadow-lg cursor-pointer">
                                <MdCloudUpload size={20} />
                            </label>
                        </div>
                        <input type="file" id="carPhoto" className="hidden" />
                        <p className="text-blue-500 font-bold text-sm">إضافة سيارة جديدة</p>
                    </div>

                    <div className="lg:col-span-9 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="اسم السيارة" className={inputStyle} />
                            <input type="text" placeholder="موديل السيارة" className={inputStyle} />
                            <input type="text" placeholder="سنة تصنيع" className={inputStyle} />
                            <input type="text" placeholder="رقم لوحة بيانات" className={inputStyle} />
                        </div>
                        <div className="flex justify-center">
                            <button className="bg-[#137FEC] text-white px-12 py-3 rounded-xl font-bold flex items-center gap-2">
                                <MdAdd size={24} /> اضافة سيارة
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t-2 border-dotted border-blue-400 opacity-50 my-8"></div>

                {/* --- قائمة السيارات المتحركة --- */}
                <div className="space-y-4" dir="rtl">
                    {cars.map((car) => (
                        <div key={car.id} className="overflow-hidden border border-blue-50 rounded-3xl transition-all">
                            {/* الرأس - الشريط الأساسي */}
                            <div className="bg-[#137FEC9C] dark:bg-[#137FEC33] p-4 flex items-center justify-between shadow-md transition-all">
                                <div 
                                    className="flex items-center gap-6 cursor-pointer flex-1" 
                                    onClick={() => toggleExpand(car.id)}
                                >
                                    <div className="w-20 h-12 rounded-xl overflow-hidden border-2 border-white/30 bg-gray-200">
                                        <img src={car.image} alt="Car" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-white font-black text-lg flex items-center gap-2">
                                        {car.name}
                                        {expandedCarId === car.id ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                    </span>
                                </div>

                                <div className="flex gap-3 px-4">
                                    <button 
                                        onClick={() => handleEditClick(car)}
                                        className="bg-[#1380EC] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all text-sm border border-white/10"
                                    >
                                        <MdEdit size={18} /> {editModeId === car.id ? "تعديل حالي" : "تعديل"}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(car.id, car.name)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-red-600 transition-all text-sm"
                                    >
                                        <MdDelete size={18} /> حذف
                                    </button>
                                </div>
                            </div>

                            {/* محتوى التفاصيل / التعديل (يظهر عند التوسيع) */}
                            {expandedCarId === car.id && (
                                <div className="p-8 bg-blue-50/30 dark:bg-gray-800/20 animate-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {editModeId === car.id ? (
                                            // واجهة التعديل
                                            <>
                                                <div className="space-y-1"><label className="text-sm text-gray-500 px-2">اسم السيارة</label>
                                                <input value={editData?.name} onChange={(e)=>setEditData({...editData!, name: e.target.value})} className={inputStyle} /></div>
                                                <div className="space-y-1"><label className="text-sm text-gray-500 px-2">الموديل</label>
                                                <input value={editData?.model} onChange={(e)=>setEditData({...editData!, model: e.target.value})} className={inputStyle} /></div>
                                                <div className="space-y-1"><label className="text-sm text-gray-500 px-2">سنة الصنع</label>
                                                <input value={editData?.year} onChange={(e)=>setEditData({...editData!, year: e.target.value})} className={inputStyle} /></div>
                                                <div className="space-y-1"><label className="text-sm text-gray-500 px-2">رقم اللوحة</label>
                                                <input value={editData?.plate} onChange={(e)=>setEditData({...editData!, plate: e.target.value})} className={inputStyle} /></div>
                                                <div className="md:col-span-2 flex justify-end mt-4">
                                                    <button onClick={handleSave} className="bg-green-600 text-white px-8 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700">
                                                        <MdSave /> حفظ التعديلات
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            // واجهة العرض فقط
                                            <>
                                                <div className="p-4 bg-white dark:bg-gray-700 rounded-2xl border border-blue-100 shadow-sm">
                                                    <p className="text-xs text-blue-400">اسم السيارة</p>
                                                    <p className="font-bold text-gray-700 dark:text-gray-200">{car.name}</p>
                                                </div>
                                                <div className="p-4 bg-white dark:bg-gray-700 rounded-2xl border border-blue-100 shadow-sm">
                                                    <p className="text-xs text-blue-400">الموديل</p>
                                                    <p className="font-bold text-gray-700 dark:text-gray-200">{car.model}</p>
                                                </div>
                                                <div className="p-4 bg-white dark:bg-gray-700 rounded-2xl border border-blue-100 shadow-sm">
                                                    <p className="text-xs text-blue-400">سنة الصنع</p>
                                                    <p className="font-bold text-gray-700 dark:text-gray-200">{car.year}</p>
                                                </div>
                                                <div className="p-4 bg-white dark:bg-gray-700 rounded-2xl border border-blue-100 shadow-sm">
                                                    <p className="text-xs text-blue-400">رقم اللوحة</p>
                                                    <p className="font-bold text-gray-700 dark:text-gray-200">{car.plate}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};