// src/services/cartService.js
const API_BASE_URL = '/api/cart';
const API_CART_ITEMS_URL = '/api/cart-items';

// Tạo giỏ hàng mới cho user
export const createCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Gửi cookie
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
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
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể lấy thông tin giỏ hàng!');
    }
    
    return response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
    throw error;
  }
};

// Lấy giỏ hàng của user
export const getActiveCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      let errorMessage = 'Không thể lấy thông tin giỏ hàng!';
      if (response.status === 401) {
        errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!';
      } else if (response.status === 404) {
        errorMessage = 'Không tìm thấy giỏ hàng!';
      }
      try {
        const errorData = await response.json();
        console.log('Error response from /api/cart:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Không thể parse error response:', e);
      }
      throw new Error(errorMessage);
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
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể lấy danh sách sản phẩm trong giỏ hàng!');
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
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        productId: cartItem.product.id,
        quantity: cartItem.quantity,
        size: cartItem.size,
        color: cartItem.color
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể thêm sản phẩm vào giỏ hàng!');
    }
    
    return response.json();
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    throw error;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể xóa sản phẩm khỏi giỏ hàng!');
    }
    
    return response.json();
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
    throw error;
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (cartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể xóa giỏ hàng!');
    }
    
    return response;
  } catch (error) {
    console.error('Lỗi khi xóa giỏ hàng:', error);
    throw error;
  }
};

// Xóa giỏ hàng
export const deleteCart = async (cartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${cartId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể xóa giỏ hàng!');
    }
    
    return response;
  } catch (error) {
    console.error('Lỗi khi xóa giỏ hàng:', error);
    throw error;
  }
};

// Cập nhật sản phẩm trong giỏ hàng
export const updateCartItem = async (cartItemId, { quantity, size, color, availableSizes, availableColors }) => {
  try {
    if (size && availableSizes && !availableSizes.includes(size)) {
      throw new Error('Size không hợp lệ cho sản phẩm này!');
    }
    if (color && availableColors && !availableColors.includes(color)) {
      throw new Error('Màu sắc không hợp lệ cho sản phẩm này!');
    }
    if (quantity <= 0) {
      throw new Error('Số lượng phải lớn hơn 0!');
    }

    const response = await fetch(`${API_BASE_URL}/items/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        quantity,
        size,
        color
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Không thể cập nhật sản phẩm trong giỏ hàng!');
    }

    return response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm trong giỏ hàng:', error);
    throw error;
  }
};