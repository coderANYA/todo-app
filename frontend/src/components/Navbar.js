import React, { useState } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import AlertLogOut from "./AlertLogOut";

export default function Navbar() {
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false); // State to toggle alert

  // Confirm logout
  const handleConfirmLogout = () => {
    localStorage.removeItem("user_login");   // clear session
    setShowLogoutAlert(false);    // close the alert
    navigate("/login");    // Redirect to login page
  };

  // Cancel logout
  const handleCancelLogout = () => {
    setShowLogoutAlert(false);    // just close the alert
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid">
          <NavLink to="/home" className="navbar-brand ms-3 ps-4">
            <strong>
              Task It!
              <GiCheckMark className="tick-mark" />
            </strong>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0 gap-3 me-4">
              <li className="nav-item">
                <NavLink to="/home" className="nav-link" aria-current="page">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" className="nav-link">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/all" className="nav-link">
                  MyTasks
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="logout-btn">
            <button 
              type="button" 
              onClick = {() => setShowLogoutAlert(true)} >    
                Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* AlertLogOut Modal */}
      <AlertLogOut 
        show = {showLogoutAlert} 
        onConfirm = {handleConfirmLogout} 
        onCancel = {handleCancelLogout} 
      />
    </>
  );
}
