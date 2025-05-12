import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login-page">
      {/* Desktop branding only */}
      <div className="login-left desktop-branding">
        <img src={logo} alt="AccountAbility Logo" className="login-logo" />
        <div className="blue-text">
          <h1>AccountAbility</h1>
        </div>
        <p>Take control of your finances with confidence.</p>
      </div>

      {/* Login form + mobile branding */}
      <div className="login-right">
        {/* Mobile branding only */}
        <div className="mobile-branding-banner">
          <img src={logo} alt="AccountAbility Logo" className="login-logo" />
          <div className="blue-text">
            <h1>AccountAbility</h1>
          </div>
          <p>Take control of your finances with confidence.</p>
        </div>

        <div className="login-form-card">
          <h2>Login to Your Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="input-with-icon">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M3.98 8.223A10.477 10.477 0 001.5 12s3.75 6.75 9.75 6.75a9.724 9.724 0 004.7-1.29M21.75 12s-3.75-6.75-9.75-6.75a9.75 9.75 0 00-2.564.333" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75 9.75 6.75 9.75 6.75-3.75 6.75-9.75 6.75S2.25 12 2.25 12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </span>
            </div>
            {error && <p className="login-error">{error}</p>}
            <button type="submit">Login</button>
          </form>
          <p className="login-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
