import React, { useState } from 'react';
import './Orders-admin.css';

const mockOrders = [
  {
    orderId: "ORD001",
    date: "2025-04-18",
    status: "ORDERED",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    paymentMethod: "Thanh toán khi nhận hàng",
    total: 890000,
    products: [
      {
        id: 1,
        name: "Áo thun xanh",
        image: "/images/image1.png",
        quantity: 2,
        price: 570000,
      },
      {
        id: 2,
        name: "Quần dài",
        image: "/images/image4.png",
        quantity: 1,
        price: 320000,
      },
    ],
  },
  {
    orderId: "ORD002",
    date: "2025-04-12",
    status: "COMPLETED",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    paymentMethod: "Thanh toán khi nhận hàng",
    total: 420000,
    products: [
      {
        id: 3,
        name: "Áo caro",
        image: "/images/image2.png",
        quantity: 1,
        price: 420000,
      },
    ],
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [filteredStatus, setFilteredStatus] = useState("ALL");
  const [expandedOrders, setExpandedOrders] = useState({});

  const handleStatusFilter = (status) => {
    setFilteredStatus(status);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const filteredOrders =
    filteredStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === filteredStatus);

  return (
    <div className="orders-container">
      <h1 className="orders-title">Lịch sử đơn hàng</h1>

      <div className="order-filter centered">
        {["ALL", "ORDERED", "COMPLETED", "CANCELED","PENDING"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusFilter(status)}
            className={filteredStatus === status ? "filter-button active" : "filter-button"}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <p>Không có đơn hàng nào với trạng thái này.</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div>
                  <p><strong>Mã đơn:</strong> {order.orderId} &nbsp;&nbsp; <strong>Ngày đặt:</strong> {order.date}</p>
                  <p><strong>Địa chỉ:</strong> {order.address}</p>
                  <p><strong>Tổng tiền:</strong> {order.total.toLocaleString()} VND &nbsp;&nbsp; <strong>Phương thức:</strong> {order.paymentMethod}</p>
                  <div className="order-footer">
                <button className="toggle-button" onClick={() => toggleExpand(order.orderId)}>
                      {expandedOrders[order.orderId] ? 'Ẩn sản phẩm ▲' : 'Xem thêm ▼'}
                </button>
                </div>
                </div>
                <div>
                  <select
                    className="status-dropdown"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                  >
                    <option value="ORDERED">ORDERED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELED">CANCELED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              {expandedOrders[order.orderId] && (
                <div className="order-products">
                  {order.products.map((product) => (
                    <div key={product.id} className="order-item">
                      <img src={product.image} alt={product.name} className="order-image" />
                      <div className="order-details">
                        <h4>{product.name}</h4>
                        <p>Số lượng: {product.quantity}</p>
                        <p>Giá: {product.price.toLocaleString()} VND</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
