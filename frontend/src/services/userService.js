const API_BASE_URL = '/api/user';

export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Gửi cookie (bao gồm token HttpOnly)
  });
  if (!response.ok) throw new Error('Không thể lấy thông tin người dùng!');
  return response.json();
};

export const updateUserProfile = async (updatedData) => {
  const response = await fetch(`${API_BASE_URL}/edit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Gửi cookie
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error('Cập nhật thông tin thất bại!');
  return response.json();
};

export const getUserAddresses = async () => {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Gửi cookie
  });
  if (!response.ok) throw new Error('Không thể lấy danh sách địa chỉ!');
  return response.json();
};

export const addUserAddress = async (addressData) => {
  const response = await fetch(`/api/user/addresses/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(addressData),
  });
  if (!response.ok) throw new Error('Could not add address!');
  return response.json();
};

export const deleteUserAddress = async (id) => {
  const response = await fetch(`/api/user/addresses/delete/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Could not delete address!');
};

export const updateUserAddress = async (id, addressData) => {
  const response = await fetch(`/api/user/addresses/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(addressData),
  });
  if (!response.ok) throw new Error('Could not update address!');
  return response.json();
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await fetch('/api/user/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Could not change password!');
  }
  return response.json();
};