import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav style={styles.navbar}>
          <h2 style={styles.logo}>AccountAbility</h2>
          <div style={styles.links}>
            <Link to="/" style={styles.link}>Dashboard</Link>
            <Link to="/transactions" style={styles.link}>Transactions</Link>
            <button onClick={handleLogout} style={styles.logout}>Logout</button>
          </div>
        </nav>
      );
}

const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#2c3e50",
      padding: "10px 20px",
      color: "white",
    },
    logo: {
      margin: 0,
    },
    links: {
      display: "flex",
      gap: "15px",
      alignItems: "center",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontWeight: "bold",
    },
    logout: {
      background: "#e74c3c",
      border: "none",
      color: "white",
      padding: "5px 10px",
      cursor: "pointer",
      borderRadius: "5px",
    },
  };

  export default Navbar;