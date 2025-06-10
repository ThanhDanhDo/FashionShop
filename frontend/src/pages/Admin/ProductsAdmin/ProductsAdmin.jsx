import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Space, Typography, Table, Button, Flex, Modal } from 'antd';
import { DownOutlined, MoreOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import './ProductAdmin.css';
import { adminFilterProducts} from '../../../services/productService';
import FullPageSpin from '../../../components/ListSpin';

const categoryData = [
  { id: 1, name: "Outerwear", parent_id: null },
  { id: 2, name: "T-shirt", parent_id: null },
  { id: 3, name: "Shirt", parent_id: null },
  { id: 4, name: "Dress", parent_id: null },
  { id: 5, name: "Bottom", parent_id: null },
  { id: 6, name: "Accessories", parent_id: null },
  { id: 7, name: "Jackets & Blazers", parent_id: "1" },
  { id: 8, name: "Coats", parent_id: "1" },
  { id: 9, name: "Short-sleeve T-shirt", parent_id: "2" },
  { id: 10, name: "Short-sleeve Shirt", parent_id: "3" },
  { id: 11, name: "Long-sleeve T-shirt", parent_id: "2" },
  { id: 12, name: "Long-sleeve Shirt", parent_id: "3" },
  { id: 13, name: "Skirts", parent_id: "4" },
  { id: 14, name: "Dresses", parent_id: "4" },
  { id: 15, name: "Long", parent_id: "5" },
  { id: 16, name: "Short", parent_id: "5" },
  { id: 17, name: "Bags", parent_id: "6" },
  { id: 18, name: "Belts", parent_id: "6" }
];
const mainCategories = categoryData.filter(cat => cat.parent_id === null);
const subCategories = categoryData.filter(cat => cat.parent_id !== null);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [mainCategoryFilter, setMainCategoryFilter] = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('id'); // Mặc định là id
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Dropdown items
  const mainCategoryItems = [
    { key: '', label: 'Main Category' },
    ...mainCategories.map(cat => ({
      key: String(cat.id),
      label: cat.name,
    })),
  ];
  const subCategoryItems = subCategories
    .filter(sub => !mainCategoryFilter || sub.parent_id === String(mainCategoryFilter))
    .map(sub => ({
      key: String(sub.id),
      label: sub.name,
    }));

  const typeItems = [
    { key: '', label: 'Choose type' },
    { key: 'Name', label: 'Name' },
    { key: 'ID', label: 'ID' },
  ];

  // Fetch products with filter
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage - 1,
          size: pageSize,
          sortBy,
          sortOrder,
        };
        if (mainCategoryFilter) params.mainCategoryId = mainCategoryFilter;
        if (subCategoryFilter) params.subCategoryId = subCategoryFilter;
        if (searchTerm && searchType === 'Name') params.name = searchTerm;
        if (searchTerm && searchType === 'ID' && !isNaN(Number(searchTerm))) params.id = Number(searchTerm);

        const data = await adminFilterProducts(params);
        setProducts(data.content || []);
        setTotalProducts(data.totalElements || 0);
      } catch (err) {
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mainCategoryFilter, subCategoryFilter, searchTerm, searchType, currentPage, pageSize, sortBy, sortOrder]);

  // Xử lý chọn Main Category
  const handleMainCategorySelect = ({ key }) => {
    setMainCategoryFilter(key);
    setSubCategoryFilter('');
    setCurrentPage(1);
  };
  // Xử lý chọn Sub Category
  const handleSubCategorySelect = ({ key }) => {
    setSubCategoryFilter(key);
    setCurrentPage(1);
  };
  const handleTypeSelect = ({ key }) => {
    setSearchType(key);
    setCurrentPage(1);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const navigate = useNavigate();

  // Ant Design Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === 'id' ? sortedInfo.order : null,
      width: 60, // Giảm xuống nhỏ hơn
      align: 'center',
    },
    {
      title: 'Product',
      dataIndex: 'imgurls',
      key: 'imgurls',
      render: (imgurls, record) => (
        <img
          src={imgurls?.[0] || "/images/image1.png"}
          alt={record.name}
          className="product-img"
        />
      ),
      width: 70,
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Category',
      key: 'category',
      render: (_, record) => {
        const mainCat = mainCategories.find(c => c.id === (record.mainCategory?.id || record.mainCategoryId))?.name || '';
        const subCat = subCategories.find(s => s.id === (record.subCategory?.id || record.subCategoryId))?.name || '';
        return (
          <div>
            <div>{mainCat}</div>
            <div style={{ fontSize: '14px', color: '#888', marginTop: 2 }}>
              {subCat}
            </div>
          </div>
        );
      },
      ellipsis: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Men', value: 'Men' },
        { text: 'Women', value: 'Women' },
        { text: 'Unisex', value: 'Unisex' },
      ],
      onFilter: (value, record) => record.gender === value,
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
      sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order : null,
      render: price => price?.toLocaleString('vi-VN') || '',
      align: 'right',
      width: 110,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
      sortOrder: sortedInfo.columnKey === 'stock' ? sortedInfo.order : null,
      align: 'center',
      width: 60, // Giảm xuống nhỏ hơn
    },
    {
      title: 'Status',
      dataIndex: 'stock',
      key: 'status',
      render: stock => (
        <span className={`status ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {stock > 0 ? 'In stock' : 'Out of stock'}
        </span>
      ),
      align: 'center',
      width: 110,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: 60, // Giảm xuống nhỏ hơn
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <EyeOutlined style={{ color: '#1890ff' }} />,
                label: 'View Detail',
                onClick: () => navigate(`/Products-admin/Product-detail/${record.id}`),
              },
              {
                key: 'edit',
                icon: <EditOutlined style={{ color: '#52c41a' }} />,
                label: 'Change',
                onClick: () => navigate(`/Products-admin/Change-product/${record.id}`),
              },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <MoreOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        </Dropdown>
      ),
    },
  ];

  // Table sort handler
  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    if (sorter && sorter.columnKey) {
      setSortBy(sorter.columnKey);
      setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Row selection config (KHÔNG xóa khi chọn)
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="product-admin">
      <div className="main-content">
        <div className="filters">
          <input
            type="text"
            placeholder="Search in type"
            className="search-input"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <Dropdown
            menu={{
              items: [
                { key: '', label: 'Choose type' },
                { key: 'Name', label: 'Name' },
                { key: 'ID', label: 'ID' },
              ],
              selectable: true,
              selectedKeys: [searchType],
              onSelect: ({ key }) => { setSearchType(key); setCurrentPage(1); },
            }}
          >
            <Typography.Link className="filter-select">
              <Space>
                {searchType ? (searchType === 'Name' ? 'Name' : 'ID') : 'Choose type'}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
          <Dropdown
            menu={{
              items: [
                { key: '', label: 'Main Category' },
                ...mainCategories.map(cat => ({
                  key: String(cat.id),
                  label: cat.name,
                })),
              ],
              selectable: true,
              selectedKeys: [mainCategoryFilter],
              onSelect: ({ key }) => { setMainCategoryFilter(key); setSubCategoryFilter(''); setCurrentPage(1); },
            }}
          >
            <Typography.Link className="filter-select">
              <Space>
                {mainCategoryFilter
                  ? mainCategories.find(c => String(c.id) === mainCategoryFilter)?.name
                  : 'Main Category'}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
          <Dropdown
            menu={{
              items: subCategories
                .filter(sub => !mainCategoryFilter || sub.parent_id === String(mainCategoryFilter))
                .map(sub => ({
                  key: String(sub.id),
                  label: sub.name,
                })),
              selectable: true,
              selectedKeys: subCategoryFilter ? [subCategoryFilter] : [],
              onSelect: ({ key }) => { setSubCategoryFilter(key); setCurrentPage(1); },
            }}
            disabled={!mainCategoryFilter}
          >
            <Typography.Link
              className={`filter-select sub-category-dropdown${!mainCategoryFilter ? ' sub-category-disabled' : ''}`}
            >
              <Space>
                {subCategoryFilter
                  ? subCategories.find(s => String(s.id) === subCategoryFilter)?.name
                  : 'Sub Category'}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
          <button
            className="add-product-btn"
            onClick={() => navigate('/products-admin/add-product')}
            style={{ marginRight: 8 }}
          >
            Add product
          </button>
        </div>

        {/* Table Ant Design */}
        {loading ? (
          <FullPageSpin />
        ) : (
          <Flex gap="middle" vertical>
            <Table
              columns={columns}
              dataSource={products.map(p => ({ ...p, key: p.id }))}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalProducts,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                position: ['bottomCenter'],
              }}
              onChange={handleTableChange}
              bordered
              scroll={{ x: 'max-content' }}
              style={{ background: '#fff', borderRadius: 8 }}
            />
          </Flex>
        )}
      </div>
    </div>
  );
};

export default Products;