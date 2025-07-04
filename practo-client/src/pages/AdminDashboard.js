import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/api";
import "../styles/AdminDashboard.css"; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
      localStorage.removeItem('user');  
      sessionStorage.removeItem('user');

      navigate('/login'); 
      window.location.reload();
  };

  const handleDelete = async () => {
      const confirm = window.confirm("Are you sure you want to delete your account?");
      if (!confirm) return;
  
      try {
        await API.delete(`/admin/${user.id}`, { withCredentials: true });
        localStorage.removeItem('user');  
        sessionStorage.removeItem('user');
        navigate("/home");
        window.location.reload();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    };

  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
        <div className="sidebar-buttons">
          <button
              className="sidebar-button"
              onClick={() => navigate("/admin")}
            >
            My Profile
          </button>
          <button
              className="sidebar-button"
              onClick={() => navigate("/admin/add-admin")}
            >
            Add Admin
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/admin/admin-list")}
          >
            View All Admins
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/admin/add")}
          >
            Add Doctor
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/admin/doctor-list")}
          >
            View All Doctors
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/admin/user-list")}
          >
            View All Users
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/admin/appointment-list")}
          >
            View All Appointments
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/admin/generate-report")}
          >
            See Reports
          </button>
          <button className="sidebar-button" onClick={handleLogout} style={{backgroundColor: "white", color: "black"}}>Logout</button>
          <button className="sidebar-button" onClick={handleDelete} style={{backgroundColor: "#c61919", color: "white"}}>Delete My Account</button>
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
