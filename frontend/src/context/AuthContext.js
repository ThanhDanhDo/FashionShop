import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/userService';
import { getActiveCart, getCartItems } from '../services/cartService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0); // Thêm state cho cartItemCount

  useEffect(() => {
    const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='));
    if (jwt) {
      const token = jwt.split('=')[1];
      localStorage.setItem('jwt', token);
  
      getUserProfile()
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
          console.error('Không thể khôi phục trạng thái đăng nhập hoặc giỏ hàng:', error);
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
      const jwt = document.cookie.split('; ').find(row => row.startsWith('jwt='));
      if (jwt) {
        const token = jwt.split('=')[1];
        localStorage.setItem('jwt', token);
      }
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
    setUser(null);
    setCartId(null);
    setCartItemCount(0); // Reset số lượng giỏ hàng
    localStorage.removeItem('jwt');
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
        cartItemCount, // Thêm cartItemCount
        refreshCartItemCount, // Thêm hàm refresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};