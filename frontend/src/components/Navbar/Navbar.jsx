import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          <img src="/path-to-your-logo.png" alt="Logo" />
        </Link>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button type="button" className="search-button">
            🔍
          </button>
        </div>
      </div>
      
      <div className="navbar-right">
        <Link to="/product" className="nav-link">Product</Link>
        <Link to="/contact" className="nav-link">Contact Us</Link>
        <Link to="/login" className="nav-link">Sign In</Link>
        <Link to="/signup" className="nav-button">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar; 