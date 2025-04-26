import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/userService'; // Import API lấy thông tin user

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [cartId, setCartId] = useState(null); // Thêm state để lưu cartId

  // Kiểm tra JWT token khi khởi động
  useEffect(() => {
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='));
    if (jwt) {
      const token = jwt.split('=')[1];
      // Lưu token vào localStorage để sử dụng cho các API calls
      localStorage.setItem('jwt', token);
      
      // Gọi API để lấy thông tin user dựa trên token
      getUserProfile()
        .then((userData) => {
          setUser(userData);
          // Có thể thêm logic để lấy cartId của user ở đây nếu cần
        })
        .catch((error) => {
          console.error('Không thể khôi phục trạng thái đăng nhập:', error);
          // Xóa token nếu không hợp lệ
          localStorage.removeItem('jwt');
          document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    if (userData) {
      setUser(userData);
      // Lấy JWT token từ cookie sau khi đăng nhập
      const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='));
      if (jwt) {
        const token = jwt.split('=')[1];
        localStorage.setItem('jwt', token);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setCartId(null); // Reset cartId khi logout
    localStorage.removeItem('jwt');
    // Xóa cookie JWT
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const updateCartId = (newCartId) => {
    setCartId(newCartId);
  };

  const isLoggedIn = !!user;
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

  // Đợi loading xong mới render children
  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang kiểm tra
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        userName, 
        login, 
        logout,
        user,
        cartId,
        updateCartId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};