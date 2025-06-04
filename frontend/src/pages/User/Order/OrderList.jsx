import React, { useEffect, useState, useContext } from "react";
import Navbar from '../../../components/Navbar/Navbar';
import "./OrderList.css";
import { AuthContext } from '../../../context/AuthContext';
import CustomBreadcrumb from '../../../components/Breadcrumb';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import { useLoading } from '../../../context/LoadingContext';
import { getMyOrders, cancelOrder } from '../../../services/orderService'

const statusStyles = {
  ORDERED: "order-status ordered",
  COMPLETED: "order-status completed",
  CANCELED: "order-status canceled",
  SHIPPING: "order-status shipping",
  PENDING: "order-status pending",
};

const formatCurrency = (value) => {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
};

const OrderList = () => {
  const [expandedOrders, setExpandedOrders] = useState({});
  const [orders, setOrders] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  const toggleProducts = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const { setLoading } = useLoading();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders();
      console.log(res.content);
      setOrders(res.content);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isLoggedIn]);

  const handleCancelOrder = async (orderId) => {
    setLoading(true);
    try {
      const res = await cancelOrder(orderId);
      console.log("Đơn hàng huỷ: ", res)
      fetchOrders();
    } catch (error) {
      console.log("Lỗi khi huỷ đơn hàng: ", error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <CustomBreadcrumb
        items={[
          {
            title: "Order",
          },
        ]}
      />
      <div className="order-list-container">
        <h1 className="order-list-title">ORDER HISTORY</h1>

        {orders.map((order) => (
          <div key={order.id} className="order-block">
            <div className="order-header">
              <div className="order-info">
                <div className="order-id-date">
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Order Date:</strong> {order.orderDate}</p>
                </div>
                <p><strong>Address:</strong> {order.address.fullAddress}, {order.address.district}, {order.address.province}</p>
                <div className="order-total-payment">
                  <p><strong>Number of products:</strong> {order.totalItems}</p>
                  <p><strong>Total:</strong> {formatCurrency(order.totalOrderPrice)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className={statusStyles[order.orderStatus]}>
                  {order.orderStatus}
                </span>
                {order.orderStatus === "PENDING" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Huỷ đơn
                  </button>
                )}
                <button
                  onClick={() => toggleProducts(order.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#007bff',
                  }}
                  title={expandedOrders[order.id] ? "Hide Products" : "Show Products"}
                >
                  {expandedOrders[order.id] ? <UpOutlined /> : <DownOutlined />}
                </button>
              </div>
            </div>
            {expandedOrders[order.id] && (
              <div className="order-products" style={{ transition: 'opacity 0.3s ease' }}>
                {order.orderItems.map((orderItem) => (
                  <div key={orderItem.id} className="order-item">
                    <Image
                      width={80}
                      height={80}
                      src={orderItem.product.imgurls[0]}
                      alt={orderItem.product.name}
                      className="order-image"
                      placeholder={
                        <Image
                          preview={false}
                          src={`${orderItem.product.imgurls[0]}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_80,w_80`}
                          width={80}
                          height={80}
                        />
                      }
                    />
                    <div className="order-details">
                      <h2 className="order-name">{orderItem.product.name}</h2>
                      <div className="product-variant">
                        <span>Size: {orderItem.size}</span> | <span>Color: {orderItem.color}</span>
                      </div>
                      <div className="product-price-qty">
                        <span>Quantity: {orderItem.quantity}</span>
                        <span>Price: {formatCurrency(orderItem.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;