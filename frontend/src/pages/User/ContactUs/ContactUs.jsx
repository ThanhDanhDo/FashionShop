// src/components/ContactUs.jsx
import React from 'react';
import './ContactUs.css';
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs';

const ContactUs = () => {
  const year = new Date().getFullYear();
  const companyName = "FashionShop™";

  return (
    
    <div className="contact-container" 
    style={{
    backgroundImage: `url(/images/ContactUs.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  }}>
      <div className="contact-content">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          We'd love to hear from you. Whether you have questions, feedback, or need help — feel free to reach out.
        </p>

        <div className="contact-grid">
          {/* Contact Form */}
          <form className="contact-form">
            <label>Name</label>
            <input type="text" placeholder="Enter your Name" required />

            <label>Email</label>
            <input type="email" placeholder="Enter a valid Email address" required />

            <label>Message</label>
            <textarea rows="5" placeholder="Write your message..." required />

            <button type="submit">Send Message</button>
          </form>

          {/* Contact Info */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> <a href="mailto:support@fashionshop.com">support@fashionshop.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+1234567890">+1 (234) 567-890</a></p>
            <p><strong>GitHub:</strong> <a href="https://github.com/" target="_blank" rel="noopener noreferrer">github.com</a></p>

            <h2>Follow Us</h2>
            <div className="social-icons">
              <a href="#" className="social-icon"><BsFacebook /></a>
              <a href="#" className="social-icon"><BsInstagram /></a>
              <a href="#" className="social-icon"><BsTwitter /></a>
            </div>
          <div className="footer-copyright">
            © {year} <a href="#" className="footer-copyright-link">{companyName}</a>. All rights reserved.
          </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ContactUs;
