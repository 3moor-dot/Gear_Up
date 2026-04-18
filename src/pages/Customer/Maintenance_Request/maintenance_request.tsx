
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdImage, MdLocationOn } from "react-icons/md";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import { useTheme } from "../../../contexts/ThemeContext";
import { FaChevronDown } from "react-icons/fa";
import Swal from "sweetalert2";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const MaintenanceRequest = () => {
    const { dark } = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [carsLoading, setCarsLoading] = useState(true);
    const [cars, setCars] = useState<any[]>([]);

    const [timeLeft, setTimeLeft] = useState(300); // 5 دقائق
const [phase, setPhase] = useState<"waiting" | "expanding" | "cancelled">("waiting");

const [acceptedMechanics, setAcceptedMechanics] = useState<any[]>([]);


// const [acceptedMechanicName, setAcceptedMechanicName] = useState<string | null>(null);


useEffect(() => {
    if (currentStep !== 2) return;
  
    const timer = setInterval(() => {
      // ⛔ لو فيه ميكانيكي خلاص نوقف كل حاجة
      if (acceptedMechanics.length > 0) return;
  
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
  
        // ⛔ خلص الوقت
        if (phase === "waiting") {
        //   Swal.fire({
        //     title: "جاري توسيع دائرة البحث 🔍",
        //     text: "لم يتم العثور على ميكانيكي",
        //     icon: "info",
        //   });
        Swal.fire({
            title: "جاري توسيع دائرة البحث 🔍",
            text: "لم يتم العثور على ميكانيكي",
            icon: "info",
            background: dark ? "#0B1220" : "#ffffff",
            color: dark ? "#ffffff" : "#1f2937",
            confirmButtonColor: "#137FEC"
          });
  
          setPhase("expanding");
          return 300;
        }
  
        if (phase === "expanding") {
          // ⛔ مهم: نتأكد تاني قبل الإلغاء
          if (acceptedMechanics.length === 0) {
            // Swal.fire({
            //   title: "تم إلغاء الطلب ❌",
            //   text: "لم يتم العثور على ميكانيكي",
            //   icon: "error",
            // });
            Swal.fire({
                title: "تم إلغاء الطلب ❌",
                text: "لم يتم العثور على ميكانيكي",
                icon: "error",
                background: dark ? "#0B1220" : "#ffffff",
                color: dark ? "#ffffff" : "#1f2937",
                confirmButtonColor: "#137FEC"
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


//   useEffect(() => {
//     if (acceptedMechanics.length > 0) {
//       setTimeLeft(0);
//     }
//   }, [acceptedMechanics]);


    // --- بيانات الطلب ---
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
    const [issueDescription, setIssueDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
    const [requestId, setRequestId] = useState<string | null>(null);

    const [requestType, setRequestType] = useState(1); // Emergency=1, Scheduled=2
    const [serviceMode, setServiceMode] = useState(2); // MechanicComes=1, CustomerGoes=2
    // const [serviceType, setServiceType] = useState(1);
    const [serviceType, setServiceType] = useState<number | null>(null);

    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const selectedCar = cars.find(c => c.id === selectedCarId);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  

    const navigate = useNavigate();

    useEffect(() => {
        console.log("LOCATION:", location);
    }, [location]);


    useEffect(() => {
        const handleMechanicAccepted = () => {
          const stored = localStorage.getItem("accepted_mechanic");
      
          if (!stored) return;
      
          const parsed = JSON.parse(stored);
      
          // 👇 أهم شرط
          if (parsed.requestId === requestId) {
            // setAcceptedMechanicName(parsed.name);
          }
        };
      
        window.addEventListener("mechanicAccepted", handleMechanicAccepted);
      
        handleMechanicAccepted();
      
        return () => {
          window.removeEventListener("mechanicAccepted", handleMechanicAccepted);
        };
      }, [requestId]);

    useEffect(() => {
        const token = sessionStorage.getItem("userToken");
    
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));

            console.log("FULL PAYLOAD:", payload);
            
            const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            
            console.log("ROLE:", role);
        }
    }, []);


        useEffect(() => {
            // if (!requestId) return;
            if (!requestId || currentStep !== 2) return;
    
        const token = sessionStorage.getItem("userToken");
    
        const interval = setInterval(async () => {
            try {
                const res = await fetch(
                    `https://gearupapp.runasp.net/api/requests/${requestId}/accepted-mechanics`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    


                if (res.ok) {

                    const data = await res.json();

                    console.log("MECHANICS RESPONSE:", data);
                    

let mechanics: any[] = [];

if (Array.isArray(data)) {
  mechanics = data;
} else if (Array.isArray(data?.mechanics)) {
  mechanics = data.mechanics;
} else if (Array.isArray(data?.data)) {
  mechanics = data.data;
}

console.log("FINAL MECHANICS:", mechanics);

setAcceptedMechanics(mechanics);

                }

            } catch (err) {
                console.error(err);
            }
        }, 5000);
    
        return () => clearInterval(interval);
    }, [requestId, currentStep]);


    const [gettingLocation, setGettingLocation] = useState(false);

    const inputStyle = "w-full bg-[#137FEC1A] dark:bg-[#137FEC33] border-2 border-blue-500/20 rounded-2xl p-4 text-right outline-none dark:text-white focus:border-blue-500 transition-all";
    const sectionTitleStyle = "text-lg font-bold mb-4 dark:text-white text-gray-800 text-right";

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBX8_y6ZtDBv722QljpxUubkpQQQG4sTQ0",
    });

    const isStepOneValid =
        selectedCarId &&
        issueDescription.trim() &&
        location &&
        (requestType === 1 || (scheduledDate && scheduledTime));

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const token = sessionStorage.getItem('userToken');
                console.log("TOKEN:", token);
                const response = await fetch("https://gearupapp.runasp.net/api/requests/cars", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data && data.cars) {
                    setCars(data.cars);
                    if (data.cars.length > 0) setSelectedCarId(data.cars[0].id);
                }
            } catch (error) { console.error(error); } finally { setCarsLoading(false); }
        };
        fetchCars();
    }, []);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setSelectedImagePreview(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };

    const validateStepOne = () => {
        return (
            !!selectedCarId &&
            issueDescription.trim().length > 0 &&
            !!location &&
            (requestType === 1 || (scheduledDate && scheduledTime))
        );
    };

    const handleSubmitRequest = async () => {
        console.log("LOCATION BEFORE SEND:", location); 
        if (!validateStepOne()) return;
    
        setLoading(true);
        try {
            const token = sessionStorage.getItem('userToken');
            const formData = new FormData();
    
            formData.append("CarId", selectedCarId!);
            formData.append("IssueDescription", issueDescription);
            if (imageFile) formData.append("ProblemPhoto", imageFile);
          
            formData.append("RequestType", requestType.toString());
              
            formData.append("ServiceMode", serviceMode.toString());
            if (serviceType !== null) {
                formData.append("ServiceType", serviceType.toString());
            }
    
            if (requestType === 2) {
                formData.append("ScheduledDate", scheduledDate);
                formData.append("ScheduledTime", scheduledTime);
            }
    
            if (location) {
           
                formData.append("Latitude", location.lat.toString());
formData.append("Longitude", location.lng.toString());
            }

    
            const response = await fetch("https://gearupapp.runasp.net/api/requests", {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
    
            
            if (response.ok) {
                const responseData = await response.json();

localStorage.removeItem("accepted_mechanic");
// setAcceptedMechanicName(null);

                console.log("FULL RESPONSE:", responseData);

                const selectedCar = cars.find(c => c.id === selectedCarId);
            
                const newNotification = {
  
title:
  requestType === 1
    ? "طلب صيانة طارئ 🚨"
    : requestType === 2
    ? "طلب صيانة مجدول 📅"
    : "طلب صيانة",

                    isRequest: true,
                    carName: `${selectedCar?.brand} ${selectedCar?.model}`,
                    requestDetail: requestType === 1 
                    ? (serviceMode === 1 ? "طريقة تلقي الخدمة: ميكانيكي متنقل إليك" : "طريقة تلقي الخدمة: ذهاب للورشة")
                        : `الموعد: ${scheduledDate} الساعة ${scheduledTime}`,
                    description: issueDescription,
                    time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
                    // requestId: responseData.id || "N/A"
                    requestId: responseData.id || "N/A"
                };
            
                const storageKey = `notifications_${token?.slice(-10)}`;
                const savedNotifications = JSON.parse(localStorage.getItem(storageKey) || "[]");
                localStorage.setItem(storageKey, JSON.stringify([newNotification, ...savedNotifications]));
            
                window.dispatchEvent(new Event("storage"));
            
            
const newRequestId = responseData.requestId || responseData.id;

setRequestId(newRequestId);
console.log("REQUEST ID AFTER SET:", responseData.requestId || responseData.id);

                // Swal.fire("تم إرسال طلبك بنجاح ");
                Swal.fire({
                    title: "تم إرسال طلبك بنجاح",
                    icon: "success",
                    background: dark ? "#0B1220" : "#ffffff",
                    color: dark ? "#ffffff" : "#1f2937",
                    confirmButtonColor: "#137FEC"
                  });
                // ✅ الانتقال التلقائي للخطوة 2
                 setCurrentStep(2);
            }

            else {
                Swal.fire("خطأ", "فشل الإرسال، تأكد من البيانات", "error");
            }
        } 
        // catch (error) {
        //     Swal.fire("خطأ", "فشل الاتصال بالسيرفر", "error");
        // } 
        catch (err) {
            console.error(err);
            Swal.fire("خطأ", "فشل الاتصال بالسيرفر", "error");
        }
        finally {
            setLoading(false);
        }
    };


    const handleSelectMechanic = async (mechanicUserId: string) => {
        try {
          const token = sessionStorage.getItem("userToken");
      
          const res = await fetch(
            `https://gearupapp.runasp.net/api/requests/${requestId}/select-mechanic/${mechanicUserId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          if (res.ok) {
            // Swal.fire("تم اختيار الميكانيكي بنجاح ✅");
            Swal.fire({
                title: "تم اختيار الميكانيكي بنجاح",
                icon: "success",
                background: dark ? "#0B1220" : "#ffffff",
                color: dark ? "#ffffff" : "#1f2937",
                confirmButtonColor: "#137FEC"
              });
            console.log("NAVIGATING WITH ID:", requestId);
            // ✅ هنا بقى التنقل
            if (requestId) {
            navigate(`/Customer/Maintenance_request/request_tracking/${requestId}`);}
      
          } else {
            Swal.fire("خطأ", "فشل اختيار الميكانيكي", "error");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("خطأ", "مشكلة في الاتصال", "error");
        }
      };



    return (
       <div className="flex h-screen overflow-hidden dark:bg-primary_BGD" dir="rtl">
  <Sidebar />
  <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
    <Header />
    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">

                    {currentStep === 1 ? (
                        <div className="space-y-10 animate-in fade-in duration-500">

                            {/* 1. اختيار السيارة */}
                            <section>
                                <h3 className={sectionTitleStyle}>اختر مركبة</h3>
                                <div className="relative">
                                    <button onClick={() => !carsLoading && setIsOpen(!isOpen)} className={`${inputStyle} flex items-center justify-between p-5 border-2 ${isOpen ? 'border-blue-500' : 'border-blue-500/20'}`}>
                                        <div className="flex items-center gap-4">
                                      

{selectedCar ? (
    <div className="flex items-center gap-4">
        <img
            src={selectedCar.carPhotoUrl}
            className="w-16 h-12 object-cover rounded-xl"
            alt=""
        />
        <div className="flex flex-col text-right">
            <span className="text-xl font-black dark:text-white">
                {selectedCar.brand} {selectedCar.model}
            </span>
            <span className="text-xs text-gray-500">
                {selectedCar.plateNumber}
            </span>
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
                                            {cars.map(car => (
                                                <div key={car.id} onClick={() => { setSelectedCarId(car.id); setIsOpen(false); }} className="flex items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-blue-600/10 cursor-pointer border-b border-gray-100 dark:border-gray-700">
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
                            </section>

                            {/* 2. نوع الخدمة */}
                            <section>
                                <h3 className={sectionTitleStyle}>نوع الخدمة</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setRequestType(1)} className={`p-6 rounded-2xl border-2 transition-all ${requestType === 1 ? 'border-blue-500 bg-blue-500/10 shadow-md' : 'border-transparent bg-white dark:bg-[#1F2937]'}`}>
                                        <p className="font-black text-xl dark:text-white">🚨 طارئة</p>
                                        <p className="text-xs text-gray-500 mt-1">إصلاح في الحال</p>
                                    </button>
                                    <button onClick={() => setRequestType(2)} className={`p-6 rounded-2xl border-2 transition-all ${requestType === 2 ? 'border-blue-500 bg-blue-500/10 shadow-md' : 'border-transparent bg-white dark:bg-[#1F2937]'}`}>
                                        <p className="font-black text-xl dark:text-white">📅 مجدولة</p>
                                        <p className="text-xs text-gray-500 mt-1">حجز موعد لاحق</p>
                                    </button>
                                </div>
                            </section>

                            {/* 3. الصندوق المتغير + الخريطة */}
                            <div className="bg-white dark:bg-[#137FEC0D] p-6 rounded-[30px] border border-blue-500/10 shadow-sm space-y-8">
                                {requestType === 1 ? (
                                    <section className="animate-in slide-in-from-right duration-300">
                                        <h3 className={sectionTitleStyle}>أين الميكانيكي؟</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => setServiceMode(2)} className={`flex-1 p-4 rounded-xl font-bold border-2 ${serviceMode === 2 ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent border-blue-500/20 dark:text-white'}`}>في الورشة</button>
                                            <button onClick={() => setServiceMode(1)} className={`flex-1 p-4 rounded-xl font-bold border-2 ${serviceMode === 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent border-blue-500/20 dark:text-white'}`}>متنقل إليك</button>
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
                                    <div className={`relative w-full h-64 rounded-[25px] overflow-hidden border-2 transition-all duration-500 ${location ? 'border-blue-500 shadow-lg' : 'border-dashed border-blue-500/20 bg-gray-50 dark:bg-gray-800'}`}>
                                        {location ? (
                                            <>
                                            

{isLoaded && location && (
  <GoogleMap
    mapContainerStyle={{ width: "100%", height: "100%" }}
    center={location}
    zoom={15}
  >
    <Marker
      position={location}
      icon={{
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
      }}
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
                                <textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} placeholder="اكتب وصفاً للمشكلة..." className={inputStyle + " min-h-[100px]"} />
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
                                <div className="grid grid-cols-4 gap-3">
                                    {[{ t: "تشخيص", i: "🛠️", v: 1 }, { t: "إطارات", i: "🛞", v: 2 }, { t: "جسم", i: "🔨", v: 3 }, { t: "زيت", i: "🛢️", v: 4 }].map(s => (
                                        <div key={s.v} onClick={() => setServiceType(s.v)} className={`p-4 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all border-2 ${serviceType === s.v ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white dark:bg-[#1F2937] border-transparent dark:text-white'}`}>
                                            <span className="text-xl">{s.i}</span>
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
                                    className={`w-full py-4 rounded-2xl font-black text-xl shadow-xl transition-all
                                    ${isStepOneValid ? "bg-[#137FEC] text-white" : "bg-gray-300 cursor-not-allowed"}`}
                                >
                                    {loading ? "جاري الإرسال..." : "ارسال الطلب"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-left duration-500">


<div className="mb-6 mt-6 w-full text-right">

{acceptedMechanics.length > 0 ? (
  <div className="space-y-4">
    <h2 className="font-bold text-lg dark:text-white">
      الميكانيكيين الذين قبلوا الطلب
    </h2>


{acceptedMechanics.map((m: any) => (
  <div
    key={m.mechanicUserId}
    className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-2xl shadow-lg border border-blue-500/10 p-4"
  >
    {/* Header */}
    <div className="flex items-center gap-3">
      <img
        src={m.profilePhotoUrl}
        alt="mechanic"
        className="w-12 h-12 rounded-full object-cover border"
      />

      <div className="text-right flex-1">
        <p className="dark:text-white font-bold text-sm">
          👨‍🔧 {m.firstName} {m.lastName}
        </p>

        <p className="text-xs text-gray-500">
          📞 {m.phoneNumber}
        </p>
      </div>
    </div>

    {/* Status */}
    <p className="text-green-500 text-xs mt-3 font-bold text-right">
      تم قبول الطلب ✅
    </p>

    {/* Button */}
    <button
      onClick={() => handleSelectMechanic(m.mechanicUserId)}
      className="mt-4 w-full bg-[#137FEC] hover:bg-blue-600 text-white py-2 rounded-xl text-sm font-bold transition-all"
    >
      اختيار الميكانيكي
    </button>
  </div>
))}

  </div>
) 

: (

<div className="text-right space-y-2">

{/* {phase === "cancelled" ? (
  <p className="text-red-500 font-bold text-lg">
    تم إلغاء الطلب ❌
  </p>
) : ( */}

{phase === "cancelled" ? (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="bg-white dark:bg-[#1F2937] border border-red-500/20 rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
      
      <p className="text-red-500 text-2xl font-black mb-2">
        تم إلغاء الطلب ❌
      </p>

      <p className="text-gray-500 dark:text-gray-300 text-sm">
        لم يتم العثور على ميكانيكي
      </p>

    </div>
  </div>
) : (

  <>
    <p className="text-gray-500">
      في انتظار قبول ميكانيكي...
    </p>

        <div className="flex items-center justify-center min-h-[300px]">
  <div className="relative flex flex-col items-center justify-center w-64 h-64 rounded-full bg-white dark:bg-[#1F2937] shadow-2xl border-4 border-blue-500/20">
    
    {/* دائرة خلفية خفيفة */}
    <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 animate-pulse"></div>

    {/* العد التنازلي */}
    <div className="text-center z-10">
      <p className="text-6xl font-black text-blue-500">
        {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </p>
      <p className="text-sm text-gray-400 mt-2 font-semibold">
        وقت الانتظار
      </p>
    </div>
  </div>
</div>

    {phase === "expanding" && (
      <p className="text-orange-500 text-xs font-bold">
        جاري توسيع دائرة البحث...
      </p>
    )}
  </>
)}

</div>
)}

   </div>


<div className="mt-[400px] pt-8 border-t border-gray-200 dark:border-gray-700 w-full" />


{/* <div className="flex justify-start mt-12 pb-60"> 
  <button
    onClick={() => setCurrentStep(1)}
    className="bg-gray-500 hover:bg-gray-600 text-white px-20 py-4 rounded-2xl font-black shadow-2xl transition-all"
  >
    رجوع
  </button>
</div> */}

</div>
                     
                    )}
                </main>
            </div>
        </div>
    );
};

export default MaintenanceRequest;