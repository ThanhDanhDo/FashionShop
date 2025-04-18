import React, { useState } from 'react';
import './Cart.css'; // Import file CSS
import Navbar from '../../../components/Navbar/Navbar';

// Dữ liệu mẫu cho giỏ hàng - Thêm color và size
const initialCartItems = [
  { id: 1, name: 'Váy dài', price: 400000, quantity: 1, color: 'WHITE', size: 'XL', image: '/images/image4.png' },
  { id: 2, name: 'Áo', price: 300000, quantity: 1, color: 'BLUE', size: 'XS', image: '/images/image2.png' },
];

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
};

function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const placeholderImage = "/images/image1.png";

  // Hàm xử lý thay đổi số lượng (cập nhật cho select)
  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (quantity >= 1) { // Có thể giới hạn số lượng tối đa nếu muốn
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
      );
    }
  };

  // Hàm xử lý xóa sản phẩm
  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Hàm tính tổng giá trị từng sản phẩm
  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  // Hàm tính tổng giá trị giỏ hàng
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // Ví dụ thuế 10%
  const orderTotal = subtotal + tax; // Tổng đơn hàng bao gồm thuế

  return (
    <div>
      <Navbar />
      <div className="breadcrumb">
        <a href="/">Home</a> {'>'} <span>Cart</span>
      </div>

      <div className="cart-page-container"> {/* Container chính cho trang */}
        <h1 className="cart-main-title">YOUR CART</h1> {/* Tiêu đề chính */}

        {cartItems.length > 0 ? (
          <div className="cart-layout"> {/* Container cho bố cục 2 cột */}

            {/* === Danh sách sản phẩm === */}
            <div className="cart-items-column">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item-card">
                  <div className="item-image-wrapper">
                    <img
                      src={item.image || placeholderImage}
                      alt={item.name}
                      className="product-image-cart"
                    />
                  </div>
                  <div className="item-details-wrapper">
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-attribute">Color: {item.color}</p>
                      <p className="item-attribute">Size: {item.size}</p>
                      {/* Thêm các thuộc tính khác nếu có */}
                      <p className="item-price">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="item-actions">
                      <div className="quantity-section">
                        <label htmlFor={`quantity-${item.id}`} className="quantity-label">Quantity</label>
                        <select
                          id={`quantity-${item.id}`}
                          className="quantity-select"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        >
                          {/* Tạo các option số lượng*/}
                          {[...Array(10).keys()].map(i => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                      <div className="item-total-section">
                        <span className="item-total-label">Total:</span>
                        <span className="item-total-value">{formatCurrency(calculateItemTotal(item))}</span>
                      </div>
                    </div>
                  </div>
                   <div className="item-remove-wrapper">
                     <button
                        className="remove-button-x"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Xóa ${item.name}`}
                      >
                        {'×'}
                      </button>
                   </div>
                </div>
              ))}
            </div>

            {/* === Tóm tắt đơn hàng === */}
            <div className="cart-summary-column">
              <div className="cart-summary">
                <h2 className="cart-summary-title">Subtotal  | {cartItems.length} Item</h2>
                <div className="cart-summary-row">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                 <div className="cart-summary-row total-row">
                 </div>
                 <div className="cart-summary-row tax-row">
                   <span className='tax-note'>Tax (10%)</span>
                   <span>{formatCurrency(tax)}</span> {/* Hiển thị tiền thuế */}
                 </div>
                <div className="cart-summary-row order-total-row">
                  <span>SUBTOTAL</span>
                  <span>{formatCurrency(orderTotal)}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button
                  className="checkout-button-main" // Class mới cho nút thanh toán
                  onClick={() => window.location.href = '/'}
                >
                  CHECKOUT
                </button>
                <button
                  className="continue-shopping-button-secondary" // Class mới cho nút tiếp tục
                  onClick={() => window.location.href = '/products'} // Giữ nguyên hoặc dùng router
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="cart-empty">
             {/* Giữ lại hoặc thay đổi thông báo giỏ hàng trống */}
             <h2 className="empty-cart-message">There is no products in your cart.</h2>
             <button
                className="continue-shopping-button-secondary"
                onClick={() => window.location.href = '/products'}
              >
                CONTINUE SHOPPING
              </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;