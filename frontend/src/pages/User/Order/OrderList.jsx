import React, { useState } from "react";
import Navbar from '../../../components/Navbar/Navbar';
import "./OrderList.css";
import CustomBreadcrumb from '../../../components/Breadcrumb';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Image } from 'antd';

const statusStyles = {
  ORDERED: "order-status ordered",
  COMPLETED: "order-status completed",
  CANCELED: "order-status canceled",
  SHIPPING: "order-status shipping",
  PENDING: "order-status pending",
};

// Simulated data: each order contains multiple products
const orders = [
  {
    orderId: "ORD001",
    date: "2025-04-18",
    status: "ORDERED",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hanoi",
    paymentMethod: "Cash on Delivery",
    total: 890000,
    products: [
      {
        id: 1,
        name: "Blue T-shirt",
        image: "/images/image1.png",
        quantity: 2,
        price: 570000,
        size: "M",
        color: "Blue",
      },
      {
        id: 2,
        name: "Long Pants",
        image: "/images/image4.png",
        quantity: 1,
        price: 320000,
        size: "XL",
        color: "Blue",
      },
    ],
  },
  {
    orderId: "ORD002",
    date: "2025-04-12",
    status: "COMPLETED",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hanoi",
    paymentMethod: "Cash on Delivery",
    total: 320000,
    products: [
      {
        id: 3,
        name: "Checkered Shirt",
        image: "/images/image2.png",
        quantity: 1,
        price: 320000,
        size: "L",
        color: "Blue",
      },
    ],
  },
  {
    orderId: "ORD003",
    date: "2025-04-10",
    status: "SHIPPING",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hanoi",
    paymentMethod: "Cash on Delivery",
    total: 610000,
    products: [
      {
        id: 4,
        name: "White Shirt",
        image: "/images/image3.png",
        quantity: 1,
        price: 250000,
        size: "M",
        color: "Blue",
      },
      {
        id: 5,
        name: "Khaki Pants",
        image: "/images/image1.png",
        quantity: 1,
        price: 360000,
        size: "M",
        color: "Blue",
      },
    ],
  },
  {
    orderId: "ORD004",
    date: "2025-04-08",
    status: "CANCELLED",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hanoi",
    paymentMethod: "Cash on Delivery",
    total: 280000,
    products: [
      {
        id: 6,
        name: "Hoodie",
        image: "/images/image2.png",
        quantity: 1,
        price: 280000,
        size: "M",
        color: "Blue",
      },
    ],
  },
  {
    orderId: "ORD005",
    date: "2025-04-06",
    status: "PENDING",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hanoi",
    paymentMethod: "Cash on Delivery",
    total: 450000,
    products: [
      {
        id: 7,
        name: "Short Skirt",
        image: "/images/image3.png",
        quantity: 1,
        price: 450000,
        size: "M",
        color: "Blue",
      },
    ],
  },
];

const OrderList = () => {
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleProducts = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

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
          <div key={order.orderId} className="order-block">
            <div className="order-header">
              <div className="order-info">
                <div className="order-id-date">
                  <p><strong>Order ID:</strong> {order.orderId}</p>
                  <p><strong>Order Date:</strong> {order.date}</p>
                </div>
                <p><strong>Address:</strong> {order.address}</p>
                <div className="order-total-payment">
                  <p><strong>Total:</strong> {order.total.toLocaleString()} VND</p>
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className={statusStyles[order.status]}>
                  {order.status}
                </span>
                <button
                  onClick={() => toggleProducts(order.orderId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#007bff',
                  }}
                  title={expandedOrders[order.orderId] ? "Hide Products" : "Show Products"}
                >
                  {expandedOrders[order.orderId] ? <UpOutlined /> : <DownOutlined />}
                </button>
              </div>
            </div>
            {expandedOrders[order.orderId] && (
              <div className="order-products" style={{ transition: 'opacity 0.3s ease' }}>
                {order.products.map((product) => (
                  <div key={product.id} className="order-item">
                    <Image
                      width={80}
                      height={80}
                      src={product.image}
                      alt={product.name}
                      className="order-image"
                      placeholder={
                        <Image
                          preview={false}
                          src={`${product.image}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_80,w_80`}
                          width={80}
                          height={80}
                        />
                      }
                    />
                    <div className="order-details">
                      <h2 className="order-name">{product.name}</h2>
                      <div className="product-variant">
                        <span>Size: {product.size}</span> | <span>Color: {product.color}</span>
                      </div>
                      <div className="product-price-qty">
                        <span>Quantity: {product.quantity}</span>
                        <span>Price: {product.price.toLocaleString()} VND</span>
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