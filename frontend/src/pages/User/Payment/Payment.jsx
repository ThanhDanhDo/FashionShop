import React, { useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import "./Payment.css";
import { useNavigate } from "react-router-dom";
const Payment = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      phone: "0123456789",
      street: "Ấp Cái Đôi",
      ward: "Xã Phú Tân",
      district: "Huyện Phú Tân",
      province: "Tỉnh Cà Mau",
    },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [tempAddress, setTempAddress] = useState({});
  const [deleteMessage, setDeleteMessage] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    phone: "",
    street: "",
    ward: "",
    district: "",
    province: "",
  });

  const navigate = useNavigate();

  const [subtotal] = useState(500000);
  const [discount] = useState(50000);
  const [shipping] = useState(10000);

  const total = subtotal - discount + shipping;

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);

    if (selectedAddress === id && updated.length > 0) {
      setSelectedAddress(updated[0].id);
    }

    if (editingId === id) {
      setEditingId(null);
      setTempAddress({});
    }

    setDeleteMessage("Address has been deleted.");
    setTimeout(() => setDeleteMessage(""), 3000);
  };


  const handleEditAddress = (id) => {
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      setEditingId(id);
      setTempAddress({ ...addr });
    }
  };

  const handleSaveEdit = () => {
    const updated = addresses.map((a) =>
      a.id === editingId ? { ...tempAddress, id: editingId } : a
    );
    setAddresses(updated);
    setSelectedAddress(editingId);
    setEditingId(null);
    setTempAddress({});
  };
  const handleAddAddress = () => {
    const isEditing = newAddress.id != null;
    if (isEditing) {
      const updatedList = addresses.map((a) =>
        a.id === newAddress.id ? newAddress : a
      );
      setAddresses(updatedList);
      setSelectedAddress(newAddress.id);
    } else {
      const newId =
        addresses.length > 0 ? addresses[addresses.length - 1].id + 1 : 1;
      const addressToAdd = { ...newAddress, id: newId };
      setAddresses([...addresses, addressToAdd]);
      setSelectedAddress(newId);
    }

    setNewAddress({
      phone: "",
      street: "",
      ward: "",
      district: "",
      province: "",
    });
    setShowForm(false);
  };

  return (
    <div className="payment-container">
      {deleteMessage && (
        <div className="delete-message">
          {deleteMessage}
        </div>
      )}
      <button className="back-btn" onClick={() => navigate('/cart')}>
        ← Back to Cart
      </button>
      <h2 className="section-title">Select Delivery Address</h2>

      <div className="payment-grid">
        {/* Left Panel */}
        <div className="left-panel">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`address-box ${selectedAddress === addr.id ? "selected" : ""}`}
              onClick={() => setSelectedAddress(addr.id)}
            >
              <div className="address-header">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                />
                <div className="address-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(addr.id);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(addr.id);
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>

              {editingId === addr.id ? (
                <>
                  {["phone", "street", "ward", "district", "province"].map((field) => (
                    <div className="form-group" key={field}>
                      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        type="text"
                        value={tempAddress[field]}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setTempAddress({ ...tempAddress, [field]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <button
                    className="cancel-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(null);
                      setTempAddress({});
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="save-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveEdit();
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Province:</strong> {addr.province}</p>
                  <p><strong>District:</strong> {addr.district}</p>
                  <p><strong>Ward:</strong> {addr.ward}</p>
                  <p><strong>Full Address:</strong> {addr.street}, {addr.ward}, {addr.district}, {addr.province}</p>
                  <p><strong>Phone:</strong> {addr.phone}</p>
                </>
              )}
            </div>
          ))}

          {!showForm && !newAddress.id && (
            <button className="toggle-form-btn" onClick={() => setShowForm(true)}>
              Add New Address
            </button>
          )}

          {showForm && (
            <div className="new-address-card">
              <h4 className="card-title">{newAddress.id ? "Edit Address" : "Add New Address"}</h4>
              {["phone", "street", "ward", "district", "province"].map((field) => (
                <div className="form-group" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    value={newAddress[field]}
                    onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                  />
                </div>
              ))}
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setNewAddress({
                    phone: "",
                    street: "",
                    ward: "",
                    district: "",
                    province: "",
                  });
                }}
                style={{ marginBottom: "10px" }} // tạo khoảng cách
              >
                Cancel
              </button>
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
