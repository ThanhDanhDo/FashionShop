import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Grid, Container } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import { getProductById } from "../../../services/productService";
import { addToCart, createCart } from '../../../services/cartService';
import { AuthContext } from '../../../context/AuthContext';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, cartId, updateCartId } = useContext(AuthContext);
  const [cartMessage, setCartMessage] = useState('');

  // Mock data cho relatedProducts (có thể thay bằng API sau này)
  const relatedProducts = [
    {
      name: "Cotton Tencel Jacket Relaxed Fit",
      image: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/476941/item/vngoods_02_476941_3x4.jpg?width=423",
      sizes: "S, M, L",
      colors: ["White", "Black"],
      price: 1275000,
      rating: 4.5,
      reviewCount: 10,
    },
    {
      name: "Miracle Air Double Jacket",
      image: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/474943/item/vngoods_03_474943_3x4.jpg?width=369",
      sizes: "S, M, L",
      colors: ["Gray", "Dark Gray", "Black"],
      price: 1471000,
      rating: 4.8,
      reviewCount: 15,
    },
    {
      name: "Knitted Short Jacket",
      image: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/474981/item/vngoods_00_474981_3x4.jpg?width=369",
      sizes: "S, M, L, XL",
      colors: ["White", "Black"],
      price: 784000,
      rating: 4.2,
      reviewCount: 8,
    },
    {
      name: "Oversized Shirt Coat",
      image: "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/474941/item/vngoods_57_474941_3x4.jpg?width=369",
      sizes: "S, M, L, XL",
      colors: ["Olive", "Navy"],
      price: 1471000,
      rating: 4.7,
      reviewCount: 12,
    },
  ];

  // State để quản lý trạng thái yêu thích cho từng sản phẩm liên quan
  const [favoriteStates, setFavoriteStates] = useState(
    new Array(relatedProducts.length).fill(false)
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setSelectedColor(data.color[0] || "");
        setSelectedSize(data.size[0] || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!selectedSize || !selectedColor) {
      setCartMessage('Vui lòng chọn size và màu sắc');
      return;
    }

    if (!product.price || product.price <= 0) {
      setCartMessage('Sản phẩm này hiện không có giá bán');
      return;
    }

    if (!product.stock || product.stock <= 0) {
      setCartMessage('Sản phẩm này đã hết hàng');
      return;
    }

    try {
      let cart = await createCart();
      
      const cartItem = {
        cart: {
          id: cart.id
        },
        product: {
          id: product.id
        },
        quantity: quantity,
        size: selectedSize,
        color: selectedColor
      };

      await addToCart(cartItem);
      setCartMessage('Đã thêm vào giỏ hàng thành công!');
    } catch (error) {
      setCartMessage('Không thể thêm vào giỏ hàng: ' + error.message);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  const filteredImages = product.imgurls || [];

  // Xử lý chuỗi description để thay thế \\n thành \n
  const formattedDescription = product.description.replaceAll("\\n", "\n");

  return (
    <>
      <Navbar />
      <div style={{ fontSize: "18px" }}>
        <div
          style={{
            padding: "40px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, marginLeft: "auto" }}>
            {/* Ảnh sản phẩm */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "70px",
              }}
            >
              <div style={{ display: "flex", gap: "12px" }}>
                {/* Cột ảnh nhỏ bên trái */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {filteredImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={product.name}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        border:
                          selectedImageIndex === index
                            ? "2px solid black"
                            : "1px solid #ccc",
                        cursor: "pointer",
                        borderRadius: "8px",
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
                      maxWidth: "400px",
                      maxHeight: "500px",
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mô tả & Đánh giá */}
            <div
              style={{
                marginLeft: "auto",
                marginRight: "120px",
                marginTop: "40px",
                width: "400px", // Cố định chiều rộng khung mô tả
              }}
            >
              <div>
                <h3 style={{ fontSize: "20px" }}>Description</h3>
                <p>Product ID: {product.id}</p>
                <details>
                  <summary style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Details
                  </summary>
                  <p style={{ whiteSpace: "pre-line" }}>{formattedDescription}</p>
                </details>
                <details>
                  <summary style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Delivery Information / Product Return Policy
                  </summary>
                  <p>
                    Delivery within 3-5 business days. Free return policy
                    within 30 days if the product is defective or not as described.
                  </p>
                </details>

                <h3 style={{ marginTop: "32px", fontSize: "20px" }}>
                  Đánh giá
                </h3>
                <p>★★★★★ 5.0 (0 reviews)</p>
                <p>There are no reviews for this product yet.</p>
              </div>
            </div>
          </div>
          {/* Thông tin sản phẩm */}
          <div
            style={{
              flex: 1,
              position: "sticky",
              top: "40px",
              alignSelf: "flex-start",
              maxWidth: "700px",
            }}
          >
            <h2 style={{ fontSize: "24px" }}>{product.name}</h2>
            <p>
              Category: {product.mainCategory?.name}{" "}
              {product.subCategory?.name ? `> ${product.subCategory.name}` : ""}
            </p>
            <p>Gender: {product.gender}</p>
            <p>Status: {product.stock > 0 ? "In stock" : "Out of stock"}</p>

            {/* Màu sắc */}
            <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
              {product.color.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: color.toLowerCase(),
                    border:
                      selectedColor === color
                        ? "2px solid black"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
            </div>

            {/* Kích cỡ */}
            <div>
              {product.size.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "1.5px solid gray";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border =
                      selectedSize === size
                        ? "2px solid black"
                        : "1px solid #ccc";
                  }}
                  style={{
                    margin: "6px",
                    padding: "12px",
                    fontSize: "16px",
                    minWidth: "40px",
                    borderRadius: "10px",
                    border:
                      selectedSize === size
                        ? "2px solid black"
                        : "1px solid #ccc",
                    fontWeight: selectedSize === size ? "bold" : "normal",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Giá */}
            <div
              style={{
                display: "flex",
                gap: "150px",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <h3 style={{ color: "black", fontSize: "22px" }}>
                {product.price.toLocaleString("vi-VN")} VND
              </h3>
            </div>

            {/* Bộ đếm số lượng */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "16px",
                border: "1px solid #ddd",
                borderRadius: "999px",
                overflow: "hidden",
                width: "120px",
              }}
            >
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px 12px",
                  fontSize: "18px",
                  cursor: "pointer",
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#555",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                -
              </button>
              <span
                style={{
                  padding: "8px 12px",
                  fontSize: "18px",
                  textAlign: "center",
                  borderLeft: "1px solid #ddd",
                  borderRight: "1px solid #ddd",
                  minWidth: "40px",
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "8px 12px",
                  fontSize: "18px",
                  cursor: "pointer",
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#555",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                +
              </button>
            </div>

            {/* Thêm vào giỏ hàng */}
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  padding: "12px 48px",
                  background: "black",
                  color: "white",
                  borderRadius: "999px",
                  marginTop: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "18px",
                  width: "300px",
                }}
              >
                ADD TO CART
              </button>
            </div>
            {cartMessage && <p style={{ color: 'red', marginTop: '10px' }}>{cartMessage}</p>}
          </div>
        </div>
        {/* Sản phẩm liên quan */}
        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "20px" }}>Sản phẩm được quan tâm</h2>
          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              justifyContent: "flex-start",
              scrollbarWidth: "none", /* Firefox */
              msOverflowStyle: "none", /* IE and Edge */
            }}
          >
            {relatedProducts.map((item, index) => (
              <div
                key={index}
                style={{
                  width: "calc(25% - 15px)",
                  minWidth: "0",
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  padding: "10px",
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ position: "-add-to-cartrelative" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      transition: "transform 0.3s ease",
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
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "28px",
                      height: "28px",
                      background: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      zIndex: 2,
                      cursor: "pointer",
                      color: favoriteStates[index] ? "red" : "gray",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {favoriteStates[index] ? "❤️" : "🤍"}
                  </div>
                </div>
                <h3 style={{ fontSize: "18px", margin: "10px 0" }}>{item.name}</h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#666",
                      marginBottom: "0",
                      marginRight: "10px",
                    }}
                  >
                    Size: {item.sizes}
                  </p>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {item.colors?.map((color, cidx) => (
                      <div
                        key={cidx}
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p style={{ marginBottom: "4px" }}>{item.price.toLocaleString()} VND</p>
                <p style={{ fontSize: "16px" }}>
                  ★ {item.rating} ({item.reviewCount})
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <footer
          style={{
            backgroundColor: "#333",
            color: "#fff",
            padding: "40px 0",
            marginTop: "40px",
          }}
        >
          <Container>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  Tên web
                </Typography>
                <Typography variant="body2">slogan</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  LIÊN HỆ
                </Typography>
                <Typography variant="body2">
                  📍 Đường Hàn Thuyên, Khu Phố 6, Thủ Đức, HCM
                </Typography>
                <Typography variant="body2">
                  📞 (+84) 12 3456 7891
                </Typography>
                <Typography variant="body2">✉️ info@gmail.com</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  HỖ TRỢ KHÁCH HÀNG
                </Typography>
                <Typography variant="body2">
                  Chính sách bảo mật thông tin
                </Typography>
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
    </>
  );
};

export default ProductDetail;