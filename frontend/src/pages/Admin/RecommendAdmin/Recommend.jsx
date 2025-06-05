import React, { useEffect, useState, useCallback } from 'react';
import { Table, Input, Dropdown, Button, message } from 'antd';
import { SearchOutlined, DownOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { searchRecommendations, triggerTraining } from '../../../services/recommendService';

const searchTypeItems = [
  { key: 'id', label: 'ID' },
  { key: 'userId', label: 'User ID' },
];

const Recommend = () => {
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('id');
  const [data, setData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [sortedInfo, setSortedInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(false);

  const buildQuery = () => {
    const query = {
      page: currentPage - 1,
      size: pageSize,
      sortBy: sortedInfo?.field || 'id',
      sortDir: sortedInfo?.order === 'descend' ? 'desc' : 'asc',
    };

    if (search) {
      query[searchType] = Number(search);
    }

    return query;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await searchRecommendations(buildQuery());
      const tableData = res.content.map(item => ({ key: item.id, ...item }));
      setData(tableData);
      setTotalElements(res.totalElements || 0);
    } catch (error) {
      message.error(error.message || 'Lỗi khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortedInfo, search, searchType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleMenuClick = ({ key }) => {
    setSearchType(key);
    setSearch('');
    setCurrentPage(1);
  };

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleRun = async () => {
    try {
      const msg = await triggerTraining();
      message.success(msg);
    } catch (err) {
      message.error(err.message || 'Lỗi khi chạy huấn luyện!');
    }
  };

  return (
    <div className="user-admin">
      <div className="main-content">
        <div
          className="filters"
          style={{
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Input
              placeholder={`Search ${searchTypeItems.find(i => i.key === searchType)?.label || ''}`}
              value={search}
              onChange={handleSearchChange}
              onPressEnter={fetchData}
              prefix={<SearchOutlined />}
              style={{ width: 220, marginRight: 10 }}
            />
            <Dropdown menu={{ items: searchTypeItems, onClick: handleMenuClick }}>
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

        <Table
          loading={loading}
          dataSource={data}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalElements,
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
            sorter
            sortOrder={sortedInfo.columnKey === 'id' && sortedInfo.order}
          />
          <Table.Column
            title="User ID"
            dataIndex="userId"
            key="userId"
            sorter
            sortOrder={sortedInfo.columnKey === 'userId' && sortedInfo.order}
          />
          <Table.Column
            title="Product IDs"
            dataIndex="productIds"
            key="productIds"
            render={(ids) => ids?.join(', ')}
          />
        </Table>
      </div>
    </div>
  );
};

export default Recommend;
