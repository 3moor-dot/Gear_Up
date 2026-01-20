import { MdCloudUpload, MdEdit, MdDelete, MdAdd } from "react-icons/md";

export const MyCars = ({ inputStyle }: { inputStyle: string }) => {
    return (
        <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-[#137FEC] text-2xl font-black mb-8 text-right border-b pb-4 dark:border-gray-700">بيانات سياراتي</h2>

            <div className="space-y-12">
                {/* --- قسم إضافة سيارة جديدة --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* رفع صورة السيارة */}
                    <div className="lg:col-span-3 flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-[#E5F1FD] bg-[#FDEBD0] overflow-hidden flex items-center justify-center">
                                <img src="/car-placeholder.png" alt="Car" className="w-full h-full object-cover opacity-40" />
                            </div>
                            <label htmlFor="carPhoto" className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition-all">
                                <MdCloudUpload size={20} />
                            </label>
                        </div>
                        <div className="text-center">
                            <p className="text-blue-500 font-bold text-sm">قم بتحميل صورة السيارة</p>
                            <input type="file" id="carPhoto" className="hidden" accept="image/*" />
                            <label htmlFor="carPhoto" className="mt-4 inline-block bg-[#3B82F6] text-white px-6 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-600 transition-all">
                                تحميل الصورة
                            </label>
                        </div>
                    </div>

                    {/* حقول بيانات السيارة */}
                    <div className="lg:col-span-9 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="اسم السيارة" className={inputStyle} />
                            <input type="text" placeholder="موديل السيارة" className={inputStyle} />
                            <input type="text" placeholder="سنة تصنيع" className={inputStyle} />
                            <input type="text" placeholder="رقم لوحة بيانات" className={inputStyle} />
                        </div>
                        <div className="flex justify-center">
                            <button className="bg-[#137FEC] text-white px-12 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                                <MdAdd size={24} /> اضافة سيارة
                            </button>
                        </div>
                    </div>
                </div>

                {/* خط فاصل منقط كما في الصورة */}
                <div className="border-t-2 border-dotted border-blue-400 opacity-50 my-8"></div>

                {/* --- قائمة السيارات المضافة --- */}
                <div className="space-y-4">
                    <div className="bg-[#137FEC9C] dark:bg-[#137FEC33] p-4 rounded-full flex items-center justify-between shadow-md group hover:shadow-lg transition-all border border-white/20">

                        {/* معلومات السيارة وصورتها */}
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-14 rounded-2xl overflow-hidden border-2 border-white/30 shadow-inner bg-gray-200">
                                <img 
                                    src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Car Preview" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <span className="text-white font-black text-lg">2022 Toyota RAV4</span>
                        </div>
                        {/* أزرار التحكم (حذف وتعديل) */}
                        <div className="flex gap-3 px-4">
                            <button className="bg-[#1380EC] text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all text-sm border border-white/10">
                                <MdEdit size={18} /> تعديل
                            </button>
                            <button className="bg-red-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-red-600 transition-all text-sm">
                                <MdDelete size={18} /> حذف
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};