import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Modal } from "antd";
import "./Payment.css";
import { useNavigate } from "react-router-dom";
import { getUserAddresses, addUserAddress, deleteUserAddress, updateUserAddress } from "../../../services/userService";
import { useNotification } from "../../../components/NotificationProvider";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Payment = () => {
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempAddress, setTempAddress] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    phone: "",
    fullAddress: "",
    ward: "",
    district: "",
    province: "",
  });
  const api = useNotification();

  const navigate = useNavigate();

  const [subtotal] = useState(500000);
  const [discount] = useState(50000);
  const [shipping] = useState(10000);

  const total = subtotal - discount + shipping;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await getUserAddresses();
      const normalized = (data || []).map(addr => ({
        ...addr,
        is_default: addr.isDefault ?? addr.is_default ?? addr.default
      }));
      // Sort addresses: default address at the top
      const sortedAddresses = normalized.sort((a, b) => 
        a.is_default === true ? -1 : b.is_default === true ? 1 : 0
      );
      setAddresses(sortedAddresses);
      if (sortedAddresses.length > 0) {
        setSelectedAddress(sortedAddresses[0].id);
      }
    } catch {
      api.error({
        message: 'Failed to load addresses',
        description: 'Could not fetch your addresses. Please try again later.',
      });
    }
  };

  const handleDeleteAddress = async (id) => {
    Modal.confirm({
      title: 'Remove Address',
      content: 'Are you sure you want to remove this address?',
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteUserAddress(id);
          api.success({
            message: 'Address removed',
            description: 'The address has been deleted successfully.',
          });
          fetchAddresses();
          if (selectedAddress === id && addresses.length > 1) {
            setSelectedAddress(addresses.find(addr => addr.id !== id).id);
          } else if (addresses.length === 1) {
            setSelectedAddress(null);
          }
        } catch {
          api.error({
            message: 'Remove failed',
            description: 'Could not remove address. Please try again.',
          });
        }
      },
    });
  };

  const handleEditAddress = (address) => {
    setTempAddress({ ...address });
    setEditingId(address.id);
  };

  const handleSaveEdit = async () => {
    try {
      await updateUserAddress(editingId, tempAddress);
      api.success({
        message: 'Address updated',
        description: 'The address has been updated successfully.',
      });
      setEditingId(null);
      setTempAddress({});
      fetchAddresses();
    } catch {
      api.error({
        message: 'Update failed',
        description: 'Could not update address. Please try again.',
      });
    }
  };

  const handleAddAddress = async () => {
    try {
      await addUserAddress(newAddress);
      api.success({
        message: 'Address added successfully',
        description: 'Your new address has been saved.',
      });
      setNewAddress({
        phone: "",
        fullAddress: "",
        ward: "",
        district: "",
        province: "",
      });
      setShowForm(false);
      fetchAddresses();
    } catch {
      api.error({
        message: 'Add address failed',
        description: 'Could not add address. Please try again.',
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setTempAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="payment-container">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <FaArrowLeft /> Back to Cart
      </button>
      <h2 className="section-title">Select Delivery Address</h2>

      <div className="payment-grid">
        {/* Left Panel */}
        <div className="left-panel">
          {addresses.length === 0 ? (
            <p>No addresses found.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-box ${selectedAddress === addr.id ? "selected" : ""}`}
                onClick={() => setSelectedAddress(addr.id)}
              >
                <div className="address-header">
                  <div className="radio-group">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                    />
                    {addr.is_default && <span className="default-label">Default</span>}
                  </div>
                  <div className="address-actions">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(addr);
                      }}
                    >
                      <EditOutlined />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr.id);
                      }}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>

                {editingId === addr.id ? (
                  <>
                    {["province", "district", "ward", "fullAddress", "phone"].map((field) => (
                      <div className="form-group" key={field}>
                        <label>
                          {field === "fullAddress"
                            ? "Full Address"
                            : field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={tempAddress[field] || ""}
                          onClick={(e) => e.stopPropagation()}
                          onChange={handleEditChange}
                        />
                      </div>
                    ))}
                    <button
                      className="save-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEdit();
                      }}
                    >
                      Save
                    </button>
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
                  </>
                ) : (
                  <>
                    <p><strong>Province:</strong> {addr.province}</p>
                    <p><strong>District:</strong> {addr.district}</p>
                    <p><strong>Ward:</strong> {addr.ward}</p>
                    <p><strong>Full Address:</strong> {addr.fullAddress}</p>
                    <p><strong>Phone:</strong> {addr.phone}</p>
                  </>
                )}
              </div>
            ))
          )}

          {!showForm && (
            <button className="toggle-form-btn" onClick={() => setShowForm(true)}>
              Add New Address
            </button>
          )}

          {showForm && (
            <div className="new-address-card">
              <h4 className="card-title">Add New Address</h4>
              {["province", "district", "ward", "fullAddress", "phone"].map((field) => (
                <div className="form-group" key={field}>
                  <label>
                    {field === "fullAddress"
                      ? "Full Address"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={newAddress[field]}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        [field]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
              <button className="add-btn" onClick={handleAddAddress}>
                Save Address
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setNewAddress({
                    phone: "",
                    fullAddress: "",
                    ward: "",
                    district: "",
                    province: "",
                  });
                }}
                style={{ marginBottom: "10px" }}
              >
                Cancel
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