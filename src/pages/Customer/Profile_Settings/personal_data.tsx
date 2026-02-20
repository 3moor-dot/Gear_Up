import { useState, useEffect } from "react";
import { MdSave, MdCloudUpload, MdEdit, MdClose } from "react-icons/md";

interface PersonalDataProps {
  inputStyle: string;
}

export const PersonalData = ({ inputStyle }: PersonalDataProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [profileImage, setProfileImage] = useState<File | string | null>(null);

  const toggleEdit = () => setIsEditable(!isEditable);

  // ✅ جلب بيانات البروفايل من السيرفر
  const fetchProfile = async () => {
    try {
      const token = sessionStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(
        "http://gearupapp.runasp.net/api/users/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        email: data.email || "",
      });

      if (data.profilePhoto) {
        setProfileImage(data.profilePhoto);
        localStorage.setItem("profileImage", data.profilePhoto);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    // جلب الصورة من localStorage أولًا
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) setProfileImage(storedImage);

    fetchProfile();
  }, []);

  // ✅ رفع صورة جديدة
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // نخزنها في localStorage بصيغة base64
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          localStorage.setItem("profileImage", reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ حفظ التعديلات مع الصورة
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("userToken");
      if (!token) throw new Error("No token found");

      const form = new FormData();
      form.append("FirstName", formData.firstName);
      form.append("LastName", formData.lastName);
      form.append("Phone", formData.phone);
      if (profileImage instanceof File) {
        form.append("ProfilePhoto", profileImage);
      }

      const response = await fetch(
        "http://gearupapp.runasp.net/api/users/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const result = await response.json();
      // بعد الحفظ، نخزن الـ URL النهائي من السيرفر في localStorage
      if (result.profilePhoto) {
        setProfileImage(result.profilePhoto);
        localStorage.setItem("profileImage", result.profilePhoto);
      }

      setIsEditable(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl">
      <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-gray-700">
        <h2 className="text-[#137FEC] text-2xl font-black text-right">
          البيانات الشخصية الأساسية
        </h2>

        {!isEditable && (
          <button
            onClick={toggleEdit}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md"
          >
            <MdEdit size={18} /> تعديل البيانات
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* صورة البروفايل */}
        <div className="lg:col-span-3 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-[#E5F1FD] bg-[#FDEBD0] overflow-hidden flex items-center justify-center">
              {profileImage ? (
                profileImage instanceof File ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={profileImage as string}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="text-gray-400">صورة</div>
              )}
            </div>

            {isEditable && (
              <label
                htmlFor="userPhoto"
                className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2 rounded-full shadow-lg cursor-pointer"
              >
                <MdCloudUpload size={20} />
              </label>
            )}
          </div>

          {isEditable && (
            <div className="text-center">
              <p className="text-blue-500 font-bold text-sm">
                تحميل صورة الملف الشخصي
              </p>
              <input
                type="file"
                id="userPhoto"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>

        {/* الحقول */}
        <div className="lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">
                الاسم الأول
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className={inputStyle}
                disabled={!isEditable}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">
                اسم العائلة
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className={inputStyle}
                disabled={!isEditable}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">
              رقم الهاتف
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={`${inputStyle} ${
                !isEditable ? "bg-gray-50 opacity-70" : ""
              }`}
              disabled={!isEditable}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`${inputStyle} ${
                !isEditable ? "bg-gray-50 opacity-70" : ""
              }`}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>

      {isEditable && (
        <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#137FEC] text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-all disabled:bg-gray-400"
          >
            <MdSave size={20} />
            {loading ? "جاري الحفظ..." : "حفظ التغيرات"}
          </button>

          <button
            onClick={() => setIsEditable(false)}
            className="bg-gray-200 text-gray-700 px-10 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center gap-2"
          >
            <MdClose size={20} /> إلغاء
          </button>
        </div>
      )}
    </div>
  );
};

// import { useState, useEffect } from "react";
// import { MdSave, MdCloudUpload, MdEdit, MdClose } from "react-icons/md";

// interface PersonalDataProps {
//   profileImage: File | null; // خليها File عشان نرفعها للباك
//   handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   inputStyle: string;
// }

// export const PersonalData = ({
//   profileImage,
//   handleImageUpload,
//   inputStyle,
// }: PersonalDataProps) => {
//   const [isEditable, setIsEditable] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//   });

//   const toggleEdit = () => {
//     setIsEditable(!isEditable);
//   };

//   // ✅ جلب بيانات البروفايل
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = sessionStorage.getItem("userToken");
//         if (!token) return;

//         const response = await fetch(
//           "http://gearupapp.runasp.net/api/users/profile",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await response.json();

//         setFormData({
//           firstName: data.firstName?.value || data.firstName || "",
//           lastName: data.lastName?.value || data.lastName || "",
//           phone: data.phone || "",
//           email: data.email || "",
//         });
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // ✅ حفظ التعديلات مع الصورة
//   const handleSave = async () => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem("userToken");
//       if (!token) throw new Error("No token found");

//       const form = new FormData();
//       form.append("FirstName", formData.firstName);
//       form.append("LastName", formData.lastName);
//       form.append("Phone", formData.phone);
//       if (profileImage instanceof File) {
//         form.append("ProfilePhoto", profileImage);
//       }

//       const response = await fetch(
//         "http://gearupapp.runasp.net/api/users/profile",
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             // ما تحطش Content-Type هنا، fetch هيتصرف صح مع FormData
//           },
//           body: form,
//         }
//       );

//       if (!response.ok) throw new Error("Update failed");

//       setIsEditable(false);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-primary_BGD border border-blue-100 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-xl">
//       <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-gray-700">
//         <h2 className="text-[#137FEC] text-2xl font-black text-right">
//           البيانات الشخصية الأساسية
//         </h2>

//         {!isEditable && (
//           <button
//             onClick={toggleEdit}
//             className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md"
//           >
//             <MdEdit size={18} /> تعديل البيانات
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         {/* صورة البروفايل */}
//         <div className="lg:col-span-3 flex flex-col items-center gap-4">
//           <div className="relative">
//             <div className="w-32 h-32 rounded-full border-4 border-[#E5F1FD] bg-[#FDEBD0] overflow-hidden flex items-center justify-center">
//               {profileImage ? (
//                 profileImage instanceof File ? (
//                   <img
//                     src={URL.createObjectURL(profileImage)}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <img
//                     src={profileImage as string}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 )
//               ) : (
//                 <div className="text-gray-400">صورة</div>
//               )}
//             </div>

//             {isEditable && (
//               <label
//                 htmlFor="userPhoto"
//                 className="absolute -bottom-2 -right-2 bg-[#137FEC] text-white p-2 rounded-full shadow-lg cursor-pointer"
//               >
//                 <MdCloudUpload size={20} />
//               </label>
//             )}
//           </div>

//           {isEditable && (
//             <div className="text-center">
//               <p className="text-blue-500 font-bold text-sm">
//                 تحميل صورة الملف الشخصي
//               </p>
//               <input
//                 type="file"
//                 id="userPhoto"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//               />
//             </div>
//           )}
//         </div>

//         {/* الحقول */}
//         <div className="lg:col-span-9 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">
//                 الاسم الأول
//               </label>
//               <input
//                 type="text"
//                 value={formData.firstName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, firstName: e.target.value })
//                 }
//                 className={inputStyle}
//                 disabled={!isEditable}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">
//                 اسم العائلة
//               </label>
//               <input
//                 type="text"
//                 value={formData.lastName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, lastName: e.target.value })
//                 }
//                 className={inputStyle}
//                 disabled={!isEditable}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">
//               رقم الهاتف
//             </label>
//             <input
//               type="text"
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({ ...formData, phone: e.target.value })
//               }
//               className={`${inputStyle} ${
//                 !isEditable ? "bg-gray-50 opacity-70" : ""
//               }`}
//               disabled={!isEditable}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-500 mb-1 mr-2">
//               البريد الإلكتروني
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               className={`${inputStyle} ${
//                 !isEditable ? "bg-gray-50 opacity-70" : ""
//               }`}
//               disabled={!isEditable}
//             />
//           </div>
//         </div>
//       </div>

//       {isEditable && (
//         <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="bg-[#137FEC] text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-all disabled:bg-gray-400"
//           >
//             <MdSave size={20} />
//             {loading ? "جاري الحفظ..." : "حفظ التغيرات"}
//           </button>

//           <button
//             onClick={() => setIsEditable(false)}
//             className="bg-gray-200 text-gray-700 px-10 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center gap-2"
//           >
//             <MdClose size={20} /> إلغاء
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };


