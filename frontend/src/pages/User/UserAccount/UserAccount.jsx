import React, { useState, useEffect } from 'react';
import './UserAccount.css';
import Navbar from '../../../components/Navbar/Navbar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getUserProfile, updateUserProfile, changePassword } from '../../../services/userService';
import { Dropdown, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import InfoSkeleton from '../../../components/Skeleton';
import { useNotification } from '../../../components/NotificationProvider'; // Thêm dòng này

const genderOptions = [
  { key: 'Men', label: 'Men' },
  { key: 'Women', label: 'Women' },
  { key: 'Unisex', label: 'Unisex' },
];

const UserAccount = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State cho thông tin cá nhân
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Notification của Ant Design
  const api = useNotification(); // Thay thế notification.useNotification()

  useEffect(() => {
    // Lấy thông tin user khi load trang
    getUserProfile()
      .then((data) => {
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          gender: data.gender || '',
          email: data.email || '',
        });
      })
      .catch(() => {
        api.error({
          message: 'Failed to load user information',
          description: 'Could not fetch your profile. Please try again later.',
        });
      })
      .finally(() => setLoadingProfile(false));
  }, [api]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
      });
      api.success({
        message: 'Profile updated successfully',
        description: 'Your personal information has been updated.',
      });
    } catch (err) {
      api.error({
        message: 'Update failed',
        description: 'Could not update your profile. Please try again.',
      });
    }
  };

  const toggleShow = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleNotification = (message, type = 'success') => {
    // Giữ lại cho các thông báo khác nếu cần
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword) {
      api.error({ message: 'PLEASE ENTER YOUR CURRENT PASSWORD!' });
      return;
    }
    if (!passwords.newPassword || !passwords.confirmPassword) {
      api.error({ message: 'PLEASE FILL IN BOTH PASSWORD FIELDS!' });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      api.error({ message: 'PASSWORDS DO NOT MATCH!' });
      return;
    }
    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      api.success({ message: 'Password changed successfully' });
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      api.error({ message: err.message || 'Could not change password!' });
    }
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

        {/* PERSONAL INFORMATION */}
        <div className="form-box hoverable">
          <h3>PERSONAL INFORMATION</h3>
          {loadingProfile ? (
            <InfoSkeleton />
          ) : (
            <>
              <div className="input-group">
                <label>First name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="input-group">
                <label>Last name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="input-group">
                <label>Gender:</label>
                <Dropdown
                  menu={{
                    items: genderOptions,
                    selectable: true,
                    selectedKeys: profile.gender ? [profile.gender] : [],
                    onClick: ({ key }) => setProfile((prev) => ({ ...prev, gender: key })),
                  }}
                  trigger={['click']}
                >
                  <Typography.Link style={{ width: '100%' }}>
                    <Space style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      background: '#fdfdfd',
                      fontSize: '15px',
                      color: '#222', 
                    }}>
                      {profile.gender || 'Select gender'}
                      <DownOutlined />
                    </Space>
                  </Typography.Link>
                </Dropdown>
              </div>

              <div className="input-group">
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="input-disabled"
                  tabIndex={-1}
                />
              </div>

              <div className="button-wrapper">
                <button className="blue-btn" onClick={handleUpdateProfile}>
                  Update profile
                </button>
              </div>
            </>
          )}
        </div>

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
              Change password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAccount;
