import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import ProductsAdmin from './pages/Admin/Products-admin/Products-admin';
import OrdersAdmin from './pages/Admin/Orders-admin/Orders-admin';
import UsersAdmin from './pages/Admin/Users-admin/Users-admin';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/Signup';
import Home from './pages/User/Home/Home';
import Products from './pages/User/Products/Products';
import AddProduct from './pages/Admin/Products-admin/add-product';
import ChangeProduct from './pages/Admin/Products-admin/Change-product';
import { AuthProvider } from './context/AuthContext';
import ProductDetail from './pages/User/ProductDetail/ProductDetail';
import Cart from './pages/User/Cart/Cart';
import OtpVerification from './pages/OtpVerification/OtpVerification';
import OrderList from './pages/User/Orders-user/OrderList';
import WishList from './pages/User/WishList/WishList';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/cart" element={<Cart />} />

          {/* Product routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/men" element={<Products />} />
          <Route path="/women" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products/:categoryType/:categoryId" element={<Products />} />
          <Route path="/wishList" element={<WishList />} />
          
          {/* Home route */}
          <Route path="/" element={<Home />} />
          
          {/* User routes */}
          <Route path="/orders" element={<OrderList />} />
          
          {/* Admin routes */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/products-admin"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <ProductsAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="/Products-admin/add-product"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <AddProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/Products-admin/Change-product/:id"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <ChangeProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders-admin"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <OrdersAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="/users-admin"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <UsersAdmin />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
