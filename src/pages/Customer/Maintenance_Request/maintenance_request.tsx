
import { useState, useEffect } from "react";
import { MdImage, MdLocationOn, MdMyLocation } from "react-icons/md";
import Sidebar from "../../../components/Customer/customer_sidebar";
import Header from "../../../components/Customer/customer_header";
import StepProgress from "./step_progress";
import MechanicSelection from "./mechanic_selection";
import Swal from "sweetalert2";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const MaintenanceRequest = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [carsLoading, setCarsLoading] = useState(true);
    const [cars, setCars] = useState<any[]>([]);

    // --- بيانات الطلب ---
    const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
    const [issueDescription, setIssueDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

    const [requestType, setRequestType] = useState(1); // Emergency=1, Scheduled=2
    const [serviceMode, setServiceMode] = useState(2); // MechanicComes=1, CustomerGoes=2
    const [serviceType, setServiceType] = useState(1);

    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");

    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        console.log("LOCATION:", location);
    }, [location]);

    const [gettingLocation, setGettingLocation] = useState(false);

    const inputStyle = "w-full bg-[#137FEC1A] dark:bg-[#137FEC33] border-2 border-blue-500/20 rounded-2xl p-4 text-right outline-none dark:text-white focus:border-blue-500 transition-all";
    const sectionTitleStyle = "text-lg font-bold mb-4 dark:text-white text-gray-800 text-right";

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyB6Cs-wIkTOJVWrGF6tQg26nvxXwnySROM",
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
            formData.append("ServiceType", serviceType.toString());
    
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
                const selectedCar = cars.find(c => c.id === selectedCarId);
            
                const newNotification = {
                    title: requestType === 1 ? "طلب صيانة طارئ 🚨" : "طلب صيانة مجدول 📅",
                    isRequest: true,
                    carName: `${selectedCar?.brand} ${selectedCar?.model}`,
                    requestDetail: requestType === 1 
                        ? (serviceMode === 1 ? "الوضع: ميكانيكي متنقل إليك" : "الوضع: ذهاب للورشة")
                        : `الموعد: ${scheduledDate} الساعة ${scheduledTime}`,
                    description: issueDescription,
                    time: new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }),
                    requestId: responseData.id || "N/A"
                };
            
                const storageKey = `notifications_${token?.slice(-10)}`;
                const savedNotifications = JSON.parse(localStorage.getItem(storageKey) || "[]");
                localStorage.setItem(storageKey, JSON.stringify([newNotification, ...savedNotifications]));
            
                window.dispatchEvent(new Event("storage"));
            
                Swal.fire("تم إرسال طلبك بنجاح وجاري إبلاغ الفنيين");
            
                // ✅ الانتقال التلقائي للخطوة 2
                setCurrentStep(2);
            }

            else {
                Swal.fire("خطأ", "فشل الإرسال، تأكد من البيانات", "error");
            }
        } catch (error) {
            Swal.fire("خطأ", "فشل الاتصال بالسيرفر", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen dark:bg-primary_BGD bg-gray-50" dir="rtl">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="p-4 md:p-8 mt-12 lg:mt-0 max-w-5xl mx-auto w-full pb-20 text-right">
                    {/* <StepProgress currentStep={currentStep} onStepChange={setCurrentStep} /> */}

                    {currentStep === 1 ? (
                        <div className="space-y-10 animate-in fade-in duration-500">

                            {/* 1. اختيار السيارة */}
                            <section>
                                <h3 className={sectionTitleStyle}>اختر مركبة</h3>
                                <div className="relative">
                                    <button onClick={() => !carsLoading && setIsOpen(!isOpen)} className={`${inputStyle} flex items-center justify-between p-5 border-2 ${isOpen ? 'border-blue-500' : 'border-blue-500/20'}`}>
                                        <div className="flex items-center gap-4">
                                            {selectedCarId ? (
                                                <>
                                                    <img src={cars.find(c => c.id === selectedCarId)?.carPhotoUrl} className="w-16 h-12 object-cover rounded-xl" alt="" />
                                                    <span className="text-xl font-black dark:text-white">{cars.find(c => c.id === selectedCarId)?.brand} {cars.find(c => c.id === selectedCarId)?.model}</span>
                                                </>
                                            ) : <span className="text-gray-400">اختر سيارة...</span>}
                                        </div>
                                        <MdMyLocation size={24} className="text-blue-500" />
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
                                                {/* {isLoaded && (
                                                    <GoogleMap
                                                        mapContainerStyle={{ width: "100%", height: "100%" }}
                                                        center={location}
                                                        zoom={15}
                                                    >
                                                        <Marker position={location} />
                                                    </GoogleMap>
                                                )} */}

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
                            <MechanicSelection />
                            <div className="flex justify-between mt-10">
                                <button onClick={() => setCurrentStep(1)} className="bg-gray-700 text-white px-12 py-3 rounded-xl font-bold">رجوع</button>
                                <button onClick={handleSubmitRequest} disabled={loading} className="bg-[#137FEC] text-white px-12 py-3 rounded-xl font-bold shadow-xl">
                                    {loading ? "جاري الإرسال..." : "تأكيد الطلب"}
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MaintenanceRequest;