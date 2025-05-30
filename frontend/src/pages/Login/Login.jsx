import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Login.module.css';
import { login } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import CustomBreadcrumb from '../../components/Breadcrumb';
import { useNotification } from '../../components/NotificationProvider';

const Login = () => {
  const navigate = useNavigate();
  const { login: setLoginState } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const api = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      if (response.data) {
        // Gọi API /api/authorities để lấy role
        const authResponse = await fetch('/api/authorities', {
          method: 'GET',
          credentials: 'include',
        });
        if (!authResponse.ok) throw new Error('Không thể lấy thông tin vai trò');
        const authData = await authResponse.json();
        const userRole = authData.role[0]; // Lấy role (ROLE_ADMIN hoặc ROLE_USER)

        // Cập nhật trạng thái đăng nhập với user và role
        setLoginState(response.data, userRole);
        
        api.success({ message: 'Login successful' });
        setTimeout(() => {
          if (userRole === 'ADMIN') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        }, 100);
      } else {
        api.error({ message: 'Login failed' });
      }
    } catch (error) {
      api.error({ message: error.message || 'Login failed' });
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.pageContainer}>
        <CustomBreadcrumb
          items={[
            {
              title: 'Login',
            },
          ]}
        />
        <div className={styles.loginContainer}>
          
          <div className={styles.loginFormSection}>
            <div className={styles.loginFormWrapper}>
              <h2>LOG IN ACCOUNT</h2>
              <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    EMAIL ADDRESS<span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter a valid email"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">
                    PASSWORD<span className={styles.required}>*</span>
                  </label>
                  <div className={styles.passwordInput}>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Input your password"
                      required
                    />
                    <span className={styles.passwordToggle}>👁</span>
                  </div>
                  <a href="/forgot-password" className={styles.forgotPassword}>
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" className={styles.loginButton}>
                  LOGIN
                </button>

                <div className={styles.signupPrompt}>
                  No account yet? <a href="/signup">Sign up now</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;