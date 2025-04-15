import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
          <h2 className="logo">AccountAbility</h2>
          <div classsName="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/chat-coach">Chat Coach</Link>
            <Link to="/planning">Planning</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      );
}

  export default Navbar;