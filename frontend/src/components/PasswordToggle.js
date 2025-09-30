import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordToggle({ 
placeholder,
name,
onChange}) 
{
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-group position-relative">
      <input
        type={showPassword ? "text" : "password"}
        className="form-control rounded-2"
        placeholder={placeholder}
        name={name}
        onChange={onChange}  
      />
      <span
        className="input-group-icon"
        onClick={() => setShowPassword((prev) => !prev)}>
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
}


