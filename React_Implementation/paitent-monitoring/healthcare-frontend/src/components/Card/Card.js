// src/components/Card/Card.js
import React from "react";
import "./Card.css";

const Card = ({ title, content }) => {
  return (
    <div className="generic-card">
      <h4>{title}</h4>
      <p>{content}</p>
    </div>
  );
};

export default Card;