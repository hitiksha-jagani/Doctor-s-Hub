import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.js";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword";
import DoctorList from "./pages/DoctorList";
import DoctorForm from "./components/AddDoctorForm"
import DoctorDetails from "./pages/DoctorDetails";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminLayout from "./AdminLayout";
import { AuthProvider } from "./context/AuthContext";
import ProfileDetails from "./pages/ProfilePage";
import BookAppointmentForm from "./components/BookAppointmentForm";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import RescheduleAppointment from './components/RescheduleAppointment';
import AdminProfile from './components/AdminProfile.js';
import AddAdmin from './components/AddAdmin.js';
import AdminLogin from './components/AdminLogin.js';
import AdminDetails from './components/AdminDetails.js';
import UsersDetails from './components/AllUsers.js';
import AppointmentDetails from './components/AllAppointments.js';
import GenerateReport from './components/GenerateReport.js';
import GenerateAppointmentReport from "./components/GenerateAppointmentReport.js";

function App() {
  return (
    <AuthProvider> 
      <Router>
      <div className="App">
        {window.location.pathname.startsWith('/admin') ? null : <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />

          {/* Pages */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/profile" element={<ProfileDetails />} />
          <Route path="/doctors/:id/appointment" element={<BookAppointmentForm />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/reschedule/:id" element={<RescheduleAppointment />} />
          
          {/* Admin dashboard */}
          {/* Admin protected routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route path="" element={<AdminDashboard />}>
              <Route index element={<AdminProfile />} />
              <Route path="admin-login" element={<AdminLogin />} />
              <Route path="add-admin" element={<AddAdmin />} />
              <Route path="add" element={<DoctorForm />} />
              <Route path="admin-list" element={<AdminDetails />} />
              <Route path="doctor-list" element={<DoctorDetails />} />
              <Route path="user-list" element={<UsersDetails />} />
              <Route path="appointment-list" element={<AppointmentDetails />} />
              <Route path="generate-report" element={<GenerateReport />} />
                <Route path="generate-appointment-report" element={<GenerateAppointmentReport />} />
            </Route>
          </Route>
          
          {/* Fallback for 404 */}
          <Route path="*" element={<div style={{ textAlign: 'center' }}><h2>404: Page Not Found</h2></div>} />
          
        </Routes></div>
      </Router>
    </AuthProvider>
  );
}

export default App;
