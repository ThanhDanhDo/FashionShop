import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/userService'; // Import API lấy thông tin user

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  // Kiểm tra token khi khởi động
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Gọi API để lấy thông tin user dựa trên token
      getUserProfile()
        .then((userData) => {
          setUser(userData); // Cập nhật user nếu token hợp lệ
        })
        .catch((error) => {
          console.error('Không thể khôi phục trạng thái đăng nhập:', error);
          localStorage.removeItem('token'); // Xóa token nếu không hợp lệ
        })
        .finally(() => {
          setLoading(false); // Kết thúc loading
        });
    } else {
      setLoading(false); // Không có token thì không cần load
    }
  }, []);

  const login = (userData) => {
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const isLoggedIn = !!user;
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

  // Đợi loading xong mới render children
  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang kiểm tra
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};