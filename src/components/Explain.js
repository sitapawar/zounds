// components/Explain.js
import React from 'react';
import './style.css';

export default function Explain({ onClose }) {
  return (
    <div className="about-overlay">
      <div className="about-content">
        <button className="close-button" onClick={onClose}>✕</button>
        <h1>explain.</h1>
        <p>
        This is what is means </p>
      </div>
    </div>
  );
}
