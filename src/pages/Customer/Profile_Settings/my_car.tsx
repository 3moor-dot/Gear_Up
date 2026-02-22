import { useState, useEffect } from "react";
import { MdCloudUpload, MdEdit, MdDelete, MdAdd, MdSave, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface Car {
  id: string;
  name: string;
  model: string;
  year: string;
  plate: string;
  image: string;
}

export const MyCars = ({ inputStyle }: { inputStyle: string }) => {
  // التوكن موجود من تسجيل الدخول السابق
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));
  const [cars, setCars] = useState<Car[]>([]);
  const [expandedCarId, setExpandedCarId] = useState<string | null>(null);
  const [editModeId, setEditModeId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Car | null>(null);
  const [newCar, setNewCar] = useState({ name: "", model: "", year: "", plate: "" });
  const [carPhoto, setCarPhoto] = useState<File | null>(null);

  // جلب سيارات المستخدم
  const fetchCars = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://gearupapp.runasp.net/api/customers/cars", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      const mappedCars: Car[] = data.cars.map((car: any) => ({
        id: car.id,
        name: car.brand,
        model: car.model,
        year: car.year.toString(),
        plate: car.plateNumber,
        image: car.carPhotoUrl
      }));
      setCars(mappedCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [token]);

  // إضافة سيارة جديدة
  const handleAddCar = async () => {
    if (!token) return;

    // تحقق من نوع الصورة قبل الإرسال
    if (carPhoto && !["image/jpeg", "image/png"].includes(carPhoto.type)) {
      alert("يرجى رفع صورة PNG أو JPG فقط");
      return;
    }

    const formData = new FormData();
    formData.append("Brand", newCar.name);
    formData.append("Model", newCar.model);
    formData.append("Year", newCar.year);
    formData.append("PlateNumber", newCar.plate);
    if (carPhoto) formData.append("CarPhoto", carPhoto);

    try {
      const res = await fetch("http://gearupapp.runasp.net/api/customers/cars/register", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchCars();
      setNewCar({ name: "", model: "", year: "", plate: "" });
      setCarPhoto(null);
    } catch (error: any) {
      console.error("Error adding car:", error);
      alert("فشل إضافة السيارة");
    }
  };

  // التعديل على سيارة
  const handleEditClick = (car: Car) => {
    setEditModeId(car.id);
    setEditData({ ...car });
    setExpandedCarId(car.id);
  };

  const handleSave = async () => {
    if (!editData || !token) return;

    const formData = new FormData();
    formData.append("Brand", editData.name);
    formData.append("Model", editData.model);
    formData.append("Year", editData.year);

    try {
      const res = await fetch(`http://gearupapp.runasp.net/api/customers/cars/${editData.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchCars();
      setEditModeId(null);
    } catch (error: any) {
      console.error("Error editing car:", error);
      alert("فشل تعديل السيارة");
    }
  };

  // حذف سيارة
  const handleDelete = async (id: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`هل أنت متأكد من حذف السيارة: ${name}؟`)) return;

    try {
      const res = await fetch(`http://gearupapp.runasp.net/api/customers/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 204) {
        setCars(cars.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCarId(expandedCarId === id ? null : id);
    setEditModeId(null);
  };

  return (
    <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl">
      <h2 className="text-[#137FEC] text-2xl font-black mb-8 text-right border-b pb-4 dark:border-gray-700">
        بيانات سياراتي
      </h2>

      <div className="space-y-12">
        {/* إضافة سيارة جديدة */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-3 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-[#E5F1FD] bg-[#FDEBD0] overflow-hidden flex items-center justify-center">
                <img
                  src={carPhoto ? URL.createObjectURL(carPhoto) : "/images.png"}
                  alt="Car"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="carPhoto"
                className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2 rounded-full shadow-lg cursor-pointer"
              >
                <MdCloudUpload size={20} />
              </label>
            </div>
            <input
              type="file"
              id="carPhoto"
              className="hidden"
              onChange={(e) => e.target.files && setCarPhoto(e.target.files[0])}
            />
            <p className="text-blue-500 font-bold text-sm">إضافة سيارة جديدة</p>
          </div>

          <div className="lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="اسم السيارة" className={inputStyle} value={newCar.name} onChange={(e) => setNewCar({ ...newCar, name: e.target.value })} />
              <input type="text" placeholder="موديل السيارة" className={inputStyle} value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} />
              <input type="text" placeholder="سنة تصنيع" className={inputStyle} value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} />
              <input type="text" placeholder="رقم لوحة بيانات" className={inputStyle} value={newCar.plate} onChange={(e) => setNewCar({ ...newCar, plate: e.target.value })} />
            </div>
            <div className="flex justify-center">
              <button
                className="bg-[#137FEC] text-white px-12 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                onClick={handleAddCar}
                disabled={!carPhoto}
              >
                <MdAdd size={24} /> اضافة سيارة
              </button>
            </div>
          </div>
        </div>

        {/* قائمة السيارات */}
        <div className="space-y-4" dir="rtl">
          {cars.map((car) => (
            <div key={car.id} className="overflow-hidden border border-blue-50 rounded-3xl transition-all">
              <div className="bg-[#137FEC9C] dark:bg-[#137FEC33] p-4 flex items-center justify-between shadow-md transition-all">
                <div className="flex items-center gap-6 cursor-pointer flex-1" onClick={() => toggleExpand(car.id)}>
                  <div className="w-20 h-12 rounded-xl overflow-hidden border-2 border-white/30 bg-gray-200">
                    <img src={car.image} alt="Car" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white font-black text-lg flex items-center gap-2">
                    {car.name}
                    {expandedCarId === car.id ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                  </span>
                </div>

                <div className="flex gap-3 px-4">
                  <button onClick={() => handleEditClick(car)} className="bg-[#1380EC] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all text-sm border border-white/10">
                    <MdEdit size={18} /> {editModeId === car.id ? "تعديل حالي" : "تعديل"}
                  </button>
                  <button onClick={() => handleDelete(car.id, car.name)} className="bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-red-600 transition-all text-sm">
                    <MdDelete size={18} /> حذف
                  </button>
                </div>
              </div>

              {expandedCarId === car.id && editModeId === car.id && (
                <div className="p-8 bg-blue-50/30 dark:bg-gray-800/20 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm text-gray-500 px-2">اسم السيارة</label>
                      <input value={editData?.name} onChange={(e) => setEditData({ ...editData!, name: e.target.value })} className={inputStyle} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-500 px-2">الموديل</label>
                      <input value={editData?.model} onChange={(e) => setEditData({ ...editData!, model: e.target.value })} className={inputStyle} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-500 px-2">سنة الصنع</label>
                      <input value={editData?.year} onChange={(e) => setEditData({ ...editData!, year: e.target.value })} className={inputStyle} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-500 px-2">رقم اللوحة</label>
                      <input value={editData?.plate} onChange={(e) => setEditData({ ...editData!, plate: e.target.value })} className={inputStyle} />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-4">
                      <button onClick={handleSave} className="bg-green-600 text-white px-8 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700">
                        <MdSave /> حفظ التعديلات
                      </button>
                    </div>
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


// import { useState, useEffect } from "react";
// import { MdCloudUpload, MdEdit, MdDelete, MdAdd, MdSave, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

// interface Car {
//   id: string;
//   name: string;
//   model: string;
//   year: string;
//   plate: string;
//   image: string;
// }

// export const MyCars = ({ inputStyle }: { inputStyle: string }) => {
//   const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));

//   const [cars, setCars] = useState<Car[]>([]);
//   const [expandedCarId, setExpandedCarId] = useState<string | null>(null);
//   const [editModeId, setEditModeId] = useState<string | null>(null);
//   const [editData, setEditData] = useState<Car | null>(null);

//   const [newCar, setNewCar] = useState({ name: "", model: "", year: "", plate: "" });
//   const [carPhoto, setCarPhoto] = useState<File | null>(null);

//   const login = async () => {
//     if (token) return;
//     try {
//       const res = await fetch("http://gearupapp.runasp.net/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           emailOrPhone: "shima@gmail.com",
//           password: "12345678",
//           rememberMe: true
//         })
//       });
//       if (!res.ok) throw new Error("فشل تسجيل الدخول");
//       const data = await res.json();
//       sessionStorage.setItem("token", data.accessToken);
//       setToken(data.accessToken);
//     } catch {
//       alert("الرجاء التحقق من بيانات الدخول");
//     }
//   };

//   const fetchCars = async () => {
//     if (!token) return;
//     const res = await fetch("http://gearupapp.runasp.net/api/customers/cars", {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     if (!res.ok) return;
//     const data = await res.json();
//     const mappedCars: Car[] = data.cars.map((car: any) => ({
//       id: car.id,
//       name: car.brand,
//       model: car.model,
//       year: car.year.toString(),
//       plate: car.plateNumber,
//       image: car.carPhotoUrl
//     }));
//     setCars(mappedCars);
//   };

//   useEffect(() => {
//     const init = async () => {
//       await login();
//       await fetchCars();
//     };
//     init();
//   }, []);

//   const handleAddCar = async () => {
//     console.log("Token before add:", token);
//     if (!token) return;

//     const formData = new FormData();
//     formData.append("Brand", newCar.name);
//     formData.append("Model", newCar.model);
//     formData.append("Year", newCar.year);
//     formData.append("PlateNumber", newCar.plate);
//     if (carPhoto) formData.append("CarPhoto", carPhoto);

//     const res = await fetch("http://gearupapp.runasp.net/api/customers/cars/register", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData
//     });

//     if (res.ok) {
//       await fetchCars();
//       setNewCar({ name: "", model: "", year: "", plate: "" });
//       setCarPhoto(null);
//     } else {
//       alert("فشل إضافة السيارة");
//     }
//   };

//   const handleEditClick = (car: Car) => {
//     setEditModeId(car.id);
//     setEditData({ ...car });
//     setExpandedCarId(car.id);
//   };

//   const handleSave = async () => {
//     if (!editData || !token) return;

//     const formData = new FormData();
//     formData.append("Brand", editData.name);
//     formData.append("Model", editData.model);
//     formData.append("Year", editData.year);

//     const res = await fetch(
//       `http://gearupapp.runasp.net/api/customers/cars/${editData.id}`,
//       {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData
//       }
//     );

//     if (res.ok) {
//       await fetchCars();
//       setEditModeId(null);
//     } else {
//       alert("فشل تعديل السيارة");
//     }
//   };

//   const handleDelete = async (id: string, name: string) => {
//     if (!token) return;
//     if (!window.confirm(`هل أنت متأكد من حذف السيارة: ${name}؟`)) return;

//     const res = await fetch(
//       `http://gearupapp.runasp.net/api/customers/cars/${id}`,
//       {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );

//     if (res.status === 204) {
//       setCars(cars.filter(c => c.id !== id));
//     }
//   };

//   const toggleExpand = (id: string) => {
//     setExpandedCarId(expandedCarId === id ? null : id);
//     setEditModeId(null);
//   };

//   return (
//     <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl">
//       <h2 className="text-[#137FEC] text-2xl font-black mb-8 text-right border-b pb-4 dark:border-gray-700">
//         بيانات سياراتي
//       </h2>

//       <div className="space-y-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
//           <div className="lg:col-span-3 flex flex-col items-center gap-4">
//             <div className="relative">
//               <div className="w-32 h-32 rounded-full border-4 border-[#E5F1FD] bg-[#FDEBD0] overflow-hidden flex items-center justify-center">
//                 <img
//                   src={carPhoto ? URL.createObjectURL(carPhoto) : "/images.png"}
//                   alt="Car"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <label
//                 htmlFor="carPhoto"
//                 className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2 rounded-full shadow-lg cursor-pointer"
//               >
//                 <MdCloudUpload size={20} />
//               </label>
//             </div>
//             <input
//               type="file"
//               id="carPhoto"
//               className="hidden"
//               onChange={(e) =>
//                 e.target.files && setCarPhoto(e.target.files[0])
//               }
//             />
//             <p className="text-blue-500 font-bold text-sm">
//               إضافة سيارة جديدة
//             </p>
//           </div>

//           <div className="lg:col-span-9 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input type="text" placeholder="اسم السيارة" className={inputStyle} value={newCar.name} onChange={(e) => setNewCar({ ...newCar, name: e.target.value })} />
//               <input type="text" placeholder="موديل السيارة" className={inputStyle} value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} />
//               <input type="text" placeholder="سنة تصنيع" className={inputStyle} value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} />
//               <input type="text" placeholder="رقم لوحة بيانات" className={inputStyle} value={newCar.plate} onChange={(e) => setNewCar({ ...newCar, plate: e.target.value })} />
//             </div>
//             <div className="flex justify-center">
//               <button
//                 className="bg-[#137FEC] text-white px-12 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
//                 onClick={handleAddCar}
//                 disabled={!carPhoto}
//               >
//                 <MdAdd size={24} /> اضافة سيارة
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="border-t-2 border-dotted border-blue-400 opacity-50 my-8"></div>

//         <div className="space-y-4" dir="rtl">
//           {cars.map((car) => (
//             <div key={car.id} className="overflow-hidden border border-blue-50 rounded-3xl transition-all">
//               <div className="bg-[#137FEC9C] dark:bg-[#137FEC33] p-4 flex items-center justify-between shadow-md transition-all">
//                 <div className="flex items-center gap-6 cursor-pointer flex-1" onClick={() => toggleExpand(car.id)}>
//                   <div className="w-20 h-12 rounded-xl overflow-hidden border-2 border-white/30 bg-gray-200">
//                     <img src={car.image} alt="Car" className="w-full h-full object-cover" />
//                   </div>
//                   <span className="text-white font-black text-lg flex items-center gap-2">
//                     {car.name}
//                     {expandedCarId === car.id ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
//                   </span>
//                 </div>

//                 <div className="flex gap-3 px-4">
//                   <button onClick={() => handleEditClick(car)} className="bg-[#1380EC] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all text-sm border border-white/10">
//                     <MdEdit size={18} /> {editModeId === car.id ? "تعديل حالي" : "تعديل"}
//                   </button>
//                   <button onClick={() => handleDelete(car.id, car.name)} className="bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-red-600 transition-all text-sm">
//                     <MdDelete size={18} /> حذف
//                   </button>
//                 </div>
//               </div>

//               {expandedCarId === car.id && editModeId === car.id && (
//                 <div className="p-8 bg-blue-50/30 dark:bg-gray-800/20 animate-in slide-in-from-top-2 duration-300">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-1">
//                       <label className="text-sm text-gray-500 px-2">اسم السيارة</label>
//                       <input value={editData?.name} onChange={(e) => setEditData({ ...editData!, name: e.target.value })} className={inputStyle} />
//                     </div>
//                     <div className="space-y-1">
//                       <label className="text-sm text-gray-500 px-2">الموديل</label>
//                       <input value={editData?.model} onChange={(e) => setEditData({ ...editData!, model: e.target.value })} className={inputStyle} />
//                     </div>
//                     <div className="space-y-1">
//                       <label className="text-sm text-gray-500 px-2">سنة الصنع</label>
//                       <input value={editData?.year} onChange={(e) => setEditData({ ...editData!, year: e.target.value })} className={inputStyle} />
//                     </div>
//                     <div className="space-y-1">
//                       <label className="text-sm text-gray-500 px-2">رقم اللوحة</label>
//                       <input value={editData?.plate} onChange={(e) => setEditData({ ...editData!, plate: e.target.value })} className={inputStyle} />
//                     </div>
//                     <div className="md:col-span-2 flex justify-end mt-4">
//                       <button onClick={handleSave} className="bg-green-600 text-white px-8 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700">
//                         <MdSave /> حفظ التعديلات
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
