import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { getActiveCart, getCartItems } from '../services/cartService';
import { logoutApi } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/authorities', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không xác thực được người dùng');
        return res.json();
      })
      .then(() => getUserProfile())
      .then((userData) => {
        setUser(userData);
        return getActiveCart();
      })
      .then((cartData) => {
        if (cartData && cartData.id) {
          setCartId(cartData.id);
          return getCartItems(cartData.id);
        }
        return [];
      })
      .then((items) => {
        setCartItemCount(items.length);
      })
      .catch((error) => {
        console.error('Không thể khôi phục trạng thái đăng nhập:', error);
        setUser(null); // Đặt user về null để coi là Guest
        setCartId(null);
        setCartItemCount(0);
        // Không chuyển hướng đến /login trừ khi cần thiết
        // Ví dụ: Chỉ chuyển hướng nếu đang ở trang yêu cầu đăng nhập
        const protectedRoutes = ['/profile', '/checkout']; // Danh sách các route yêu cầu đăng nhập
        if (protectedRoutes.includes(window.location.pathname)) {
          navigate('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const login = (userData) => {
    if (userData) {
      setUser(userData);
      getActiveCart()
        .then((cartData) => {
          if (cartData && cartData.id) {
            setCartId(cartData.id);
            return getCartItems(cartData.id);
          }
          return [];
        })
        .then((items) => {
          setCartItemCount(items.length);
        })
        .catch((error) => {
          console.error('Không thể lấy giỏ hàng sau khi đăng nhập:', error);
        });
    }
  };

  const logout = () => {
    logoutApi()
      .then(() => {
        setUser(null);
        setCartId(null);
        setCartItemCount(0);
        navigate('/login');
      })
      .catch((err) => {
        console.error('Lỗi khi gọi logout:', err);
        // Vẫn xóa state để đảm bảo frontend không hiển thị user
        setUser(null);
        setCartId(null);
        setCartItemCount(0);
        navigate('/login');
      });
  };

  const updateCartId = (newCartId) => {
    setCartId(newCartId);
  };

  const refreshCartItemCount = async () => {
    if (cartId) {
      try {
        const items = await getCartItems(cartId);
        setCartItemCount(items.length);
      } catch (error) {
        console.error('Không thể làm mới số lượng giỏ hàng:', error);
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
  };

  const isLoggedIn = !!user;
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

  if (loading) {
    return <div>Loading...</div>;
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
        updateCartId,
        cartItemCount,
        refreshCartItemCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};