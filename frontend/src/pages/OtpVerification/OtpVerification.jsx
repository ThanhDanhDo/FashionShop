import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import CustomBreadcrumb from '../../components/Breadcrumb';
import { verifyOtp } from '../../services/authService';
import './OtpVerification.css';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(otp, email);
      alert('OTP verified successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('OTP verification error:', error.message);
      setError(error.message || 'OTP verification failed!');
    }
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
    setError(''); // Clear error on input change
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isLoggedIn={false} />
      <div className="page-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CustomBreadcrumb
          items={[
            { title: 'Sign Up', to: '/signup' },
            { title: 'OTP Verification' },
          ]}
        />
        <div className="otp-container flex justify-center">
          <div className="otp-form-section bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">VERIFY YOUR OTP</h2>
            <p className="text-center text-sm text-gray-600 mb-4">
              An OTP has been sent to <span className="font-semibold">{email}</span>. Please enter it below.
            </p>
            {error && (
              <div className="mb-4 text-center text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="otp-form space-y-6">
              <div className="form-group">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP CODE<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={handleChange}
                  placeholder="Enter your OTP"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                VERIFY OTP
              </button>
              <p className="text-center text-sm text-gray-600">
                Didn't receive an OTP? <Link to="/signup" className="text-indigo-600 hover:underline">Resend OTP</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;