import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/spinner.css";
import '../styles/BookAppointmentForm.css'; 
import "../styles/DoctorCard.css"
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [passwordTouched, setPasswordTouched] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user.id) return;
      fetchAppointments();

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

  const fetchAppointments = async () => {
    try {
      const res = await API.get(`/users/${user.id}/appointments`, { withCredentials: true });
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoadingAppointments(false);
    }
  };
  
  fetchAppointments();  

  const handleLogout = () => {
    // Clear session data from localStorage and sessionStorage
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate('/login');
    window.location.reload();
  };
  
  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 32;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || password.length > maxLength) {
      return "Password must be between 8 and 32 characters.";
    }
    if (!hasUpperCase) {
      return "Password must include at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must include at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must include at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must include at least one special character.";
    }
    return null; // No error
  };

  const passwordValidations = {
    length: passwordData.newPassword.length >= 8 && passwordData.newPassword.length <= 32,
    uppercase: /[A-Z]/.test(passwordData.newPassword),
    lowercase: /[a-z]/.test(passwordData.newPassword),
    number: /[0-9]/.test(passwordData.newPassword),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword),
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;

    try {
      await API.delete(`/users/${user.id}`, { withCredentials: true });
      localStorage.removeItem('user');  
      sessionStorage.removeItem('user');
      navigate("/home");
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

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

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      alert(passwordError);
      return;
    }
  
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
        `/users/${user.id}/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
  
      // Show message and logout after short delay
      setMessage("Password changed successfully. Logging out...");
  
      setTimeout(() => {
        localStorage.removeItem('user');  
        sessionStorage.removeItem('user');          // Clear auth context / localStorage
        navigate("/login");   // Redirect to login page
      }, 0); // wait 1.5 seconds before logout
  
    } catch (err) {
      console.error("Failed to change password:", err);
      setMessage("Failed to change password. Check old password.");
    }
  };


  if (!userData) return <div className="spinner"></div>;

  return (
    <div className="profile-container">
      {/* User Details Section */}
      <div className="profile-box">
        <h2 className="book-appointment-title">User Details</h2>
        {editMode ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', alignItems: 'center', marginLeft: '100px'}}>
              <label>First Name:</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} style={{width: '500px'}}/>

              <label>Last Name:</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} style={{width: '500px'}}/>

              <label>Phone:</label>
              <input name="phone" value={formData.phone} onChange={handleChange} style={{width: '500px'}}/>

              <label>Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={{width: '530px', background: 'white'}}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <label>Email:</label>
              <input value={userData.email} readOnly disabled style={{width: '500px'}}/>
            </div>
            <button className="form-button save" onClick={handleSave}>Save</button>
            <button className="form-button cancel" onClick={handleEditToggle}>Cancel</button>
          </>
        ) : changePasswordMode ? (
          <>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', alignItems: 'center', marginLeft: '100px' }}>
  <label>Old Password:</label>
  <div className="password-container">
    <input
      type={showPassword ? "text" : "password"}
      name="oldPassword"
      placeholder="Password"
      required
      value={passwordData.oldPassword}
      onChange={handlePasswordInputChange}
      className="login-input"
    />
    <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>

  <label>New Password:</label>
  <div className="password-container">
    <input
      type={showPassword ? "text" : "password"}
      name="newPassword"
      placeholder="Password"
      required
      value={passwordData.newPassword}
      onChange={(e) => {
        handlePasswordInputChange(e);
        setPasswordTouched(true);
      }}
      className="login-input"
    />
    <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>

  {passwordTouched && (
    <div className="password-validations">
      <p className={passwordValidations.length ? "valid" : "invalid"}>
        {passwordValidations.length ? "✅" : "❌"} 8-32 characters
      </p>
      <p className={passwordValidations.uppercase ? "valid" : "invalid"}>
        {passwordValidations.uppercase ? "✅" : "❌"} At least one uppercase letter
      </p>
      <p className={passwordValidations.lowercase ? "valid" : "invalid"}>
        {passwordValidations.lowercase ? "✅" : "❌"} At least one lowercase letter
      </p>
      <p className={passwordValidations.number ? "valid" : "invalid"}>
        {passwordValidations.number ? "✅" : "❌"} At least one number
      </p>
      <p className={passwordValidations.specialChar ? "valid" : "invalid"}>
        {passwordValidations.specialChar ? "✅" : "❌"} At least one special character
      </p>
    </div>
  )}

  {/* Confirm New Password below password validations */}
  <label>Confirm New Password:</label>
  <div className="password-container">
    <input
      type={showPassword ? "text" : "password"}
      name="confirmNewPassword"
      placeholder="Password"
      required
      value={passwordData.confirmNewPassword}
      onChange={handlePasswordInputChange}
      className="login-input"
    />
    <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</div>

<button onClick={handleChangePassword}>Change Password</button>
<button className="form-button cancel" onClick={handleChangePasswordToggle}>Cancel</button>

        </>
        ) : (
          <>
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
            <div>
              <button onClick={handleLogout}>Logout</button>
              <button className="delete" onClick={handleDelete}>Delete My Account</button>
            </div>
          </>
        )}
      </div>

      <ul>
      <div className="appointments-grid">
        {appointments.map((appt) => {
          const isFuture = new Date(appt.date) > new Date();
          return (
            <div className="appointment-card" key={appt.id}>
              <div className="appointment-row">
                <span className="label">Doctor:</span>
                <span>{appt.doctorName}</span>
              </div>
              <div className="appointment-row">
                <span className="label">Date:</span>
                <span>{appt.date}</span>
              </div>
              <div className="appointment-row">
                <span className="label">Time Slot:</span>
                <span>{appt.timeSlot}</span>
              </div>
              <div className="appointment-row">
                <span className="label">Status:</span>
                <span>{appt.status || "Booked"}</span>
              </div>
              <div className="appointment-row">
                <span className="label">Amount Paid:</span>
                <span>{appt.amount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </ul>


      {/* Logout and Delete Account Section */}
      
    </div>
  );
};

export default ProfilePage;
