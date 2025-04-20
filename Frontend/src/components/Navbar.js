import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png'; // Update if your path is different

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo & Brand Name */}
      <Link to="/" className="navbar-logo-link">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
          <h1>
            <span className="white-text">B</span>
            <span className="yellow-text">ShotT</span>
          </h1>
        </div>
      </Link>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/practice">Practice</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        {/* Styled Login Button */}
        <li>
          <Link to="/login" className="login-btn">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
