import React from 'react';
import './style.css';
import logo from '../mylogo.png';

export default function Navbar({ onHomeClick, onStartOverClick, onAboutClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Logo" className="navbar-logo" />
        <span className="navbar-title">zounds.</span>
      </div>

      <div className="navbar-right">
        <button className="navbar-button" onClick={onHomeClick}>Start Over</button>
        <button className="navbar-button" onClick={onAboutClick}>About</button>

      </div>
    </nav>
  );
}
