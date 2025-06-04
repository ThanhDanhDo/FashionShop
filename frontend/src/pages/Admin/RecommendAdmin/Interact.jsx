import React, { useState } from 'react';
import { Table, Input, Dropdown, Button, Space, Flex } from 'antd';
import { SearchOutlined, DownOutlined, PlayCircleOutlined } from '@ant-design/icons';

const data = [
  { key: '1', id: 1, recommendedForUserId: 101, productIds: [12, 31, 13] },
  { key: '2', id: 2, recommendedForUserId: 102, productIds: [21, 15] },
  // ...more mock data
];

const searchTypeItems = [
  { key: 'id', label: 'ID' },
  { key: 'recommendedForUserId', label: 'Recommended For User ID' },
  { key: 'productIds', label: 'Product ID' },
];

const Interact = () => {
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('id');
  const [sortedInfo, setSortedInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const filtered = data.filter(item => {
    if (!search) return true;
    if (searchType === 'id') return String(item.id).includes(search);
    if (searchType === 'recommendedForUserId') return String(item.recommendedForUserId).includes(search);
    if (searchType === 'productIds') return item.productIds.some(pid => String(pid).includes(search));
    return true;
  });

  const handleSearch = (e) => setSearch(e.target.value);

  const handleMenuClick = ({ key }) => {
    setSearchType(key);
    setSearch('');
  };

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleRun = () => {
    console.log('Run button clicked!');
    // Add your run logic here
  };

  return (
    <div className="user-admin">
      <div className="main-content">
        <div className="filters" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Input
              placeholder={`Search ${searchTypeItems.find(i => i.key === searchType)?.label || ''}`}
              className="search-input"
              value={search}
              onChange={handleSearch}
              prefix={<SearchOutlined />}
              style={{ width: 220, marginRight: 10 }}
            />
            <Dropdown
              menu={{
                items: searchTypeItems,
                onClick: handleMenuClick,
              }}
            >
              <Button>
                {searchTypeItems.find(i => i.key === searchType)?.label || 'ID'} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <Button
            type="default"
            onClick={handleRun}
            style={{
              borderColor: '#1890ff',
              color: '#1890ff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <PlayCircleOutlined />
            Run
          </Button>
        </div>
        <Flex gap="middle" vertical>
          <Table
            dataSource={filtered}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filtered.length,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '8', '10', '20', '50'],
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              position: ['bottomCenter'],
            }}
            onChange={handleChange}
            rowKey="id"
          >
            <Table.Column
              title="ID"
              dataIndex="id"
              key="id"
              sorter={(a, b) => a.id - b.id}
              sortOrder={sortedInfo.columnKey === 'id' && sortedInfo.order}
            />
            <Table.Column
              title="Recommended For User ID"
              dataIndex="recommendedForUserId"
              key="recommendedForUserId"
              sorter={(a, b) => a.recommendedForUserId - b.recommendedForUserId}
              sortOrder={sortedInfo.columnKey === 'recommendedForUserId' && sortedInfo.order}
            />
            <Table.Column
              title="Product ID"
              dataIndex="productIds"
              key="productIds"
              render={ids => ids.join(', ')}
              sorter={(a, b) => (a.productIds[0] || 0) - (b.productIds[0] || 0)}
              sortOrder={sortedInfo.columnKey === 'productIds' && sortedInfo.order}
            />
          </Table>
        </Flex>
      </div>
    </div>
  );
};

export default Interact;