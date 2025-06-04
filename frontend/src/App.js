import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import './styles/index.css';
import LayoutAdmin from './components/LayoutAdmin/LayoutAdmin';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import ProductsAdmin from './pages/Admin/ProductsAdmin/ProductsAdmin';
import OrdersAdmin from './pages/Admin/Orders-admin/Orders-admin';
import UsersAdmin from './pages/Admin/Users-admin/Users-admin';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/Signup';
import Home from './pages/User/Home/Home';
import Products from './pages/User/Products/Products';
import AddProduct from './pages/Admin/ProductsAdmin/AddProduct';
import ChangeProduct from './pages/Admin/ProductsAdmin/ChangeProduct';
import { AuthProvider } from './context/AuthContext';
import ProductDetail from './pages/User/ProductDetail/ProductDetail';
import UserAccount from './pages/User/UserAccount/UserAccount';
import Cart from './pages/User/Cart/Cart';
import OtpVerification from './pages/OtpVerification/OtpVerification';
import OrderList from './pages/User/Order/OrderList';
import WishList from './pages/User/WishList/WishList';
import Payment from './pages/User/Payment/Payment';
import PrivateRoute from './components/PrivateRoute';
import DeliveryAddress from './pages/User/DeliveryAddress/DeliveryAddress';
import NotificationProvider from './components/NotificationProvider';
import ConfirmOtp from './pages/confirm_otp/confirm_otp';
import ChangeAccount from './pages/Admin/Users-admin/Change-account';
import AddAccount from './pages/Admin/Users-admin/Add-account';
import ProductDetailAdmin from './pages/Admin/ProductsAdmin/ProductDetailAdmin';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import SpinPage from './components/SpinPage';
import PayPalSuccess from './pages/User/PayPalSuccess/PayPalSuccess';
import Recommend from './pages/Admin/RecommendAdmin/Recommend';
import Interact from './pages/Admin/RecommendAdmin/Interact';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LoadingProvider>
          <SpinPageWrapper />
          <NotificationProvider>
            <Routes>
              {/* Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/otp-verification" element={<OtpVerification />} />
              <Route path="/confirm-otp" element={<ConfirmOtp />} />
              <Route path="/cart" element={<Cart />} />

              {/* Product routes */}
              <Route path="/products" element={<Products />} />
              <Route path="/men" element={<Products />} />
              <Route path="/women" element={<Products />} />
              <Route path="/products/:category" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/products/:categoryType/:categoryId" element={<Products />} />
              <Route path="/wishList" element={<WishList />} />
              <Route path="/Payment" element={<Payment />} />
              <Route path='/payment-success/' element={<PayPalSuccess />} />

              {/* Home route */}
              <Route path="/" element={<Home />} />

              {/* User routes */}
              <Route path="/orders" element={<OrderList />} />
              <Route path="/user-account" element={<UserAccount />} />
              <Route path="/delivery-address" element={<DeliveryAddress />} />

              {/* Admin routes */}
              <Route element={<LayoutAdmin />}>
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

                <Route
                  path="/users-admin/Change-account/:accountId"
                  element={
                    <PrivateRoute requiredRole="ADMIN">
                      <ChangeAccount />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/users-admin/Add-account"
                  element={
                    <PrivateRoute requiredRole="ADMIN">
                      <AddAccount />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Products-admin/Product-detail/:id"
                  element={
                    <PrivateRoute requiredRole="ADMIN">
                      <ProductDetailAdmin />
                    </PrivateRoute>
                  }
                />
                {/* Recommendation System routes */}
                <Route
                  path="/recommend-products"
                  element={
                    <PrivateRoute requiredRole="ADMIN">
                      <Recommend />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/user-interactions"
                  element={
                    <PrivateRoute requiredRole="ADMIN">
                      <Interact />
                    </PrivateRoute>
                  }
                />
              </Route>
            </Routes>
          </NotificationProvider>
        </LoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Hiển thị SpinPage khi loading toàn cục
function SpinPageWrapper() {
  const { loading } = useLoading();
  return <SpinPage spinning={loading} />;
}

export default App;
