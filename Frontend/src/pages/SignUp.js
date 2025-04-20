import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import "../styles/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    alert("Account created successfully!");
    navigate("/login");
  };

  const handleGoogleSignUp = () => alert("Google SignUp Clicked!");
  const handleGithubSignUp = () => alert("GitHub SignUp Clicked!");
  const handleFacebookSignUp = () => alert("Facebook SignUp Clicked!");

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>
          <span className="white-text">B</span>
          <span className="yellow-text">ShotT</span> Sign Up
        </h2>

        <form onSubmit={handleSignUp} className="signup-form">
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
