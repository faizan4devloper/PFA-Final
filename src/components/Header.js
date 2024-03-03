import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  // Close the menu when the component is mounted or unmounted
  useEffect(() => {
    const handleWindowClick = () => {
      setShowMenu(false);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  // Toggle the menu
  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event propagation to parent elements
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  return (
    <header className="header">
      <h1>NGO Case Management System</h1>
      <button
        className={`menu-btn ${showMenu ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span className="hamburger"></span>
      </button>
      <nav
        className={`nav-links ${showMenu ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()} // Prevent menu closing when clicking inside the menu
      >
        <ul>
          <li>
            <Link to="/" onClick={toggleMenu}>
              New Case Entry
            </Link>
          </li>
          <li>
            <Link to="/review" onClick={toggleMenu}>
              Review Cases
            </Link>
          </li>
          <li>
            <Link to="/approval" onClick={toggleMenu}>
              Approval Screen
            </Link>
          </li>
          <li>
            <Link to="/financial-review" onClick={toggleMenu}>
              Financial Review
            </Link>
          </li>
          <li>
            <Link to="/admin" onClick={toggleMenu}>
              Login Admin
            </Link>
          </li>
          {/* <li>
            <Link to="/dashboard" onClick={toggleMenu}>
              Case Dashboard
            </Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
