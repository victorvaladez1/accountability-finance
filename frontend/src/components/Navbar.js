import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <h2 className="logo">AccountAbility</h2>

      <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
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
