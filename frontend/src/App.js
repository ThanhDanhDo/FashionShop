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
import { AuthProvider } from './context/AuthContext';
import ProductDetail from './pages/User/ProductDetail/ProductDetail';
import WishList from './pages/User/WishList/WishList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Product routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/men" element={<Products />} />
          <Route path="/women" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/WishList" element={<WishList />} />
          {/* Home route */}
          <Route path="/" element={<Home />} />

          {/* Admin routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products-admin" element={<ProductsAdmin />} />
            <Route path="/orders-admin" element={<OrdersAdmin />} />
            <Route path="/users-admin" element={<UsersAdmin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
