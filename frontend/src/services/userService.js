const API_BASE_URL = '/api/user';

// Existing functions (unchanged)
export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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
    credentials: 'include',
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
    credentials: 'include',
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

export const searchUsers = async ({ searchType, searchTerm, page = 0, size = 10, sortBy = 'id', sortDir = 'asc' }) => {
  let url = '/api/admin';
  const params = new URLSearchParams({ page, size, sortBy, sortDir });

  if (searchType === 'ID' && searchTerm) {
    url = `${url}/users/${searchTerm}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Không thể tìm người dùng!');
    const user = await response.json();
    return { content: [user], totalElements: 1, number: 0, size: 1 };
  } else {
    url = `${url}/searchUser`;
    if (searchType === 'Name' && searchTerm) params.append('firstName', searchTerm);
    else if (searchType === 'Email' && searchTerm) params.append('email', searchTerm);
    else if (searchTerm) {
      params.append('firstName', searchTerm);
      params.append('email', searchTerm);
    }
    url += `?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Không thể tìm người dùng!');
    return response.json();
  }
};

export const createUserByAdmin = async (userData) => {
  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Could not create user!');
  }
  return response.json();
};

export const createUserWithAddress = async (userAndAddressData) => {
  const response = await fetch('/api/admin/users-with-address', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userAndAddressData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Could not create user!');
  }
  return response.json();
};

export const deleteUser = async (id) => {
  try {
    const res = await fetch(`/api/user/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Không thể xoá user');
    return res
  } catch (error) {
    console.log("Không thể xoá user: ", error)
  }
};

export const getUserAddressesByAdmin = async (userId) => {
  const response = await fetch(`/api/admin/users/${userId}/addresses`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Không thể lấy danh sách địa chỉ!');
  return response.json();
};

export const deleteUserAddressByAdmin = async (userId, addressId) => {
  const response = await fetch(`/api/admin/users/${userId}/addresses/${addressId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Could not delete address!');
};

export const updateUserAddressByAdmin = async (userId, addressId, addressData) => {
  const response = await fetch(`/api/admin/users/${userId}/addresses/${addressId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(addressData),
  });
  if (!response.ok) throw new Error('Could not update address!');
  return response.json();
};

export const addUserAddressByAdmin = async (userId, addressData) => {
  const response = await fetch(`/api/admin/users/${userId}/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(addressData),
  });
  if (!response.ok) throw new Error('Could not add address!');
  return response.json();
};

// New function to fetch user by ID
export const getUserById = async (userId) => {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Không thể lấy thông tin người dùng!');
  }
  return response.json();
};

export const updateUserByAdmin = async (userId, updatedUser) => {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // nếu cần gửi cookie (JWT, session v.v.)
    body: JSON.stringify(updatedUser),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Không thể cập nhật người dùng!');
  }

  return response.json(); // trả về kết quả từ API (ApiResponse)
};
