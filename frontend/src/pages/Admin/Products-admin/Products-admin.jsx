import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Product-admin.css';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 'AB001', name: 'Cropped Shirt', category: 'Shirt', gender: 'Men', stock: 150, price: '1000000 đ', status: 'In stock' },
    { id: 'AB002', name: 'Round Mini Shoulder Bag', category: 'Bags', gender: 'Unisex', stock: 0, price: '2990000 đ', status: 'Out of stock' },
    { id: 'AB003', name: 'Satin Skirt', category: 'Skirts', gender: 'Women', stock: 200, price: '3990000 đ', status: 'In stock' },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGenderFilter(e.target.value);
  };

  // Xử lý chọn tất cả checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((product) => product.id));
    }
    setSelectAll(!selectAll);
  };

  // Xử lý chọn từng checkbox
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
    // Cập nhật trạng thái selectAll
    setSelectAll(filteredProducts.length === selectedProducts.length + 1);
  };

  // Xử lý khi nhấn nút delete đơn lẻ
  const handleDeleteClick = (productId) => {
    setSelectedProduct(productId);
    setShowPopup(true);
  };

  // Xử lý khi nhấn nút delete nhiều sản phẩm
  const handleDeleteSelected = () => {
    setShowPopup(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = () => {
    if (selectedProduct) {
      // Xóa sản phẩm đơn lẻ
      setProducts((prev) => prev.filter((product) => product.id !== selectedProduct));
    } else {
      // Xóa nhiều sản phẩm
      setProducts((prev) => prev.filter((product) => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
      setSelectAll(false);
    }
    setSelectedProduct(null);
    setShowPopup(false);
  };

  // Xử lý hủy xóa
  const handleCancelDelete = () => {
    setSelectedProduct(null);
    setShowPopup(false);
  };

  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/Products-admin/add-product');
  };

  const handleChangeProduct = (productId) => {
    navigate(`/Products-admin/Change-product/${productId}`);
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter((product) => {
    const searchMatch = searchType
      ? searchType === 'Name'
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
        : product.id.toLowerCase().includes(searchTerm.toLowerCase())
      : product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryMatch = categoryFilter ? product.category === categoryFilter : true;
    const genderMatch = genderFilter ? product.gender === genderFilter : true;

    return searchMatch && categoryMatch && genderMatch;
  });

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
          <select className="filter-select" value={searchType} onChange={handleSearchTypeChange}>
            <option value="">Choose type</option>
            <option value="Name">Name</option>
            <option value="ID">ID</option>
          </select>
          <select className="filter-select" value={categoryFilter} onChange={handleCategoryChange}>
            <option value="">Category</option>
            <option value="Outerwear">Outerwear</option>
            <option value="T-shirt">T-shirt</option>
            <option value="Shirt">Shirt</option>
            <option value="Dress">Dress</option>
            <option value="Bottom">Bottom</option>
            <option value="Accessories">Accessories</option>
            <option value="Jackets & Blazers">Jackets & Blazers</option>
            <option value="Coats">Coats</option>
            <option value="Short-sleeve T-shirt">Short-sleeve T-shirt</option>
            <option value="Short-sleeve Shirt">Short-sleeve Shirt</option>
            <option value="Long-sleeve T-shirt">Long-sleeve T-shirt</option>
            <option value="Long-sleeve Shirt">Long-sleeve Shirt</option>
            <option value="Skirts">Skirts</option>
            <option value="Dresses">Dresses</option>
            <option value="Long">Long</option>
            <option value="Short">Short</option>
            <option value="Bags">Bags</option>
            <option value="Belts">Belts</option>
          </select>
          <select className="filter-select" value={genderFilter} onChange={handleGenderChange}>
            <option value="">Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
          <button className="add-product-btn" onClick={handleAddProduct}>Add product</button>
          {selectedProducts.length > 0 && (
            <button className="delete-selected-btn" onClick={handleDeleteSelected}>
              Delete Selected
            </button>
          )}
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Product</th>
              <th>Name</th>
              <th>ID</th>
              <th>Category</th>
              <th>Gender</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td><img src="/images/image1.png" alt="" className="product-img" /></td>
                <td>{product.name}</td>
                <td>{product.id}</td>
                <td>{product.category}</td>
                <td>{product.gender}</td>
                <td>{product.stock}</td>
                <td>{product.price}</td>
                <td>
                  <span className={`status ${product.status === 'In stock' ? 'in-stock' : 'out-of-stock'}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleChangeProduct(product.id)}
                  >
                    Change
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>
                {selectedProduct
                  ? 'Are you sure you want to delete this product?'
                  : `Are you sure you want to delete ${selectedProducts.length} selected product(s)?`}
              </p>
              <button className="popup-btn" onClick={handleConfirmDelete}>Yes</button>
              <button className="popup-btn cancel-btn" onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;