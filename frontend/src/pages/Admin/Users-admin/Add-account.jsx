import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message, Modal } from 'antd';
import { createUserWithAddress, deleteUserAddress, updateUserAddress } from '../../../services/userService';
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

  const handleDeleteAddress = async (id) => {
    if (typeof id === 'number') {
      setAddresses(addresses.filter(addr => addr.id !== id));
      if (selectedAddress === id && addresses.length > 1) {
        setSelectedAddress(addresses.find(addr => addr.id !== id).id);
      } else if (addresses.length === 1) {
        setSelectedAddress(null);
      }
      return;
    }
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
    if (typeof editingId === 'number') {
      setAddresses(addresses.map(addr =>
        addr.id === editingId ? { ...addr, ...tempAddress } : addr
      ));
      setEditingId(null);
      setTempAddress({});
      return;
    }
    try {
      await updateUserAddress(editingId, tempAddress);
      api.success({
        message: 'Address updated',
        description: 'The address has been updated successfully.',
      });
      setEditingId(null);
      setTempAddress({});
    } catch {
      api.error({
        message: 'Update failed',
        description: 'Could not update address. Please try again.',
      });
    }
  };

  const handleAddAddress = async () => {
    const newAddr = { ...newAddress, id: Date.now(), is_default: addresses.length === 0 };
    setAddresses([...addresses, newAddr]);
    setNewAddress({
      phone: "",
      fullAddress: "",
      ward: "",
      district: "",
      province: "",
    });
    setShowForm(false);
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

    const userData = {
      lastName: values.lastName,
      firstName: values.firstName,
      email: values.email,
      password: values.password,
      gender: values.gender,
      role: values.role,
    };

    const addressData = {
      province: newAddress.province,
      district: newAddress.district,
      ward: newAddress.ward,
      fullAddress: newAddress.fullAddress,
      phone: newAddress.phone,
    };

    const userAndAddressData = { ...userData, ...addressData };

    try {
      await createUserWithAddress(userAndAddressData);
      message.success('Account and address added successfully');
      navigate('/users-admin');
    } catch (e) {
      message.error(e.message || 'Failed to add account');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/users-admin');
  };

  return (
    <div className="add-account" style={{
      maxWidth: 600,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      padding: '24px',
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Add Account</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select role' }]}
                style={{ width: '100%' }}
              >
                <Select options={roleOptions} placeholder="Select role" />
              </Form.Item>
              <Form.Item></Form.Item>
              
            </div>
          </div>
        </div>

        {/* Address Section giữ nguyên */}
        {/* ... (đoạn địa chỉ không thay đổi) */}

        <div className="action-bar">
          <Button className="cancel-button" onClick={handleCancel} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button
            className="save-button"
            type="primary"
            htmlType="submit"
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
