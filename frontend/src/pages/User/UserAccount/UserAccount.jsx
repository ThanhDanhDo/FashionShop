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
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('success'); // success or error
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const toggleShow = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleNotification = (message, type = 'success') => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(''), 1500); // Ẩn thông báo sau 1 giây
  };

  const handleChangePassword = () => {
    if (!passwords.currentPassword) {
      handleNotification('PLEASE ENTER YOUR CURRENT PASSWORD!', 'error');
      return;
    }
    if (!passwords.newPassword || !passwords.confirmPassword) {
      handleNotification('PLEASE FILL IN BOTH PASSWORD FIELDS!', 'error');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      handleNotification('PASSWORDS DO NOT MATCH!', 'error');
      return;
    }
    handleNotification('PASSWORD SAVED SUCCESSFULLY', 'success');
  };

  const handleInputChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  return (
    <>
    <Navbar />
    <div className="user-account">
      <h2 className="title">ACCOUNT MANAGEMENT</h2>

      {notification && (
          <div className="popup">
            <p>{notification}</p>
          </div>
        )}

      {/* PERSONAL INFORMATION */}
      <div className="form-box hoverable">
        <h3>PERSONAL INFORMATION</h3>

        <div className="input-group">
          <label>First name:</label>
          <input type="text" defaultValue="Pham Hai" />
        </div>

        <div className="input-group">
          <label>Last name:</label>
          <input type="text" defaultValue="Duong" />
        </div>

        <div className="info-group">
          <label>Gender:</label>
          <p>Nam</p>
        </div>

        <div className="info-group">
          <label>Email:</label>
          <p>PhamHaiDuong@gmail.com</p>
        </div>

        <div className="button-wrapper">
          <button className="blue-btn"
          onClick={() => handleNotification('PROFILE SAVED SUCCESSFULLY')}
          >Update profile</button>
        </div>
      </div>

      {notification && (
          <div className={`popup ${notificationType}`}>
            <p>{notification}</p>
          </div>
        )}

      {/* CHANGE PASSWORD */}
      <div className="form-box hoverable">
          <h3>CHANGE PASSWORD</h3>

          <div className="input-group">
          <label>Current password:</label>
          <div className="password-field">
            <input
              type={showPassword.current ? 'text' : 'password'}
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            />
            <span onClick={() => toggleShow('current')}>
              {showPassword.current ? <FaEye /> : <FaEyeSlash />}
            </span>
            </div>
          </div>

          <div className="input-group">
            <label>New password:</label>
            <div className="password-field">
              <input
                type={showPassword.new ? 'text' : 'password'}
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
              />
              <span onClick={() => toggleShow('new')}>
                {showPassword.new ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm new password:</label>
            <div className="password-field">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={passwords.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              />
              <span onClick={() => toggleShow('confirm')}>
                {showPassword.confirm ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="button-wrapper">
            <button className="blue-btn" onClick={handleChangePassword}>
              Change password</button>
        </div>
      </div>

      {/* DELIVERY ADDRESS */}
      <div className="form-box hoverable">
        <h3>DELIVERY ADDRESS</h3>

        <div className="input-group">
          <label>Province:</label>
          <input type="text" defaultValue="Cà mau" />
        </div>

        <div className="input-group">
          <label>District:</label>
          <input type="text" defaultValue="Huyện Phú Tân" />
        </div>

        <div className="input-group">
          <label>Ward:</label>
          <input type="text" defaultValue="Xã Phú Tân" />
        </div>

        <div className="input-group">
          <label>Full Address:</label>
          <input
            type="text"
            defaultValue="Ấp Cái Đôi, Xã Phú Tân, Huyện Phú Tân, Tỉnh Cà Mau"
          />
        </div>

        <div className="input-group">
          <label>Phone number:</label>
          <input type="text" defaultValue="0221111113" />
        </div>

        <div className="button-wrapper">
          <button className="blue-btn"
          onClick={() => handleNotification('ADDRESS SAVED SUCCESSFULLY')}
          >Save address</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserAccount;
