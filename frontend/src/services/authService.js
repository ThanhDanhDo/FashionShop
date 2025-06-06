const API_BASE_URL = '/api/auth';

export const register = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    credentials: 'include', // Gửi cookie
  });
  if (!response.ok) throw new Error('Registration failed!');
  return response.json();
};

export const verifyOtp = async (otp, email) => {
  console.log("OTP gửi đi:", otp);
  console.log("Email gửi đi:", email);

  const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp, email }),
    credentials: 'include', // Gửi cookie
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Lỗi từ Backend:", errorMessage);
    throw new Error(errorMessage || 'OTP authentication failed!');
  }

  return response.json();
};

export const login = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    credentials: 'include', // Gửi cookie
  });
  if (!response.ok) throw new Error('Login failed!');
  return response.json();
};

export const logoutApi = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include', // Gửi cookie jwt để backend biết mà xóa
  });

  if (!response.ok) {
    throw new Error('Logout failed!');
  }

  return response.json(); // hoặc return void nếu không cần dữ liệu
};