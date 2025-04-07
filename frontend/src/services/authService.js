const API_BASE_URL = '/api/auth';

export const register = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error('Đăng ký thất bại!');
  return response.json();
};

export const verifyOtp = async (otp, email) => {
  console.log("OTP gửi đi:", otp);
  console.log("Email gửi đi:", email);

  const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp, email }),
  });

  if (!response.ok) {
    const errorMessage = await response.text(); // Lấy thông báo lỗi từ Backend
    console.error("Lỗi từ Backend:", errorMessage);
    throw new Error(errorMessage || 'Xác thực OTP thất bại!');
  }

  return response.json();
};

export const login = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error('Đăng nhập thất bại!');
  return response.json();
};