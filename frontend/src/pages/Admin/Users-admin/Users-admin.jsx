import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Tag, Input, Dropdown, Button, Modal, message, Tooltip, Typography, Space } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';
import { searchUsers } from '../../../services/userService';
import './Users-admin.css';
import { deleteUser } from '../../../services/userService'

const { Column } = Table;

const UsersAdmin = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [genderFilter, setGenderFilter] = useState(null);
  const [roleFilter, setRoleFilter] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await searchUsers({ searchType, searchTerm, page, size: pageSize, sortBy, sortDir });
      const users = response.content.map(user => ({
        key: user.id.toString(),
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        role: user.role,
        created_at: user.createdAt,
        // Lấy address mặc định từ object address
        defaultFullAddress: user.address ? user.address.fullAddress : null,
        defaultPhone: user.address ? user.address.phone : null,
      }));
      setAccounts(users);
      setTotalElements(response.totalElements);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, searchType, page, pageSize, sortBy, sortDir]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleSearchTypeChange = ({ key }) => {
    setSearchType(key);
    setPage(0);
  };

  const onSelectChange = (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.role === 'ADMIN',
      name: `${record.firstName} ${record.lastName}`,
      title: record.role === 'ADMIN' ? 'Cannot select ADMIN accounts' : undefined,
    }),
  };

  const handleDeleteClick = (key) => {
    setAccountToDelete(key);
    setShowModal(true);
  };
  const handleDeleteSelected = () => { setAccountToDelete(null); setShowModal(true); };
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      if (accountToDelete) {
        await deleteUser(accountToDelete);
      } else {
        // Xóa từng user đã chọn
        await Promise.all(selectedRowKeys.map(id => deleteUser(id)));
      }
      await fetchUsers();
      message.success('Account(s) deleted successfully');
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('Không thể xoá user!');
      console.log(error);
    } finally {
      setAccountToDelete(null);
      setShowModal(false);
      setLoading(false);
    }
  };
  const handleCancelDelete = () => setShowModal(false);
  const handleAddAccount = () => navigate('/users-admin/add-account', { state: { accounts } });
  const handleChangeAccount = (id) => navigate(`/Users-admin/Change-account/${id}`, { state: { accounts } });

  const handleTableChange = (pagination, filters, sorter) => {
    setPage(pagination.current - 1);
    setPageSize(pagination.pageSize);
    if (sorter.field) {
      setSortBy(sorter.field === 'created_at' ? 'createdAt' : sorter.field);
      setSortDir(sorter.order === 'descend' ? 'desc' : 'asc');
    }
    if (filters.gender) {
      setGenderFilter(filters.gender);
    } else {
      setGenderFilter(null);
    }
    if (filters.role) {
      setRoleFilter(filters.role);
    } else {
      setRoleFilter(null);
    }
  };

  const filteredAccounts = accounts.filter((account) => {
    let genderMatch = true;
    let roleMatch = true;
    if (genderFilter) {
      genderMatch = genderFilter.includes(account.gender);
    }
    if (roleFilter) {
      roleMatch = roleFilter.includes(account.role);
    }
    return genderMatch && roleMatch;
  });

  const searchTypeItems = [
    { key: '', label: 'All' },
    { key: 'ID', label: 'ID' },
    { key: 'Name', label: 'Name' },
    { key: 'Email', label: 'Email' },
  ];

  return (
    <div className="user-admin">
      <div className="main-content">
        <div className="filters" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input placeholder="Search in type" className="search-input" value={searchTerm} onChange={handleSearch} />
            <Dropdown
              menu={{
                items: searchTypeItems,
                selectable: true,
                selectedKeys: [searchType],
                onSelect: handleSearchTypeChange,
              }}
            >
              <Typography.Link className="filter-select">
                <Space>
                  {searchType || 'All'}
                  <DownOutlined />
                </Space>
              </Typography.Link>
            </Dropdown>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedRowKeys.length > 0 && <Button danger className="delete-selected-btn" onClick={handleDeleteSelected}>Delete Selected</Button>}
            <Button className="new-user-btn" onClick={handleAddAccount}>New User</Button>
          </div>
        </div>

        <Table
          rowSelection={rowSelection}
          dataSource={filteredAccounts}
          pagination={{
            current: page + 1,
            pageSize,
            total: totalElements,
            position: ['bottomCenter'],
            showSizeChanger: true,
          }}
          className="user-table"
          onChange={handleTableChange}
          loading={loading}
        >
          <Column
            title="ID"
            dataIndex="id"
            key="id"
            sorter
            render={(id) => <Tooltip title={`Created at: ${id}`}><span className="id-tooltip">{id}</span></Tooltip>}
          />
          <Column
            title="Name"
            key="name"
            render={(_, record) => (
              <div>
                <div>{`${record.lastName} ${record.firstName}`}</div>
                <div style={{ color: '#888', fontSize: '13px' }}>{record.email}</div>
              </div>
            )}
          />
          <Column
            title="Address (default)"
            key="defaultAddress"
            render={(_, record) => (
              <div>
                <div>{record.defaultFullAddress || <span style={{ color: '#bbb' }}>No address</span>}</div>
                <div style={{ color: '#888', fontSize: '13px' }}>{record.defaultPhone || ''}</div>
              </div>
            )}
          />
          <Column
            title="Created at"
            dataIndex="created_at"
            key="created_at"
            sorter
            render={(created_at) => {
              const date = new Date(created_at);
              const formattedDate = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              const formattedTime = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });
              return (
                <div>
                  <div>{formattedDate}</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>{formattedTime}</div>
                </div>
              );
            }}
          />
          <Column
            title="Gender"
            dataIndex="gender"
            key="gender"
            filters={[
              { text: 'Men', value: 'Men' },
              { text: 'Women', value: 'Women' },
              { text: 'Unisex', value: 'Unisex' },
            ]}
            filteredValue={genderFilter}
            onFilter={(value, record) => record.gender === value}
            render={(gender) => {
              let color = '#1890ff';
              let bgColor = '#e6f7ff';
              if (gender === 'Women') {
                color = '#eb2f96';
                bgColor = '#fff0f6';
              } else if (gender === 'Unisex') {
                color = '#722ed1';
                bgColor = '#f3e8ff';
              }
              return <Tag style={{ color, backgroundColor: bgColor, border: `1px solid ${color}` }}>{gender.toUpperCase()}</Tag>;
            }}
          />
          <Column
            title="Role"
            dataIndex="role"
            key="role"
            filters={[{ text: 'ADMIN', value: 'ADMIN' }, { text: 'USER', value: 'USER' }]}
            filteredValue={roleFilter}
            onFilter={(value, record) => record.role === value}
            render={(role) => {
              let color = '#1890ff';
              let bgColor = '#e6f7ff';
              if (role === 'USER') {
                color = '#389e0d';
                bgColor = '#f6ffed';
              }
              return <Tag style={{ color, backgroundColor: bgColor, border: `1px solid ${color}` }}>{role.toUpperCase()}</Tag>;
            }}
          />
          <Column
            title="Action"
            key="action"
            align="center"
            render={(_, record) => (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'edit',
                      icon: <EditOutlined />,
                      label: 'Edit',
                      onClick: () => handleChangeAccount(record.id),
                    },
                    {
                      key: 'delete',
                      icon: <DeleteOutlined style={{ color: 'red' }} />,
                      label: 'Delete',
                      onClick: () => handleDeleteClick(record.key),
                      disabled: record.role === 'ADMIN',
                    },
                  ],
                }}
                trigger={['click']}
                placement="bottomRight"
              >
                <MoreOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
              </Dropdown>
            )}
          />
        </Table>

        <Modal
          title="Confirm Deletion"
          open={showModal}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <p>{accountToDelete ? 'Are you sure you want to delete this account?' : `Are you sure you want to delete ${selectedRowKeys.length} selected account(s)?`}</p>
        </Modal>
      </div>
    </div>
  );
};

export default UsersAdmin;