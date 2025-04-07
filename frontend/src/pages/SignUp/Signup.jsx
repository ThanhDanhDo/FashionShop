import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Signup.css';
import { register, verifyOtp } from '../../services/authService';

const Signup = () => {
  const navigate = useNavigate();
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
        gender: formData.gender.toUpperCase(), // Chuyển gender thành chữ hoa
      };

      await register(formDataWithUpperCaseGender);
      alert('OTP đã được gửi tới email của bạn. Vui lòng kiểm tra và xác thực.');

      const otp = prompt('Nhập mã OTP:');

      await verifyOtp(otp, formData.email);

      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi xác thực OTP:', error.message);
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar isLoggedIn={false} />
      <div className="page-container">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> {'>'} </span>
          <span>Đăng ký</span>
        </div>

        <div className="signup-container">
          <div className="signup-form-section">
            <div className="signup-form-wrapper">
              <h2>ĐĂNG KÝ TÀI KHOẢN MỚI</h2>
            
              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="email">ĐỊA CHỈ EMAIL<span className="required">*</span></label>
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
                  <label htmlFor="password">MẬT KHẨU<span className="required">*</span></label>
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
                    <span className="password-toggle">👁️</span>
                  </div>
                  <p className="password-hint">
                    Mật khẩu phải có từ 8 đến 20 ký tự bao gồm cả chữ và số. Có thể sử dụng các 
                    ký hiệu sau {"!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"}
                  </p>
                </div>

                <div className="form-group">
                  <label>TÊN NGƯỜI DÙNG<span className="required">*</span></label>
                  <div className="name-inputs">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Họ"
                      required
                    />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Tên"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="gender-options">
                    <label>GIỚI TÍNH</label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="nam"
                        checked={formData.gender === 'nam'}
                        onChange={handleChange}
                      />
                      Nam
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="nu"
                        checked={formData.gender === 'nu'}
                        onChange={handleChange}
                      />
                      Nữ
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === 'other'}
                        onChange={handleChange}
                      />
                      Bỏ chọn
                    </label>
                  </div>
                </div>

                <div className="form-group terms">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span>Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và <Link to="/privacy">Chính sách bảo mật</Link></span>
                  </label>
                </div>

                <button type="submit" className="signup-button">
                  ĐĂNG KÝ
                </button>

                <p className="login-link">
                  Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
              </form>
            </div>
          </div>

          <div className="brand-section">
            <h2>icon thương hiệu</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;