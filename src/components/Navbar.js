import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import logo from '../mylogo.png';

export default function Navbar({ onHomeClick, onAboutClick, onResetClick, onExplainClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Collapse menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAndClose = (callback) => {
    if (callback) callback();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" ref={menuRef}>
      <div className="navbar-left" onClick={() => navigate('/insights')}>
        <img src={logo} alt="Logo" className="navbar-logo" />
        <span className="navbar-title">zounds.</span>
      </div>

      <div className={`navbar-menu-toggle ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <div></div><div></div><div></div>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'show' : ''}`}>
        <li onClick={() => handleAndClose(onHomeClick)}>home.</li>
        <li onClick={() => handleAndClose(onAboutClick)}>about.</li>
        <li onClick={() => handleAndClose(onExplainClick)}>understand.</li>
      </ul>
    </nav>
  );
}
