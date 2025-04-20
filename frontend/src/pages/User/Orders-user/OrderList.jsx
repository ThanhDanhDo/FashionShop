import React from "react";
import Navbar from '../../../components/Navbar/Navbar';
import "./OrderList.css";

const statusStyles = {
  ORDERED: "order-status ordered",
  COMPLETED: "order-status completed",
  CANCELED: "order-status canceled",
  SHIPPING: "order-status shipping",
  PENDING: "order-status pending",
};

// Mô phỏng dữ liệu: mỗi đơn hàng gồm nhiều sản phẩm
const orders = [
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
          size: "M",
          color: "Xanh dương",
        },
      {
        id: 2,
        name: "Quần dài",
        image: "/images/image4.png",
        quantity: 1,
        price: 320000,
        size: "X:",
        color: "Xanh dương",
      },
    ],
  },
  {
    orderId: "ORD002",
    date: "2025-04-12",
    status: "COMPLETED",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    paymentMethod: "Thanh toán khi nhận hàng",
    total: 320000,
    products: [
      {
        id: 3,
        name: "Áo caro",
        image: "/images/image2.png",
        quantity: 1,
        price: 320000,
        size: "L",
        color: "Xanh dương",
      },
    ],
  },
  {
    orderId: "ORD003",
    date: "2025-04-10",
    status: "SHIPPING",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    paymentMethod: "Thanh toán khi nhận hàng",
    total: 610000,
    products: [
      {
        id: 4,
        name: "Áo sơ mi trắng",
        image: "/images/image3.png",
        quantity: 1,
        price: 250000,
        size: "M",
        color: "Xanh dương",
      },
      {
        id: 5,
        name: "Quần kaki",
        image: "/images/image1.png",
        quantity: 1,
        price: 360000,
        size: "M",
        color: "Xanh dương",
      },
    ],
  },
  {
    orderId: "ORD004",
    date: "2025-04-08",
    status: "CANCELED",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    paymentMethod: "Thanh toán khi nhận hàng",
    total: 300000,
    products: [
      {
        id: 6,
        name: "Áo hoodie",
        image: "/images/image2.png",
        quantity: 1,
        price: 300000,
        size: "M",
        color: "Xanh dương",
      },
    ],
  },
  {
    orderId: "ORD005",
    date: "2025-04-06",
    status: "PENDING",
    address: "123 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    paymentMethod: "Thanh toán khi nhận hàng",
    total: 450000,
    products: [
      {
        id: 7,
        name: "Chân váy ngắn",
        image: "/images/image3.png",
        quantity: 1,
        price: 450000,
        size: "M",
        color: "Xanh dương",
      },
    ],
  },
];

const OrderList = () => {
  return (
    <div>
      <Navbar />
      <div className="breadcrumb">
        <a href="/">Trang chủ</a> {'>'} <span>Orders</span>
      </div>
      <div className="order-list-container">
        <h1 className="order-list-title">ORDER HISTORY</h1>

        {orders.map((order) => (
          <div key={order.orderId} className="order-block">
            <div className="order-header">
  <         div className="order-info">
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
  
            <span className={statusStyles[order.status]}>
              {order.status}
            </span>
            </div>
            <div className="order-products">
  {order.products.map((product) => (
    <div key={product.id} className="order-item">
      <img src={product.image} alt={product.name} className="order-image" />
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
