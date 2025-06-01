import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Space, Table, Tag, Input, Select, Button, Modal, message, Tooltip } from 'antd';
import './Users-admin.css';

const { Column } = Table;
const { Option } = Select;

const UsersAdmin = () => {
  const [accounts, setAccounts] = useState([
    {
      key: '1',
      id: 1,
      firstName: 'Đỗ',
      lastName: 'Danh',
      email: 'thanhdanhd1701@gmail.com',
      gender: 'Men',
      role: 'ADMIN',
    },
    {
      key: '2',
      id: 2,
      firstName: 'Quyen',
      lastName: 'Ngo',
      email: 'quyen@gmail.com',
      gender: 'Women',
      role: 'USER',
    },
    {
      key: '3',
      id: 3,
      firstName: 'Phạm',
      lastName: 'Dương',
      email: 'ThanhBongToiV1d@gmail.com',
      gender: 'Men',
      role: 'USER',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Handle updated accounts from ChangeAccount.jsx or AddAccount.jsx
  useEffect(() => {
    if (location.state?.updatedAccounts && Array.isArray(location.state.updatedAccounts)) {
      const maxId = Math.max(...accounts.map((acc) => acc.id || 0), 0);
      const newAccounts = location.state.updatedAccounts.filter(
        (account) => !account.id // New accounts won't have an id yet
      );
      let updatedAccounts = [...accounts];

      if (newAccounts.length > 0) {
        // Handle new accounts
        updatedAccounts = [
          ...updatedAccounts,
          ...newAccounts.map((account, index) => ({
            ...account,
            id: maxId + index + 1, // Assign incremental id for new accounts
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 19), // Current timestamp, e.g., 2025-06-01 19:44:00
          })),
        ];
      } else {
        // Handle updates from ChangeAccount.jsx
        updatedAccounts = accounts.map((existingAccount) => {
          const updatedAccount = location.state.updatedAccounts.find(
            (acc) => acc.id === existingAccount.id
          );
          return updatedAccount || existingAccount;
        });
      }

      // Strip created_at from accounts state
      const accountsWithoutCreatedAt = updatedAccounts.map(({ created_at, ...rest }) => rest);
      setAccounts(accountsWithoutCreatedAt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]); // Removed accounts from dependencies to prevent re-triggering

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
  };

  const handleGenderChange = (value) => {
    setGenderFilter(value);
  };

  const handleRoleChange = (value) => {
    setRoleFilter(value);
  };

  // Handle row selection
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.role === 'ADMIN',
      name: `${record.firstName} ${record.lastName}`,
      title: record.role === 'ADMIN' ? 'Cannot select ADMIN accounts' : undefined,
    }),
  };

  // Handle delete
  const handleDeleteClick = (key) => {
    setAccountToDelete(key);
    setShowModal(true);
  };

  const handleDeleteSelected = () => {
    setAccountToDelete(null);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (accountToDelete) {
      setAccounts((prev) => prev.filter((account) => account.key !== accountToDelete));
      setSelectedRowKeys((prev) => prev.filter((key) => key !== accountToDelete));
      message.success('Account deleted successfully');
    } else {
      setAccounts((prev) => prev.filter((account) => !selectedRowKeys.includes(account.key)));
      setSelectedRowKeys([]);
      message.success(`${selectedRowKeys.length} account(s) deleted successfully`);
    }
    setAccountToDelete(null);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setAccountToDelete(null);
    setShowModal(false);
  };

  const handleAddAccount = () => {
    console.log('Add account clicked'); // Debug log
    navigate('/Users-admin/add-account', {
      state: { accounts },
    });
  };

  const handleChangeAccount = (accountId) => {
    console.log('Change account clicked for id:', accountId); // Debug log
    const account = accounts.find((acc) => acc.id === accountId);
    if (!account) {
      console.log('Account not found for id:', accountId); // Debug log
      message.error('Account not found');
      return;
    }
    // Add created_at when navigating
    const accountsWithCreatedAt = accounts.map((acc) =>
      acc.id === accountId
        ? { ...acc, created_at: '2025-05-18 20:53:54.655363' }
        : acc
    );
    navigate(`/Users-admin/Change-account/${accountId}`, {
      state: { accounts: accountsWithCreatedAt },
    });
  };

  // Memoized filtered accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const searchMatch = searchType
        ? searchType === 'First name'
          ? account.firstName.toLowerCase().includes(searchTerm.toLowerCase())
          : searchType === 'Last name'
          ? account.lastName.toLowerCase().includes(searchTerm.toLowerCase())
          : (account.id || '').toString().includes(searchTerm)
        : account.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (account.id || '').toString().includes(searchTerm);

      const genderMatch = genderFilter ? account.gender === genderFilter : true;
      const roleMatch = roleFilter ? account.role === roleFilter : true;

      return searchMatch && genderMatch && roleMatch;
    });
  }, [accounts, searchTerm, searchType, genderFilter, roleFilter]);

  // Created at timestamps for display in tooltip
  const createdAtMap = useMemo(() => {
    const map = {};
    accounts.forEach((account) => {
      if (account.id) {
        map[account.id] = account.created_at || '2025-05-18 20:53:54.655363'; // Default for existing accounts
      }
    });
    return map;
  }, [accounts]);

  return (
    <div className="user-admin">
      <div className="main-content">
        <div className="filters">
          <Input
            placeholder="Search in type"
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select
            placeholder="Choose type"
            className="filter-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <Option value="">Choose type</Option>
            <Option value="First name">First name</Option>
            <Option value="Last name">Last name</Option>
            <Option value="ID">ID</Option>
          </Select>
          <Select
            placeholder="Gender"
            className="filter-select"
            value={genderFilter}
            onChange={handleGenderChange}
          >
            <Option value="">Gender</Option>
            <Option value="Men">Men</Option>
            <Option value="Women">Women</Option>
          </Select>
          <Select
            placeholder="Role"
            className="filter-select"
            value={roleFilter}
            onChange={handleRoleChange}
          >
            <Option value="">Role</Option>
            <Option value="ADMIN">ADMIN</Option>
            <Option value="USER">USER</Option>
          </Select>
          <Button
            type="primary"
            className="add-account-btn"
            onClick={handleAddAccount}
          >
            Add account
          </Button>
          {selectedRowKeys.length > 0 && (
            <Button
              danger
              className="delete-selected-btn"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
          )}
        </div>

        <Table
          rowSelection={rowSelection}
          dataSource={filteredAccounts}
          pagination={{ pageSize: 10 }}
          className="user-table"
        >
          <Column
            title="ID"
            dataIndex="id"
            key="id"
            sorter={(a, b) => (a.id || 0) - (b.id || 0)}
            render={(id) => (
              <Tooltip title={`Created at: ${createdAtMap[id] || '2025-05-18 20:53:54.655363'}`}>
                <span className="id-tooltip">{id || 'N/A'}</span>
              </Tooltip>
            )}
          />
          <Column
            title="First Name"
            dataIndex="firstName"
            key="firstName"
            sorter={(a, b) => a.firstName.localeCompare(b.firstName)}
          />
          <Column
            title="Last Name"
            dataIndex="lastName"
            key="lastName"
            sorter={(a, b) => a.lastName.localeCompare(b.lastName)}
          />
          <Column
            title="Email"
            dataIndex="email"
            key="email"
            sorter={(a, b) => a.email.localeCompare(b.email)}
          />
          <Column
            title="Gender"
            dataIndex="gender"
            key="gender"
            filters={[
              { text: 'Men', value: 'Men' },
              { text: 'Women', value: 'Women' },
            ]}
            onFilter={(value, record) => record.gender === value}
            filterSearch={true}
          />
          <Column
            title="Role"
            dataIndex="role"
            key="role"
            render={(role) => {
              const color = role === 'ADMIN' ? '#1890ff' : '#13c2c2';
              return <Tag color={color} key={role}>{role.toUpperCase()}</Tag>;
            }}
          />
          <Column
            title="Action"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <Button
                  type="primary"
                  className="change-account-btn"
                  onClick={() => handleChangeAccount(record.id)}
                  aria-label={`Edit account for ${record.firstName} ${record.lastName}`}
                >
                  Change
                </Button>
                <Button
                  danger
                  className="delete-account-btn"
                  onClick={() => handleDeleteClick(record.key)}
                  aria-label={`Delete account for ${record.firstName} ${record.lastName}`}
                  disabled={record.role === 'ADMIN'}
                >
                  Delete
                </Button>
              </Space>
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
          <p>
            {accountToDelete
              ? 'Are you sure you want to delete this account?'
              : `Are you sure you want to delete ${selectedRowKeys.length} selected account(s)?`}
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default UsersAdmin;