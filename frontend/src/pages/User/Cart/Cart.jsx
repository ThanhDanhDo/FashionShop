import React, { useState, useEffect, useContext } from 'react';
import { getCartItems, removeFromCart, getActiveCart, updateCartItem } from '../../../services/cartService';
import { getProductById } from '../../../services/productService';
import { AuthContext } from '../../../context/AuthContext';
import './Cart.css';
import Navbar from '../../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import CustomBreadcrumb from '../../../components/Breadcrumb';
import FooterComponent from '../../../components/Footer/Footer';
import { useLoading } from '../../../context/LoadingContext';

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
};

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const { isLoggedIn, cartId, updateCartId } = useContext(AuthContext);
  const navigate = useNavigate();
  const placeholderImage = "/images/image1.png";

  // Cache cho getProductById
  const productCache = new Map();

  const { setLoading } = useLoading();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setLoading(true);
    fetchCartItems().finally(() => setLoading(false));
  }, [isLoggedIn, cartId]);

  const fetchCartItems = async () => {
    try {
      // KHÔNG setLoading ở đây nữa, chỉ set ở useEffect
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
    }
  };

  const handleEditClick = (item) => {
    setEditItem({
      id: item.id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      availableSizes: item.availableSizes,
      availableColors: item.availableColors
    });
  };

  const handleModalChange = (field, value) => {
    setEditItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModalSubmit = async () => {
    if (updating || !editItem) return;
    setUpdating(true);
    try {
      await updateCartItem(editItem.id, {
        quantity: editItem.quantity,
        size: editItem.size,
        color: editItem.color,
        availableSizes: editItem.availableSizes,
        availableColors: editItem.availableColors
      });
      await fetchCartItems();
      setSuccessMessage('Cập nhật sản phẩm thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setEditItem(null);
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

  if (error) return <div>Lỗi: {error}</div>;

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + tax;

  const handleCheckout = () => {
    localStorage.setItem("totalPriceToPay", orderTotal);
    navigate('/Payment ');
  }

  return (
    <div>
      <Navbar />
      <CustomBreadcrumb
        items={[
          {
            title: 'Cart',
          },
        ]}
      />

      <div className="cart-page-container">
        <div class="cart-header">
          <h1 class="cart-main-title">Your Cart</h1>
        </div>
        {successMessage && <div className="success-message">{successMessage}</div>}

        {cartItems.length > 0 ? (
          <div className="cart-layout">
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
                      <p className="item-attribute">Color: {item.color}</p>
                      <p className="item-attribute">Size: {item.size}</p>
                      <p className="item-attribute">Quantity: {item.quantity}</p>
                      <p className="item-price">{formatCurrency(item.product.price)}</p>
                    </div>
                    <div className="item-actions">
                      <div className="item-total-section">
                        <span className="item-total-label">Total:</span>
                        <span className="item-total-value">{formatCurrency(calculateItemTotal(item))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-action-icons">
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
                    <div className="item-edit-wrapper">
                      <button
                        className="edit-icon-button"
                        onClick={() => handleEditClick(item)}
                        disabled={updating}
                      >
                        ✎
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                  onClick={handleCheckout}
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

        {editItem && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h2>Edit Item</h2>
              <div className="edit-form">
                {/* Color selection */}
                <div className="edit-form-field">
                  <label>Color:</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    {editItem.availableColors.map((color) => (
                      <div
                        key={color}
                        onClick={() => handleModalChange('color', color)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: color.toLowerCase(),
                          border: editItem.color === color ? '2px solid black' : '1px solid #ccc',
                          cursor: 'pointer',
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                {/* Size selection */}
                <div className="edit-form-field">
                  <label>Size:</label>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '5px', flexWrap: 'wrap' }}>
                    {editItem.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleModalChange('size', size)}
                        onMouseEnter={(e) => { e.currentTarget.style.border = '1.5px solid gray'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.border = editItem.size === size ? '2px solid black' : '1px solid #ccc'; }}
                        style={{
                          margin: '6px',
                          padding: '12px',
                          fontSize: '16px',
                          minWidth: '40px',
                          borderRadius: '10px',
                          border: editItem.size === size ? '2px solid black' : '1px solid #ccc',
                          fontWeight: editItem.size === size ? 'bold' : 'normal',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Quantity selection */}
                <div className="edit-form-field">
                  <label>Quantity:</label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      width: '120px',
                    }}
                  >
                    <button
                      onClick={() => handleModalChange('quantity', Math.max(1, editItem.quantity - 1))}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px 12px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#555',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      -
                    </button>
                    <span
                      style={{
                        padding: '8px 12px',
                        fontSize: '18px',
                        textAlign: 'center',
                        borderLeft: '1px solid #ddd',
                        borderRight: '1px solid #ddd',
                        minWidth: '40px',
                      }}
                    >
                      {editItem.quantity}
                    </span>
                    <button
                      onClick={() => handleModalChange('quantity', editItem.quantity + 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px 12px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#555',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="edit-modal-actions">
                <button
                  className="edit-modal-save"
                  onClick={handleModalSubmit}
                  disabled={updating}
                >
                  Save
                </button>
                <button
                  className="edit-modal-cancel"
                  onClick={() => setEditItem(null)}
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <FooterComponent />
    </div>
  );
}

export default Cart;