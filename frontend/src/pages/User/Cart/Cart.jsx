import React, { useState, useEffect, useContext } from 'react';
import { getCartItems, removeFromCart, getActiveCart, updateCartItem } from '../../../services/cartService';
import { getProductById } from '../../../services/productService';
import { AuthContext } from '../../../context/AuthContext';
import './Cart.css';
import Navbar from '../../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
};

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const { isLoggedIn, cartId, updateCartId } = useContext(AuthContext);
  const navigate = useNavigate();
  const placeholderImage = "/images/image1.png";

  // Cache cho getProductById
  const productCache = new Map();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [isLoggedIn, cartId]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      let currentCartId = cartId;
  
      if (!currentCartId) {
        const activeCart = await getActiveCart();
        if (activeCart && activeCart.id) {
          currentCartId = activeCart.id;
          updateCartId(currentCartId);
        } else {
          setCartItems([]);
          return;
        }
      }
  
      const items = await getCartItems(currentCartId);
      // Lấy sizes và colors cho mỗi sản phẩm với cache
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          let productDetails = productCache.get(item.product.id);
          if (!productDetails) {
            productDetails = await getProductById(item.product.id);
            productCache.set(item.product.id, productDetails);
          }
          return {
            ...item,
            availableSizes: productDetails.size || [],
            availableColors: productDetails.color || []
          };
        })
      );
      setCartItems(enrichedItems);
    } catch (error) {
      setError('Không thể lấy thông tin giỏ hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = async (itemId, field, value) => {
    if (updating) return;
    setUpdating(true);
    try {
      const updatedItem = cartItems.find(item => item.id === itemId);
      if (updatedItem) {
        const updateData = {
          quantity: field === 'quantity' ? value : updatedItem.quantity,
          size: field === 'size' ? value : updatedItem.size,
          color: field === 'color' ? value : updatedItem.color,
          availableSizes: updatedItem.availableSizes,
          availableColors: updatedItem.availableColors
        };

        await updateCartItem(itemId, updateData);
        await fetchCartItems(); // Tải lại để đồng bộ
        setSuccessMessage('Cập nhật sản phẩm thành công!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      setError('Không thể cập nhật sản phẩm: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (cartItem) => {
    try {
      await removeFromCart(cartItem.id);
      await fetchCartItems();
    } catch (error) {
      setError('Không thể xóa sản phẩm: ' + error.message);
    }
  };

  const calculateItemTotal = (item) => {
    return item.product.price * item.quantity;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // Ví dụ thuế 10%
  const orderTotal = subtotal + tax;

  return (
    <div>
      <Navbar />
      <div className="breadcrumb">
        <a href="/">Home</a> {'>'} <span>Cart</span>
      </div>

      <div className="cart-page-container">
        <h1 className="cart-main-title">YOUR CART</h1>
        {successMessage && <div className="success-message">{successMessage}</div>}

        {cartItems.length > 0 ? (
          <div className="cart-layout">
            {/* Danh sách sản phẩm */}
            <div className="cart-items-column">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item-card">
                  <div className="item-image-wrapper">
                    <img
                      src={item.product.imgurls[0] || placeholderImage}
                      alt={item.product.name}
                      className="product-image-cart"
                    />
                  </div>
                  <div className="item-details-wrapper">
                    <div className="item-info">
                      <p className="item-name">{item.product.name}</p>
                      <div className="item-attribute">
                        <label htmlFor={`color-${item.id}`}>Color: </label>
                        <select
                          id={`color-${item.id}`}
                          value={item.color}
                          onChange={(e) => handleItemChange(item.id, 'color', e.target.value)}
                          disabled={updating || item.availableColors.length === 0}
                        >
                          {item.availableColors.length > 0 ? (
                            item.availableColors.map(color => (
                              <option key={color} value={color}>{color}</option>
                            ))
                          ) : (
                            <option value={item.color}>{item.color}</option>
                          )}
                        </select>
                      </div>
                      <div className="item-attribute">
                        <label htmlFor={`size-${item.id}`}>Size: </label>
                        <select
                          id={`size-${item.id}`}
                          value={item.size}
                          onChange={(e) => handleItemChange(item.id, 'size', e.target.value)}
                          disabled={updating || item.availableSizes.length === 0}
                        >
                          {item.availableSizes.length > 0 ? (
                            item.availableSizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))
                          ) : (
                            <option value={item.size}>{item.size}</option>
                          )}
                        </select>
                      </div>
                      <p className="item-price">{formatCurrency(item.product.price)}</p>
                    </div>
                    <div className="item-actions">
                      <div className="quantity-section">
                        <label htmlFor={`quantity-${item.id}`} className="quantity-label">Quantity</label>
                        <select
                          id={`quantity-${item.id}`}
                          className="quantity-select"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value, 10))}
                          disabled={updating}
                        >
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
                      onClick={() => handleRemoveItem(item)}
                      aria-label={`Xóa ${item.product.name}`}
                      disabled={updating}
                    >
                      {'×'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="cart-summary-column">
              <div className="cart-summary">
                <h2 className="cart-summary-title">Subtotal | {cartItems.length} Item</h2>
                <div className="cart-summary-row">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="cart-summary-row tax-row">
                  <span className="tax-note">Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="cart-summary-row order-total-row">
                  <span>SUBTOTAL</span>
                  <span>{formatCurrency(orderTotal)}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button
                  className="checkout-button-main"
                  onClick={() => navigate('/checkout')}
                  disabled={updating}
                >
                  CHECKOUT
                </button>
                <button
                  className="continue-shopping-button-secondary"
                  onClick={() => navigate('/products')}
                  disabled={updating}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart-empty">
            <h2 className="empty-cart-message">There is no products in your cart.</h2>
            <button
              className="continue-shopping-button-secondary"
              onClick={() => navigate('/products')}
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