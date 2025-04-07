const API_BASE_URL = '/api/categories';

export const getAllCategories = async () => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Không thể lấy danh sách danh mục!');
  return response.json();
};

export const getCategoryByName = async (name) => {
  const response = await fetch(`${API_BASE_URL}/name/${name}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Không thể tìm danh mục!');
  return response.json();
};