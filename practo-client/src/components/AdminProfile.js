import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/spinner.css";
import "../styles/ProfilePage.css"

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user.id) return;

      try {
        const res = await API.get(`/users/${user.id}`, { withCredentials: true });
        setUserData(res.data);
        setFormData({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          phone: res.data.phone,
          gender: res.data.gender,
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [user]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setChangePasswordMode(false);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await API.put(`/users/${user.id}`, formData, { withCredentials: true });
      setUserData({ ...userData, ...formData });
      setEditMode(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update user:", err);
      setMessage("Failed to update profile.");
    }
  };

  const handleChangePasswordToggle = () => {
        setChangePasswordMode(!changePasswordMode);
        setEditMode(false);
        setMessage("");
      };
    
      const handlePasswordInputChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
      };
    
      const handleChangePassword = async () => {
        const { oldPassword, newPassword, confirmNewPassword } = passwordData;
      
        if (!oldPassword || !newPassword || !confirmNewPassword) {
          setMessage("Please fill all password fields.");
          return;
        }
      
        if (newPassword !== confirmNewPassword) {
          setMessage("New passwords do not match.");
          return;
        }
      
        try {
          const res = await API.put(
            `/admin/${user.id}/change-password`,
            { oldPassword, newPassword },
            { withCredentials: true }
          );
      
          // Show message and logout after short delay
          setMessage("Password changed successfully. Logging out...");
      
          setTimeout(() => {
            localStorage.removeItem('user');  
            sessionStorage.removeItem('user'); 
            window.location.href = "/login";
            // logout();    
            //navigate("/login");   // Redirect to login page
          }, 1500); // wait 1.5 seconds before logout
      
        } catch (err) {
          console.error("Failed to change password:", err);
          setMessage("Failed to change password. Check old password.");
        }
      };

  if (!userData) return <div className="spinner"></div>;

  return (
    <>
      <style>{`
        .profile-container {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }
  
        .profile-box {
          width: 100%;
          max-width: 600px;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          margin-left: 500px;
          margin-top: 200px;
        }
  
        .profile-box h3 {
          margin-bottom: 20px;
          text-align: center;
          color: #333;
        }
  
        .profile-box label {
          display: block;
          font-weight: bold;
          margin-top: 15px;
          font-size: large;
        }
  
        .profile-box input{
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
        }

        .profile-box select{
          width: 103%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          background: white;
        }
  
        .form-btn {
          margin-top: 20px;
          margin-right: 10px;
          padding: 10px 20px;
          font-size: 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
        }
  
        .form-button.save {
          background-color: #28a745;
        }
  
        .form-button.cancel {
          background-color: #6c757d;
        }
  
        .form-btn.edit {
          background-color: #007bff;
        }
  
        .form-btn.change-password {
          background-color: #ff9800;
        }
  
        .profile-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
      `}</style>
  
  <div className="profile-box">
        {editMode ? (
          <>
            <h2 className="book-appointment-title">Edit Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', alignItems: 'center', marginLeft: '100px'}}>
              <label>First Name:</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} style={{width: '250px'}}/>

              <label>Last Name:</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} style={{width: '250px'}}/>

              <label>Phone:</label>
              <input name="phone" value={formData.phone} onChange={handleChange} style={{width: '250px'}}/>

              <label>Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={{width: '270px', background: 'white'}}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <label>Email:</label>
              <input value={userData.email} readOnly disabled style={{width: '250px'}}/>
            </div>
            <button className="form-button save" onClick={handleSave}>Save</button>
            <button className="form-button cancel" onClick={handleEditToggle} style={{backgroundColor: "#c61919", color: "white"}}>Cancel</button>
          </>
        ) : changePasswordMode ? (
          <>
          <h2 className="book-appointment-title">Change Password</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', alignItems: 'center', marginLeft: '100px'}}>
            <label>Old Password:</label>
            <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordInputChange} style={{width: '250px'}}/>
            <label>New Password:</label>
            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} style={{width: '250px'}}/>
            <label>Confirm New Password:</label>
            <input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordInputChange} style={{width: '250px'}}/>
          </div>
            <button onClick={handleChangePassword}>Change Password</button>
            <button className="form-button cancel" onClick={handleChangePasswordToggle} style={{backgroundColor: "#c61919", color: "white"}}>Cancel</button>
          </>
        ) : (
          <>
          <h2 className="book-appointment-title">Admin Details</h2>
          <div className="doctor-info-grid">
            <div className="label-column">
              <p>First Name:</p>
              <p>Last Name:</p>
              <p>Email:</p>
              <p>Phone:</p>
              <p>Gender:</p>
            </div>
            <div className="value-column">
              <p>{userData.firstName}</p>
              <p>{userData.lastName}</p>
              <p>{userData.email}</p>
              <p>{userData.phone}</p>
              <p>{userData.gender}</p>
            </div>
          </div>
            <button onClick={handleEditToggle}>Edit Profile</button>
            <button onClick={handleChangePasswordToggle}>Change Password</button>
          </>
        )}
      </div>
    </>
  );
};  

export default AdminProfile;
