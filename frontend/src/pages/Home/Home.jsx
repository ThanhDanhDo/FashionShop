import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, InputBase, Typography, Button, Grid, Divider, Container, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Navbar from '../../components/Navbar/Navbar'; // Import Navbar

const images = [
    "/images/Group1504.png",
    "/images/Group1503.png",
];

const hotSalesImages = [
    '/images/Rectangle24.png',
    '/images/Rectangle24.png',
    '/images/Rectangle24.png',
];

const bestSellingProducts = [
  {
      name: 'Sản phẩm 1',
      price: '100.000 VNĐ',
      rating: '4.5 sao',
      image: '/images/image1.png',
  },
  {
      name: 'Sản phẩm 2',
      price: '150.000 VNĐ',
      rating: '4.0 sao',
      image: '/images/image2.png',
  },
  {
      name: 'Sản phẩm 3',
      price: '200.000 VNĐ',
      rating: '4.8 sao',
      image: '/images/image3.png',
  },
  {
      name: 'Sản phẩm 4',
      price: '120.000 VNĐ',
      rating: '4.2 sao',
      image: '/images/image4.png',
  },
  
];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [likedItems, setLikedItems] = useState({});
    const toggleLike = (index) => {
      setLikedItems((prev) => ({ ...prev, [index]: !prev[index] }));
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {/* Sử dụng Navbar */}
            <Navbar isLoggedIn={false} />

            {/* Banner */}
            <div style={{ position: "relative", textAlign: "center", marginTop: "1px" }}>
                <img
                    src={images[currentIndex]}
                    alt="Banner"
                    style={{ width: "100%", maxHeight: "500px", borderRadius: "10px", objectFit: "cover" }}
                />
                <button
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#000000",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
                        transition: "0.3s"
                    }}
                    onMouseOver={(e) => e.target.style.textShadow = "2px 2px 15px rgba(0, 0, 0, 0.8)"}
                    onMouseOut={(e) => e.target.style.textShadow = "2px 2px 10px rgba(0, 0, 0, 0.5)"}
                >
                    BUY NOW <ArrowForwardIcon style={{ verticalAlign: "middle" }} />
                </button>
            </div>

            <Divider sx={{ my: 4 }} />

            {/* HOT SALES */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <Typography variant="h5" gutterBottom>
                    HOT SALES
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {hotSalesImages.map((image, index) => (
                        <Grid item key={index} xs={12} sm={4}>
                            <img
                                src={image}
                                alt={`Hot Sales ${index + 1}`}
                                style={{ width: '100%', borderRadius: '10px' }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>

            <Divider sx={{ my: 4 }} />

            {/* Sản phẩm bán chạy */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <Typography variant="h6" gutterBottom>Sản phẩm bán chạy</Typography>
        <Grid container spacing={2} justifyContent="center">
          {bestSellingProducts.map((product, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <div 
                style={{ position: "relative", padding: "10px", backgroundColor: "#f8f8f8", borderRadius: "10px" }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img src={product.image} alt={product.name} style={{ width: "100%" }} />
        {hoveredIndex === index && (
        <div
        style={{
            position: "absolute",
            bottom: "20%",
            left: "10px", 
            right: "10px", 
            height: "40px", 
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px",
            color: "white",
            transition: "0.3s",
            borderRadius: "5px", 
        }}
    >
        <Button
            variant="contained"
            style={{
                backgroundColor: "#001F3F",
                color: "white",
                transition: "0.3s",
                padding: "5px 10px", // Giảm padding của nút
                fontSize: "12px", // Giảm kích thước font của nút
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#003366")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#001F3F")}
        >
            ADD TO CART
        </Button>
        <IconButton onClick={() => toggleLike(index)} style={{ padding: "5px" }}>
            {likedItems[index] ? (
                <FavoriteIcon style={{ color: "#FF1493", fontSize: "18px" }} />
            ) : (
                <FavoriteBorderIcon style={{ color: "white", fontSize: "18px" }} />
            )}
        </IconButton>
        </div>
        )}
        <Button
                variant="contained"
                color="primary"
                style={{ position: 'absolute', bottom: '10px', right: '10px' }}
              >
                BUY NOW
              </Button>
                <div style={{ textAlign: "left", padding: "10px" }}>
                  <Typography variant="body1">{product.name}</Typography>
                  <Typography variant="body2">{product.price}</Typography>
                  <Typography variant="body2">{product.rating}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
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
export default Home;