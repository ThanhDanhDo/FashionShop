// src/pages/OtpVerification/confirm_otp.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import Navbar from '../../components/Navbar/Navbar';
import CustomBreadcrumb from '../../components/Breadcrumb';
import { verifyOtp } from '../../services/authService'; // Import verifyOtp
import { useNotification } from '../../components/NotificationProvider';
import './confirm_otp.css';

const ConfirmOtp = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const api = useNotification();
  
  // Lấy email từ state
  const email = location.state?.email || '';

  const handleChange = (otpValue) => {
    setOtp(otpValue);
  };

  const handleClear = () => {
    setOtp(''); // Xóa giá trị OTP
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(otp, email); // Gọi API verifyOtp với OTP và email
      api.success({ message: 'OTP verified successfully!' });
      navigate('/login');
    } catch (error) {
      api.error({ message: error.message || 'OTP verification failed' });
    }
  };

  return (
    <div>
      <Navbar isLoggedIn={false} />
      <div className="page-container">
        <CustomBreadcrumb
          items={[
            { title: 'Sign Up', to: '/signup' },
            { title: 'Confirm OTP' },
          ]}
        />
        <div className="otp-container">
          <div className = "otp-form-section">
            <h2>CONFIRM OTP</h2>
            <p>Please enter the OTP code sent to your email</p>
            <form onSubmit={handleSubmit}>
                <OtpInput
                value={otp}
                onChange={handleChange}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} inputMode="numeric" pattern="[0-9]*" />}
                inputType="number"
                containerStyle="otp-input-container"
                inputStyle="otp-input"
                />
                <div className="btn-row">
                    <button type="button" className="clear-btn" onClick={handleClear}>
                        Clear
                    </button>
                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                </div> 
              
            </form>
            <p>
                Didn't receive an OTP? <Link to="/signup" className="text-indigo-600 hover:underline">Resend OTP</Link>
            </p>
        </div>
        </div>
    </div>
    
    </div>
  );
};

export default ConfirmOtp;