const API_BASE_URL = '/cart';
const API_CART_ITEMS_URL = '/api/cart-items';

// Tạo giỏ hàng mới cho user
export const createCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể tạo giỏ hàng mới!');
    }
    
    return response.json();
  } catch (error) {
    console.error('Lỗi khi tạo giỏ hàng:', error);
    throw error;
  }
};

// Lấy thông tin giỏ hàng theo ID
export const getCartById = async (cartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${cartId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin giỏ hàng!');
    }
    
    return response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
    throw error;
  }
};

// Lấy cart đang active của user
export const getActiveCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin giỏ hàng!');
    }
    
    return response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
    throw error;
  }
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCartItems = async (cartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${cartId}/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách sản phẩm trong giỏ hàng!');
    }
    
    return response.json();
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:', error);
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (cartItem) => {
  try {
    const response = await fetch(`${API_CART_ITEMS_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        cart: { id: cartItem.cart.id },
        product: { id: cartItem.product.id },
        quantity: cartItem.quantity,
        size: cartItem.size,
        color: cartItem.color
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể thêm sản phẩm vào giỏ hàng!');
    }
    
    return response.json();
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    throw error;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (cartItem) => {
  try {
    const response = await fetch(`${API_CART_ITEMS_URL}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItem),
    });
    
    if (!response.ok) {
      throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng!');
    }
    
    return response;
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
    throw error;
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (cartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${cartId}/clear`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Không thể xóa giỏ hàng!');
    }
    
    return response;
  } catch (error) {
    console.error('Lỗi khi xóa giỏ hàng:', error);
    throw error;
  }
};

// Cập nhật trạng thái giỏ hàng
export const updateCartStatus = async (cartId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${cartId}/status?status=${status}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Không thể cập nhật trạng thái giỏ hàng!');
    }
    
    return response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái giỏ hàng:', error);
    throw error;
  }
};

// Xóa giỏ hàng
export const deleteCart = async (cartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${cartId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Không thể xóa giỏ hàng!');
    }
    
    return response;
  } catch (error) {
    console.error('Lỗi khi xóa giỏ hàng:', error);
    throw error;
  }
};