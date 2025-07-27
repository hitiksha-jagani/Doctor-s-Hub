import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginForm.css"; // ✅ Import the new CSS file

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and Password are required");
      return;
    }

    try {
      const response = await API.post("/admin-login", formData, {
        withCredentials: true,
      });

      const user = response.data;
      login(user);

      if (user.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials or server error."
      );
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-form-container">
        <h2 className="login-heading">Login</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="login-input"
          />
  
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="login-input"
          />
  
          <button type="submit" className="login-btn">Login</button>
        </form>
  
        <div className="login-links">
          <p><Link to="/forgot-password">Forgot Password?</Link></p>
        </div>
      </div>
    </div>
  );
  
};

export default AdminLogin;
