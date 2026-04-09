
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import MachineSidebar from "../../../components/Machine/MachineSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import { useTheme } from "../../../contexts/ThemeContext";


     const statusOptions = [
         { value: "Accepted", label: "تم القبول" },
         { value: "OnTheWay", label: "في الطريق" },
         { value: "Arrived", label: "وصل" },
         { value: "InProgress", label: "قيد الإصلاح" },
         { value: "Completed", label: "تم الانتهاء" },
         { value: "Cancelled", label: "تم الإلغاء" }
       ];
    const statusMap: any = {
        Accepted: 3,
        OnTheWay: 4,
        Arrived: 5,
        InProgress: 6,
        Completed: 7,
        Cancelled: 8
      };



const MRequestTracking = () => {
  const { requestId } = useParams();
  console.log("requestId:", requestId);

  const { dark } = useTheme();

  const [request, setRequest] = useState<any>(null);
//   const [status, setStatus] = useState<number | null>(null);
const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("userToken");


const fetchRequest = async () => {
    try {
      const resStatus = await axios.get(
        `https://gearupapp.runasp.net/api/mechanic/requests/${requestId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      console.log("DATA:", resStatus.data);
  
      setRequest(resStatus.data);   // 👈 كله من هنا
      setStatus(resStatus.data.status);
  
    } catch (err: any) {
      console.error("ERROR:", err.response?.data);
      toast.error("فشل تحميل بيانات الطلب");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (requestId) fetchRequest();
  }, [requestId]);


const updateStatus = async (newStatus: string) => {
    try {
      await axios.put(
        `https://gearupapp.runasp.net/api/mechanic/requests/${requestId}/status`,
        { newStatus: statusMap[newStatus] }, // 👈 هنا المهم
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      toast.success("تم تحديث الحالة");
  
      setStatus(newStatus);
  
      fetchRequest();
  
    } catch (err: any) {
      console.error("UPDATE ERROR:", err.response?.data);
      toast.error("فشل تحديث الحالة");
    }
  };


//   const getStatusLabel = (value: number | null) => {
    const getStatusLabel = (value: string | null) => {
    const found = statusOptions.find(s => s.value === value);
    return found ? found.label : "غير معروف";
  };

  if (loading) return <p className="p-10 text-center">جاري التحميل...</p>;

  return (
    <div
      dir="rtl"
      className={`flex min-h-screen transition-colors duration-500 ${
        !dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"
      }`}
    >
      {/* Sidebar */}
      <MachineSidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-3 sm:p-5 md:p-8 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between mt-14 lg:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold">
            حالة الطلب
          </h1>

          <div className="flex items-center gap-3">
            <NotificationBell size={28} />
            <ThemeToggle />
          </div>
        </div>

        {/* Content Card */}
        <div className={`p-4 rounded-xl shadow ${
          !dark ? "bg-white" : "bg-[#0d1629]"
        }`}>

              {request && (
  <>
    {/* 🚗 car image + info */}
    {/* <div className="flex items-center gap-3">
      {/* {request.carPhotoUrl && ( *
      {request.car?.carPhotoUrl && (
        <img
          src={request.carPhotoUrl}
          className="w-20 h-20 rounded-lg object-cover"
        />
      )}

      <div>
        <p className="flex flex-wrap items-center gap-2">
  <strong>🚗 السيارة:</strong>
  <span>
    {request.car?.brand} {request.car?.model} - {request.car?.year} - {request.car?.plateNumber}
  </span>
</p>
      </div>
    </div> */}
    <div className="flex items-center gap-3">
  {request.car?.carPhotoUrl && (
    <img
      src={request.car.carPhotoUrl}
      className="w-20 h-20 rounded-lg object-cover"
      alt="car"
    />
  )}

  <div>
    <p className="flex flex-wrap items-center gap-2">
      <strong>السيارة:</strong>
      <span>
        {request.car?.brand} {request.car?.model} - {request.car?.year} - {request.car?.plateNumber}
      </span>
    </p>
  </div>
</div>

    <hr className="my-3" />

    {/* 🧑 customer */}
    <div className="flex items-center gap-3">
      <img
        src={request.customer?.profilePhotoUrl}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <p><strong>👤 العميل:</strong> {request.customer?.firstName} {request.customer?.lastName}</p>
        <p>📞 {request.customer?.phoneNumber}</p>
      </div>
    </div>

    <hr className="my-3" />

    {/* 🛠 problem */}
    <p><strong>📝 المشكلة:</strong> {request.issueDescription}</p>

    {request.problemPhotoUrl && (
      <img
        src={request.problemPhotoUrl}
        className="w-full h-40 object-cover rounded-lg mt-2"
      />
    )}

    <hr className="my-3" />

    {/* 📌 request info */}
    <p><strong>📌 نوع الطلب:</strong> {request.requestType}</p>
    <p><strong>🛠 الخدمة:</strong> {request.serviceType}</p>
            </>
          )}

          <p>
            <strong>📌 الحالة الحالية:</strong>{" "}
            {getStatusLabel(status)}
          </p>

        </div>

        {/* Status Buttons */}
        <div className="grid grid-cols-2 gap-3">
      
          {statusOptions.map((s) => (
  <button
    key={s.value}
    onClick={() => updateStatus(s.value)}
    className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
  >
    {s.label}
  </button>
))}
        </div>

      </main>
    </div>
  );
};

export default MRequestTracking;