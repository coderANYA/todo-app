import React, { useState } from "react";
import "./EmailValidation.css";
import { 
FaCheckCircle, 
FaExclamationCircle } from "react-icons/fa";

export default function EmailValidation({
placeholder, 
name, 
onChange,
onValidityChange })
{
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(null);    // null = not typed yet, true = valid, false = invalid

  function validateEmail(value) {
    const atIndex = value.indexOf("@");
    const dotIndex = value.lastIndexOf(".");
    return (
      atIndex > 0 &&
      dotIndex > atIndex + 1 &&
      dotIndex < value.length - 2
    );
  }

  function handleInputChange(event) {
    const value = event.target.value.trim();
    setEmail(value);

    let validity = null;
    if (value === "") {
      validity = null;
    } else {
      validity = validateEmail(value);
    }

    setIsValid(validity);

    if (onChange) {
      onChange(event);   // pass event to parent form handler
    }

    // Notify parent of validity
    if (onValidityChange) {
      onValidityChange(validity);
    }
  }

  return (
    <div className="position-relative mb-4">
      <input
        type="email"
        name={name}
        value={email}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="form-control"
        style={{
          ...(isValid === true
          ? { border: "2px solid #2ecc71" } // green if valid
          : isValid === false
          ? { border: "2px solid #ff2851" } // red if invalid
          : {}),                              // nothing if null
        }}
      />

      {/* Icons */}
      {isValid !== null && (
        <span
          className={isValid ? "icon-valid" : "icon-invalid"}>
          {isValid ? <FaCheckCircle /> : <FaExclamationCircle />}
        </span>
      )}
    </div>
  );
}
