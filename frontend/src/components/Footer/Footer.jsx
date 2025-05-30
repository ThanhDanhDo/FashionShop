import React from 'react';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
import './Footer.css'; // Import file CSS riêng

const FooterComponent = ({ year = 2025, companyName = "FashionShop™" }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">About</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Brand Center</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Help Center</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Discord Server</a></li>
              <li><a href="#" className="footer-link">Twitter</a></li>
              <li><a href="#" className="footer-link">Facebook</a></li>
              <li><a href="#" className="footer-link">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Licensing</a></li>
              <li><a href="#" className="footer-link">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Download</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">iOS</a></li>
              <li><a href="#" className="footer-link">Android</a></li>
              <li><a href="#" className="footer-link">Windows</a></li>
              <li><a href="#" className="footer-link">MacOS</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {year} <a href="#" className="footer-copyright-link">{companyName}</a>. All rights reserved.
          </div>
          <div className="footer-socials">
            <a href="#" className="social-icon"><BsFacebook /></a>
            <a href="#" className="social-icon"><BsInstagram /></a>
            <a href="#" className="social-icon"><BsTwitter /></a>
            <a href="#" className="social-icon"><BsGithub /></a>
            <a href="#" className="social-icon"><BsDribbble /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;