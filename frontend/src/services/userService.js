const API_BASE_URL = '/api/user';

export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Thêm token vào header
    },
  });
  if (!response.ok) throw new Error('Không thể lấy thông tin người dùng!');
  return response.json();
};

export const updateUserProfile = async (updatedData) => {
  const response = await fetch(`${API_BASE_URL}/edit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error('Cập nhật thông tin thất bại!');
  return response.json();
};

export const getUserAddresses = async () => {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Không thể lấy danh sách địa chỉ!');
  return response.json();
};