
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import { useTheme } from "../../../contexts/ThemeContext";

// const statusMap: any = {
//   3: "تم القبول",
//   4: "في الطريق",
//   5: "وصل",
//   6: "قيد الإصلاح",
//   7: "تم الانتهاء",
//   8: "تم الإلغاء"
// };
const statusMap: any = {
  Accepted: "تم القبول",
  OnTheWay: "في الطريق",
  Arrived: "وصل",
  InProgress: "قيد الإصلاح",
  Completed: "تم الانتهاء",
  Cancelled: "تم الإلغاء"
};

const RequestTracking = () => {
  const { requestId } = useParams();

  const { dark } = useTheme();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("userToken");

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
    if (requestId) fetchRequest();
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
<p>
  <strong>🛠️ الخدمة:</strong> {request?.serviceType}
</p>

{/* 📌 نوع الطلب */}
<p>
  <strong>📌 نوع الطلب:</strong>{" "}
  {request?.requestType === "Emergency" ? "🚨 طارئ" : "📅 مجدول"}
</p>


{/* <p>
  <strong>🚚 نوع الخدمة:</strong>{" "}
  {request?.serviceMode === 1
    ? "الميكانيكي يجي لك"
    : request?.serviceMode === 2
    ? "أنت تروح للورشة"
    : "غير محدد"}
</p> */}
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

{/* 🔧 الميكانيكي */}
{request?.mechanic && (
  <div className="flex items-center gap-3 pt-3 border-t">

    <img
      src={request.mechanic.profilePhotoUrl}
      className="w-12 h-12 rounded-full object-cover"
    />

    <div>
      {/* <p className="font-bold">
        🔧 {request.mechanic.firstName} {request.mechanic.lastName}
      </p> */}
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