import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { getUserAddresses, addUserAddress, deleteUserAddress, updateUserAddress } from '../../../services/userService';
import { Modal, Input } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './DeliveryAddress.css';
import { useNotification } from '../../../components/NotificationProvider'; // Thêm dòng này

const DeliveryAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    province: '',
    district: '',
    ward: '',
    fullAddress: '',
    phone: '',
  });
  const [editForm, setEditForm] = useState(null); // null hoặc object address đang edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const api = useNotification(); // Thay thế notification.useNotification()

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await getUserAddresses();
      const normalized = (data || []).map(addr => ({
        ...addr,
        isDefault: addr.isDefault ?? addr.is_default ?? addr.default
      }));
      setAddresses(normalized);
    } catch {
      api.error({
        message: 'Failed to load addresses',
        description: 'Could not fetch your addresses. Please try again later.',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = async () => {
    try {
      await addUserAddress(form);
      api.success({
        message: 'Address added successfully',
        description: 'Your new address has been saved.',
      });
      setForm({
        province: '',
        district: '',
        ward: '',
        fullAddress: '',
        phone: '',
      });
      fetchAddresses();
    } catch {
      api.error({
        message: 'Add address failed',
        description: 'Could not add address. Please try again.',
      });
    }
  };

  const handleRemoveAddress = async (id) => {
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
            description: 'The address has been deleted.',
          });
          fetchAddresses();
        } catch {
          api.error({
            message: 'Remove failed',
            description: 'Could not remove address. Please try again.',
          });
        }
      }
    });
  };

  const handleEditAddress = (address) => {
    setEditForm({ ...address });
    setEditModalOpen(true);
  };

  const handleUpdateAddress = async () => {
    try {
      await updateUserAddress(editForm.id, editForm);
      api.success({
        message: 'Address updated',
        description: 'The address has been updated.',
      });
      setEditModalOpen(false);
      setEditForm(null);
      fetchAddresses();
    } catch {
      api.error({
        message: 'Update failed',
        description: 'Could not update address. Please try again.',
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-account">
        <h2 className="title">DELIVERY ADDRESS</h2>
        <div className="form-box hoverable">
          <h3>Add New Address</h3>
          <div className="input-group">
            <label>Province:</label>
            <input
              type="text"
              name="province"
              value={form.province}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>District:</label>
            <input
              type="text"
              name="district"
              value={form.district}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Ward:</label>
            <input
              type="text"
              name="ward"
              value={form.ward}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Full Address:</label>
            <input
              type="text"
              name="fullAddress"
              value={form.fullAddress}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Phone number:</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="button-wrapper">
            <button className="blue-btn" onClick={handleAddAddress}>
              Add
            </button>
          </div>
        </div>

        <div className="form-box hoverable">
          <h3>Your Addresses</h3>
          {addresses.length === 0 ? (
            <p>No addresses found.</p>
          ) : (
            <ul style={{ paddingLeft: 0 }}>
              {addresses.map((addr, idx) => (
                <li key={addr.id || idx} style={{
                  listStyle: 'none',
                  marginBottom: '18px',
                  padding: '12px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  background: '#f9fafb',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 16 }}>
                    <button
                      className="icon-btn edit-btn"
                      title="Edit"
                      onClick={() => handleEditAddress(addr)}
                    >
                      <EditOutlined />
                    </button>
                    <button
                      className="icon-btn remove-btn"
                      title="Remove"
                      type="button"
                      onClick={() => handleRemoveAddress(addr.id)}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <b>Province:</b> {addr.province}
                    {(addr.isDefault || addr.is_default || addr.default) && (
                      <span className="address-default-label">Default</span>
                    )}
                  </div>
                  <div><b>District:</b> {addr.district}</div>
                  <div><b>Ward:</b> {addr.ward}</div>
                  <div><b>Full Address:</b> {addr.fullAddress}</div>
                  <div><b>Phone:</b> {addr.phone}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Edit Address Modal */}
      <Modal
        title="Edit Address"
        open={editModalOpen}
        onOk={handleUpdateAddress}
        onCancel={() => setEditModalOpen(false)}
        okText="Update"
        cancelText="Cancel"
      >
        {editForm && (
          <div>
            <div className="input-group">
              <label>Province:</label>
              <Input
                name="province"
                value={editForm.province}
                onChange={handleEditChange}
              />
            </div>
            <div className="input-group">
              <label>District:</label>
              <Input
                name="district"
                value={editForm.district}
                onChange={handleEditChange}
              />
            </div>
            <div className="input-group">
              <label>Ward:</label>
              <Input
                name="ward"
                value={editForm.ward}
                onChange={handleEditChange}
              />
            </div>
            <div className="input-group">
              <label>Full Address:</label>
              <Input
                name="fullAddress"
                value={editForm.fullAddress}
                onChange={handleEditChange}
              />
            </div>
            <div className="input-group">
              <label>Phone number:</label>
              <Input
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default DeliveryAddress;