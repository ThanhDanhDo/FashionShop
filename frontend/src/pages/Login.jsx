import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      // TODO: Implement login logic here
      console.log('Login data:', formData);
      // After successful login, navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="breadcrumb">
        <a href="/">Trang chủ</a> {'>'} <span>Đăng nhập</span>
      </div>
      <div className="login-container">
        <div className="brand-section">
          <div className="brand-logo">icon thương hiệu</div>
        </div>
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <h2>ĐĂNG NHẬP TÀI KHOẢN</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">ĐỊA CHỈ EMAIL<span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email hợp lệ"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">MẬT KHẨU<span className="required">*</span></label>
                <div className="password-input">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                  />
                  <span className="password-toggle">👁</span>
                </div>
                <a href="/forgot-password" className="forgot-password">Quên mật khẩu?</a>
              </div>

              <button type="submit" className="login-button">
                ĐĂNG NHẬP
              </button>

              <div className="signup-prompt">
                Chưa có tài khoản? <a href="/signup">Đăng ký ngay</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 