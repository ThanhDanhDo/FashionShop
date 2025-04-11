const API_BASE_URL = '/api/products';

export const getAllProducts = async (page = 0, size = 10) => {
  const response = await fetch(`${API_BASE_URL}/all?page=${page}&size=${size}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Không thể lấy danh sách sản phẩm!');
  return response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/id/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Không thể lấy thông tin sản phẩm!');
  return response.json();
};

export const searchProducts = async (name) => {
  const response = await fetch(`${API_BASE_URL}/search?Name=${name}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Không thể tìm kiếm sản phẩm!');
  return response.json();
};