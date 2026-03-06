// src/components/Button/Button.js
import React from "react";
import "./Button.css";

const Button = ({ text, onClick, type = "button", variant = "primary", disabled = false }) => {
  return (
    <button
      className={`custom-button ${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;