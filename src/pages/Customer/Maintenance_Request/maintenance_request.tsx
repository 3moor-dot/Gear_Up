
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdImage, MdLocationOn, MdDirectionsCar, MdCalendarToday } from "react-icons/md";
import { FaChevronDown, FaWrench, FaOilCan, FaExclamationTriangle, FaStar } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import { useTheme } from "../../../contexts/ThemeContext";
import { User } from "lucide-react";
import Swal from "sweetalert2";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

// ==================== دالة الحصول على معرف العميل الفريد ====================
const getCustomerKey = (): string => {
  const token = sessionStorage.getItem("userToken");
  if (!token) return "guest";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // نستخدم الـ userId كمفتاح فريد لكل عميل
    const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                || payload.sub 
                || payload.nameid 
                || payload.userId
                || token.slice(-10);
    return `request_state_${userId}`;
  } catch {
    return `request_state_${token.slice(-10)}`;
  }
};

// ==================== هيكل البيانات المحفوظة ====================
interface SavedRequestState {
  currentStep: number;
  selectedCarId: string | null;
  issueDescription: string;
  requestType: number;
  serviceMode: number;
  serviceType: number | null;
  scheduledDate: string;
  scheduledTime: string;
  location: { lat: number; lng: number } | null;
  requestId: string | null;
  timeLeft: number;
  phase: "waiting" | "expanding" | "cancelled";
  acceptedMechanics: any[];
  selectedImagePreview: string | null;
  isFromChatbot: boolean;
  chatbotData: any;
  savedAt: number; // timestamp للحصول على العمر
}

const MaintenanceRequest = () => {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const themedSwal = Swal.mixin({
    background: dark ? "#0B1220" : "#ffffff",
    color: dark ? "#ffffff" : "#1f2937",
    confirmButtonColor: "#137FEC",
  });

  // ==================== الـ States ====================
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carsLoading, setCarsLoading] = useState(true);
  const [cars, setCars] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [phase, setPhase] = useState<"waiting" | "expanding" | "cancelled">("waiting");
  const [acceptedMechanics, setAcceptedMechanics] = useState<any[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [issueDescription, setIssueDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [requestType, setRequestType] = useState(1);
  const [serviceMode, setServiceMode] = useState(2);
  const [serviceType, setServiceType] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pendingCarId, setPendingCarId] = useState<string | null>(null);
  const [isFromChatbot, setIsFromChatbot] = useState(false);
  const [chatbotData, setChatbotData] = useState<any>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
 const [stateRestored, setStateRestored] = useState(false); // مهم جداً


  const [requestCompleted, setRequestCompleted] = useState(false);

  const selectedCar = cars.find(c => c.id === selectedCarId);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const inputStyle = "w-full bg-[#137FEC1A] dark:bg-[#137FEC33] border border-blue-500/20 rounded-xl p-2.5 text-sm text-right outline-none dark:text-white focus:border-blue-500 transition-all";
  const sectionTitleStyle = "text-lg font-bold mb-4 dark:text-white text-gray-800 text-right";

  // ==================== 1. استرجاع الحالة المحفوظة ====================
  useEffect(() => {
    const storageKey = getCustomerKey();
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      setStateRestored(true);
      return;
    }

    try {
      const parsed: SavedRequestState = JSON.parse(saved);

      // التحقق من أن الحالة محفوظة منذ أقل من ساعة (60 دقيقة)
      const now = Date.now();
      const savedAge = now - (parsed.savedAt || 0);
      const maxAge = 60 * 60 * 1000; // ساعة واحدة

      if (savedAge > maxAge) {
        // الحالة قديمة، نحذفها ونبدأ من جديد
        localStorage.removeItem(storageKey);
        setStateRestored(true);
        return;
      }

      // استرجاع كل القيم
      if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      if (parsed.selectedCarId) {
        setPendingCarId(parsed.selectedCarId);
        setSelectedCarId(parsed.selectedCarId);
      }
      if (parsed.issueDescription) setIssueDescription(parsed.issueDescription);
      if (parsed.requestType) setRequestType(parsed.requestType);
      if (parsed.serviceMode) setServiceMode(parsed.serviceMode);
      if (parsed.serviceType !== null && parsed.serviceType !== undefined) setServiceType(parsed.serviceType);
      if (parsed.scheduledDate) setScheduledDate(parsed.scheduledDate);
      if (parsed.scheduledTime) setScheduledTime(parsed.scheduledTime);
      if (parsed.location) setLocation(parsed.location);
      if (parsed.requestId) setRequestId(parsed.requestId);
      if (parsed.timeLeft) setTimeLeft(parsed.timeLeft);
      if (parsed.phase) setPhase(parsed.phase);
      if (parsed.acceptedMechanics?.length) setAcceptedMechanics(parsed.acceptedMechanics);
      if (parsed.selectedImagePreview) setSelectedImagePreview(parsed.selectedImagePreview);
      if (parsed.isFromChatbot) setIsFromChatbot(parsed.isFromChatbot);
      if (parsed.chatbotData) setChatbotData(parsed.chatbotData);

      console.log("✅ تم استرجاع حالة الطلب المحفوظة:", parsed.currentStep === 2 ? "مرحلة الانتظار" : "الفورم");

    } catch (err) {
      console.error("خطأ في استرجاع الحالة:", err);
      localStorage.removeItem(storageKey);
    }

    setStateRestored(true);
  }, []);

  // ==================== 2. حفظ الحالة تلقائياً عند أي تغيير ====================
  useEffect(() => {
    // لا نحفظ حتى يتم تحميل الحالة السابقة أولاً
    if (!stateRestored) return;

    // لا نحفظ حالة الفورم الفارغة (الخطوة 1 بدون بيانات)
    if (currentStep === 1 && !selectedCarId && !issueDescription && !requestId) {
      return;
    }

    const storageKey = getCustomerKey();
    const stateToSave: SavedRequestState = {
      currentStep,
      selectedCarId,
      issueDescription,
      requestType,
      serviceMode,
      serviceType,
      scheduledDate,
      scheduledTime,
      location,
      requestId,
      timeLeft,
      phase,
      acceptedMechanics,
      selectedImagePreview, // نحفظ الـ preview فقط (الـ File لا يمكن حفظه)
      isFromChatbot,
      chatbotData,
      savedAt: Date.now(),
    };

    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
  }, [
    stateRestored,
    currentStep,
    selectedCarId,
    issueDescription,
    requestType,
    serviceMode,
    serviceType,
    scheduledDate,
    scheduledTime,
    location,
    requestId,
    timeLeft,
    phase,
    acceptedMechanics,
    selectedImagePreview,
    isFromChatbot,
    chatbotData,
  ]);

  // ==================== 3. دالة مسح الحالة المحفوظة ====================
  const clearSavedState = () => {
    const storageKey = getCustomerKey();
    localStorage.removeItem(storageKey);
    console.log("🗑️ تم مسح حالة الطلب المحفوظة");
  };

  // ==================== التايمر ====================
  useEffect(() => {
    // if (currentStep !== 2) return;
    if (currentStep !== 2 || requestCompleted) return;

    const timer = setInterval(() => {
      if (acceptedMechanics.length > 0) return;

      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;

        if (phase === "waiting") {
          themedSwal.fire({
            title: "جاري توسيع دائرة البحث 🔍",
            text: "لم يتم العثور على ميكانيكي",
            icon: "info",
            background: dark ? "#0B1220" : "#ffffff",
            color: dark ? "#ffffff" : "#1f2937",
            confirmButtonColor: "#137FEC",
          });
          setPhase("expanding");
          return 300;
        }

        if (phase === "expanding") {
          if (acceptedMechanics.length === 0) {
            themedSwal.fire({
              title: "تم إلغاء الطلب ❌",
              text: "لم يتم العثور على ميكانيكي",
              icon: "error",
              background: dark ? "#0B1220" : "#ffffff",
              color: dark ? "#ffffff" : "#1f2937",
              confirmButtonColor: "#137FEC",
            });
            setPhase("cancelled");
          }
          return 0;
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, phase, acceptedMechanics, dark]);

  // ==================== جلب السيارات ====================
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = sessionStorage.getItem("userToken");
        const response = await fetch("https://gearupapp.runasp.net/api/requests/cars", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data && data.cars) {
          setCars(data.cars);
          // لا نغير selectedCarId هنا لو كان مسترجعاً من الحالة المحفوظة
          if (!selectedCarId && data.cars.length > 0) {
            setSelectedCarId(data.cars[0].id);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCarsLoading(false);
      }
    };
    fetchCars();
  }, []); // eslint-disable-line

  // ==================== التأكد من أن السيارة المختارة موجودة ====================
  useEffect(() => {
    if (!pendingCarId) return;
    const carExists = cars.find((c) => c.id === pendingCarId);
    if (carExists) {
      setSelectedCarId(pendingCarId);
    }
  }, [cars, pendingCarId]);

  // ==================== Chatbot Data ====================
  useEffect(() => {
    // لا نقرأ من chatbot_request لو الحالة مسترجعة بالفعل
    if (stateRestored && currentStep !== 1) return;

    const stored = localStorage.getItem("chatbot_request");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setIsFromChatbot(true);
    setChatbotData(parsed);

    if (parsed.car_id) setPendingCarId(parsed.car_id);
    if (parsed.issue_summary) setIssueDescription(parsed.issue_summary);

    setRequestType(1);
    setServiceMode(1);
    setServiceType(1);
    getMyLocation();

    localStorage.removeItem("chatbot_request");
  }, [stateRestored]); // eslint-disable-line

  // ==================== استماع لقبول الميكانيكي ====================
  useEffect(() => {
    const handleMechanicAccepted = () => {
      const stored = localStorage.getItem("accepted_mechanic");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed.requestId === requestId) {
        // logic if needed
      }
    };

    window.addEventListener("mechanicAccepted", handleMechanicAccepted);
    handleMechanicAccepted();
    return () => window.removeEventListener("mechanicAccepted", handleMechanicAccepted);
  }, [requestId]);

  // ==================== جلب الميكانيكيين المقبولين ====================
  useEffect(() => {
    if (!requestId || currentStep !== 2) return;

    const token = sessionStorage.getItem("userToken");

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://gearupapp.runasp.net/api/requests/${requestId}/accepted-mechanics`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          const data = await res.json();
          let mechanics: any[] = [];
          if (Array.isArray(data)) mechanics = data;
          else if (Array.isArray(data?.mechanics)) mechanics = data.mechanics;
          else if (Array.isArray(data?.data)) mechanics = data.data;
          setAcceptedMechanics(mechanics);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [requestId, currentStep]);

  // ==================== تحديد الموقع ====================
  const getMyLocation = () => {
    if (!navigator.geolocation) return Swal.fire("خطأ", "المتصفح لا يدعم الموقع", "error");
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setGettingLocation(false);
      },
      () => { setGettingLocation(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ==================== رفع الصورة ====================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ==================== التحقق ====================
  const isStepOneValid =
    cars.length > 0 &&
    selectedCarId &&
    issueDescription.trim() &&
    location &&
    (requestType === 1 || (scheduledDate && scheduledTime));

  const validateStepOne = () => {
    return (
      !!selectedCarId &&
      issueDescription.trim().length > 0 &&
      !!location &&
      (requestType === 1 || (scheduledDate && scheduledTime))
    );
  };

  // ==================== إرسال الطلب ====================
  const handleSubmitRequest = async () => {
    if (!validateStepOne()) return;

    if (requestType === 2) {
      // const selectedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      const now = new Date();
    
      const selectedDate = new Date(scheduledDate);
      const today = new Date();
    
      // صفّر الوقت عشان نقارن تاريخ بس
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
    
      // 1) لو التاريخ في الماضي
      if (selectedDate < today) {
        themedSwal.fire({
          icon: "error",
          title: "تاريخ غير صالح",
          text: "لا يمكن اختيار تاريخ في الماضي",
        });
        return;
      }
    
      // 2) لو نفس اليوم → قارن الوقت
      if (selectedDate.getTime() === today.getTime()) {
        const selectedTime = scheduledTime.split(":").map(Number);
        const nowTime = now.getHours() * 60 + now.getMinutes();
        const chosenTime = selectedTime[0] * 60 + selectedTime[1];
    
        if (chosenTime < nowTime) {
          themedSwal.fire({
            icon: "error",
            title: "الوقت غير صالح ⏰",
            text: "الوقت المختار قد تم تجاوزه، اختر وقتًا لاحقًا",
          });
          return;
        }
      }
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem("userToken");
      const formData = new FormData();

      formData.append("CarId", selectedCarId!);
      formData.append("IssueDescription", issueDescription);
      if (imageFile) formData.append("ProblemPhoto", imageFile);
      formData.append("RequestType", requestType.toString());
      formData.append("ServiceMode", serviceMode.toString());
      if (serviceType !== null) formData.append("ServiceType", serviceType.toString());

      if (requestType === 2) {
        formData.append("ScheduledDate", scheduledDate);
        formData.append("ScheduledTime", scheduledTime);
      }

      if (location) {
        formData.append("Latitude", location.lat.toString());
        formData.append("Longitude", location.lng.toString());
      }

      if (isFromChatbot && chatbotData?.recommended_mechanics?.length) {
        chatbotData.recommended_mechanics.forEach((id: string) => {
          formData.append("MechanicIds", id);
        });
      }

      const url = isFromChatbot
        ? "https://gearupapp.runasp.net/api/requests/chatbot"
        : "https://gearupapp.runasp.net/api/requests";

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.removeItem("accepted_mechanic");

        const selectedCar = cars.find((c) => c.id === selectedCarId);
        const newNotification = {
          title: requestType === 1 ? "طلب صيانة طارئ 🚨" : requestType === 2 ? "طلب صيانة مجدول 📅" : "طلب صيانة",
          isRequest: true,
          carName: `${selectedCar?.brand} ${selectedCar?.model}`,
          requestDetail:
            requestType === 1
              ? serviceMode === 1
                ? "طريقة تلقي الخدمة: ميكانيكي متنقل إليك"
                : "طريقة تلقي الخدمة: ذهاب للورشة"
              : `الموعد: ${scheduledDate} الساعة ${scheduledTime}`,
          description: issueDescription,
          time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
          requestId: responseData.id || "N/A",
        };

        const storageKeyNotif = `notifications_${token?.slice(-10)}`;
        const savedNotifications = JSON.parse(localStorage.getItem(storageKeyNotif) || "[]");
        localStorage.setItem(storageKeyNotif, JSON.stringify([newNotification, ...savedNotifications]));
        window.dispatchEvent(new Event("storage"));

        const newRequestId = responseData.requestId || responseData.id;
        setRequestId(newRequestId);

        // ⭐ الانتقال للخطوة 2 - سيتم حفظها تلقائياً عبر الـ useEffect
        setCurrentStep(2);

        Swal.fire({
          title: "تم إرسال طلبك بنجاح",
          icon: "success",
          background: dark ? "#0B1220" : "#ffffff",
          color: dark ? "#ffffff" : "#1f2937",
          confirmButtonColor: "#137FEC",
        });
      } else {
        themedSwal.fire("خطأ", "فشل الإرسال، تأكد من البيانات", "error");
      }
    } catch (err) {
      console.error(err);
      // Swal.fire("خطأ", "فشل الاتصال بالسيرفر", "error");
      themedSwal.fire("خطأ", "فشل الاتصال بالسيرفر", "error");
    } finally {
      setLoading(false);
    }
  };

  // ==================== اختيار الميكانيكي ====================
  const handleSelectMechanic = async (mechanicUserId: string) => {
    try {
      const token = sessionStorage.getItem("userToken");

      const res = await fetch(
        `https://gearupapp.runasp.net/api/requests/${requestId}/select-mechanic/${mechanicUserId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        // ⭐ مسح الحالة المحفوظة لأن الطلب اكتمل

        setRequestCompleted(true);


        clearSavedState();


        // setAcceptedMechanics([]);
        // setPhase("waiting");
        // setCurrentStep(1);

        setAcceptedMechanics([]);
setPhase("waiting");

// تصفير كل بيانات الفورم
setCurrentStep(1);
setSelectedCarId(cars.length > 0 ? cars[0].id : null);
setIssueDescription("");
setImageFile(null);
setSelectedImagePreview(null);
setRequestId(null);
setRequestType(1);
setServiceMode(2);
setServiceType(null);
setScheduledDate("");
setScheduledTime("");
setLocation(null);
setTimeLeft(300);
setIsFromChatbot(false);
setChatbotData(null);

        Swal.fire({
          title: "تم اختيار الميكانيكي بنجاح",
          icon: "success",
          background: dark ? "#0B1220" : "#ffffff",
          color: dark ? "#ffffff" : "#1f2937",
          confirmButtonColor: "#137FEC",
        });



        // if (requestId) {
        //   navigate(`/Customer/Maintenance_request/request_tracking/${requestId}`);
        // }

        if (requestId) {
          setTimeout(() => {
            navigate(`/Customer/Maintenance_request/request_tracking/${requestId}`);
          }, 100);
        }

      } else {
        Swal.fire("خطأ", "فشل اختيار الميكانيكي", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("خطأ", "مشكلة في الاتصال", "error");
    }
  };

  // ==================== زر بدء طلب جديد (للإلغاء) ====================
  const handleStartNewRequest = () => {
    clearSavedState();
    setCurrentStep(1);
    setSelectedCarId(cars.length > 0 ? cars[0].id : null);
    setIssueDescription("");
    setImageFile(null);
    setSelectedImagePreview(null);
    setRequestId(null);
    setRequestType(1);
    setServiceMode(2);
    setServiceType(null);
    setScheduledDate("");
    setScheduledTime("");
    setLocation(null);
    setTimeLeft(300);
    setPhase("waiting");
    setAcceptedMechanics([]);
    setIsFromChatbot(false);
    setChatbotData(null);
  };

  // ==================== JSX ====================
  return (
    <div className="flex h-screen overflow-hidden dark:bg-primary_BGD" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
          {currentStep === 1 ? (
            <div className="space-y-5 animate-in fade-in duration-500">
              {/* اختيار السيارة */}
              <section>
                <h3 className={sectionTitleStyle}>اختر مركبة</h3>

                {carsLoading ? (
                  <div className="text-gray-400 text-sm">جاري تحميل السيارات...</div>
                ) : cars.length === 0 ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-4 rounded-xl text-center">
                    <p className="text-yellow-700 dark:text-yellow-400 font-bold text-sm">لا يوجد سيارات مضافة 🚗</p>
                    <p className="text-xs text-gray-500 mt-1">قم بإضافة سيارة أولاً حتى تتمكن من إرسال طلب صيانة</p>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className={`${inputStyle} flex items-center justify-between p-5 border-2 ${
                        isOpen ? "border-blue-500" : "border-blue-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {selectedCar ? (
                          <div className="flex items-center gap-4">
                            <img src={selectedCar.carPhotoUrl} className="w-16 h-12 object-cover rounded-xl" alt="" />
                            <div className="flex flex-col text-right">
                              <span className="text-xl font-black dark:text-white">{selectedCar.brand} {selectedCar.model}</span>
                              <span className="text-xs text-gray-500">{selectedCar.plateNumber}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">اختر سيارة...</span>
                        )}
                      </div>
                      <FaChevronDown className="text-blue-500 text-xl" />
                    </button>

                    {isOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1F2937] border-2 border-blue-500/20 rounded-[25px] shadow-2xl overflow-hidden">
                        {cars.map((car) => (
                          <div
                            key={car.id}
                            onClick={() => {
                              setSelectedCarId(car.id);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-blue-600/10 cursor-pointer border-b border-gray-100 dark:border-gray-700"
                          >
                            <img src={car.carPhotoUrl} className="w-12 h-10 object-cover rounded-lg" alt="" />
                            <div className="text-right flex-1">
                              <p className="font-bold dark:text-white">{car.brand} {car.model}</p>
                              <p className="text-xs text-gray-500">{car.plateNumber}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* نوع الخدمة */}
              <section>
                <h3 className={sectionTitleStyle}>نوع الخدمة</h3>
                <div className="grid grid-cols-2 gap-8">
                  <button
                    onClick={() => setRequestType(1)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                      requestType === 1
                        ? "bg-blue-500 border-blue-500 text-white shadow-md transform scale-105"
                        : "bg-white dark:bg-[#1F2937] border-gray-200 dark:border-transparent text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-400 dark:hover:shadow-lg"
                    }`}
                  >
                    <FaExclamationTriangle size={16} />
                    <p className="font-black text-xs">طارئة</p>
                    <p className="text-[10px] font-medium">إصلاح في الحال</p>
                  </button>
                  <button
                    onClick={() => setRequestType(2)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                      requestType === 2
                        ? "bg-blue-500 border-blue-500 text-white shadow-md transform scale-105"
                        : "bg-white dark:bg-[#1F2937] border-gray-200 dark:border-transparent text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-400 dark:hover:shadow-lg"
                    }`}
                  >
                    <MdCalendarToday size={20} />
                    <p className="font-black text-sm">مجدولة</p>
                    <p className="text-[10px] font-medium">حجز موعد لاحق</p>
                  </button>
                </div>
              </section>

              {/* الصندوق المتغير + الخريطة */}
              <div className="bg-white dark:bg-[#137FEC0D] p-3 rounded-2xl border border-blue-500/10 shadow-sm space-y-8">
                {requestType === 1 ? (
                  <section className="animate-in slide-in-from-right duration-300">
                    <h3 className={sectionTitleStyle}>أين الميكانيكي؟</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setServiceMode(2)}
                        className={`flex-1 p-4 rounded-xl font-bold border-2 ${
                          serviceMode === 2 ? "bg-blue-500 text-white border-blue-500" : "bg-transparent border-blue-500/20 dark:text-white"
                        }`}
                      >
                        في الورشة
                      </button>
                      <button
                        onClick={() => setServiceMode(1)}
                        className={`flex-1 p-4 rounded-xl font-bold border-2 ${
                          serviceMode === 1 ? "bg-blue-500 text-white border-blue-500" : "bg-transparent border-blue-500/20 dark:text-white"
                        }`}
                      >
                        متنقل إليك
                      </button>
                    </div>
                  </section>
                ) : (
                  <section className="animate-in slide-in-from-left duration-300">
                    <h3 className={sectionTitleStyle}>متى الموعد؟</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className={inputStyle} />
                      <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className={inputStyle} />
                    </div>
                  </section>
                )}

                <section>
                  <h3 className={sectionTitleStyle}>تحديد الموقع</h3>
                  <div
                    className={`relative w-full h-40 rounded-[25px] overflow-hidden border-2 transition-all duration-500 ${
                      location ? "border-blue-500 shadow-lg" : "border-dashed border-blue-500/20 bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    {location ? (
                      <>
                        {isLoaded && location && (
                          <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={location} zoom={15}>
                            <Marker
                              position={location}
                              icon={{ url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
                            />
                          </GoogleMap>
                        )}
                      </>
                    ) : (
                      <button onClick={getMyLocation} className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg">
                          <MdLocationOn size={24} className={gettingLocation ? "animate-bounce" : ""} />
                        </div>
                        <p className="font-black text-xs text-blue-600">
                          {gettingLocation ? "جاري التحديد..." : "اضغط لتحديد موقعك"}
                        </p>
                      </button>
                    )}
                  </div>
                </section>
              </div>

              {/* وصف المشكلة */}
              <section className="space-y-4">
                <h3 className={sectionTitleStyle}>تفاصيل العطل</h3>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="اكتب وصفاً للمشكلة..."
                  className={inputStyle + " min-h-[70px]"}
                />
                <div className="flex justify-between items-center bg-white dark:bg-[#1F2937] p-4 rounded-2xl border border-blue-500/10">
                  <label htmlFor="imgUp" className="flex items-center gap-2 cursor-pointer text-blue-500 font-bold text-sm">
                    <MdImage size={20} /> إرفاق صورة
                  </label>
                  <input type="file" id="imgUp" className="hidden" onChange={handleImageChange} />
                  {selectedImagePreview && <img src={selectedImagePreview} className="w-12 h-10 rounded object-cover border border-blue-500" alt="" />}
                </div>
              </section>

              {/* تصنيف العطل */}
              <section>
                <h3 className={sectionTitleStyle}>تصنيف العطل</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { t: "تشخيص", icon: <FaWrench size={24} />, v: 1 },
                    { t: "إطارات", icon: <GiCarWheel size={24} />, v: 2 },
                    { t: "جسم", icon: <MdDirectionsCar size={24} />, v: 3 },
                    { t: "زيت", icon: <FaOilCan size={24} />, v: 4 },
                  ].map((s) => (
                    <div
                      key={s.v}
                      onClick={() => setServiceType(s.v)}
                      className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all border-2 ${
                        serviceType === s.v
                          ? "bg-blue-500 border-blue-500 text-white shadow-lg transform scale-105"
                          : "bg-white dark:bg-[#1F2937] border-gray-200 dark:border-transparent text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-400 dark:hover:shadow-lg"
                      }`}
                    >
                      {s.icon}
                      <span className="text-[10px] font-bold">{s.t}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-10 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  disabled={!isStepOneValid || loading}
                  onClick={handleSubmitRequest}
                  className={`w-full py-4 rounded-2xl font-black text-xl shadow-xl transition-all ${
                    isStepOneValid ? "bg-[#137FEC] text-white" : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {loading ? "جاري الإرسال..." : "ارسال الطلب"}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-left duration-500">
              <div className="mb-6 mt-6 w-full text-right">
                {/* {acceptedMechanics.length > 0 ? ( */}
                {!requestCompleted && (
  acceptedMechanics.length > 0 ? (
                  <div className="space-y-4">
                    <h2 className="font-bold text-lg dark:text-white">الميكانيكيين الذين قبلوا الطلب</h2>
                    {acceptedMechanics.map((m: any) => (
                      <div
                        key={m.mechanicUserId}
                        className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-2xl shadow-lg border border-blue-500/10 p-4 transition-all hover:shadow-xl"
                      >
                        <div className="flex items-center gap-3">
                          {m.profilePhotoUrl ? (
                            <img src={m.profilePhotoUrl} alt="mechanic" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                              <User className="text-gray-500 dark:text-gray-300" size={24} />
                            </div>
                          )}
                          <div className="text-right flex-1">
                            <p className="dark:text-white font-bold text-base">👨‍🔧 {m.firstName} {m.lastName}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <span>📞 {m.phoneNumber}</span>
                            </p>
                            {m.distanceKm !== undefined && <p className="text-[10px] text-blue-400 mt-1">📍 {m.distanceKm} كم</p>}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {(() => {
                            let specs = Array.isArray(m.specializations) ? m.specializations : [];
                            if (specs.length === 0 && typeof m.specializations === "string") specs = [m.specializations];
                            if (specs.length === 0 && m.specialization) specs = [m.specialization];
                            if (specs.length > 0) {
                              return specs.map((spec: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-[9px] md:text-[10px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800"
                                >
                                  {typeof spec === "string" ? spec : spec.name || spec}
                                </span>
                              ));
                            }
                            return <span className="text-[10px] text-gray-400 dark:text-gray-500">غير محدد</span>;
                          })()}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl text-center border border-blue-100 dark:border-blue-800">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1">السعر المقترح</span>
                            <span className="font-bold text-green-600 dark:text-green-400 text-sm block">
                              {m.price > 0 ? `${m.price} ج.م` : "جاري التحديد"}
                            </span>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-xl text-center border border-yellow-100 dark:border-yellow-800 flex flex-col items-center justify-center">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-1">التقييم</span>
                            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                              <FaStar className="text-xs" />
                              <span>{m.averageStars || 0}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">({m.totalRatings || 0})</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectMechanic(m.mechanicUserId)}
                          className="mt-4 w-full bg-[#137FEC] hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-md"
                        >
                          اختيار الميكانيكي
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-right space-y-2">
                    {!isFromChatbot && phase === "cancelled" ? (
                      <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="bg-white dark:bg-[#1F2937] border border-red-500/20 rounded-2xl shadow-2xl p-8 text-center max-w-md w-full space-y-4">
                          <p className="text-red-500 text-2xl font-black mb-2">تم إلغاء الطلب ❌</p>
                          <p className="text-gray-500 dark:text-gray-300 text-sm">لم يتم العثور على ميكانيكي</p>
                          {/* ⭐ زر بدء طلب جديد */}
                          <button
                            onClick={handleStartNewRequest}
                            className="mt-4 px-6 py-3 bg-[#137FEC] hover:bg-blue-600 text-white rounded-xl font-bold transition-all"
                          >
                            بدء طلب جديد
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-500">في انتظار قبول ميكانيكي...</p>
                        <div className="flex items-center justify-center min-h-[300px]">
                          <div className="relative flex flex-col items-center justify-center w-64 h-64 rounded-full bg-white dark:bg-[#1F2937] shadow-2xl border-4 border-blue-500/20">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 animate-pulse"></div>
                            <div className="text-center z-10">
                              <p className="text-6xl font-black text-blue-500">
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                              </p>
                              <p className="text-sm text-gray-400 mt-2 font-semibold">وقت الانتظار</p>
                            </div>
                          </div>
                        </div>
                        {phase === "expanding" && <p className="text-orange-500 text-xs font-bold">جاري توسيع دائرة البحث...</p>}
                      </>
                    )}
                  </div>
              ))
}
              </div>
              <div className="mt-[400px] pt-8 border-t border-gray-200 dark:border-gray-700 w-full" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MaintenanceRequest;