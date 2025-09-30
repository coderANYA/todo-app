import React, { useState } from "react";
import "./LogIn.css";
import PasswordToggle from "./PasswordToggle";
import { GiCheckMark } from "react-icons/gi";
import EmailValidation from "./EmailValidation";
import Toast from "./Toast";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function LogIn() {
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(null);

  const history = useNavigate();

  const getData = (event) => {
    const { name, value } = event.target;

    setInputValue(() => {
      return {
        ...inputValue,
        [name]: value
      }
    })
  }

  const handleEmailValidity = (validity) => {
    setIsEmailValid(validity);
  };

  const addData = async (event) => {
    event.preventDefault();

    const { email, password } = inputValue;

    if (email.trim() === "") 
      return triggerToast("⚠️ Email is required!");
    
    if (email.includes(" ")) 
      return triggerToast("⚠️ Email should not contain spaces!");
    
    if (isEmailValid === false) 
      return triggerToast("⚠️ Please enter a valid email!");
    
    if (password === "") 
      return triggerToast("⚠️ Password is required!");
    
    if (password.includes(" ")) 
      return triggerToast("⚠️ Password should not contain spaces!");
    
    if (password.length < 8 || password.length > 10) 
      return triggerToast("⚠️ Password must be between 8 to 10 characters!");
    
    try {
      const res = await axios.get(`http://localhost:8000/users?email=${email}&password=${password}`);
      if (res.data.length === 0) {
        return triggerToast("⚠️ Invalid credentials");
      }

      // store logged-in user in localStorage for session tracking
      localStorage.setItem("user_login", JSON.stringify(res.data[0]));

      history("/home");
    } 
    catch (error) {
      console.error(error);
      triggerToast("⚠️ Something went wrong!");
    }
  };

  const triggerToast = (message) => {
    setToastMsg(message);
    setShowToast(true);

    // Hide after a while so next toast can trigger again
    setTimeout(() => {
      setShowToast(false);
    }, 5000); 
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="d-flex flex-column justify-content-center align-items-center mb-4">
          <div className="brand-logo me-0">
            <strong>
              Task It!
              <GiCheckMark className="tick-mark" />
            </strong>
          </div>
          <h3 className="mt-4">Sign In</h3>
        </div>

        <form>
          <div className="mb-4">
            <EmailValidation
              placeholder="Enter your Email"
              name = 'email'
              onChange = {getData}
              onValidityChange={handleEmailValidity}     // send validity to parent
            />
          </div>

          <div className="mb-5">
            <PasswordToggle 
              placeholder="Enter your Password" 
              name = 'password'
              onChange = {getData}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn w-100"
            onClick={addData}>
            Login
          </button>
        </form>
      </div>

      <Toast message={toastMsg} show={showToast} />
    </div>
  );
}
