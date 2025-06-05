import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Avatar, Popover, MenuItem, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, userName, logout, cartId, cartItemCount, refreshCartItemCount, orderCount, wishlistCount, refreshOrderCount, refreshWishlistCount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isWomenHovered, setIsWomenHovered] = useState(false);
  const [isMenHovered, setIsMenHovered] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

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
        <div className="search-row">
          <input type="text" placeholder="Search" />
          <span className="cancel-text" onClick={closeSearchPopup}>Cancel</span>
        </div>
        <div className="popular-terms">
          <span>Knitted Short Jacket</span>
          <span>Cropped Shirt</span>
          <span>Work Jacket</span>
          <span>Gift Bag</span>
          <span>Pleated Skort</span>
          <span>Miracle Air Double Jacket | Relaxed Fit</span>
        </div>
      </div>
    </>
  );
};

export default Navbar;