import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Login.css";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(evaluatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const API = import.meta.env.VITE_API_URL;
      await axios.post(`${API}/api/auth/register`, formData);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };
  

  function evaluatePasswordStrength(password) {
    if (password.length < 6) return "Weak";
    if (password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
    return "Medium";
  }

  return (
    <div className="login-page">
      <div className="login-left desktop-branding">
        <img src={logo} alt="AccountAbility Logo" className="login-logo" />
        <div className="blue-text">
            <h1>AccountAbility</h1>
          </div>
        <p>Your journey to smarter finances starts here.</p>
      </div>
      <div className="login-right">
        <div className="mobile-branding-banner">
          <img src={logo} alt="AccountAbility Logo" className="login-logo" />
          <div className="blue-text">
            <h1>AccountAbility</h1>
          </div>
          <p>Your journey to smarter finances starts here.</p>
        </div>
        <div className="login-form-card">
          <h2>Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
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

            {formData.password && (
              <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Password Strength: {passwordStrength}
              </p>
            )}

            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}
            <button type="submit">Register</button>
          </form>
          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
