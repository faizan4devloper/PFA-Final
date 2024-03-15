import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleWindowClick = () => {
      setShowMenu(false);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
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
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          <li>
            <Link
              to="/"
              onClick={toggleMenu}
              className={location.pathname === "/" ? "active" : ""}
            >
              New Case Entry
            </Link>
          </li>
          <li>
            <Link
              to="/review"
              onClick={toggleMenu}
              className={location.pathname === "/review" ? "active" : ""}
            >
              Review Cases
            </Link>
          </li>

          <li>
            <Link
              to="/financial-review"
              onClick={toggleMenu}
              className={
                location.pathname === "/financial-review" ? "active" : ""
              }
            >
              Financial Review
            </Link>
          </li>
          <li>
            <Link
              to="/Admin"
              onClick={toggleMenu}
              className={location.pathname === "/Admin" ? "active" : ""}
            >
              Admin Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
