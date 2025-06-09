import React, { useState, useEffect } from 'react';
import './Orders-admin.css';
import { Select, DatePicker, Space, Dropdown, Typography } from 'antd';
import 'antd/dist/reset.css';
import { DownOutlined } from '@ant-design/icons';
import { searchOrder, updateOrderStatus } from '../../../services/orderService';

const { RangePicker } = DatePicker;

const getNextValidStatuses = (currentStatus) => {
  switch (currentStatus) {
    case "PENDING":
      return ["CONFIRMED", "SHIPPED", "DELIVERED"];
    case "CONFIRMED":
      return ["SHIPPED", "DELIVERED"];
    case "SHIPPED":
      return ["DELIVERED"];
    default:
      return [];
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("ALL");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchOrderId, setSearchOrderId] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [searchType, setSearchType] = useState('Order ID');

  const searchTypeItems = [
    { key: 'Order ID', label: 'Order ID' },
    { key: 'User ID', label: 'User ID' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await searchOrder({
          id: searchType === 'Order ID' ? searchOrderId || undefined : undefined,
          userId: searchType === 'User ID' ? searchOrderId || undefined : undefined,
          orderStatus: filteredStatus !== 'ALL' ? filteredStatus : undefined,
          fromDateStr: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : undefined,
          toDateStr: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : undefined,
        });
        console.log('API Response:', data.content); // Log to inspect userId field
        setOrders(data.content || []);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm đơn hàng:', error);
      }
    };

    fetchOrders();
  }, [searchOrderId, filteredStatus, dateRange, searchType]);

  const handleStatusFilter = (status) => {
    setFilteredStatus(status);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order.orderId === orderId ? { ...order, status: updatedOrder.orderStatus } : order
        )
      );
    } catch (error) {
      console.log("Lỗi khi cập nhật trạng thái đơn hàng: ", error);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleSearchTypeSelect = ({ key }) => {
    setSearchType(key);
  };

  const filteredOrders = orders.filter(order => {
    if (filteredStatus !== "ALL" && order.status !== filteredStatus) return false;
    if (searchOrderId && searchType === 'Order ID' && !String(order.orderId).toLowerCase().includes(searchOrderId.toLowerCase())) return false;
    if (searchOrderId && searchType === 'User ID' && !String(order.userId).toLowerCase().includes(searchOrderId.toLowerCase())) return false;
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
      <div className="order-filter centered" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <input
            type="text"
            placeholder={`Search ${searchType}`}
            className="search-input"
            value={searchOrderId}
            onChange={e => setSearchOrderId(e.target.value)}
          />
          <Dropdown
            menu={{
              items: searchTypeItems,
              selectable: true,
              selectedKeys: [searchType],
              onSelect: handleSearchTypeSelect,
            }}
          >
            <Typography.Link className="filter-select">
              <Space>
                {searchType}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
          <RangePicker
            style={{ height: 38, borderRadius: 5 }}
            value={dateRange}
            onChange={setDateRange}
            allowClear
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {["ALL", "CONFIRMED", "SHIPPED", "DELIVERED", "PENDING", "CANCELLED"].map((status) => (
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
        ) : (
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
                    <strong>UserID:</strong> {order.userId || 'N/A'} &nbsp;&nbsp;
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
                      options={getNextValidStatuses(order.status).map(status => ({
                        label: status,
                        value: status
                      }))}
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
                        <div className="order-details-row">
                          <span><strong>Product Name:</strong> {product.name}</span>
                          <span><strong>Gender:</strong> {product.gender}</span>
                          <span><strong>Main Category:</strong> {product.mainCategory.name}</span>
                        </div>
                        <div className="order-details-row">
                          <span><strong>Product ID:</strong> {product.id}</span>
                          <span><strong>Size:</strong> {product.size}</span>
                          <span><strong>Sub Category:</strong> {product.subCategory.name}</span>
                        </div>
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