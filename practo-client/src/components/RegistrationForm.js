import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import "../styles/RegistrationForm.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    length: formData.password.length >= 8 && formData.password.length <= 32,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      alert(passwordError);
      return;
    }

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await API.post("/register", {
        ...formData,
        role: "USER", // auto-set
      });

      // Redirect to login on successful registration
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Email already registered.");
      }
    }
  };

  return (
    <div className="page-background">
    <div className="form-container">
      <h2 className="heading">Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          value={formData.firstName}
          onChange={handleChange}
          className="input-box"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          value={formData.lastName}
          onChange={handleChange}
          className="input-box"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="input-box"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="input-box"
        />
        <select
          name="gender"
          required
          value={formData.gender}
          onChange={handleChange}
          className="input-box select-box"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        {/* <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) => {
            handleChange(e);
            setPasswordTouched(true);
          }}
          className="input-box"
        /> */}

        <div className="password-container">
                   <input
                      type={showPassword ? "text" : "password"} // Show text or password based on the state
                      name="password"
                      placeholder="Password"
                      
                      required
                      value={formData.password}
                      onChange={(e) => {
                        handleChange(e);
                        setPasswordTouched(true);
                      }}
                      className="input-box login-input"
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)} 
                    >
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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input-box"
        />
        <button type="submit" className="submit-btn">Register</button>
      </form>
      <p className="login-link">
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
    </div>
  );
};

export default RegistrationForm;
