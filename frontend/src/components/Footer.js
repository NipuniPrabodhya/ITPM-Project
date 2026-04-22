import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <span className="footer-logo">UniNexus</span>
          <p className="footer-tagline">Connecting students, simplifying campus commerce.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/view-products">Marketplace</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: support@uninexus.sliit.lk</p>
          <p>Phone: +94 11 234 5678</p>
          <p>Location: SLIIT Campus, Malabe</p>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} UniNexus | Developed for SLIIT Community</p>
      </div>
    </footer>
  );
}
