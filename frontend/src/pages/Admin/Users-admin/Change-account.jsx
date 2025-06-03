import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Modal, message, Spin } from 'antd';
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

  // Initialize form with account data
  useEffect(() => {
    const fetchAccount = () => {
      setLoading(true);
      try {
        const accounts = window.history.state?.usr?.accounts || [];
        const account = accounts.find((acc) => acc.id === parseInt(accountId));
        if (!account) {
          message.error('Account not found');
          navigate('/Users-admin');
          return;
        }
        form.setFieldsValue({
          id: account.id,
          created_at: account.created_at || '2025-05-18 20:53:54.655363',
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          gender: account.gender,
          role: account.role,
        });
        setNewRole(account.role);
      } catch (e) {
        message.error('Error loading account data');
        navigate('/Users-admin');
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, [accountId, form, navigate]);

  const onFinish = (values) => {
    setShowModal(true);
  };

  const handleConfirmChange = () => {
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
    };

    try {
      const accounts = window.history.state?.usr?.accounts || [];
      const updatedAccounts = accounts.map((acc) =>
        acc.id === parseInt(accountId) ? updatedAccount : acc
      );
      setShowModal(false);
      navigate('/Users-admin', { state: { updatedAccounts } });
    } catch (e) {
      message.error('Failed to update account');
      setShowModal(false);
    }
  };

  const handleCancelChange = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    navigate('/Users-admin');
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
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ width: '100%' }}
        >
          <div className="form-container">
            <div className="left-column">
              <Form.Item label="Account ID" name="id">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Created At" name="created_at">
                <Input disabled />
              </Form.Item>
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
                <Input disabled value={form.getFieldValue('role')} />
              </Form.Item>
              <Form.Item>
                <Button
                  className="change-role-btn"
                  onClick={handleRoleChangeClick}
                  aria-label="Change user role"
                >
                  Change Role
                </Button>
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
            >
              Save Changes
            </Button>
          </div>
        </Form>
      )}
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
          style={{ width: '100%', border: '1px solid #ddd'}}
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