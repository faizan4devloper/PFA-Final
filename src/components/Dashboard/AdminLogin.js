import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useNavigate();

  const handleLogin = () => {
    // Check username and password (This is a basic example, replace with proper authentication)
    if (username === "admin" && password === "1212") {
      history("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      {error && <div className="admin-error-message">{error}</div>}
      <div className="admin-form-group">
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="admin-form-input"
          placeholder="Username"
        />
      </div>
      <div className="admin-form-group">
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-form-input"
          placeholder="Password"
        />
      </div>
      <button className="admin-login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default AdminLogin;
