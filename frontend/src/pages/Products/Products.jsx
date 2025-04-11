import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  IconButton,
  Collapse,
  Chip
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from '../../components/Navbar/Navbar';
import './Products.css';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    gender: '',
    categories: [],
    selectedTitles: [],
    selectedItems: {}
  });
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    style: true,
    productLine: true,
    price: true,
    collection: true,
    material: true,
    color: true
  });

  const [favorites, setFavorites] = useState({});

  // Product titles for each gender
  const productTitles = {
    all: [
      'Outerwear | Áo khoác ngoài',
      'T-shirt | Áo thun',
      'Shirt | Áo sơ mi',
      'Dresses | Váy',
      'Bottoms | Nửa dưới',
      'Accessories | Phụ kiện'
    ],
    nam: [
      'Outerwear | Áo khoác ngoài',
      'T-shirt | Áo thun',
      'Shirt | Áo sơ mi',
      'Bottoms | Nửa dưới',
      'Accessories | Phụ kiện'
    ],
    nữ: [
      'Outerwear | Áo khoác ngoài',
      'T-shirt | Áo thun',
      'Shirt | Áo sơ mi',
      'Dresses | Váy',
      'Bottoms | Nửa dưới',
      'Accessories | Phụ kiện'
    ]
  };

  // Product line items for each category
  const productLineItems = {
    'Outerwear | Áo khoác ngoài': ['Jackets & Blazers', 'Coats'],
    'T-shirt | Áo thun': ['Short-sleeve', 'Long-sleeve'],
    'Shirt | Áo sơ mi': ['Short-sleeve', 'Long-sleeve'],
    'Dresses | Váy': ['Skirts', 'Dresses'],
    'Bottoms | Nửa dưới': ['Long', 'Short'],
    'Accessories | Phụ kiện': ['Bags', 'Belts']
  };

  // Filter sections
  const getFilterSections = () => {
    const baseSections = [
      {
        id: 'price',
        title: 'GIÁ',
        items: ['Dưới 500.000đ', '500.000đ - 1.000.000đ', 'Trên 1.000.000đ']
      },
      {
        id: 'size',
        title: 'KÍCH CỠ',
        items: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        id: 'color',
        title: 'MÀU SẮC',
        items: ['Đen', 'Trắng', 'Nâu', 'Natural', 'Xanh lá', 'Navy', 'Xám', 'Olive', 'Xanh dương', 'Cam']
      }
    ];

    // Nếu có category được chọn, thêm section DÒNG SẢN PHẨM
    if (filters.selectedTitles.length > 0) {
      const selectedCategory = filters.selectedTitles[0];
      const productLineSection = {
        id: 'productLine',
        title: 'DÒNG SẢN PHẨM',
        items: productLineItems[selectedCategory] || []
      };
      return [productLineSection, ...baseSections];
    }

    return baseSections;
  };

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: 'Áo khoác gì đó',
      price: '650.000 VND',
      size: 'M',
      image: '/images/product1.jpg',
      category: 'Outerwear | Áo khoác ngoài',
      productLine: 'Jackets & Blazers',
      gender: 'nam',
      color: 'Đen',
    },
    {
      id: 2,
      name: 'Áo sơ mi gì đó',
      price: '650.000 VND',
      size: 'XL',
      image: '/images/product2.jpg',
      category: 'Shirt | Áo sơ mi',
      productLine: 'Short-sleeve',
      gender: 'nữ',
      color: 'Cam',
    },
    {
      id: 3,
      name: 'Phụ kiện gì đó',
      price: '69.000 VND',
      size: 'S',
      image: '/images/product3.jpg',
      category: 'Accessories | Phụ kiện',
      productLine: 'Bags',
      gender: 'all',
      color: 'Olive',
    },
  ];

  useEffect(() => {
    setProducts(mockProducts);
    
    let currentGender = 'all';
    if (location.pathname === '/men') {
      currentGender = 'nam';
    } else if (location.pathname === '/women') {
      currentGender = 'nữ';
    }
    
    setFilters(prev => ({ ...prev, gender: currentGender }));

    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
  }, [location.pathname, category]);

  const handleGenderChange = (gender) => {
    if (gender === 'nam') {
      navigate('/men');
    } else if (gender === 'nữ') {
      navigate('/women');
    } else {
      navigate('/products');
    }

    // Kiểm tra nếu category đang được chọn không còn trong danh sách mới
    const currentSelectedTitle = filters.selectedTitles[0];
    if (currentSelectedTitle && !productTitles[gender].includes(currentSelectedTitle)) {
      setFilters(prev => ({
        ...prev,
        selectedTitles: [],
        selectedItems: {
          ...prev.selectedItems,
          productLine: {}
        }
      }));
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleSectionExpand = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleTitleSelect = (title) => {
    setFilters(prev => ({
      ...prev,
      selectedTitles: prev.selectedTitles.includes(title)
        ? []
        : [title],
      selectedItems: {
        ...prev.selectedItems,
        productLine: {}
      }
    }));
  };

  const handleItemSelect = (sectionId, item) => {
    setFilters(prev => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        [sectionId]: {
          ...(prev.selectedItems[sectionId] || {}),
          [item]: !(prev.selectedItems[sectionId]?.[item] || false)
        }
      }
    }));
  };

  const filteredProducts = products.filter(product => {
    if (filters.gender && filters.gender !== 'all' && product.gender !== filters.gender) {
      return false;
    }
    if (filters.selectedTitles.length > 0 && !filters.selectedTitles.includes(product.category)) {
      return false;
    }
    
    // Add filtering based on selected items
    for (const [sectionId, selectedItems] of Object.entries(filters.selectedItems)) {
      const selectedValues = Object.entries(selectedItems)
        .filter(([_, isSelected]) => isSelected)
        .map(([value]) => value);
      
      if (selectedValues.length > 0) {
        switch (sectionId) {
          case 'productLine':
            if (!selectedValues.includes(product.productLine)) return false;
            break;
          case 'price':
            const productPrice = parseInt(product.price.replace(/[^\d]/g, ''));
            const matchesPrice = selectedValues.some(range => {
              if (range.includes('Dưới')) {
                return productPrice < 500000;
              } else if (range.includes('Trên')) {
                return productPrice > 1000000;
              } else {
                return productPrice >= 500000 && productPrice <= 1000000;
              }
            });
            if (!matchesPrice) return false;
            break;
          case 'size':
            if (!selectedValues.includes(product.size)) return false;
            break;
          case 'color':
            if (!selectedValues.includes(product.color)) return false;
            break;
          default:
            break;
        }
      }
    }
    
    return true;
  });

  const currentTitles = productTitles[filters.gender || 'all'];

  return (
    <div>
      <Navbar isLoggedIn={false} />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <div className="sidebar">
              {/* Gender Filter */}
              <div className="gender-filter">
                <div className="gender-options">
                  <span 
                    className={`gender-option ${filters.gender === 'all' ? 'active' : ''}`}
                    onClick={() => handleGenderChange('all')}
                  >
                    TẤT CẢ
                  </span>
                  <span 
                    className={`gender-option ${filters.gender === 'nam' ? 'active' : ''}`}
                    onClick={() => handleGenderChange('nam')}
                  >
                    NAM
                  </span>
                  <span 
                    className={`gender-option ${filters.gender === 'nữ' ? 'active' : ''}`}
                    onClick={() => handleGenderChange('nữ')}
                  >
                    NỮ
                  </span>
                </div>
              </div>

              {/* Product Titles Section */}
              <div className="category-section product-titles">
                {currentTitles.map((title) => (
                  <div 
                    key={title}
                    className={`category-item ${filters.selectedTitles.includes(title) ? 'selected' : ''}`}
                    onClick={() => handleTitleSelect(title)}
                  >
                    {title}
                    {filters.selectedTitles.includes(title) && (
                      <CloseIcon className="remove-icon" />
                    )}
                  </div>
                ))}
              </div>

              {/* Filter Sections */}
              {getFilterSections().map((section) => (
                <div key={section.id} className="category-section">
                  <div 
                    className="category-header"
                    onClick={() => handleSectionExpand(section.id)}
                  >
                    <span className="category-title">{section.title}</span>
                    {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
                  </div>
                  <Collapse in={expandedSections[section.id]}>
                    <div className="category-list">
                      {section.items.map((item) => (
                        <div 
                          key={item} 
                          className={`category-item ${filters.selectedItems[section.id]?.[item] ? 'selected' : ''}`}
                          onClick={() => handleItemSelect(section.id, item)}
                        >
                          <span>{item}</span>
                          <CloseIcon 
                            className="remove-icon"
                            style={{ 
                              opacity: filters.selectedItems[section.id]?.[item] ? 1 : 0,
                              visibility: filters.selectedItems[section.id]?.[item] ? 'visible' : 'hidden'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </Collapse>
                </div>
              ))}
            </div>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            {/* Free Shipping Banner */}
            <div className="free-shipping-banner">
              <img 
                src="/images/free-shipping-banner.svg" 
                alt="Ảnh và lời quảng cáo"
                style={{
                  filter: 'brightness(0) invert(1)', // Chuyển màu thành trắng
                  opacity: 0.9
                }}
              />
            </div>

            {/* Product Grid */}
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    <IconButton
                      className="favorite-button"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      {favorites[product.id] ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </div>
                  <div className="product-info">
                    {product.tag && (
                      <div className="product-tag">{product.tag}</div>
                    )}
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">{product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Products;
