
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import { useTheme } from "../../../contexts/ThemeContext";

 const statusMap: any = {
   Accepted: "تم القبول",
   OnTheWay: "في الطريق",
   Arrived: "وصل",
   InProgress: "قيد الإصلاح",
   Completed: "تم الانتهاء",
   Cancelled: "تم الإلغاء"
 };
const statusOptions = [
  { value: "Accepted", label: "تم القبول" },
  { value: "OnTheWay", label: "في الطريق" },
  { value: "Arrived", label: "وصل" },
  { value: "InProgress", label: "قيد الإصلاح" },
  { value: "Completed", label: "تم الانتهاء" },
  { value: "Cancelled", label: "تم الإلغاء" }
];

const statusOrder = [
  "Accepted",
  "OnTheWay",
  "Arrived",
  "InProgress",
  "Completed",
  // "Cancelled",
];

const serviceTypeMap: any = {
  Diagnosis: "تشخيص",
  Tires: "إطارات",
  BodyRepair: "إصلاح هيكل",
  OilChange: "تغيير زيت",
};

const RequestTracking = () => {
  const { requestId } = useParams();

  const { dark } = useTheme();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("userToken");
  const currentIndex = statusOrder.indexOf(request?.status);

  const fetchRequest = async () => {

    try {
      const res = await axios.get(
        `https://gearupapp.runasp.net/api/requests/${requestId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
     console.log("REQUEST DATA:", res.data);
      setRequest(res.data);
    } catch (err) {
      console.error(err);
      toast.error("فشل تحميل بيانات الطلب");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!requestId) return;
  
    let lastStatus = null;
  
    const load = async () => {
      try {
        const res = await axios.get(
          `https://gearupapp.runasp.net/api/requests/${requestId}/status`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
  
        const newData = res.data;
  
        // مهم جدًا: ما نعملش update إلا لو في تغيير
        if (newData.status !== lastStatus) {
          lastStatus = newData.status;
          setRequest(newData);
        }
      } catch (err) {
        toast.error("فشل تحميل بيانات الطلب");
      } finally {
        setLoading(false);
      }
    };
  
    load(); // أول مرة بس
  
    const interval = setInterval(load, 5000);
  
    return () => clearInterval(interval);
  }, [requestId]);


  if (loading && !request) {
    return <p className="p-10 text-center">جاري التحميل...</p>;
  }

  return (
  
    <div className={`flex min-h-screen ${dark ? "bg-primary_BGD text-white" : "bg-[#F8FAFC] text-slate-800"}`}>

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Header />

        <div className="p-6">
          {/* <div className="max-w-xl mx-auto text-right"> */}
          <div className="max-w-xl ml-auto text-right">
            <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
  تتبع حالة الطلب
</h1>

<div className="bg-white dark:bg-gray-800 shadow p-4 rounded-xl space-y-2 text-gray-900 dark:text-gray-100">


{/* 🚗 CAR CARD */}
<div className="flex gap-3 items-center">

  {request?.car?.carPhotoUrl && (
    <img
      src={request.car.carPhotoUrl}
      alt="car"
      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
    />
  )}

  <div className="flex-1">
    <p className="font-bold">
      🚗 {request?.car?.brand} {request?.car?.model}
      <span className="text-sm font-normal opacity-70">
        {" "}({request?.car?.year}) - {request?.car?.plateNumber}
      </span>
    </p>
  </div>

</div>

{/* 🛠️ الخدمة */}

{/* {request?.serviceType && (
  <p>
    <strong>🛠️ الخدمة:</strong> {request.serviceType}
  </p>
)} */}
{request?.serviceType && (
  <p>
    <strong>🛠 الخدمة:</strong>{" "}
    {serviceTypeMap[request.serviceType] || request.serviceType}
  </p>
)}

{/* 📌 نوع الطلب */}
<p>
  <strong>📌 نوع الطلب:</strong>{" "}
  {request?.requestType === "Emergency" ? "🚨 طارئ" : "📅 مجدول"}
</p>


<p>
  <strong>🚚 نوع الخدمة:</strong>{" "}
  {request?.serviceMode === "MechanicComesToCustomer"
    ? "ميكانيكي متنقل"
    : request?.serviceMode === "CustomerGoesToMechanic"
    ? "الذهاب إلى الورشة"
    : "غير محدد"}
</p>

{/* 📝 المشكلة */}
<p>
  <strong>📝 المشكلة:</strong> {request?.issueDescription}
</p>

{/* 🖼️ صورة المشكلة */}
{request?.problemPhotoUrl && (
  <img
    src={request.problemPhotoUrl}
    className="w-full h-44 object-cover rounded-lg"
  />
)}

{/* 📌 الحالة */}
<p>
  <strong>📌 الحالة:</strong>{" "}
  {statusMap[request?.status] || request?.status}
</p>

<div className="flex items-center justify-between mt-6">
  {statusOrder.map((step, index) => {
    const isCompleted = index < currentIndex;
    const isActive = index === currentIndex;

    return (
      <div key={step} className="flex-1 flex flex-col items-center relative">

        {/* line */}
        {index !== statusOrder.length - 1 && (
          <div
            className={`absolute top-4 right-1/2 w-full h-1 z-0 ${
              index < currentIndex ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        )}

        {/* circle */}
        <div
          className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${
              isCompleted
                ? "bg-green-500 text-white"
                : isActive
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
        >
          {index + 1}
        </div>

        {/* label */}
        <span className="text-xs mt-2 text-center">
          {statusOptions.find(s => s.value === step)?.label}
        </span>
      </div>
    );
  })}
</div>

{/* 🔧 الميكانيكي */}
{request?.mechanic && (
  <div className="flex items-center gap-3 pt-3 border-t">

    <img
      src={request.mechanic.profilePhotoUrl}
      className="w-12 h-12 rounded-full object-cover"
    />

    <div>
      <p className="font-bold">
  🔧 الميكانيكي: {request.mechanic.firstName} {request.mechanic.lastName}
</p>

      <p className="text-sm opacity-70">
        📞 {request.mechanic.phoneNumber}
      </p>
    </div>

  </div>
)}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RequestTracking;