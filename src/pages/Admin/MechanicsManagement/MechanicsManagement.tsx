
import React, { useEffect, useState, useMemo } from "react";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import NotificationBell from "../../../components/NotificationBell/notification_bell";
import ThemeToggle from "../../../components/ThemeToggle/theme_toggle";
import {
  FaEye,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useTheme } from "../../../contexts/ThemeContext";

// Types
interface ApiMechanic {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: number;
  registeredAt: string;
}

interface ApiMechanicDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePhotoUrl: string | null;
  accountStatus: number;
  isEmailConfirmed: boolean;
  isPhoneConfirmed: boolean;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
  isVerified: boolean; // هذا هو الحقل الذي سيتم تحديثه
  supportsFieldVisit: boolean;
  workStartTime: string | null;
  workEndTime: string | null;
  createdAt: string;
  updatedAt: string;
}

type MechanicStatus =
  | "Active"
  | "Pending"
  | "Frozen"
  | "Rejected"
  | "Disabled";

interface MechanicDisplay {
  id: string;
  name: string;
  status: MechanicStatus;
  statusLabel: string;
  phone: string;
  email: string;
  regDate: string;
}

interface LocationInfo {
  country?: string;
  governorate?: string;
}

// --- Custom UI Components for Alerts & Modals ---

interface ToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  dark: boolean;
  onClose: () => void;
}

const NotificationToast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl transition-all duration-300 ${
        isSuccess
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      } animate-bounce-in`}
    >
      {isSuccess ? (
        <FaCheckCircle className="text-lg" />
      ) : (
        <FaExclamationTriangle className="text-lg" />
      )}
      {/* تم إزالة الإيموجي من هنا لتفادي التكرار مع الأيقونة أعلاه */}
      <span className="font-medium text-sm md:text-base">{message}</span>
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  dark: boolean;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  dark,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal Content */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all scale-100 ${
          dark ? "bg-[#0d1629] border border-gray-700" : "bg-white border border-gray-100"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-full ${dark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <FaShieldAlt size={20} />
          </div>
          <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
        </div>

        <p className={`text-sm mb-6 leading-relaxed whitespace-pre-line ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dark
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التنفيذ...
              </>
            ) : (
              <>تأكيد</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const MechanicsManagement: React.FC = () => {
  const { dark } = useTheme();

  const [allMechanics, setAllMechanics] = useState<MechanicDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [selectedMechanic, setSelectedMechanic] =
    useState<MechanicDisplay | null>(null);

  const [mechanicDetails, setMechanicDetails] =
    useState<ApiMechanicDetails | null>(null);

  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Custom Notification & Confirm States ---
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "",
    type: "success",
    visible: false,
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, visible: true });
  };

  const openConfirm = (title: string, message: string, action: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: action,
    });
  };

  const closeConfirm = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // -------------------------

  const fetchMechanicDetails = async (id: string) => {
    setLoadingDetails(true);
    setLocationInfo(null);
    setLocationError("");

    const token = sessionStorage.getItem("userToken");

    try {
      const response = await fetch(
        `https://gearupapp.runasp.net/api/admin/mechanics/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data: ApiMechanicDetails = await response.json();
        setMechanicDetails(data);
      } else {
        console.error("Failed to fetch mechanic details");
        showToast("فشل تحميل التفاصيل", "error");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      showToast("خطأ في الاتصال", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  // دالة التحقق من المستند بالذكاء الاصطناعي (تم تعديلها للاستبدال)
  const executeVerifyDocument = async () => {
    if (!selectedMechanic) return;
    const token = sessionStorage.getItem("userToken");

    setIsVerifying(true);
    
    try {
      const response = await fetch(
        "https://gearupapp.runasp.net/api/admin/verify-document",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: new URLSearchParams({ mechanic_id: selectedMechanic.id }),
        }
      );

      const result = await response.json();
      console.log("Verification Result:", result);

      if (response.ok && result.success && result.data.isApproved) {
        // تم إزالة الإيموجي من هنا
        showToast("تم التحقق بنجاح! المستند سليم.", "success");

        // 1. تحديث الحالة محلياً
        if (mechanicDetails) {
          setMechanicDetails({ ...mechanicDetails, isVerified: true });
        }

        // 2. تفعيل الحساب
        await handleStatusChange("activate", true);
        closeConfirm(); 
      } else {
        // تم تغيير الرسالة الافتراضية وتنظيف الإيموجي
        let errorMessage = "لم يتم إرفاق صورة لرخصة ورشة";
        
        if (result.data && result.data.message) {
          try {
            const parsedMsg = JSON.parse(result.data.message);
            errorMessage = parsedMsg.detail || result.data.message;
          } catch {
            errorMessage = result.data.message;
          }
        } else if (result.data && result.data.aiFeedback) {
           errorMessage = result.data.aiFeedback;
        }

        // تم إزالة الإيموجي من هنا
        showToast(`فشل التحقق: ${errorMessage}`, "error");
        closeConfirm();
      }
    } catch (error) {
      console.error(error);
      showToast("خطأ في الاتصال بالسيرفر", "error");
      closeConfirm();
    } finally {
      setIsVerifying(false);
    }
  };

  // هذه الدالة تفتح المودال فقط بدلاً من confirm
  const handleVerifyClick = () => {
    openConfirm(
      " التحقق بالذكاء الاصطناعي",
      "التحقق من رخصة الورشة باستخدام الذكاء الاصطناعي\nإذا كانت الوثيقة سليمة سيتم توثيق الحساب وتفعيله تلقائياً.",
      executeVerifyDocument
    );
  };

  const fetchAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    if (!latitude || !longitude) {
      setLocationInfo(null);
      setLocationError("لا توجد إحداثيات متاحة");
      return;
    }

    setLoadingLocation(true);
    setLocationError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=ar`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const data = await response.json();
      const address = data?.address || {};

      const location: LocationInfo = {
        country: address.country || undefined,
        governorate:
          address.state ||
          address.governorate ||
          address.province ||
          undefined,
      };

      setLocationInfo(location);
    } catch (error) {
      console.error("Error converting coordinates to address:", error);
      setLocationInfo(null);
      setLocationError("تعذر تحديد العنوان من الإحداثيات");
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    const fetchMechanics = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("userToken");

      try {
        const response = await fetch(
          "https://gearupapp.runasp.net/api/admin/mechanics",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data: ApiMechanic[] = await response.json();

          const formattedData: MechanicDisplay[] = data.map((item) => {
            const statusInfo = mapStatus(item.status);

            return {
              id: item.id,
              name: `${item.firstName} ${item.lastName}`,
              status: statusInfo.status,
              statusLabel: statusInfo.label,
              phone: item.phone,
              email: item.email,
              regDate: formatDate(item.registeredAt),
            };
          });

          setAllMechanics(formattedData);
        } else {
          console.error("Failed to fetch mechanics");
          showToast("فشل جلب قائمة الميكانيكيين", "error");
        }
      } catch (error) {
        console.error("Error fetching mechanics:", error);
        showToast("خطأ في الشبكة", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  useEffect(() => {
    if (selectedMechanic) {
      fetchMechanicDetails(selectedMechanic.id);
    } else {
      setMechanicDetails(null);
      setLocationInfo(null);
      setLocationError("");
    }
  }, [selectedMechanic]);

  useEffect(() => {
    if (
      mechanicDetails &&
      typeof mechanicDetails.latitude === "number" &&
      typeof mechanicDetails.longitude === "number"
    ) {
      fetchAddressFromCoordinates(
        mechanicDetails.latitude,
        mechanicDetails.longitude
      );
    }
  }, [mechanicDetails]);

  const handleStatusChange = async (
    action: "activate" | "freeze" | "disable",
    skipRefetch: boolean = false
  ) => {
    if (!selectedMechanic) return;

    setUpdatingStatus(true);
    const token = sessionStorage.getItem("userToken");

    try {
      const response = await fetch(
        `https://gearupapp.runasp.net/api/admin/mechanics/${selectedMechanic.id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const newStatusMap = {
          activate: 1,
          freeze: 2,
          disable: 4,
        };

        const newStatusVal = newStatusMap[action];
        const statusInfo = mapStatus(newStatusVal);

        setAllMechanics((prev) =>
          prev.map((m) =>
            m.id === selectedMechanic.id
              ? {
                  ...m,
                  status: statusInfo.status,
                  statusLabel: statusInfo.label,
                }
              : m
          )
        );

        if (skipRefetch) {
          if (mechanicDetails) {
            setMechanicDetails({
              ...mechanicDetails,
              accountStatus: newStatusVal,
            });
          }
        } else {
          await fetchMechanicDetails(selectedMechanic.id);
        }
      } else {
        showToast("فشل تحديث الحالة، يرجى المحاولة مرة أخرى", "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("حدث خطأ أثناء الاتصال بالخادم", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const mapStatus = (status: number) => {
    if (status === 0) return { status: "Pending" as const, label: "معلق" };
    if (status === 1) return { status: "Active" as const, label: "نشط" };
    if (status === 2) return { status: "Frozen" as const, label: "مجمد" };
    if (status === 3) return { status: "Rejected" as const, label: "مرفوض" };
    if (status === 4) return { status: "Disabled" as const, label: "معطل" };

    return { status: "Rejected" as const, label: "مرفوض" };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStatusBadge = (
    status: boolean,
    labelTrue: string,
    labelFalse: string
  ) => {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
          status
            ? "bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-700/30 dark:text-gray-400"
        }`}
      >
        {status ? <FaCheckCircle /> : <FaTimesCircle />}
        {status ? labelTrue : labelFalse}
      </span>
    );
  };

  const tabs = useMemo(
    () => [
      { id: "all", label: "الكل", count: allMechanics.length },
      {
        id: "Active",
        label: "نشط",
        count: allMechanics.filter((m) => m.status === "Active").length,
      },
      {
        id: "Pending",
        label: "معلق",
        count: allMechanics.filter((m) => m.status === "Pending").length,
      },
      {
        id: "Frozen",
        label: "مجمد",
        count: allMechanics.filter((m) => m.status === "Frozen").length,
      },
      {
        id: "Rejected",
        label: "مرفوض",
        count: allMechanics.filter((m) => m.status === "Rejected").length,
      },
      {
        id: "Disabled",
        label: "معطل",
        count: allMechanics.filter((m) => m.status === "Disabled").length,
      },
    ],
    [allMechanics]
  );

  const filteredMechanics = useMemo(() => {
    return allMechanics.filter((m) => {
      const matchesTab = activeTab === "all" || m.status === activeTab;

      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm);

      return matchesTab && matchesSearch;
    });
  }, [allMechanics, activeTab, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const totalPages = Math.ceil(filteredMechanics.length / itemsPerPage);

  const paginatedMechanics = filteredMechanics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      Active:
        "bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-400",
      Pending:
        "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
      Rejected:
        "bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-400",
      Frozen:
        "bg-gray-200 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300",
      Disabled:
        "bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-400",
    };

    const label = tabs.find((t) => t.id === status)?.label || status;

    return (
      <span
        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
          colorMap[status] || "bg-gray-200 text-gray-600"
        }`}
      >
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div
        dir="rtl"
        className={`flex min-h-screen ${
          !dark ? "bg-gray-50" : "bg-[#0B1220]"
        }`}
      >
        <AdminSidebar />

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className={!dark ? "text-gray-600" : "text-gray-400"}>
              جاري تحميل الميكانيكيين...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`flex min-h-screen transition-colors duration-500 ${
        !dark ? "bg-gray-50 text-[#1E3A5F]" : "bg-[#0B1220] text-white"
      }`}
    >
      {/* Notification Toast Component */}
      <NotificationToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        dark={dark}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      {/* Confirm Modal Component */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirm}
        dark={dark}
        loading={isVerifying}
      />

      <AdminSidebar />

      <main className="flex-1 p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6 w-full overflow-x-hidden mt-12 lg:mt-0">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6">
          <h1
            className={`text-xl md:text-2xl lg:text-3xl font-bold ${
              !dark ? "text-black" : "text-white"
            }`}
          >
            إدارة الميكانيكيين
          </h1>

          <div className="flex items-center gap-3 md:gap-4 self-end sm:self-auto">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* SEARCH */}
        <div
          className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl ${
            !dark
              ? "bg-white shadow-md border border-gray-200"
              : "bg-[#0d1629] border border-gray-800"
          }`}
        >
          <FaSearch
            className={`text-base md:text-lg ${
              !dark ? "text-gray-400" : "text-gray-500"
            }`}
          />

          <input
            type="text"
            placeholder="البحث حسب الاسم أو البريد أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm md:text-base ${
              !dark ? "text-gray-900" : "text-white"
            } placeholder-gray-500`}
          />
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : !dark
                  ? "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  : "bg-[#0d1629] text-gray-300 hover:bg-[#131c2f] border border-gray-800"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredMechanics.length === 0 && (
          <div
            className={`text-center py-16 rounded-xl ${
              !dark ? "bg-white" : "bg-[#0d1629]"
            }`}
          >
            <p className={!dark ? "text-gray-500" : "text-gray-400"}>
              لا يوجد ميكانيكيين بهذا الفلتر
            </p>
          </div>
        )}

        {/* TABLE - Desktop */}
        {filteredMechanics.length > 0 && (
          <div
            className={`hidden md:block rounded-xl overflow-hidden ${
              !dark ? "bg-white shadow-xl" : "bg-[#0d1629]"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr
                    className={`text-right text-xs lg:text-sm ${
                      !dark
                        ? "bg-gray-50 text-gray-700"
                        : "bg-[#131c2f] text-gray-300"
                    }`}
                  >
                    <th className="p-3 lg:p-4 font-semibold">الميكانيكي</th>
                    <th className="p-3 lg:p-4 font-semibold">الحالة</th>
                    <th className="p-3 lg:p-4 font-semibold">رقم الهاتف</th>
                    <th className="p-3 lg:p-4 font-semibold">
                      البريد الإلكتروني
                    </th>
                    <th className="p-3 lg:p-4 font-semibold">تاريخ التسجيل</th>
                    <th className="p-3 lg:p-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedMechanics.map((mechanic) => (
                    <tr
                      key={mechanic.id}
                      className={`border-b transition-colors ${
                        !dark
                          ? "border-gray-200 hover:bg-gray-50"
                          : "border-gray-800 hover:bg-[#131c2f]"
                      }`}
                    >
                      <td className="p-3 lg:p-4 font-medium text-xs lg:text-sm">
                        {mechanic.name}
                      </td>

                      <td className="p-3 lg:p-4">
                        {getStatusBadge(mechanic.status)}
                      </td>

                      <td
                        className={`p-3 lg:p-4 text-xs lg:text-sm ${
                          !dark ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {mechanic.phone}
                      </td>

                      <td
                        className={`p-3 lg:p-4 text-xs lg:text-sm ${
                          !dark ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {mechanic.email}
                      </td>

                      <td
                        className={`p-3 lg:p-4 text-xs lg:text-sm ${
                          !dark ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {mechanic.regDate}
                      </td>

                      <td className="p-3 lg:p-4">
                        <button
                          onClick={() => setSelectedMechanic(mechanic)}
                          className="p-2 hover:bg-[#137FEC1A] rounded-full transition-colors"
                        >
                          <FaEye
                            size={18}
                            color={dark ? "#E5E7EB" : "#1E293B"}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION - DESKTOP */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t ${
                !dark ? "border-gray-200" : "border-gray-800"
              }`}
            >
              <span
                className={`text-xs md:text-sm ${
                  !dark ? "text-gray-600" : "text-gray-400"
                }`}
              >
                عرض {(currentPage - 1) * itemsPerPage + 1} إلى{" "}
                {Math.min(currentPage * itemsPerPage, filteredMechanics.length)}{" "}
                من {filteredMechanics.length} ميكانيكي
              </span>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-medium transition ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : !dark
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-[#131c2f] text-gray-300 hover:bg-[#1a2332]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CARDS - Mobile */}
        {filteredMechanics.length > 0 && (
          <div className="md:hidden space-y-3">
            {paginatedMechanics.map((mechanic) => (
              <div
                key={mechanic.id}
                className={`p-4 rounded-xl ${
                  !dark
                    ? "bg-white shadow-md border border-gray-200"
                    : "bg-[#0d1629] border border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">
                      {mechanic.name}
                    </h3>

                    <p
                      className={`text-xs ${
                        !dark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {mechanic.email}
                    </p>
                  </div>

                  {getStatusBadge(mechanic.status)}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className={dark ? "text-gray-400" : "text-gray-600"}>
                      الهاتف:
                    </span>
                    <span className="font-medium">{mechanic.phone}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className={dark ? "text-gray-400" : "text-gray-600"}>
                      التسجيل:
                    </span>
                    <span className="font-medium">{mechanic.regDate}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMechanic(mechanic)}
                  className="w-full py-2 text-center text-sm font-medium text-[#137FEC] hover:bg-[#137FEC1A] rounded-lg transition-colors"
                >
                  عرض التفاصيل
                </button>
              </div>
            ))}

            {/* PAGINATION - MOBILE */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : !dark
                        ? "bg-white text-gray-700 border border-gray-200"
                        : "bg-[#131c2f] text-gray-300 border border-gray-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* OVERLAY */}
      {selectedMechanic && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSelectedMechanic(null)}
        />
      )}

      {/* DRAWER - DETAILS VIEW */}
      <div
        dir="rtl"
        className={`fixed top-0 left-0 h-full w-full sm:w-[420px] z-50 shadow-2xl transition-transform duration-300 overflow-y-auto
          ${selectedMechanic ? "translate-x-0" : "-translate-x-full"}
          ${!dark ? "bg-white" : "bg-[#0d1629]"}
        `}
      >
        {/* Drawer Header */}
        <div
          className={`flex items-center justify-between p-5 border-b ${
            !dark ? "border-gray-200" : "border-gray-800"
          }`}
        >
          <h2 className="text-lg font-bold">تفاصيل الميكانيكي</h2>

          <button
            onClick={() => setSelectedMechanic(null)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition shrink-0 ${
              !dark
                ? "hover:bg-gray-100 text-gray-600"
                : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            ✕
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 space-y-5">
          {/* Loading State */}
          {loadingDetails && (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

              <p
                className={`text-sm ${
                  dark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                جاري تحميل البيانات...
              </p>
            </div>
          )}

          {/* Data Display */}
          {!loadingDetails && mechanicDetails && (
            <div className="space-y-5">
              {/* PROFILE CARD */}
              <div
                className={`rounded-xl p-4 border ${
                  !dark
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#131c2f] border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-600 flex-shrink-0">
                      {mechanicDetails.profilePhotoUrl ? (
                        <img
                          src={mechanicDetails.profilePhotoUrl}
                          alt="profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/150";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500">
                          {mechanicDetails.firstName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-lg font-bold truncate">
                        {mechanicDetails.firstName} {mechanicDetails.lastName}
                      </h3>

                      <p
                        className={`text-sm truncate ${
                          dark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {mechanicDetails.email}
                      </p>

                      <p
                        className={`text-sm truncate ${
                          dark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {mechanicDetails.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {getStatusBadge(
                      mapStatus(mechanicDetails.accountStatus).status
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-gray-200/50 dark:border-gray-800/50 flex flex-wrap gap-2">
  {renderStatusBadge(
    mechanicDetails.isAvailable,
    "متاح حالياً",
    "غير متاح"
  )}
</div>
              </div>

              {/* DOCUMENT VERIFICATION SECTION */}
              {mapStatus(mechanicDetails.accountStatus).status ===
                "Pending" && !mechanicDetails.isVerified && (
                <div
                  className={`rounded-xl p-4 border ${
                    !dark
                      ? "bg-blue-50 border-blue-200"
                      : "bg-blue-900/10 border-blue-800"
                  }`}
                >
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <FaShieldAlt className="text-blue-500" />
                    توثيق المستند بالذكاء الاصطناعي
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    سيقوم النظام بالتحقق من صورة رخصة الورشة المرفقة.
                    في حالة الموافقة التلقائية، سيتم تفعيل الحساب وتوثيقه.
                  </p>
                  <button
                    onClick={handleVerifyClick} // Changed to open modal
                    disabled={isVerifying || updatingStatus}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        جاري التحقق...
                      </>
                    ) : (
                      <>تحقق وموافقة</>
                    )}
                  </button>
                </div>
              )}

              {/* ACCOUNT ACTIONS */}
              {mapStatus(mechanicDetails.accountStatus).status !==
                "Disabled" && (
                <div
                  className={`rounded-xl p-4 border ${
                    !dark
                      ? "bg-white border-gray-200 shadow-sm"
                      : "bg-[#131c2f] border-gray-800"
                  }`}
                >
                  <h3 className="font-bold text-sm mb-3">تغيير حالة الحساب</h3>

                  <div className="grid grid-cols-3 gap-2">
                    {mapStatus(mechanicDetails.accountStatus).status === "Frozen" && (
                      <button
                        disabled={updatingStatus || loadingDetails || isVerifying}
                        onClick={() => handleStatusChange("activate")}
                        className="px-2 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors text-center"
                      >
                        تنشيط
                      </button>
                    )}

                    {mapStatus(mechanicDetails.accountStatus).status !==
                      "Frozen" && (
                      <button
                        disabled={updatingStatus || loadingDetails || isVerifying}
                        onClick={() => handleStatusChange("freeze")}
                        className="px-2 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors text-center"
                      >
                        تجميد
                      </button>
                    )}

                    {mapStatus(mechanicDetails.accountStatus).status !==
                      "Disabled" && (
                      <button
                        disabled={updatingStatus || loadingDetails || isVerifying}
                        onClick={() => handleStatusChange("disable")}
                        className="px-2 py-2 text-xs font-medium text-white bg-slate-600 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors text-center"
                      >
                        تعطيل
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Verification Details */}
              <div
                className={`rounded-xl p-4 space-y-2 ${
                  !dark
                    ? "bg-gray-50 border border-gray-200"
                    : "bg-[#131c2f] border-gray-800"
                }`}
              >
                <h3
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    !dark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  التحقق
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {renderStatusBadge(
                    mechanicDetails.isEmailConfirmed,
                    "البريد مؤكد",
                    "البريد غير مؤكد"
                  )}

                  {renderStatusBadge(
                    mechanicDetails.isPhoneConfirmed,
                    "الهاتف مؤكد",
                    "الهاتف غير مؤكد"
                  )}

                  {renderStatusBadge(
                    mechanicDetails.supportsFieldVisit,
                    "يدعم الزيارات",
                    "لا يدعم الزيارات"
                  )}
                </div>
              </div>

              {/* Work Times & Location */}
              <div
                className={`rounded-xl p-4 space-y-3 ${
                  !dark
                    ? "bg-gray-50 border border-gray-200"
                    : "bg-[#131c2f] border-gray-800"
                }`}
              >
                <h3
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    !dark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  العمل والموقع
                </h3>

                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                    <FaMapMarkerAlt />
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-gray-500">الموقع</p>

                    {loadingLocation ? (
                      <p className="text-sm text-gray-500">
                        جاري تحديد الموقع...
                      </p>
                    ) : locationInfo &&
                      (locationInfo.country || locationInfo.governorate) ? (
                      <div className="space-y-1">
                        <p className="font-medium">
                          {[locationInfo.country, locationInfo.governorate]
                            .filter(Boolean)
                            .join(" - ")}
                        </p>

                        <a
                          href={`https://www.google.com/maps?q=${mechanicDetails.latitude},${mechanicDetails.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-xs font-bold text-[#137FEC] hover:underline"
                        >
                          فتح الموقع على الخريطة
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {locationError && (
                          <p className="text-sm text-red-500">
                            {locationError}
                          </p>
                        )}

                        <a
                          href={`https://www.google.com/maps?q=${mechanicDetails.latitude},${mechanicDetails.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-xs font-bold text-[#137FEC] hover:underline"
                        >
                          فتح الموقع على الخريطة
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {mechanicDetails.workStartTime &&
                mechanicDetails.workEndTime ? (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                      <FaClock />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">أوقات العمل</p>
                      <p className="font-medium">
                        {mechanicDetails.workStartTime} -{" "}
                        {mechanicDetails.workEndTime}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <FaClock /> لم يتم تحديد أوقات العمل
                  </div>
                )}
              </div>

              {/* System Info */}
              <div
                className={`rounded-xl p-4 space-y-2 ${
                  !dark
                    ? "bg-gray-50 border border-gray-200"
                    : "bg-[#131c2f] border-gray-800"
                }`}
              >
                <h3
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    !dark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  النظام
                </h3>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ الإنشاء:</span>
                    <span>{formatDate(mechanicDetails.createdAt)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">آخر تحديث:</span>
                    <span>{formatDate(mechanicDetails.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MechanicsManagement;
