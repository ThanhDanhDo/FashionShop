import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, role } = useContext(AuthContext);

  // Nếu không đăng nhập hoặc không có role phù hợp, chuyển hướng đến trang chủ
  if (!isLoggedIn || role !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Nếu đã đăng nhập và có role phù hợp, render component
  return children;
};

export default PrivateRoute;