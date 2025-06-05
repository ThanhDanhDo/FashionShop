import React, { useState } from 'react';
import './Orders-admin.css';
import { Select, DatePicker, Space } from 'antd';
import 'antd/dist/reset.css';

const { RangePicker } = DatePicker;

const mockOrders = [
  {
    orderId: "ORD001",
    date: "2025-04-18",
    status: "ORDERED",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    phone: "0987654321",
    paymentId: "PAY123456",
    total: 890000,
    products: [
      {
        id: 1,
        name: "Áo thun xanh",
        image: "/images/image1.png",
        quantity: 2,
        price: 570000,
        size: "L",
        color: "Blue",
        mainCategory: "T-shirt",
        subCategory: "Short-sleeve T-shirt",
        gender: "Men",
      },
      {
        id: 2,
        name: "Quần dài",
        image: "/images/image4.png",
        quantity: 1,
        price: 320000,
        size: "M",
        color: "Black",
        mainCategory: "Bottom",
        subCategory: "Long",
        gender: "Unisex",
      },
    ],
  },
  {
    orderId: "ORD002",
    date: "2025-04-12",
    status: "COMPLETED",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    phone: "0987654321",
    paymentId: "PAY654321",
    total: 420000,
    products: [
      {
        id: 3,
        name: "Áo caro",
        image: "/images/image2.png",
        quantity: 1,
        price: 420000,
        size: "XL",
        color: "Red",
        mainCategory: "Shirt",
        subCategory: "Long-sleeve Shirt",
        gender: "Women",
      },
    ],
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [filteredStatus, setFilteredStatus] = useState("ALL");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchOrderId, setSearchOrderId] = useState('');
  const [dateRange, setDateRange] = useState([]);

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

  // Lọc theo Order ID và ngày
  const filteredOrders =
    orders.filter(order => {
      // Lọc theo status
      if (filteredStatus !== "ALL" && order.status !== filteredStatus) return false;
      // Lọc theo Order ID
      if (searchOrderId && !order.orderId.toLowerCase().includes(searchOrderId.toLowerCase())) return false;
      // Lọc theo ngày
      if (dateRange && dateRange.length === 2) {
        const orderDate = new Date(order.date);
        const start = dateRange[0]?.startOf?.('day') ? dateRange[0].startOf('day').toDate() : dateRange[0]?.toDate?.();
        const end = dateRange[1]?.endOf?.('day') ? dateRange[1].endOf('day').toDate() : dateRange[1]?.toDate?.();
        if (start && orderDate < start) return false;
        if (end && orderDate > end) return false;
      }
      return true;
    });

  return (
    <div
      className="orders-container"
      style={{
        background: "#ffffff",
        padding: "20px",
        minHeight: "100vh",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e0e0e0",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Bộ lọc */}
      <div className="order-filter centered" style={{ marginBottom: 24 }}>
        {/* Hàng trên: Search + Date */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Search Order ID"
            className="search-input"
            style={{ width: 200 }}
            value={searchOrderId}
            onChange={e => setSearchOrderId(e.target.value)}
          />
          <RangePicker
            style={{ height: 38, borderRadius: 5 }}
            value={dateRange}
            onChange={setDateRange}
            allowClear
          />
        </div>
        {/* Hàng dưới: Status filter buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {["ALL", "ORDERED", "COMPLETED", "CANCELED", "PENDING"].map((status) => (
            <button
              key={status}
              onClick={() => setFilteredStatus(status)}
              className={filteredStatus === status ? "filter-button active" : "filter-button"}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <p>There are no orders with this status.</p>
        ) :
          (
            filteredOrders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <div>
                    <p>
                      <strong>OrderID:</strong> {order.orderId} &nbsp;&nbsp;
                      <strong>Payment ID:</strong> {order.paymentId} &nbsp;&nbsp;
                      <strong>Order Date:</strong> {order.date}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.address} &nbsp;&nbsp;
                      <strong>Phone:</strong> {order.phone}
                    </p>
                    <p>
                      <strong>Total price:</strong> {order.total.toLocaleString()} VND &nbsp;&nbsp;
                      <strong>Total items:</strong> {order.products.reduce((sum, p) => sum + p.quantity, 0)} &nbsp;&nbsp;
                    </p>
                    <div className="order-footer">
                      <button className="toggle-button" onClick={() => toggleExpand(order.orderId)}>
                        {expandedOrders[order.orderId] ? 'Less ▲' : 'More ▼'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <div>
                      <Select
                        value={order.status}
                        style={{ width: 150 }}
                        onChange={(value) => handleStatusChange(order.orderId, value)}
                        dropdownStyle={{ borderRadius: '8px' }}
                        className={`status-select status-${order.status}`}
                        options={[
                          { label: 'ORDERED', value: 'ORDERED' },
                          { label: 'COMPLETED', value: 'COMPLETED' },
                          { label: 'CANCELED', value: 'CANCELED' },
                          { label: 'PENDING', value: 'PENDING' },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {expandedOrders[order.orderId] && (
                  <div className="order-products">
                    {order.products.map((product) => (
                      <div key={product.id} className="order-item">
                        <img src={product.image} alt={product.name} className="order-image" />
                        <div className="order-details order-details-grid-fix">
                          {/* Hàng 1 */}
                          <div className="order-details-row">
                            <span><strong>Product Name:</strong> {product.name}</span>
                            <span><strong>Gender:</strong> {product.gender}</span>
                            <span><strong>Main Category:</strong> {product.mainCategory}</span>
                          </div>
                          {/* Hàng 2 */}
                          <div className="order-details-row">
                            <span><strong>Product ID:</strong> {product.id}</span>
                            <span><strong>Size:</strong> {product.size}</span>
                            <span><strong>Sub Category:</strong> {product.subCategory}</span>
                          </div>
                          {/* Hàng 3 */}
                          <div className="order-details-row">
                            <span><strong>Quantity:</strong> {product.quantity}</span>
                            <span><strong>Color:</strong> {product.color}</span>
                            <span><strong>Price:</strong> {product.price.toLocaleString()} VND</span>
                          </div>
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
