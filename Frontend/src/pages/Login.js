import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Logged in successfully!");
    navigate("/");
  };

  // Dummy Social Login Handlers (replace with real ones later)
  const handleGoogleLogin = () => alert("Google Login Clicked!");
  const handleGithubLogin = () => alert("GitHub Login Clicked!");
  const handleFacebookLogin = () => alert("Facebook Login Clicked!");

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>
          <span className="white-text">B</span>
          <span className="yellow-text">ShotT</span> Login
        </h2>

        <form onSubmit={handleLogin} className="login-form">
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="login-btn">Login</button>
        </form>

        

        <p className="signup-link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
