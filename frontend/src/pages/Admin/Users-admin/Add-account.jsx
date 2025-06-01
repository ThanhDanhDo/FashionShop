import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message } from 'antd';
import './Add-account.css';

const { Option } = Select;

const genderOptions = [
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
];

const roleOptions = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'USER', label: 'USER' },
];

const AddAccount = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    const newAccount = {
      key: (Date.now() + Math.random()).toString(), // Temporary unique key
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      gender: values.gender,
      role: values.role,
    };

    try {
      const accounts = window.history.state?.usr?.accounts || [];
      const updatedAccounts = [...accounts, newAccount];
      navigate('/Users-admin', { state: { updatedAccounts, isNewAccount: true } });
      setTimeout(() => {
        message.success('Account added successfully');
      }, 100); // Slight delay to ensure message appears after navigation
    } catch (e) {
      message.error('Failed to add account');
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
          <div className="left-column">
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
          </div>
          <div className="right-column">
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Select options={genderOptions} placeholder="Select gender" />
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
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddAccount;