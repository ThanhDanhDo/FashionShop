import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { products, relatedProducts } from '../pages/Product';
import { AppBar, Toolbar, InputBase, Typography, Button, Grid,  Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ProductDetail = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');

  const [favoriteStates, setFavoriteStates] = useState(
    relatedProducts.map((item) => item.isFavorited)
  );

  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  const filteredImages = product.imagesByColor?.[selectedColor] || product.imageList;

  return (
    <div style={{ fontSize: '18px' }}>
      {/* Navbar */}
                    <AppBar position="static" color="transparent" elevation={0} sx={{ padding: "10px 0" }}>
                        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: "15px" }}>
                                <Typography variant="h6">Logo</Typography>
                                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f1f1', padding: '5px 10px', borderRadius: '20px' }}>
                                    <SearchIcon />
                                    <InputBase placeholder="Search" style={{ marginLeft: '5px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <Typography variant="body1">Product</Typography>
                                <Typography variant="body1">Contact Us</Typography>
                                <Button color="inherit">Sign In</Button>
                                <Button variant="outlined">Sign Up</Button>
                            </div>
                        </Toolbar>
                    </AppBar>
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
        <div style={{ flex: 1,marginLeft: 'auto'}}>
          {/* Ảnh sản phẩm */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight:'70px'}}>
        <div style={{ display: 'flex', gap: '12px' }}>
  {/* Cột ảnh nhỏ bên trái */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
    {filteredImages.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={product.name}
        onClick={() => setSelectedImageIndex(index)}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          border: selectedImageIndex === index ? '2px solid black' : '1px solid #ccc',
          cursor: 'pointer',
          borderRadius: '8px',
        }}
          />
        ))}
        </div>

          {/* Ảnh chính hiển thị lớn bên phải */}
          
        <div>
        <img
          src={filteredImages[selectedImageIndex]}
        alt={product.name}
        style={{
          maxWidth: '400px',
          maxHeight: '500px',
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: '12px',
           display: 'flex', justifyContent: 'flex-end'
        }}
          />
        </div>
        </div>
        </div>

          {/* Mô tả & Đánh giá */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight:'120px'}}>
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '20px' }}>Mô tả</h3>
            <p>Mã sản phẩm: {product.id}</p>
            <details>
              <summary style={{ fontSize: '18px' }}>Chi tiết</summary>
              <p>{product.details}</p>
            </details>
            <details>
              <summary style={{ fontSize: '18px' }}>Chất liệu / Cách chăm sóc</summary>
              <p>{product.care}</p>
            </details>
            <details>
              <summary style={{ fontSize: '18px' }}>Thông tin giao hàng / Chính sách đổi trả sản phẩm</summary>
              <p>{product.shippingPolicy}</p>
            </details>

            <h3 style={{ marginTop: '32px', fontSize: '20px' }}>Đánh giá</h3>
            <p>★★★★★ 5.0 ({product.reviewCount})</p>
            {product.reviews.map((review, index) => (
              <div key={index} style={{ marginTop: '20px' }}>
                <strong>{review.title}</strong>
                <p>★★★★★</p>
                <p><strong>Kích cỡ đã mua:</strong> {review.size}</p>
                <p>{review.comment}</p>
                <small>{review.name} - {review.date}</small>
              </div>
            ))}
          </div>
        </div>
        </div>
        {/* Thông tin sản phẩm */}

        <div style={{ flex: 1, position: 'sticky', top: '40px', alignSelf: 'flex-start', maxWidth:'700px'}}>
          <h2 style={{ fontSize: '24px' }}>{product.name}</h2>

          {/* Màu sắc */}
          <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
            {product.colors.map((color) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: selectedColor === color ? '2px solid black' : '1px solid #ccc',
                  cursor: 'pointer',
                }}
              ></div>
            ))}
          </div>

          {/* Kích cỡ */}
<div>
  {product.sizes.map((size) => (
    <button
      key={size}
      onClick={() => setSelectedSize(size)}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1.5px solid gray';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border =
          selectedSize === size ? '2px solid black' : '1px solid #ccc';
      }}
      style={{
        margin: '6px',
        padding: '12px',
        fontSize: '16px',
        minWidth: '40px',
        borderRadius: '10px',
        border: selectedSize === size ? '2px solid black' : '1px solid #ccc',
        fontWeight: selectedSize === size ? 'bold' : 'normal',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {size}
    </button>
  ))}
</div>
          
          {/* Giá */}
          <div style={{ display: 'flex', gap: '150px', alignItems: 'center', marginTop: '16px'}}>
          {product.isSales ? (
        <>
          <p style={{ fontSize: '18px', textDecoration: 'line-through', color: 'gray' }}>
          {product.price.toLocaleString()} VNĐ
          </p>
          <h3 style={{ color: 'red', fontSize: '22px' }}>
          {product.salePrice.toLocaleString()} VNĐ
          </h3>
        </>
          ) : (
          <h3 style={{ color: 'black', fontSize: '22px' }}>
          {product.price.toLocaleString()} VNĐ
          </h3>
          )}

          {product.isLimitedOffer && (
            <p style={{ color: 'red' }}>Limited Offer: {product.offerDate}</p>
          )}

          {/* Đánh giá*/}
          <p>⭐ {product.rating} ({product.reviewCount})</p>
          </div>
          {/*chất liệu */}
          <p>Sản phẩm được làm từ {product.material}</p>
          {/* Bộ đếm số lượng */}
          <div
          style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '16px',
          border: '1px solid #ddd',
          borderRadius: '999px',
          overflow: 'hidden',
          width: '120px',
          }}
          >
        <button
        onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
        style={{
          background: 'none',
          border: 'none',
          padding: '8px 12px',
          fontSize: '18px',
          cursor: 'pointer',
          flex: 1,
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#555',
          transition: 'background-color 0.2s ease',
            }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    -
  </button>
  <span
    style={{
      padding: '8px 12px',
      fontSize: '18px',
      textAlign: 'center',
      borderLeft: '1px solid #ddd',
      borderRight: '1px solid #ddd',
      minWidth: '40px', 
    }}
  >
    {quantity}
  </span>
  <button
    onClick={() => setQuantity(quantity + 1)}
    style={{
      background: 'none',
      border: 'none',
      padding: '8px 12px',
      fontSize: '18px',
      cursor: 'pointer',
      flex: 1,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#555',
      transition: 'background-color 0.2s ease',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    +
  </button>
</div>

          {/* Thêm vào giỏ hàng */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button
        style={{
          padding: '12px 24px',
          background: 'black',
          color: 'white',
          borderRadius: '999px',
          marginTop: '20px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        THÊM VÀO GIỎ HÀNG
        </button>
        </div>
        </div>

      </div>
 {/* ==== SẢN PHẨM LIÊN QUAN ==== */}
 <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Sản phẩm được quan tâm</h2>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            justifyContent: 'flex-start',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none' /* IE and Edge */
          }}
        >
          {relatedProducts.map((item, index) => (
            <div
              key={index}
              style={{
                width: 'calc(25% - 15px)',
                minWidth: '0',
                border: '1px solid #eee',
                borderRadius: '10px',
                padding: '10px',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    transition: 'transform 0.3s ease'
                  }}
                />
                {/* Icon trái tim */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedFavorites = [...favoriteStates];
                    updatedFavorites[index] = !updatedFavorites[index];
                    setFavoriteStates(updatedFavorites);
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '28px',
                    height: '28px',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    zIndex: 2,
                    cursor: 'pointer',
                    color: favoriteStates[index] ? 'red' : 'gray',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {favoriteStates[index] ? '❤️' : '🤍'}
                </div>
              </div>
              <h3 style={{ fontSize: '18px', margin: '10px 0' }}>{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <p style={{ fontSize: '16px', color: '#666', marginBottom: '0', marginRight: '10px' }}>
                  Size: {item.sizes}
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {item.colors?.map((color, cidx) => (
                    <div
                      key={cidx}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: '1px solid #ccc',
                      }}
                    />
                  ))}
                </div>
              </div>
              <p style={{ marginBottom: '4px' }}>{item.price.toLocaleString()} VND</p>
              <p style={{ fontSize: '16px' }}>★ {item.rating} ({item.reviewCount})</p>
            </div>
          ))}
        </div>
        
      </div>
      {/* Footer */}
      <footer style={{ backgroundColor: "#333", color: "#fff", padding: "40px 0", marginTop: "40px" }}>
                      <Container>
                          <Grid container spacing={4}>
                              <Grid item xs={12} md={4}>
                                  <Typography variant="h6" style={{ fontWeight: "bold" }}>Tên web</Typography>
                                  <Typography variant="body2">slogan</Typography>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                  <Typography variant="h6" style={{ fontWeight: "bold" }}>LIÊN HỆ</Typography>
                                  <Typography variant="body2">📍 Đường Hàn Thuyên, Khu Phố 6, Thủ Đức, HCM</Typography>
                                  <Typography variant="body2">📞 (+84) 12 3456 7891</Typography>
                                  <Typography variant="body2">✉️ info@gmail.com</Typography>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                  <Typography variant="h6" style={{ fontWeight: "bold" }}>HỖ TRỢ KHÁCH HÀNG</Typography>
                                  <Typography variant="body2">Chính sách bảo mật thông tin</Typography>
                                  <Typography variant="body2">Quy chế hoạt động</Typography>
                                  <Typography variant="body2">Chính sách thanh toán</Typography>
                                  <Typography variant="body2">Chính sách đổi trả hàng</Typography>
                                  <Typography variant="body2">Chính sách vận chuyển</Typography>
                                  <Typography variant="body2">Giới thiệu sản phẩm</Typography>
                              </Grid>
                          </Grid>
                      </Container>
                  </footer>
    </div>
  );
};

export default ProductDetail;