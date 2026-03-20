
import React , { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import axios from "axios";

import LandingPage from "./pages/Landing/landing";
import Register from "./pages/Registration/register";
import LogIn from "./pages/LogIn/log_in";
import ForgotPassword from "./pages/Forgot_Password/forgot_password";
import VerifyAccount from "./pages/Verfiy_Account/verfiy_account";
import ResetPassword from "./pages/Reset_Password/reset_password";
import AdminProfile from "./pages/Admin/Admin_profile";
import SupervisorManagement from "./pages/Admin/supervisor_management";
import AddSupervisor from "./pages/Admin/add_supervisor";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import UsersManagement from "./pages/Admin/UsersManagement/UsersManagement";
import MechanicsManagement from "./pages/Admin/MechanicsManagement/MechanicsManagement";
import BookingManagement from "./pages/Admin/BookingManagement/BookingManagement";
import BookingDetails from "./pages/Admin/BookingManagement/BookingDetails";
import CitiesManagement from "./pages/Admin/CitiesManagement/CitiesManagement";
import Reviews from "./pages/Admin/Reviews/Reviews";
import ServicesManagement from "./pages/Admin/ServicesManagement/ServicesManagement";
import NotificationsManagement from "./pages/Admin/NotificationsManagement/NotificationsManagement";
import UserProfile from "./pages/Admin/UserProfile/UserProfile";
import MechanicProfile from "./pages/Admin/MechanicProfile/MechanicProfile";
import CustomerDashBoard from "./pages/Customer/Control_Panel/control_panel";
import MaintenanceReminders from "./pages/Customer/Reminder/maintenance_reminders";
import ServiceHistory from "./pages/Customer/service_history";
import ProfileSettings from "./pages/Customer/Profile_Settings/profile_settings";
import MaintenanceRequest from "./pages/Customer/Maintenance_Request/maintenance_request";
import MaintenanceBookings from "./pages/Customer/Maintenance_Bookings/maintenance_bookings";
import AddBookingModel from "./pages/Customer/Maintenance_Bookings/add_booking_modal";
import RescheduleModal from "./pages/Customer/Maintenance_Bookings/reschedule_modal";
import CancelBookingModal from "./pages/Customer/Maintenance_Bookings/cancel_booking_modal";
import MachineDashboard from "./pages/Mechanics/MachineDashboard/MachineDashboard";
import Reviewing from "./pages/Mechanics/Reviewing/Reviewing";
import Booking from "./pages/Mechanics/Booking/Booking";
import Schedule from "./pages/Mechanics/Schedule/Schedule";
import MBookingDetails from "./pages/Mechanics/Booking/MBookingDetails";
import Mprofile from "./pages/Mechanics/Msettings/Mprofile";
import Mechine_profile from "./pages/Mechanics/Msettings/Mechine_profile";
import Notification from "./pages/Notification/Notification";
import Chatbot from "./pages/Customer/Chatbot/chatbot";
const App: React.FC = () => {
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error("انتهت الجلسة، جاري التوجيه للوجين...");
          sessionStorage.removeItem("userToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    // الـ cleanup function عشان نشيل الـ interceptor لما الـ app يتقفل
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
  return (
    <ThemeProvider>

<Toaster 
        position="top-center"
        toastOptions={{
          style: { borderRadius: '16px', background: '#333', color: '#fff' },
        }}
      />

      <ToastContainer 
      style={{ zIndex: 99999 }}
  position="top-left"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={true} // تم التعديل ليكون True عشان الجديد يظهر فوق
  closeOnClick
  rtl={true} 
  pauseOnFocusLoss
  draggable
  pauseOnHover
  limit={5} // اختيار اختياري: بيسمح بظهور 5 إشعارات فوق بعض كحد أقصى عشان الزحمة
  theme="colored" // اختياري: بيخلي لون التوست أوضح (أزرق للـ info)
/>



      <Router>
        <Routes>
          {/* CUSTOMER PAGES */}
          <Route path="/customer/dashboard" element={<CustomerDashBoard />} />
          <Route path="/customer/reminders" element={<MaintenanceReminders />} />
          <Route path="/customer/servicehistory" element={<ServiceHistory />} />
          <Route path="/customer/maintenancerequest" element={<MaintenanceRequest />} />
          <Route path="/customer/profilesettings" element={<ProfileSettings />} />
          <Route path="/customer/maintenancebookings" element={<MaintenanceBookings />} />
          <Route path="/add-booking" element={<AddBookingModel isOpen={true} onClose={() => { window.location.href = '/customer/maintenancebookings'; }} />} />
          <Route path="/reschedule-booking" element={<RescheduleModal isOpen={true} onClose={() => { window.location.href = '/customer/maintenancebookings'; }} />} />
          <Route path="/cancel-booking" element={<CancelBookingModal isOpen={true} onClose={() => { window.location.href = '/customer/maintenancebookings'; }} />} />
          <Route path="/customer/chatbot" element={<Chatbot />} />
          {/* PUBLIC PAGES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/*Machinc pages */}
          <Route path="/mechanics/machinedashboard" element={<MachineDashboard/>} />
          <Route path="/mechanics/reviewing" element={<Reviewing/>} />
          <Route path="/mechanics/schedule" element={<Schedule/>} />
          <Route path="/mechanics/booking" element={<Booking/>} />
          <Route path="/mechanics/booking/mbookingdetails/:id"element={<MBookingDetails />}/>
          <Route path="/mechanics/mprofile" element={<Mprofile />} />
          <Route path="/mechanics/machineprofile" element={<Mechine_profile  />} />

          <Route path="/notification" element={<Notification />} />
          {/* ADMIN PAGES */}
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/admindashboard" element={<AdminDashboard />} />
          <Route path="/admin/supervisormanagement" element={<SupervisorManagement />} />
          <Route path="/admin/usersmanagement" element={<UsersManagement />} />
          <Route path="/admin/mechanicsmanagement" element={<MechanicsManagement />} />
          <Route path="/admin/bookingmanagement" element={<BookingManagement />} /> 
          <Route path="/admin/bookingdetails" element={<BookingDetails />} /> 
          <Route path="/admin/citiesmanagement" element={<CitiesManagement />} />
          <Route path="/admin/userprofile" element={<UserProfile />} />
          <Route path="/admin/mechanicprofile" element={<MechanicProfile />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          <Route path="/admin/services" element={<ServicesManagement />} />
          <Route path="/admin/notificationsmanagement" element={<NotificationsManagement />} />
          <Route path="/admin/addsupervisor" element={<AddSupervisor dark={false} onClose={function (): void {
            throw new Error("Function not implemented.");
          } } />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;