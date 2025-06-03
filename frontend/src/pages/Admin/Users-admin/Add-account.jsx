import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message } from 'antd';
import { createUserByAdmin } from '../../../services/userService';
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
          <div className="left-column">
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter first name' }]}
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
          <div className="right-column">
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