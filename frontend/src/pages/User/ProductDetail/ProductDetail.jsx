import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import Navbar from "../../../components/Navbar/Navbar";
import { getProductById } from "../../../services/productService";
import { addToCart, createCart, getActiveCart } from '../../../services/cartService';
import { AuthContext } from '../../../context/AuthContext';
import CustomBreadcrumb from '../../../components/Breadcrumb';
import FooterComponent from '../../../components/Footer/Footer';
import ProductCard from '../../../components/ProductCard';
import { Image } from 'antd';
import { useLoading } from '../../../context/LoadingContext';
import SpinPage from '../../../components/SpinPage';
import { getInteractRecommendations, addInteract } from '../../../services/interactService';
import IconButton from "@mui/material/IconButton";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FullPageSpin from '../../../components/ListSpin'; // Import ListSpin.jsx

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, cartId, updateCartId, refreshCartItemCount } = useContext(AuthContext);
  const [cartMessage, setCartMessage] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { loading, setLoading } = useLoading();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true); // Thêm trạng thái loading
  const RECOMMEND_PAGE_SIZE = 4;
  const [recommendPage, setRecommendPage] = useState(0);

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
  }, [id, setLoading]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoadingRecommendations(true); // Bắt đầu loading
        await addInteract(id); // Gửi tương tác
        const data = await getInteractRecommendations();
        setRelatedProducts(data);
        setFavoriteStates(new Array(data.length).fill(false));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingRecommendations(false); // Kết thúc loading
      }
    };
    fetchRecommendations();
  }, [id]);

  // cuộn lên đầu
  useEffect(() => {
    window.scrollTo(0, 0);
    setRecommendPage(0); // Reset về trang đầu tiên của danh sách recommended products
  }, [id]);

  const totalRecommendPages = Math.ceil(relatedProducts.length / RECOMMEND_PAGE_SIZE);

  const handleRecommendPrev = () => {
    setRecommendPage((prev) => (prev - 1 + totalRecommendPages) % totalRecommendPages);
  };

  const handleRecommendNext = () => {
    setRecommendPage((prev) => (prev + 1) % totalRecommendPages);
  };

  const handleRecommendDot = (idx) => setRecommendPage(idx);

  const [favoriteStates, setFavoriteStates] = useState(
    new Array(relatedProducts.length).fill(false)
  );

  const handleToggleFavorite = (index) => {
    const updatedFavorites = [...favoriteStates];
    updatedFavorites[index] = !updatedFavorites[index];
    setFavoriteStates(updatedFavorites);
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
  
    if (!selectedSize || !selectedColor) {
      setCartMessage('Please select size and color');
      return;
    }
  
    if (!product.price || product.price <= 0) {
      setCartMessage('This product is currently not for sale');
      return;
    }

    if (!product.stock || product.stock <= 0) {
      setCartMessage('This product is currently out of stock');
      return;
    }
  
    setIsAddingToCart(true);
    setLoading(true);
    try {
      let currentCartId = cartId;
  
      if (!currentCartId) {
        try {
          const activeCart = await getActiveCart();
          if (activeCart && activeCart.id) {
            currentCartId = activeCart.id;
            updateCartId(currentCartId);
          }
        } catch (error) {
          console.warn('Could not find cart, creating a new one:', error);
          const newCart = await createCart();
          currentCartId = newCart.id;
          updateCartId(currentCartId);
        }
      }
  
      const cartItem = {
        cart: { id: currentCartId },
        product: { id: product.id },
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
      };
  
      await addToCart(cartItem);
      setCartMessage('Added to cart successfully!');
      await refreshCartItemCount();
    } catch (error) {
      if (error.message.includes('Session expired')) {
        navigate('/login');
        setCartMessage('Please log in again to continue!');
      } else {
        setCartMessage('Could not add to cart: ' + error.message);
      }
    } finally {
      setIsAddingToCart(false);
      setLoading(false);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div></div>;

  const filteredImages = product.imgurls || [];
  const formattedDescription = product.description.replaceAll("\\n", "\n");

  return (
    <>
      <SpinPage spinning={loading} />
      <Navbar />
      <CustomBreadcrumb
        items={[
          {
            href: "/products",
            title: 'Products',
          },
          {
            title: product.name,
          },
        ]}
      />
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
            {/* Product Images */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "70px",
              }}
            >
              <div style={{ display: "flex", gap: "12px" }}>
                {/* Thumbnail column */}
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
                {/* Main image */}
                <div>
                  <Image
                    src={filteredImages[selectedImageIndex]}
                    alt={product.name}
                    style={{
                      maxWidth: "400px",
                      maxHeight: "500px",
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "12px",
                    }}
                    placeholder={
                      <Image
                        preview={false}
                        src={`${filteredImages[selectedImageIndex]}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_500,w_400`}
                        width={400}
                        height={500}
                      />
                    }
                  />
                </div>
              </div>
            </div>
            {/* Description & Reviews */}
            <div
              style={{
                marginLeft: "auto",
                marginRight: "120px",
                marginTop: "40px",
                width: "400px",
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
          {/* Product Information */}
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
            {/* Colors */}
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
            {/* Sizes */}
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
            {/* Price */}
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
            {/* Quantity Counter */}
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
            {/* Add to Cart */}
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                style={{
                  padding: "12px 48px",
                  background: isAddingToCart ? "#ccc" : "black",
                  color: "white",
                  borderRadius: "999px",
                  marginTop: "20px",
                  fontWeight: "bold",
                  cursor: isAddingToCart ? "not-allowed" : "pointer",
                  fontSize: "18px",
                  width: "300px",
                }}
              >
                {isAddingToCart ? "Đang thêm..." : "ADD TO CART"}
              </button>
            </div>
            {cartMessage && <p style={{ color: 'red', marginTop: '10px' }}>{cartMessage}</p>}
          </div>
        </div>
        {/* Recommend Products (Interact) */}
        <div style={{ marginTop: "60px", textAlign: "center", padding: "0 40px" }}>
          <h2 style={{ marginBottom: "30px", fontWeight: "bold" }}>Recommended products</h2>
          <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
            {isLoadingRecommendations ? (
              <FullPageSpin />
            ) : (
              <>
                <Grid container spacing={2} justifyContent="center">
                  {relatedProducts
                    .slice(recommendPage * RECOMMEND_PAGE_SIZE, recommendPage * RECOMMEND_PAGE_SIZE + RECOMMEND_PAGE_SIZE)
                    .map((item, index) => (
                      <Grid item key={index} xs={12} sm={6} md={3}>
                        <div
                          style={{ height: "100%" }}
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          <ProductCard
                            product={{
                              ...item,
                              image: item.imgurls && item.imgurls.length > 0
                                ? item.imgurls[0]
                                : "/images/default-product.jpg",
                              sizes: item.size,
                              colors: item.color,
                              rating: item.rating || 4.8,
                              reviewCount: item.reviewCount || 15,
                            }}
                            isFavorite={favoriteStates[recommendPage * RECOMMEND_PAGE_SIZE + index] || false}
                            onToggleFavorite={handleToggleFavorite}
                            index={recommendPage * RECOMMEND_PAGE_SIZE + index}
                          />
                        </div>
                      </Grid>
                    ))}
                </Grid>
                {totalRecommendPages > 1 && (
                  <>
                    <IconButton
                      onClick={handleRecommendPrev}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        transform: "translateY(-50%)",
                        background: "#fff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                    >
                      <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleRecommendNext}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: 0,
                        transform: "translateY(-50%)",
                        background: "#fff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                    >
                      <NavigateNextIcon />
                    </IconButton>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 16,
                      gap: 8,
                    }}>
                      {Array.from({ length: totalRecommendPages }).map((_, idx) => (
                        <span
                          key={idx}
                          onClick={() => handleRecommendDot(idx)}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: recommendPage === idx ? "#001F3F" : "#ccc",
                            display: "inline-block",
                            cursor: "pointer",
                            transition: "background 0.3s",
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <FooterComponent />
      </div>
    </>
  );
};

export default ProductDetail;