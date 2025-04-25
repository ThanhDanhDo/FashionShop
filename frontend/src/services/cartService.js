const API_BASE_URL = '/cart';

export const getCartById = async (cartId) => {
  const response = await fetch(`${API_BASE_URL}/${cartId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Không thể lấy thông tin giỏ hàng!');
  return response.json();
};

export const clearCart = async (cartId) => {
  const response = await fetch(`${API_BASE_URL}/${cartId}/clear`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Không thể xóa giỏ hàng!');
  return response.json();
};