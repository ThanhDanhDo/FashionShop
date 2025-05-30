// src/pages/SignUp/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Signup.css';
import { register } from '../../services/authService'; // Xóa verifyOtp vì không dùng ở đây nữa
import CustomBreadcrumb from '../../components/Breadcrumb';
import { useNotification } from '../../components/NotificationProvider';

const Signup = () => {
  const navigate = useNavigate();
  const api = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithUpperCaseGender = {
        ...formData,
        gender: formData.gender,
      };

      await register(formDataWithUpperCaseGender);
      api.info({ message: 'OTP has been sent to your email. Please check and verify.' });

      // Chuyển hướng đến trang OTP và truyền email qua state
      navigate('/confirm-otp', { state: { email: formData.email } });
    } catch (error) {
      api.error({ message: error.message || 'Registration failed' });
    }
  };

  return (
    <div>
      <Navbar isLoggedIn={false} />
      <div className="page-container">
        <CustomBreadcrumb
          items={[
            {
              title: 'Sign Up',
            },
          ]}
        />

        <div className="signup-container">
          <div className="signup-form-section">
            <div className="signup-form-wrapper">
              <h2>REGISTER NEW ACCOUNT</h2>
            
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="email">EMAIL ADDRESS<span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter a valid email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">PASSWORD<span className="required">*</span></label>
                  <div className="password-input">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                    <span className="password-toggle">👁️</span>
                  </div>
                  <p className="password-hint">
                    Password must be between 8 and 20 characters including letters and numbers. The following symbols can be used {"!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"}
                  </p>
                </div>

                <div className="form-group">
                  <label>USER NAME<span className="required">*</span></label>
                  <div className="name-inputs">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      required
                    />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="gender-options">
                    <label>GENDER</label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Men"
                        checked={formData.gender === 'Men'}
                        onChange={handleChange}
                      />
                      Men
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Women"
                        checked={formData.gender === 'Women'}
                        onChange={handleChange}
                      />
                      Women
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Unisex"
                        checked={formData.gender === 'Unisex'}
                        onChange={handleChange}
                      />
                      Other
                    </label>
                  </div>
                </div>

                <div className="form-group terms">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span>I agree with <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
                  </label>
                </div>

                <button type="submit" className="signup-button">
                  REGISTER
                </button>

                <p className="login-link">
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;