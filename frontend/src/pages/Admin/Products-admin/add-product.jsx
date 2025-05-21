import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './add-product.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    gender: '',
    stock: '',
    price: '',
    status: 'In stock',
    description: '',
    image: null,
  });

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleConfirmAdd = () => {
    console.log('New Product:', formData);
    setShowPopup(false);
    navigate('/Products-admin');
  };

  const handleCancelAdd = () => {
    setShowPopup(false);
  };

  const handleCancel = () => {
    navigate('/Products-admin');
  };

  return (
    <div className="add-product">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="left-column">
            <div className="section">
              <h3>Basic Information</h3>
              <label>
                Product ID:
                <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    required
                />
                </label>
              <label>
                Product Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Descriptions:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="8"
                  required
                />
              </label>
              <label>
                Category:
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                >
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
                </label>
                <label>
                Gender:
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                </select>
                </label>
            </div>
          </div>

          <div className="right-column">
            <div className="section">
              <h3>Product Image</h3>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
              />
              <p>Recommended size: 500x500 px</p>
              <h3>Stock & Pricing</h3>
              <label>
                Stock:
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Price:
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Status:
                <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="In stock">In stock</option>
                    <option value="Out of stock">Out of stock</option>
                </select>
            </label>
            </div>
          </div>
        </div>

        <div className="action-bar">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="add-button">
            Add Product
          </button>
        </div>
      </form>
      
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Are you sure you want to add this product?</p>
            <button className="popup-btn cancel-btn" onClick={handleCancelAdd}>
              No
            </button>
            <button className="popup-btn" onClick={handleConfirmAdd}>
              Yes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;