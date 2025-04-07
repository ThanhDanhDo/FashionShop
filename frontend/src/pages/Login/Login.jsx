import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Login.css';
import { login } from '../../services/authService'; // Import hàm login từ authService
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login: setLoginState } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem('token', response.token);
      if (response.data) {
        setLoginState(response.data); // response.data chứa thông tin user từ backend
      } else {
        console.error('Không có thông tin user trong response');
      }
      alert('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
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
                  <label htmlFor="email">
                    ĐỊA CHỈ EMAIL<span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email hợp lệ"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    MẬT KHẨU<span className="required">*</span>
                  </label>
                  <div className="password-input">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <span className="password-toggle">👁</span>
                  </div>
                  <a href="/forgot-password" className="forgot-password">
                    Quên mật khẩu?
                  </a>
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
    </div>
  );
};

export default Login;