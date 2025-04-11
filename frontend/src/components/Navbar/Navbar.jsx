import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Avatar, Popover, MenuItem, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import icon mặc định
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, userName, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isWomenHovered, setIsWomenHovered] = useState(false);
  const [isMenHovered, setIsMenHovered] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
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

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <>
      <nav className={`navbar ${isProductHovered || isWomenHovered || isMenHovered ? 'navbar-hovered' : ''}`}>
        <div className="navbar-left">
          <Link to="/" className="nav-logo">LOGO</Link>
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
                  <h4><Link to="/products/outerwear">Outerwear</Link></h4>
                  <ul>
                    <li><Link to="/products/outerwear">Jackets & Blazers</Link></li>
                    <li><Link to="/products/outerwear">Coats</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/products/T-shirt">T-shirt</Link></h4>
                  <ul>
                    <li><Link to="/products/t-shirt">Short-sleeve</Link></li>
                    <li><Link to="/products/shirt">Long-sleeve</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/products/Shirtt">Shirt</Link></h4>
                  <ul>
                    <li><Link to="/products/Shirt">Short-sleeve</Link></li>
                    <li><Link to="/products/Shirt">Long-sleeve</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/products/Dresses">Dresses</Link></h4>
                  <ul>
                    <li><Link to="/products/Dresses">Skirts</Link></li>
                    <li><Link to="/products/Dresses">Dresses</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/products/bottoms">Bottoms</Link></h4>
                  <ul>
                    <li><Link to="/products/bottom">Long</Link></li>
                    <li><Link to="/products/bottom">Short</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/products/accessories">Accessories</Link></h4>
                  <ul>
                    <li><Link to="/products/accessories">Bags</Link></li>
                    <li><Link to="/products/accessories">Belts</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="women-container">
            <Link
              to="/women"
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
                  <h4><Link to="/women/outerwear">Outerwear</Link></h4>
                  <ul>
                    <li><Link to="/women/outerwear">Jackets & Blazers</Link></li>
                    <li><Link to="/women/outerwear">Coats</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/women/T-shirt">T-shirt</Link></h4>
                  <ul>
                    <li><Link to="/women/T-shirt">Short-sleeve</Link></li>
                    <li><Link to="/women/T-shirt">Long-sleeve</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/women/Shirt">Shirt</Link></h4>
                  <ul>
                    <li><Link to="/women/Shirt">Short-sleeve</Link></li>
                    <li><Link to="/women/Shirt">Long-sleeve</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/women/Dresses">Dresses</Link></h4>
                  <ul>
                    <li><Link to="/women/Dresses">Skirts</Link></li>
                    <li><Link to="/women/Dresses">Dresses</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/women/bottoms">Bottoms</Link></h4>
                  <ul>
                    <li><Link to="/women/bottom">Long</Link></li>
                    <li><Link to="/women/bottom">Short</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/women/accessories">Accessories</Link></h4>
                  <ul>
                    <li><Link to="/women/accessories">Hats</Link></li>
                    <li><Link to="/women/accessories">Bags</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="men-container">
            <Link
              to="/men"
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
                  <h4><Link to="/men/outerwear">Outerwear</Link></h4>
                  <ul>
                    <li><Link to="/men/outerwear">Jackets & Blazers</Link></li>
                    <li><Link to="/women/outerwear">Coats</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/men/T-shirt">T-shirt</Link></h4>
                  <ul>
                    <li><Link to="/men/T-shirt">Short-sleeve</Link></li>
                    <li><Link to="/men/T-shirt">Long-sleeve</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/men/Shirt">Shirt</Link></h4>
                  <ul>
                    <li><Link to="/men/Shirt">Short-sleeve</Link></li>
                    <li><Link to="/men/Shirt">Long-sleeve</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/men/bottoms">Bottoms</Link></h4>
                  <ul>
                    <li><Link to="/men/bottom">Long</Link></li>
                    <li><Link to="/men/bottom">Short</Link></li>
                  </ul>
                </div>
                <div className="product-column">
                  <h4><Link to="/men/accessories">Accessories</Link></h4>
                  <ul>
                    <li><Link to="/men/accessories">Hats</Link></li>
                    <li><Link to="/men/accessories">Bags</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Link to="/contact" className="nav-link">Contact Us</Link>
        </div>

        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <IconButton>
                <Badge badgeContent={2} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton>
                <Badge badgeContent={5} color="error">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
              <div className="account-section" onClick={handleAvatarClick}>
                <AccountCircleIcon style={{ fontSize: 40, color: '#555' }} /> {/* Icon mặc định */}
                <span className="user-name">{userName || 'Guest'}</span>
              </div>
              <Popover
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom', // Hiển thị ngay dưới account-section
                  horizontal: 'center', // Căn giữa theo chiều ngang
                }}
                transformOrigin={{
                  vertical: 'top', // Điểm gốc của popup là phía trên
                  horizontal: 'center', // Căn giữa theo chiều ngang
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
                  onClick={handleClose}
                  sx={{ fontSize: '18px' }}
                >Tài khoản</MenuItem>     
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ fontSize: '18px' }}
                >Đăng xuất</MenuItem>
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
      
      {/* Overlay */}
      <div
        className={`search-overlay ${isSearchActive ? 'active' : ''}`}
        onClick={closeSearchPopup} // Đóng popup khi click vào overlay
      ></div>

      {/* Popup tìm kiếm */}
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