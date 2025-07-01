import React from 'react';
import './style.css';
import logo from '../mylogo.png'

export default function Navbar({ onHomeClick }) {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="navbar-logo" onClick={onHomeClick} style={{ cursor: 'pointer' }} />
      <span className="navbar-title" onClick={onHomeClick} style={{ cursor: 'pointer' }}>furioso.</span>
    </nav>
  );
}
