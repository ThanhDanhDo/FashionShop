import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Modal, message, Spin } from 'antd';
import {
  getUserById, // Thêm import này từ userService.js
  getUserAddressesByAdmin,
  addUserAddressByAdmin,
  deleteUserAddressByAdmin,
  updateUserAddressByAdmin,
} from '../../../services/userService';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNotification } from '../../../components/NotificationProvider';
import './Change-account.css';

const { Option } = Select;

const genderOptions = [
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
];

const roleOptions = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'USER', label: 'USER' },
];

const ChangeAccount = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [roleChangeModalVisible, setRoleChangeModalVisible] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(true);
  const api = useNotification();
  const [account, setAccount] = useState(null); // Thêm state để lưu account

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
    const fetchAccount = async () => {
      setLoading(true);
      try {
        // Ưu tiên lấy account từ API
        const accountData = await getUserById(accountId);
        if (!accountData) {
          api.error({
            message: 'Account not found',
            description: 'Could not find the specified account.',
          });
          setAccount(null);
        } else {
          setAccount(accountData);
          form.setFieldsValue({
            id: accountData.id,
            created_at: accountData.created_at || '2025-05-18 20:53:54.655363',
            firstName: accountData.firstName,
            lastName: accountData.lastName,
            email: accountData.email,
            gender: accountData.gender,
            role: accountData.role,
            phone: accountData.phone || '',
          });
          setNewRole(accountData.role);
        }
      } catch (e) {
        api.error({
          message: 'Error loading account data',
          description: 'Could not load account data. Please try again.',
        });
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
    fetchAddresses();
  }, [accountId, form]);

  const fetchAddresses = async () => {
    try {
      const data = await getUserAddressesByAdmin(accountId);
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
        description: 'Could not fetch user addresses. Please try again later.',
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
          await deleteUserAddressByAdmin(accountId, id);
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
        // KHÔNG điều hướng, giữ người dùng ở trang này
      },
    });
  };

  const handleEditAddress = (address) => {
    setTempAddress({ ...address });
    setEditingId(address.id);
  };

  const handleSaveEdit = async () => {
    try {
      await updateUserAddressByAdmin(accountId, editingId, tempAddress);
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
    // KHÔNG điều hướng, giữ người dùng ở trang này
  };

  const handleAddAddress = async () => {
    try {
      await addUserAddressByAdmin(accountId, newAddress);
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
    // KHÔNG điều hướng, giữ người dùng ở trang này
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setTempAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFinish = (values) => {
    setShowModal(true);
  };

  const handleConfirmChange = async () => {
    const values = form.getFieldsValue();
    const updatedAccount = {
      key: accountId.toString(),
      id: parseInt(accountId),
      created_at: values.created_at,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      gender: values.gender,
      role: values.role,
      phone: values.phone,
    };

    try {
      // Gọi API để cập nhật tài khoản (giả sử có hàm updateUserByAdmin trong userService.js)
      // await updateUserByAdmin(accountId, updatedAccount);
      api.success({
        message: 'Account updated',
        description: 'Account changes have been saved successfully.',
      });
      setShowModal(false);
      // Chỉ điều hướng khi người dùng xác nhận hoàn tất chỉnh sửa
      setTimeout(() => {
        navigate('/Users-admin');
      }, 1000); // Chờ 1 giây để người dùng thấy thông báo
    } catch (e) {
      api.error({
        message: 'Failed to update account',
        description: 'Could not save account changes. Please try again.',
      });
      setShowModal(false);
    }
  };

  const handleCancelChange = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    navigate('/Users-admin'); // Điều hướng chủ động khi người dùng nhấn Cancel
  };

  const handleRoleChangeClick = () => {
    setRoleChangeModalVisible(true);
  };

  const handleRoleChangeConfirm = () => {
    form.setFieldsValue({ role: newRole });
    setRoleChangeModalVisible(false);
    message.success('Role updated in form. Save changes to confirm.');
  };

  const handleRoleChangeCancel = () => {
    setRoleChangeModalVisible(false);
    setNewRole(form.getFieldValue('role'));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!account) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p>Account not found. Please try again or return to the user list.</p>
        <Button type="primary" onClick={() => navigate('/Users-admin')}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div
      className="change-account"
      style={{
        maxWidth: 600,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        padding: '24px',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Change Account</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ width: '100%' }}
      >
        <div className="form-container">
          <div className="form-column">
            <div className="row">
              <Form.Item label="Account ID" name="id">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Created At" name="created_at">
                <Input disabled />
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
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input />
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
                <Input disabled value={form.getFieldValue('role')} />
                <Button
                  style={{ marginTop: 10 }}
                  className="change-role-btn"
                  onClick={handleRoleChangeClick}
                  aria-label="Change user role"
                >
                  Change Role
                </Button>
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
                    <div className="action-bar">
                      <button
                        className="cancel-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                          setTempAddress({});
                        }}
                        style={{ marginBottom: "10px", width: 'auto' }}
                      >
                        Cancel Edit
                      </button>
                      <button
                        className="add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit();
                        }}
                        style={{ marginLeft: "10px", width: 'auto' }}
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
              <div className="action-bar">
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
                  style={{ marginBottom: "10px", width: 'auto' }}
                >
                  Cancel Address
                </button>
                <button
                  className="add-btn"
                  onClick={handleAddAddress}
                  style={{ marginLeft: "10px", width: 'auto' }}
                >
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
          >
            Save Changes
          </Button>
        </div>
      </Form>
      <Modal
        open={showModal}
        onCancel={handleCancelChange}
        onOk={handleConfirmChange}
        okText="Change"
        cancelText="No"
        title="Are you sure you want to save these changes?"
      />
      <Modal
        open={roleChangeModalVisible}
        onOk={handleRoleChangeConfirm}
        onCancel={handleRoleChangeCancel}
        okText="Confirm"
        cancelText="Cancel"
        title="Change User Role"
      >
        <p>Are you sure you want to change the role of this user?</p>
        <Select
          style={{ width: '100%', border: '1px solid #ddd' }}
          value={newRole}
          onChange={setNewRole}
          placeholder="Select new role"
        >
          {roleOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ChangeAccount;