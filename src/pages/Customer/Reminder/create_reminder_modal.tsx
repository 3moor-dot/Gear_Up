
import { useState, useRef, useEffect } from "react";

import { MdClose, MdSave, MdEventNote } from "react-icons/md";

import axios from "axios";



interface Props {

isOpen: boolean;

onClose: () => void;

cars: any[];

selectedCar: string;

setSelectedCar: (car: string) => void;

onSuccess: () => void;

}



const CreateReminderModal = ({

isOpen,

onClose,

cars,

selectedCar,

setSelectedCar,

onSuccess,

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





useEffect(() => {

if (isOpen) handleReset();

}, [isOpen]);





useEffect(() => {

const handleEsc = (e: KeyboardEvent) => {

if (e.key === "Escape") onClose();

};

window.addEventListener("keydown", handleEsc);

return () => window.removeEventListener("keydown", handleEsc);

}, [onClose]);



if (!isOpen) return null;



const handleReset = () => {

setFormData({

name: "",

description: "",

startDate: "",

endDate: "",

preferredNotificationTime: "09:00",

intervalValue: 1,

intervalUnit: "0",

});

setFrequencyType("0");

};



const handleSubmit = async (e: React.FormEvent) => {


e.preventDefault();


setLoading(true);



const carObj = cars.find(

(c) => `${c.year} ${c.brand} ${c.model}` === selectedCar

);



const finalCarId = carObj?.id;

const finalNotificationTime = formData.preferredNotificationTime;





const payload = {

carId: finalCarId,

name: formData.name,

description: formData.description || "",

startDate: formData.startDate

? new Date(formData.startDate).toISOString()

: new Date().toISOString(),

endDate: formData.endDate

? new Date(formData.endDate).toISOString()

: null,

preferredNotificationTime: finalNotificationTime,




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

onSuccess();

onClose();

} catch (error: any) {

console.error("خطأ في السيرفر:", error.response?.data);

alert(

"فشل الحفظ: " + (error.response?.data?.error || "تأكد من البيانات المطلوبة")

);

} finally {

setLoading(false);

}

};



const inputStyle =

"w-full dark:bg-[#1A233A] bg-white dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-right outline-none focus:border-[#137FEC] focus:ring-1 focus:ring-[#137FEC] transition-all placeholder-gray-400";



return (

<div

className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"

dir="rtl"

onClick={onClose}

>

<div

className="bg-[#F8FAFC] dark:bg-primary_BGD w-full max-w-2xl rounded-[30px] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]"

onClick={(e) => e.stopPropagation()}

>

{/* Header */}

<div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-[#137FEC0D]">

<div className="text-right">

<h2 className="text-xl font-bold dark:text-white flex items-center gap-2 text-gray-800">

<MdEventNote className="text-[#137FEC]" size={24} />

إنشاء تذكير جديد

</h2>

<p className="text-gray-500 dark:text-gray-400 text-xs mt-1">

سيتم إرسال إشعارات الصيانة بناءً على هذه المواعيد

</p>

</div>

<button

onClick={onClose}

className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full"

>

<MdClose size={28} />

</button>

</div>



{/* Body */}

<form

ref={formRef}

onSubmit={handleSubmit}

className="p-6 space-y-5 overflow-y-auto text-right"

>

{/* المركبة */}

<div className="space-y-2 text-right">

<label className="text-sm font-bold text-gray-700 dark:text-gray-300 block text-right">

المركبة المستهدفة *

</label>

<select

className={inputStyle}

value={selectedCar}

onChange={(e) => setSelectedCar(e.target.value)}

>

{cars.map((car, i) => (

<option

key={i}

value={`${car.year} ${car.brand} ${car.model}`}

>

{`${car.year} ${car.brand} ${car.model}`}

</option>

))}

</select>

</div>



{/* عنوان التذكير */}

<div className="space-y-2">

<label className="text-sm font-bold text-gray-700 dark:text-gray-300 block text-right">

عنوان التذكير *

</label>

<input

required

type="text"

placeholder="ما الذي تريد تذكره؟"

className={inputStyle}

value={formData.name}

onChange={(e) =>

setFormData({ ...formData, name: e.target.value })

}

/>

</div>



{/* ملاحظات إضافية */}

<div className="space-y-2">

<label className="text-sm font-bold text-gray-700 dark:text-gray-300 block text-right">

ملاحظات إضافية

</label>

<textarea

rows={2}

placeholder="تفاصيل أكثر عن الصيانة..."

className={`${inputStyle} resize-none`}

value={formData.description}

onChange={(e) =>

setFormData({ ...formData, description: e.target.value })

}

/>

</div>



{/* التواريخ ووقت الإشعار */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<div className="space-y-2">

<label className="text-sm font-bold text-gray-700 dark:text-gray-300 block text-right">

تاريخ البدء *

</label>

<input

required

type="datetime-local"

className={inputStyle}

value={formData.startDate}

onChange={(e) =>

setFormData({ ...formData, startDate: e.target.value })

}

/>

</div>

<div className="space-y-2">

<label className="text-sm font-bold text-gray-700 dark:text-gray-300 block text-right">

تاريخ الانتهاء

</label>

<input

type="datetime-local"

className={inputStyle}

value={formData.endDate}

onChange={(e) =>

setFormData({ ...formData, endDate: e.target.value })

}

/>

</div>

</div>



<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<div className="space-y-2">

<label className="text-sm font-bold text-gray-700 dark:text-gray-300 block text-right">

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

<label className="text-sm font-bold text-gray-700 dark:text-gray-300 block text-right">

نظام التكرار

</label>

<select

className={inputStyle}

value={frequencyType}

onChange={(e) => setFrequencyType(e.target.value)}

>

<option value="0">مرة واحدة فقط</option> {/* Once = 0 */}

<option value="1">كل يوم</option> {/* Daily = 1 */}

<option value="2">كل أسبوع</option> {/* Weekly = 2 */}

<option value="3">كل شهر</option> {/* Monthly = 3 */}

<option value="4">تكرار مخصص</option> {/* هيروح للسيرفر 5 في الـ payload */}

</select>

</div>

</div>



{frequencyType === "4" && (

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50/50 dark:bg-gray-800/50 rounded-2xl border border-blue-100 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">

<div className="space-y-2">

<label className="text-sm font-bold text-gray-700 dark:text-gray-300 block text-right">

يتكرر كل

</label>

<input

type="number"

min="1"

className={inputStyle}

value={formData.intervalValue}

onChange={(e) =>

setFormData({

...formData,

intervalValue: parseInt(e.target.value) || 1,

})

}

/>

</div>



<div className="space-y-2">

<label className="text-sm font-bold text-gray-700 dark:text-gray-300 block text-right">

الوحدة الزمنية

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



{/* Footer */}

<div className="p-6 border-t border-gray-200 dark:border-gray-800 flex flex-col-reverse sm:flex-row justify-center gap-3 bg-white dark:bg-primary_BGD">

<button

type="button"

onClick={() => {

handleReset();

onClose();

}}

className="px-8 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm"

>

إلغاء

</button>



<button

type="submit"

disabled={loading}

onClick={() => formRef.current?.requestSubmit()}

className="bg-[#137FEC] text-white px-10 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 disabled:opacity-50 transition-all text-sm"

>

<MdSave size={20} />

{loading ? "جاري الحفظ..." : "إضافة التذكير"}

</button>

</div>

</div>

</div>

);

};



export default CreateReminderModal;