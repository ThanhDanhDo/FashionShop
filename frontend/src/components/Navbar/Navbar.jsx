import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Avatar, Popover, MenuItem, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close'; // Thêm import này
import { AuthContext } from '../../context/AuthContext';
import { searchProducts } from '../../services/productService'; // Thêm import này

const Navbar = () => {
  const { isLoggedIn, userName, logout, cartId, cartItemCount, refreshCartItemCount, orderCount, wishlistCount, refreshOrderCount, refreshWishlistCount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isWomenHovered, setIsWomenHovered] = useState(false);
  const [isMenHovered, setIsMenHovered] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPage, setSearchPage] = useState(0);
  const [searchTotalPages, setSearchTotalPages] = useState(0);

  const categoryMap = {
    Outerwear: 1,
    'T-shirt': 2,
    Shirt: 3,
    Dresses: 4,
    Bottoms: 5,
    Accessories: 6,
  };

  const subCategoryMap = {
    'Jackets & Blazers': 7,
    Coats: 8,
    'T-shirt Short-sleeve': 9,
    'T-shirt Long-sleeve': 10,
    'Shirt Short-sleeve': 11,
    'Shirt Long-sleeve': 12,
    Skirts: 13,
    Dresses: 14,
    Long: 15,
    Short: 16,
    Bags: 17,
    Belts: 18,
    Hats: 19,
  };

  useEffect(() => {
    if (isLoggedIn && cartId) {
      refreshCartItemCount();
    }
    if (isLoggedIn) {
      refreshOrderCount();
      refreshWishlistCount();
    }
  }, [isLoggedIn, cartId, refreshCartItemCount, refreshOrderCount, refreshWishlistCount]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const toggleSearchPopup = () => {
    setIsSearchActive(!isSearchActive);
  };

  const closeSearchPopup = () => {
    setIsSearchActive(false);
    setSearchValue('');
    setSearchResults([]);
  };

  const handleFilterNavigation = (gender, mainCategory, subCategory) => {
    const queryParams = new URLSearchParams();
    if (gender && gender !== 'all') queryParams.append('gender', gender);
    if (mainCategory) queryParams.append('mainCategoryId', categoryMap[mainCategory]);
    if (subCategory) queryParams.append('subCategoryId', subCategoryMap[subCategory]);
    
    navigate(`/products?${queryParams.toString()}`);
    
    setIsProductHovered(false);
    setIsWomenHovered(false);
    setIsMenHovered(false);
  };

  const handleAccountClick = () => {
    navigate('/user-account');
  };

  const handleDeliveryAddressClick = () => {
    navigate('/delivery-address');
    handleClose();
  };

  const isPopoverOpen = Boolean(anchorEl);

  const handleSearchInput = async (e, page = 0) => {
    const value = e.target ? e.target.value : searchValue;
    setSearchValue(value);

    if (value.trim().length === 0) {
      setSearchResults([]);
      setSearchTotalPages(0);
      setSearchPage(0);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await searchProducts(value, page, 5); // 5 sản phẩm mỗi trang
      setSearchResults(res.content || []);
      setSearchTotalPages(res.totalPages || 0);
      setSearchPage(res.number || 0);
    } catch {
      setSearchResults([]);
      setSearchTotalPages(0);
      setSearchPage(0);
    }
    setSearchLoading(false);
  };

  const handleSearchPageChange = (newPage) => {
    handleSearchInput({ target: { value: searchValue } }, newPage);
  };

  const handleSearchResultClick = (id) => {
    setIsSearchActive(false);
    setSearchValue('');
    setSearchResults([]);
    navigate(`/product/${id}`);
  };

  return (
    <>
      <nav className={`navbar ${isProductHovered || isWomenHovered || isMenHovered ? 'navbar-hovered' : ''}`}>
        <div className="navbar-left">
          <Link to="/" className="nav-logo">
            <img src="/images/logo4.png" alt="Logo" className="logo-img" />
          </Link>
          <div className="search-bar" onClick={toggleSearchPopup}>
            <SearchIcon style={{ fontSize: '24px', color: '#333' }} />
            <input type="text" placeholder="Search" readOnly />
          </div>
        </div>

        <div className="navbar-center">
          <div className="products-container">
            <Link
              to="/products"
              className="nav-link"
              onMouseEnter={() => setIsProductHovered(true)}
              onMouseLeave={() => setIsProductHovered(false)}
            >
              Products
            </Link>
            <div
              className="product-popup"
              style={{ opacity: isProductHovered ? 1 : 0, pointerEvents: isProductHovered ? 'auto' : 'none' }}
              onMouseEnter={() => setIsProductHovered(true)}
              onMouseLeave={() => setIsProductHovered(false)}
            >
              <div className="product-grid">
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span
                        onClick={() => handleFilterNavigation('all', 'Outerwear')}
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                      >
                        Outerwear
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Outerwear', 'Jackets & Blazers')} style={{ cursor: 'pointer' }}>
                          Jackets & Blazers
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Outerwear', 'Coats')} style={{ cursor: 'pointer' }}>
                          Coats
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                        onClick={() => handleFilterNavigation('all', 'T-shirt')} 
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                        >
                        T-shirt
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'T-shirt', 'T-shirt Short-sleeve')} style={{ cursor: 'pointer' }}>
                          Short-sleeve
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'T-shirt', 'T-shirt Long-sleeve')} style={{ cursor: 'pointer' }}>
                          Long-sleeve
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                        onClick={() => handleFilterNavigation('all', 'Shirt')} 
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                        >
                        Shirt
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Shirt', 'Shirt Short-sleeve')} style={{ cursor: 'pointer' }}>
                          Short-sleeve
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Shirt', 'Shirt Long-sleeve')} style={{ cursor: 'pointer' }}>
                          Long-sleeve
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                        onClick={() => handleFilterNavigation('all', 'Dresses')} 
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                        >
                        Dresses
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Dresses', 'Skirts')} style={{ cursor: 'pointer' }}>
                          Skirts
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Dresses', 'Dresses')} style={{ cursor: 'pointer' }}>
                          Dresses
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                        onClick={() => handleFilterNavigation('all', 'Bottoms')} 
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                        >
                        Bottoms
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Bottoms', 'Long')} style={{ cursor: 'pointer' }}>
                          Long
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Bottoms', 'Short')} style={{ cursor: 'pointer' }}>
                          Short
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                        onClick={() => handleFilterNavigation('all', 'Accessories')} 
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                        >
                        Accessories
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Accessories', 'Bags')} style={{ cursor: 'pointer' }}>
                          Bags
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('all', 'Accessories', 'Belts')} style={{ cursor: 'pointer' }}>
                          Belts
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="women-container">
            <Link
              to="/products?gender=Women"
              className="nav-link"
              onMouseEnter={() => setIsWomenHovered(true)}
              onMouseLeave={() => setIsWomenHovered(false)}
            >
              Women
            </Link>
            <div
              className="women-popup"
              style={{ opacity: isWomenHovered ? 1 : 0, pointerEvents: isWomenHovered ? 'auto' : 'none' }}
              onMouseEnter={() => setIsWomenHovered(true)}
              onMouseLeave={() => setIsWomenHovered(false)}
            >
              <div className="product-grid">
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                        onClick={() => handleFilterNavigation('Women', 'Outerwear')} 
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                        >
                        Outerwear
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Outerwear', 'Jackets & Blazers')} style={{ cursor: 'pointer' }}>
                          Jackets & Blazers
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Outerwear', 'Coats')} style={{ cursor: 'pointer' }}>
                          Coats
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                      onClick={() => handleFilterNavigation('Women', 'T-shirt')} 
                      style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                      >
                        T-shirt
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'T-shirt', 'T-shirt Short-sleeve')} style={{ cursor: 'pointer' }}>
                          Short-sleeve
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'T-shirt', 'T-shirt Long-sleeve')} style={{ cursor: 'pointer' }}>
                          Long-sleeve
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                        onClick={() => handleFilterNavigation('Women', 'Shirt')} 
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                        >
                        Shirt
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Shirt', 'Shirt Short-sleeve')} style={{ cursor: 'pointer' }}>
                          Short-sleeve
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Shirt', 'Shirt Long-sleeve')} style={{ cursor: 'pointer' }}>
                          Long-sleeve
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                        onClick={() => handleFilterNavigation('Women', 'Dresses')} 
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                        >
                        Dresses
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Dresses', 'Skirts')} style={{ cursor: 'pointer' }}>
                          Skirts
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Dresses', 'Dresses')} style={{ cursor: 'pointer' }}>
                          Dresses
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span 
                        onClick={() => handleFilterNavigation('Women', 'Bottoms')} 
                        style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}
                        >
                        Bottoms
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Bottoms', 'Long')} style={{ cursor: 'pointer' }}>
                          Long
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Bottoms', 'Short')} style={{ cursor: 'pointer' }}>
                          Short
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span onClick={() => handleFilterNavigation('Women', 'Accessories')} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>
                        Accessories
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Accessories', 'Hats')} style={{ cursor: 'pointer' }}>
                          Hats
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Women', 'Accessories', 'Bags')} style={{ cursor: 'pointer' }}>
                          Bags
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="men-container">
            <Link
              to="/products?gender=Men"
              className="nav-link"
              onMouseEnter={() => setIsMenHovered(true)}
              onMouseLeave={() => setIsMenHovered(false)}
            >
              Men
            </Link>
            <div
              className="men-popup"
              style={{ opacity: isMenHovered ? 1 : 0, pointerEvents: isMenHovered ? 'auto' : 'none' }}
              onMouseEnter={() => setIsMenHovered(true)}
              onMouseLeave={() => setIsMenHovered(false)}
            >
              <div className="product-grid">
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span onClick={() => handleFilterNavigation('Men', 'Outerwear')} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>
                        Outerwear
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'Outerwear', 'Jackets & Blazers')} style={{ cursor: 'pointer' }}>
                          Jackets & Blazers
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'Outerwear', 'Coats')} style={{ cursor: 'pointer' }}>
                          Coats
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span onClick={() => handleFilterNavigation('Men', 'T-shirt')} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>
                        T-shirt
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'T-shirt', 'T-shirt Short-sleeve')} style={{ cursor: 'pointer' }}>
                          Short-sleeve
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'T-shirt', 'T-shirt Long-sleeve')} style={{ cursor: 'pointer' }}>
                          Long-sleeve
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span onClick={() => handleFilterNavigation('Men', 'Shirt')} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>
                        Shirt
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'Shirt', 'Shirt Short-sleeve')} style={{ cursor: 'pointer' }}>
                          Short-sleeve
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'Shirt', 'Shirt Long-sleeve')} style={{ cursor: 'pointer' }}>
                          Long-sleeve
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span onClick={() => handleFilterNavigation('Men', 'Bottoms')} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>
                        Bottoms
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'Bottoms', 'Long')} style={{ cursor: 'pointer' }}>
                          Long
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'Bottoms', 'Short')} style={{ cursor: 'pointer' }}>
                          Short
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="product-column">
                  <div className="product-column-content">
                    <h4>
                      <span onClick={() => handleFilterNavigation('Men', 'Accessories')} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px' }}>
                        Accessories
                      </span>
                    </h4>
                    <ul>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'Accessories', 'Hats')} style={{ cursor: 'pointer' }}>
                          Hats
                        </span>
                      </li>
                      <li>
                        <span onClick={() => handleFilterNavigation('Men', 'Accessories', 'Bags')} style={{ cursor: 'pointer' }}>
                          Bags
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link to="/contact" className="nav-link">Contact Us</Link>
        </div>

        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="cart-link">
                <IconButton>
                  <Badge badgeContent={cartItemCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Link>
              <Link to="/orders" className="order-link">
                <IconButton>
                  <Badge badgeContent={orderCount} color="error">
                    <ReceiptIcon />
                  </Badge>
                </IconButton>
              </Link>
              <Link to="/wishList" className="wishlist-link">
                <IconButton>
                  <Badge badgeContent={wishlistCount} color="error">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              </Link>
              <div className="account-section" onClick={handleAvatarClick}>
                <AccountCircleIcon style={{ fontSize: 40, color: '#555' }} />
                <span className="user-name">{userName || 'Guest'}</span>
              </div>
              <Popover
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                sx={{
                  '& .MuiPopover-paper': {
                    width: '180px',
                    padding: '10px',
                    fontSize: '18px',
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleAccountClick();
                  }}
                  sx={{ fontSize: '18px' }}
                >
                  Account
                </MenuItem>
                <MenuItem
                  onClick={handleDeliveryAddressClick}
                  sx={{ fontSize: '18px' }}
                >
                  Delivery Address
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{ fontSize: '18px' }}
                >
                  Log out
                </MenuItem>
              </Popover>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/signup" className="nav-button">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <div
        className={`search-overlay ${isSearchActive ? 'active' : ''}`}
        onClick={closeSearchPopup}
      ></div>

      <div className={`search-popup ${isSearchActive ? 'active' : ''}`}>
        <div className="search-row" style={{ width: '100%', maxWidth: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Search product name"
              value={searchValue}
              onChange={handleSearchInput}
              autoFocus
              style={{
                width: '100%',
                paddingRight: 36,
                boxSizing: 'border-box',
              }}
            />
            {searchValue && (
              <span
                onClick={() => {
                  setSearchValue('');
                  setSearchResults([]);
                  setTimeout(() => {
                    document.querySelector('.search-row input')?.focus();
                  }, 0);
                }}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  cursor: 'pointer',
                  color: '#888',
                  fontSize: 20,
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  lineHeight: 1,
                }}
                aria-label="Clear"
              >
                <CloseIcon fontSize="small" />
              </span>
            )}
          </div>
          <span
            className="cancel-text"
            onClick={() => {
              setSearchValue('');
              setSearchResults([]);
              closeSearchPopup();
            }}
            style={{ marginLeft: 16 }}
          >
            Cancel
          </span>
        </div>
        {/* Gợi ý phổ biến */}
        <div className="popular-terms">
          <span onClick={() => setSearchValue('Knitted Short Jacket')}>Knitted Short Jacket</span>
          <span onClick={() => setSearchValue('Cropped Shirt')}>Cropped Shirt</span>
          <span onClick={() => setSearchValue('Work Jacket')}>Work Jacket</span>
          <span onClick={() => setSearchValue('Gift Bag')}>Gift Bag</span>
          <span onClick={() => setSearchValue('Pleated Skort')}>Pleated Skort</span>
          <span onClick={() => setSearchValue('Miracle Air Double Jacket')}>Miracle Air Double Jacket</span>
        </div>
        {/* Kết quả search */}
        {searchLoading && <div style={{ marginTop: 20 }}>Loading...</div>}
        {!searchLoading && searchValue && (
          <div style={{ marginTop: 20, width: '100%' }}>
            {searchResults.length === 0 ? (
              <div style={{ color: '#888', fontStyle: 'italic', textAlign: "center" }}>No results found.</div>
            ) : (
              <>
                <div className="search-results-grid">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      style={{
                        background: '#fff',
                        borderRadius: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        padding: 12,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'box-shadow 0.2s',
                      }}
                      onClick={() => handleSearchResultClick(product.id)}
                    >
                      <img
                        className="product-image"
                        src={product.imgurls && product.imgurls.length > 0 ? product.imgurls[0] : '/images/no-image.png'}
                        alt={product.name}
                      />
                      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{product.name}</div>
                      <div style={{ color: '#666', fontSize: 14, marginBottom: 2 }}>
                        {product.mainCategory?.name || ''}
                      </div>
                      <div style={{ color: '#1976d2', fontWeight: 500, fontSize: 15 }}>
                        {product.price?.toLocaleString('vi-VN')} VND
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination controls */}
                {searchTotalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 16 }}>
                    <button
                      onClick={() => handleSearchPageChange(searchPage - 1)}
                      disabled={searchPage === 0}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 22,
                        cursor: searchPage === 0 ? 'not-allowed' : 'pointer',
                        color: searchPage === 0 ? '#ccc' : '#1976d2'
                      }}
                    >
                      &#8592; {/* Left arrow */}
                    </button>
                    <span style={{ fontSize: 15 }}>
                      Page {searchPage + 1} / {searchTotalPages}
                    </span>
                    <button
                      onClick={() => handleSearchPageChange(searchPage + 1)}
                      disabled={searchPage >= searchTotalPages - 1}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 22,
                        cursor: searchPage >= searchTotalPages - 1 ? 'not-allowed' : 'pointer',
                        color: searchPage >= searchTotalPages - 1 ? '#ccc' : '#1976d2'
                      }}
                    >
                      &#8594; {/* Right arrow */}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;