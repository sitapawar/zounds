import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import logo from '../mylogo.png';

export default function Navbar({ onHomeClick, onAboutClick, onResetClick, onExplainClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" onClick={() => handleAndClose(onHomeClick)} />
        <span className="navbar-title" onClick={() => handleAndClose(onHomeClick)}>zounds.</span>
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
