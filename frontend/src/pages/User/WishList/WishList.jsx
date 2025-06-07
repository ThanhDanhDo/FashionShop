import React, { useState, useEffect, useContext } from "react";
import Navbar from '../../../components/Navbar/Navbar';
import "./WishList.css";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getWishlist, toggleWishlistItem } from '../../../services/wishlistService'
import { useLoading } from '../../../context/LoadingContext';
import "../Products/Products.css";
import { Grid, IconButton } from "@mui/material";
import { AuthContext } from '../../../context/AuthContext';


const WishList = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [wishListItems, setWishListItems] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await getWishlist();
      console.log("wishlis: ", res.products);
      setWishListItems(res.products);
    } catch (error) {
      console.error("Lỗi khi lấy wishlist:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWishlist();
  }, [])

  const toggleFavorite = async (productId) => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await toggleWishlistItem(productId);
      console.log("update wishlist: ", res)
      await fetchWishlist();
    } catch (error) {
      console.error("Lỗi khi update wishlist:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="wishlist-container">
        <h1 className="wishlist-title">WISHLIST</h1>
        {wishListItems.length === 0 ? (
          <p className="wishlist-empty">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích.</p>
        ) : (
          <Grid item xs={12} md={9}>
            <div className="product-grid">
              {wishListItems.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{
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
                  <div style={{ position: "relative" }}>
                    <img
                      src={
                        product.imgurls && product.imgurls.length > 0
                          ? product.imgurls[0]
                          : "/images/default-product.jpg"
                      }
                      alt={product.name}
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
                    <IconButton
                      className="favorite-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
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
                      }}
                    >
                      <FavoriteIcon color="error" />
                    </IconButton>
                  </div>
                  <h3 style={{ fontSize: "18px", margin: "10px 0" }}>{product.name}</h3>
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
                      Size: {product.size ? product.size.join(", ") : "N/A"}
                    </p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {product.color?.map((color, cidx) => (
                        <div
                          key={cidx}
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: color.toLowerCase(),
                            border: "1px solid #ccc",
                          }}
                        />
                      )) || <p>No colors</p>}
                    </div>
                  </div>
                  <p style={{ marginBottom: "4px" }}>
                    {product.price.toLocaleString("vi-VN")} VND
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    ★ {product.rating || 4.8} ({product.reviewCount || 15})
                  </p>
                </div>
              ))}
            </div>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default WishList;
