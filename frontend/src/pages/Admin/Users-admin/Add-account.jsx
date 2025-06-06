import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message, Modal } from 'antd';
import { createUserByAdmin } from '../../../services/userService';
import { getUserAddresses, addUserAddress, deleteUserAddress, updateUserAddress } from '../../../services/userService';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNotification } from '../../../components/NotificationProvider';
import './Add-account.css';

const { Option } = Select;

const genderOptions = [
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
  { value: 'Unisex', label: 'Unisex' },
];

const roleOptions = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'USER', label: 'USER' },
];

const AddAccount = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const api = useNotification();

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

  const onFinish = async (values) => {
    if (loading) return;
    setLoading(true);
    const newAccount = {
      lastName: values.lastName,
      firstName: values.firstName,
      email: values.email,
      password: values.password,
      gender: values.gender,
      role: values.role,
      phone: values.phone,
    };

    try {
      await createUserByAdmin(newAccount);
      message.success('Account added successfully');
      navigate('/Users-admin');
    } catch (e) {
      message.error(e.message || 'Failed to add account');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/Users-admin');
  };

  return (
    <div
      className="add-account"
      style={{
        maxWidth: 600,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        padding: '24px',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Add Account</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ width: '100%' }}
      >
        <div className="form-container">
          <div className="form-column">
            <div className="row">
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please enter password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
            </div>
            <div className="row">
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </div>
            <div className="row">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select options={genderOptions} placeholder="Select gender" />
              </Form.Item>
            </div>
            <div className="row">
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  {
                    pattern: /^[0-9]{10,15}$/,
                    message: 'Please enter a valid phone number (10-15 digits)',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select role' }]}
              >
                <Select options={roleOptions} placeholder="Select role" />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="address-section">
          <h2 className="section-title">Select Delivery Address
          {!showForm && (
            <button className="toggle-form-btn" onClick={() => setShowForm(true)}>
              Add New Address
            </button>
          )}
          </h2>
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
                      type="hidden"
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
                    <div class="action-bar">                   
                    <button
                      className="cancel-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                        setTempAddress({});
                      }}
                      style={{ marginBottom: "10px", width:'auto'}}
                    >
                      Cancel Edit
                    </button>
                    <button
                      className="add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEdit();
                      }}
                      style={{ marginLeft: "10px", width:'auto'}}
                    >
                      Save Edit
                    </button>
                    </div> 
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
              <div class="action-bar">
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
                style={{ marginBottom: "10px", width:'auto'}}
              >
                Cancel Address
              </button>
              <button className="add-btn" 
              onClick={handleAddAddress}
              style={{ marginLeft: "10px", width:'auto'}}>
                Save Address
              </button>
              </div>
            </div>
          )}
        </div>

        <div className="action-bar">
          <Button
            className="cancel-button"
            onClick={handleCancel}
            style={{ marginRight: 10 }}
          >
            Cancel
          </Button>
          <Button
            className="save-button"
            type="primary"
            htmlType="submit"
            onClick={() => form.submit()}
            loading={loading}
            disabled={loading}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddAccount;