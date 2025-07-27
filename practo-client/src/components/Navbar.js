import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";
import logo from '../styles/ChatGPT Image Apr 12, 2025, 11_33_02 AM.png';
import profile from '../styles/user.png';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" style={{ cursor: 'pointer' }}>
          <img
            src={logo}
            alt="Logo"
            className="navbar-logo"
          />
        </Link>
        <Link to="/doctors" className="navbar-link">Doctors</Link>
      </div>

      <div className="navbar-right">
        {!user ? (
          <>
            <Link to="/login" className="navbar-link" style={{ cursor: 'pointer' }}>Login</Link>
            <Link to="/registration" className="navbar-link" style={{ cursor: 'pointer' }}>Register</Link>
          </>
        ) : (
          <Link to="/profile" style={{ cursor: 'pointer' }}>
            <img
              src={profile}
              alt="Profile"
              className="navbar-profile"
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
