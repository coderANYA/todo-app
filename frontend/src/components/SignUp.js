import React, { useState } from "react";
import "./SignUp.css";
import { NavLink, useNavigate } from "react-router-dom";
import PasswordToggle from "./PasswordToggle";
import { GiCheckMark } from "react-icons/gi";
import EmailValidation from "./EmailValidation";
import Toast from "./Toast";
import axios from "axios";

export default function SignUp() {
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: ""
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
    const { name, email, password, cpassword } = inputValue;
    
    const onlyAlphabets = /^[A-Za-z\s]+$/;     // pattern for letters + spaces
    if (name.trim() === "") 
      return triggerToast("⚠️ Name is required!");
    
    if (!onlyAlphabets.test(name))     // comment added
      return triggerToast("⚠️ Name should contain only alphabets!");
    
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
    
    if (cpassword === "") 
      return triggerToast("⚠️ Please confirm your password!");
    
    if (password !== cpassword) 
      return triggerToast("⚠️ Passwords do not match!");
    
    try {
      // check if user already exists
      const res = await axios.get(`http://localhost:8000/users?email=${email}`);
      if (res.data.length > 0) {
        return triggerToast("⚠️ User already registered!");
      }

      // create new user
      await axios.post("http://localhost:8000/users", {
        name,
        email,
        password
      });
      history("/login");
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
    <div className="signup-page">
      <div className="signup-container">
        <div className="d-flex flex-column justify-content-center align-items-center mb-4">
          <div className="brand-logo me-0">
            <strong>
              Task It!
              <GiCheckMark className="tick-mark" />
            </strong>
          </div>
          <h3 className="mt-3">Sign Up</h3>
        </div>

        <form>
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your Name"
              name = 'name'
              onChange = {getData}
            />
          </div>

          <div className="mb-4">
            <EmailValidation
              placeholder="Enter your Email"
              name = 'email'
              onChange = {getData}
              onValidityChange={handleEmailValidity}     // send validity to parent
            />
          </div>

          <div className="mb-3">
            <PasswordToggle 
              placeholder="Enter your Password" 
              name = 'password'
              onChange = {getData}
            />
            <div className="form-text ms-2">
              Must be 8 to 10 characters long
            </div>
          </div>

          <div className="mb-5">
            <PasswordToggle 
              placeholder="Confirm your Password"
              name = 'cpassword'
              onChange = {getData}
            />
          </div>

          <button 
            type="submit" 
            className="signup-btn w-100"
            onClick={addData}>
            Sign up
          </button>
        </form>

        <p className="text-center mt-3">
          Already Have an Account?{" "}
          <NavLink to="/login" className="text-decoration-none">
            SignIn
          </NavLink>
        </p>
      </div>

      <Toast message={toastMsg} show={showToast} />
    </div>
  );
}
