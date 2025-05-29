import React, { useState } from "react";
import "./Payment.css";

const Payment = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "User",
      fullAddress:
        "Ấp Cái Đôi, Xã Phú Tân, Huyện Phú Tân, Tỉnh Cà Mau",
      phone: "0123456789",
    },
  ]);
  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    if (selectedAddress === id && updated.length > 0) {
      setSelectedAddress(updated[0].id);
    }
  };
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    fullAddress: "",
    phone: "",
  });

  const [subtotal, setSubtotal] = useState(500000);
  const [discount, setDiscount] = useState(50000);
  const [shipping, setShipping] = useState(10000);

  const total = subtotal - discount + shipping;

  const handleAddAddress = () => {
    const newId = addresses.length + 1;
    setAddresses([...addresses, { ...newAddress, id: newId }]);
    setNewAddress({ name: "", fullAddress: "", phone: "" });
    setShowForm(false);
    setSelectedAddress(newId);
  };

  return (
    <div className="payment-container">
      <h2 className="section-title">Select Delivery Address</h2>
      <div className="payment-grid">
        {/* Left Panel */}
        <div className="left-panel">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`address-box ${selectedAddress === addr.id ? "selected" : ""
                }`}
            >
              <div className="radio-group">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                />
                <label>{addr.name}</label>
              </div>
              <p>{addr.fullAddress}</p>
              <p>
                <strong>Mobile:</strong> {addr.phone}
              </p>
              <button
                className="delete-btn"
                onClick={() => handleDeleteAddress(addr.id)}
              >
                Delete
              </button>
            </div>
          ))}


          <div
            className="add-new-address"
            onClick={() => setShowForm(!showForm)}
          >
            + ADD NEW ADDRESS
          </div>

          {showForm && (
            <div className="new-address-card">
              <h4 className="card-title">Add New Address</h4>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Full Address</label>
                <textarea
                  value={newAddress.fullAddress}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullAddress: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                />
              </div>
              <button className="add-btn" onClick={handleAddAddress}>
                Save Address
              </button>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <h3>Choose Payment Gateway</h3>
          <div className="payment-options">
            <label className="gateway-option">
              <input type="radio" name="payment" defaultChecked />
              <img src="/images/paypal.png" alt="PayPal" />
            </label>
          </div>

          <div className="summary-box">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{subtotal} VND</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span>-{discount} VND</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping} VND</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{total} VND</span>
            </div>
            <button className="checkout-btn">CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
