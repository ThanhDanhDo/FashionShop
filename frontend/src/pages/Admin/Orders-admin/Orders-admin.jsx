import React, { useState, useEffect } from 'react';
import './Orders-admin.css';
import { Select, DatePicker, Space, Dropdown, Typography, Pagination } from 'antd';
import 'antd/dist/reset.css';
import { DownOutlined } from '@ant-design/icons';
import { searchOrder, updateOrderStatus } from '../../../services/orderService';
import FullPageSpin from '../../../components/ListSpin'; // Import FullPageSpin

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const searchTypeItems = [
    { key: 'Order ID', label: 'Order ID' },
    { key: 'User ID', label: 'User ID' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await searchOrder({
          id: searchType === 'Order ID' ? searchOrderId || undefined : undefined,
          userId: searchType === 'User ID' ? searchOrderId || undefined : undefined,
          orderStatus: filteredStatus !== 'ALL' ? filteredStatus : undefined,
          fromDateStr: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : undefined,
          toDateStr: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : undefined,
          page: currentPage - 1,
          size: pageSize,
        });
        setOrders(data.content || []);
        setTotalOrders(data.totalElements || 0);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm đơn hàng:', error);
        setOrders([]);
        setTotalOrders(0);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchOrders();
  }, [searchOrderId, filteredStatus, dateRange, searchType, currentPage, pageSize]);

  const handleStatusFilter = (status) => {
    setFilteredStatus(status);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
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
    setCurrentPage(1); // Reset về trang 1 khi thay đổi loại tìm kiếm
  };

  // Lọc và phân trang dữ liệu
  const paginatedOrders = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
            onChange={e => { setSearchOrderId(e.target.value); setCurrentPage(1); }}
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
              onClick={() => handleStatusFilter(status)}
              className={filteredStatus === status ? "filter-button active" : "filter-button"}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {loading ? (
          <FullPageSpin /> // Hiển thị FullPageSpin khi loading
        ) : paginatedOrders.length === 0 ? (
          <p>There are no orders with this status.</p>
        ) : (
          paginatedOrders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div>
                  <p>
                    <strong>OrderID:</strong> {order.orderId}   
                    <strong>Payment ID:</strong> {order.paymentId}   
                    <strong>Order Date:</strong> {order.date}
                  </p>
                  <p>
                    <strong>UserID:</strong> {order.userId || 'N/A'}   
                    <strong>Address:</strong> {order.address}   
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p>
                    <strong>Total price:</strong> {order.total.toLocaleString()} VND   
                    <strong>Total items:</strong> {order.products.reduce((sum, p) => sum + p.quantity, 0)}   
                  </p>
                  <div className="order-footer">
                    <button className="toggle-button" onClick={() => toggleExpand(order.orderId)}>
                      {expandedOrders[order.orderId] ? 'Less ▲' : 'More ▼'}
                    </button>
                  </div>
                </div>
                <div>
                  <Select
                    value={order.status}
                    style={{ width: 150 }}
                    onChange={(value) => handleStatusChange(order.orderId, value)}
                    className={`status-select status-${order.status}`}
                    options={getNextValidStatuses(order.status).map(status => ({
                      label: status,
                      value: status
                    }))}
                  />
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

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalOrders}
          showQuickJumper
          showSizeChanger
          pageSizeOptions={['5', '10', '20', '50']}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </div>
    </div>
  );
};

export default Orders;