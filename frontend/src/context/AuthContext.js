import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/userService';
import { getActiveCart, getCartItems } from '../services/cartService';
import { logoutApi } from '../services/authService';
import { getMyOrders } from '../services/orderService';
import { getWishlist } from '../services/wishlistService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
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
      .then((data) => {
        console.log('Authorities response:', data); // Thêm log
        setRole(data.role[0]); // Lưu role từ API (ví dụ: "ROLE_ADMIN" hoặc "ROLE_USER")
        return getUserProfile();
      })
      .then((userData) => {
        console.log('User profile:', userData);
        setUser(userData);
        if (role !== 'ADMIN') { // Bỏ qua cho ADMIN
          return getActiveCart().catch((error) => {
            console.error('Lỗi lấy giỏ hàng:', error);
            return null;
          });
        }
  return null;
      })
      .then((cartData) => {
        if (cartData && cartData.id) {
          setCartId(cartData.id);
          return getCartItems(cartData.id).catch((error) => {
            console.error('Lỗi lấy cart items:', error);
            return [];
          });
        }
        return [];
      })
      .then((items) => {
        setCartItemCount(items.length);
      })
      .catch((error) => {
        // Chỉ xử lý lỗi từ /api/authorities hoặc getUserProfile
        console.error('Không thể khôi phục trạng thái đăng nhập:', error);
        setUser(null);
        setRole(null);
        setCartId(null);
        setCartItemCount(0);
        const protectedRoutes = ['/profile', '/checkout', '/dashboard', '/products-admin'];
        if (protectedRoutes.includes(window.location.pathname)) {
          navigate('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const login = (userData, userRole) => {
    if (userData) {
      setUser(userData);
      setRole(userRole);
      // Thử lấy giỏ hàng, nhưng không làm hỏng trạng thái nếu lỗi
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
          setCartId(null);
          setCartItemCount(0);
        });
    }
  };

  const logout = () => {
    logoutApi()
      .then(() => {
        setUser(null);
        setRole(null);
        setCartId(null);
        setCartItemCount(0);
        navigate('/');
      })
      .catch((err) => {
        console.error('Lỗi khi gọi logout:', err);
        // Vẫn xóa state để đảm bảo frontend không hiển thị user
        setUser(null);
        setRole(null);
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

  // Hàm cập nhật số lượng order
  const refreshOrderCount = async () => {
    try {
      const res = await getMyOrders();
      setOrderCount(res?.content?.length || 0);
    } catch {
      setOrderCount(0);
    }
  };

  // Hàm cập nhật số lượng wishlist
  const refreshWishlistCount = async () => {
    try {
      const res = await getWishlist();
      setWishlistCount(res?.products?.length || 0);
    } catch {
      setWishlistCount(0);
    }
  };

  // Gọi khi user login hoặc reload
  useEffect(() => {
    if (user) {
      refreshOrderCount();
      refreshWishlistCount();
    }
  }, [user]);

  const isLoggedIn = !!user;
  const userName = user ? `${user.lastName} ${user.firstName} ` : 'Guest';

  if (loading) {
    return null; // Để SpinPage (loading toàn cục) hiển thị overlay
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        login,
        logout,
        user,
        role,
        cartId,
        updateCartId,
        cartItemCount,
        refreshCartItemCount,
        orderCount,
        wishlistCount,
        refreshOrderCount,
        refreshWishlistCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};