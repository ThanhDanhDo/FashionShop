import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { products, relatedProducts } from '../../data/Product';



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
    <div style={{ padding: '40px' }}>
      <div style={{  padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ flex: 1,justifyContent: 'center' }}>
          {/* Ảnh sản phẩm */}
          <div style={{ display: 'flex', gap: '16px' }}>
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
        }}
          />
        </div>
        </div>

          {/* Mô tả & Đánh giá */}
          <div style={{ marginTop: '40px' }}>
            <h3>Mô tả</h3>
            <p>Mã sản phẩm: {product.id}</p>
            <details>
              <summary>Chi tiết</summary>
              <p>{product.details}</p>
            </details>
            <details>
              <summary>Chất liệu / Cách chăm sóc</summary>
              <p>{product.care}</p>
            </details>
            <details>
              <summary>Thông tin giao hàng / Chính sách đổi trả sản phẩm</summary>
              <p>{product.shippingPolicy}</p>
            </details>

            <h3 style={{ marginTop: '32px' }}>Đánh giá</h3>
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

        {/* Thông tin sản phẩm */}
        <div style={{ flex: 1, position: 'sticky', top: '40px', alignSelf: 'flex-start' }}>
          <h2>{product.name}</h2>

          {/* Màu sắc */}
          <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
            {product.colors.map((color) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '24px',
                  height: '24px',
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
                  e.currentTarget.style.border = selectedSize === size ? '2px solid black' : '1px solid #ccc';
                }}
                style={{
                  margin: '5px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: selectedSize === size ? '2px solid black' : '1px solid #ccc',
                  fontWeight: selectedSize === size ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Giá */}
          {product.isSales ? (
        <>
          <p style={{ textDecoration: 'line-through', color: 'gray' }}>
          {product.price.toLocaleString()} VNĐ
          </p>
          <h3 style={{ color: 'red' }}>
          {product.salePrice.toLocaleString()} VNĐ
          </h3>
        </>
          ) : (
          <h3 style={{ color: 'black' }}>
          {product.price.toLocaleString()} VNĐ
          </h3>
          )}

          {product.isLimitedOffer && (
            <p style={{ color: 'red' }}>Limited Offer: {product.offerDate}</p>
          )}

          {/* Đánh giá và chất liệu */}
          <p>⭐ {product.rating} ({product.reviewCount})</p>
          <p>Sản phẩm được làm từ {product.material}</p>

          {/* Bộ đếm số lượng */}
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    overflow: 'hidden', /* Để bo tròn các nút */
    width: '120px',
  }}
>
  <button
    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
    style={{
      background: 'none',
      border: 'none',
      padding: '8px 12px',
      fontSize: '16px',
      cursor: 'pointer',
      flex: 1, /* Chia đều không gian */
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
      fontSize: '16px',
      textAlign: 'center',
      borderLeft: '1px solid #ddd',
      borderRight: '1px solid #ddd',
      minWidth: '40px', /* Đảm bảo số không bị co lại quá nhỏ */
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
      fontSize: '16px',
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
          <button style={{ padding: '10px 20px', background: 'black', color: 'white', marginTop: '20px' }}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

{/* ==== SẢN PHẨM LIÊN QUAN ==== */}
<div style={{ marginTop: '60px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Sản phẩm được quan tâm</h2>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', justifyContent: 'center' }}>
          {relatedProducts.map((item, idx) => (
            <div
              key={idx}
              style={{
                minWidth: '220px',
                border: '1px solid #eee',
                borderRadius: '10px',
                padding: '10px',
                textAlign: 'left',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              />

              {/* Trái tim + Màu sắc */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                {/* Trái tim */}
                <div
                  onClick={() => {
                    const updatedFavorites = [...favoriteStates];
                    updatedFavorites[idx] = !updatedFavorites[idx];
                    setFavoriteStates(updatedFavorites);
                  }}
                  onMouseEnter={(e) => {
                    if (!favoriteStates[idx]) e.currentTarget.style.color = '#ff69b4';
                  }}
                  onMouseLeave={(e) => {
                    if (!favoriteStates[idx]) e.currentTarget.style.color = '#ccc';
                  }}
                  style={{
                    fontSize: '18px',
                    color: favoriteStates[idx] ? '#ff69b4' : '#ccc',
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                  }}
                >
                  ♥
                </div>

                {/* Màu sắc */}
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

              {/* Size */}
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                Size: {item.sizes}
              </p>

              {/* Info */}
              <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.name}</p>
              <p style={{ marginBottom: '4px' }}>{item.price.toLocaleString()} VND</p>
              <p style={{ fontSize: '14px' }}>★ {item.rating} ({item.reviewCount})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;