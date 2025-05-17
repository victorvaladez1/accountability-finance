import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("portfolioSnapshotTaken");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="AccountAbility Logo" className="navbar-logo" />
        <h2 className="logo-text">AccountAbility</h2>
      </div>

      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/transactions" onClick={() => setMenuOpen(false)}>Transactions</Link>
        <Link to="/portfolio" onClick={() => setMenuOpen(false)}>Portfolio</Link>
        <Link to="/chat-coach" onClick={() => setMenuOpen(false)}>Chat Coach</Link>
        <Link to="/planning" onClick={() => setMenuOpen(false)}>Planning</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
