import React, { useState } from 'react';
import './UserAccount.css';
import Navbar from '../../../components/Navbar/Navbar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserAccount = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleShow = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <>
      <Navbar />
      <div className="user-account">
        <h2 className="title">QUẢN LÝ TÀI KHOẢN</h2>
        <div className="account-container">
        <div className="info-container">
        <h3>THÔNG TIN CÁ NHÂN</h3>
        <div className="info-group">
            <label>Họ:</label>
            <p>Nguyễn</p>
        </div>
        <div className="info-group">
            <label>Tên:</label>
            <p>Văn A</p>
        </div>
        <div className="info-group">
            <label>Giới tính:</label>
            <p>Nam</p>
        </div>
        <div className="info-group">
            <label>Email:</label>
            <p>nguyenvana@example.com</p>
        </div>
        </div>

          {/* Các form khác */}
          <div className="account-forms">
            {/* Đổi mật khẩu */}
            <div className="form-box">
              <h3>ĐỔI MẬT KHẨU</h3>
              <div className="input-group">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu hiện tại"
                />
                <span onClick={() => toggleShow('current')}>
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="input-group">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu mới"
                />
                <span onClick={() => toggleShow('new')}>
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="input-group">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu mới"
                />
                <span onClick={() => toggleShow('confirm')}>
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button className="blue-btn">Cập nhật mật khẩu</button>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="form-box">
              <h3>ĐỊA CHỈ GIAO HÀNG</h3>
              <input type="text" placeholder="Nhập thành phố/ tỉnh" />
              <input type="text" placeholder="Nhập quận/ huyện" />
              <input type="text" placeholder="Nhập phường/ xã" />
              <input type="text" placeholder="Nhập địa chỉ cụ thể" />
              <input type="text" placeholder="Nhập số điện thoại" />
              <button className="blue-btn">Lưu địa chỉ giao hàng</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAccount;