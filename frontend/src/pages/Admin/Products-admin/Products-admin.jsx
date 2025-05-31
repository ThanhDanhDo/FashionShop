import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Space, Typography, Pagination } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import './Product-admin.css';
import { adminFilterProducts} from '../../../services/productService';
import FullPageSpin from '../../../components/FullPageSpin';

// Giả lập dữ liệu category, bạn nên fetch từ backend nếu cần động
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
  const [genderFilter, setGenderFilter] = useState('');
  const [sortBy, setSortBy] = useState('id'); // Mặc định là id
  const [sortOrder, setSortOrder] = useState('asc');

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
  const genderItems = [
    { key: '', label: 'Gender' },
    { key: 'Men', label: 'Men' },
    { key: 'Women', label: 'Women' },
    { key: 'Unisex', label: 'Unisex' },
  ];

  // Fetch products with filter
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage - 1,
          size: pageSize,
          sortBy: sortBy === 'default' ? 'id' : sortBy,
          sortOrder,
        };
        if (mainCategoryFilter) params.mainCategoryId = mainCategoryFilter;
        if (subCategoryFilter) params.subCategoryId = subCategoryFilter;
        if (genderFilter) params.gender = genderFilter;
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
  }, [mainCategoryFilter, subCategoryFilter, genderFilter, searchTerm, searchType, currentPage, pageSize, sortBy, sortOrder]);

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
  const handleGenderSelect = ({ key }) => {
    setGenderFilter(key);
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

  return (
    <div className="product-admin">
      <div className="main-content">
        <div className="filters">
          <input
            type="text"
            placeholder="Search in type"
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Dropdown
            menu={{
              items: typeItems,
              selectable: true,
              selectedKeys: [searchType],
              onSelect: handleTypeSelect,
            }}
          >
            <Typography.Link className="filter-select">
              <Space>
                {typeItems.find(item => item.key === searchType)?.label || 'Choose type'}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
          <Dropdown
            menu={{
              items: mainCategoryItems,
              selectable: true,
              selectedKeys: [mainCategoryFilter],
              onSelect: handleMainCategorySelect,
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
              items: subCategoryItems,
              selectable: true,
              selectedKeys: subCategoryFilter ? [subCategoryFilter] : [],
              onSelect: handleSubCategorySelect,
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
          <Dropdown
            menu={{
              items: genderItems,
              selectable: true,
              selectedKeys: [genderFilter],
              onSelect: handleGenderSelect,
            }}
          >
            <Typography.Link className="filter-select">
              <Space>
                {genderItems.find(item => item.key === genderFilter)?.label || 'Gender'}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
          <button className="add-product-btn" onClick={() => navigate('/Products-admin/add-product')}>Add product</button>
        </div>

        {/* Sort by */}
        <div className="sort-by-row" style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 500 }}>Sort by:</span>
          <Dropdown
            menu={{
              items: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'price', label: 'Price' },
                { key: 'stock', label: 'Stock' },
              ],
              selectable: true,
              selectedKeys: [sortBy],
              onSelect: ({ key }) => setSortBy(key),
            }}
          >
            <Typography.Link className="filter-select" style={{ width: 150 }}>
              <Space>
                {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
          <span
            className="sort-order-btn"
            style={{
              border: '1px solid #ddd',
              borderRadius: 5,
              background: '#fff',
              width: 'auto',
              height: 38,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'border 0.2s',
              marginLeft: 4,
              marginRight: 4,
              padding: '0 12px',
              gap: 6,
              minWidth: 110,
            }}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
          >
            {sortOrder === 'asc'
              ? <>
                  <span style={{ color: '#1a73e8', fontWeight: 500 }}>Ascending</span>
                  <FaSortAmountUp style={{ color: '#1a73e8', fontSize: 16, marginLeft: 4 }} />
                </>
              : <>
                  <span style={{ color: '#d93025', fontWeight: 500 }}>Descending</span>
                  <FaSortAmountDown style={{ color: '#d93025', fontSize: 16, marginLeft: 4 }} />
                </>
            }
          </span>
        </div>

        {loading ? (
          <FullPageSpin />
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                <th>ID</th>
                <th>Main Category</th>
                <th>Sub Category</th>
                <th>Gender</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center' }}>No products found.</td></tr>
              ) : products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.imgurls?.[0] || "/images/image1.png"}
                      alt={product.name}
                      className="product-img"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.id}</td>
                  <td>
                    {mainCategories.find(c => c.id === (product.mainCategory?.id || product.mainCategoryId))?.name || ''}
                  </td>
                  <td>
                    {subCategories.find(s => s.id === (product.subCategory?.id || product.subCategoryId))?.name || ''}
                  </td>
                  <td>{product.gender}</td>
                  <td>{product.price?.toLocaleString('vi-VN') || ''}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock > 0 ? 'In stock' : 'Out of stock'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => {/* Xử lý xóa */}}
                    >
                      Delete
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/Products-admin/Change-product/${product.id}`)}
                    >
                      Change
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination căn giữa */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            showQuickJumper
            current={currentPage}
            pageSize={pageSize}
            total={totalProducts}
            onChange={page => setCurrentPage(page)}
            onShowSizeChange={(current, size) => setPageSize(size)}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;