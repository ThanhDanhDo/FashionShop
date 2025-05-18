import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, InputBase, Typography, Button, Grid, Divider, Container, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Navbar from '../../../components/Navbar/Navbar';
import FooterComponent from '../../../components/Footer/Footer';
import ProductCard from '../../../components/ProductCard'; // Import ProductCard

const images = [
    "/images/banner1.png",
    "/images/banner2.png",
    "/images/banner3.png",
    "/images/banner4.png",
    "/images/banner5.png",
    "/images/banner6.png",
    "/images/banner7.png",
    "/images/banner8.png",
];

// Dữ liệu relatedProducts từ ProductDetail.jsx
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
    const [favoriteStates, setFavoriteStates] = useState(
        new Array(relatedProducts.length).fill(false) // Trạng thái yêu thích cho Hot Sales
    );

    const toggleLike = (index) => {
        setLikedItems((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleToggleFavorite = (index) => {
        const updatedFavorites = [...favoriteStates];
        updatedFavorites[index] = !updatedFavorites[index];
        setFavoriteStates(updatedFavorites);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            goToNext();
        }, 10000); // Tự động chuyển sau 10 giây
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {/* Sử dụng Navbar */}
            <Navbar isLoggedIn={false} />

            {/* Container cho banner, HOT SALES, và sản phẩm bán chạy */}
            <div style={{ padding: "0 48px" }}>
                {/* Banner responsive với nút và chấm */}
                <div style={{ 
                    position: "relative", 
                    textAlign: "center", 
                    marginTop: "1px",
                    width: "100%",
                    overflow: "hidden"
                }}>
                    <div style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "1588.44 / 630", // Tỷ lệ của ảnh hiện tại (≈2.52:1)
                        maxHeight: "80vh", // Giới hạn chiều cao tối đa trên màn hình lớn
                        minHeight: "400px", // Đảm bảo chiều cao tối thiểu trên mobile
                    }}>
                        <img
                            src={images[currentIndex]}
                            alt={`Fashion Banner ${currentIndex + 1}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                                borderRadius: "10px",
                                transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
                                transform: "scale(1.05)",
                                opacity: 1,
                            }}
                            onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                            onMouseOut={(e) => e.target.style.transform = "scale(1.05)"}
                        />
                        {/* Nút Previous */}
                        <IconButton
                            onClick={goToPrev}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                color: "#ffffff",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                padding: "10px",
                                borderRadius: "50%",
                            }}
                        >
                            <NavigateBeforeIcon />
                        </IconButton>
                        {/* Nút Next */}
                        <IconButton
                            onClick={goToNext}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                color: "#ffffff",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                padding: "10px",
                                borderRadius: "50%",
                            }}
                        >
                            <NavigateNextIcon />
                        </IconButton>
                    </div>
                    {/* Chấm hiển thị số trang */}
                    <div style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "8px",
                    }}>
                        {images.map((_, index) => (
                            <span
                                key={index}
                                onClick={() => goToSlide(index)}
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: currentIndex === index ? "#ffffff" : "#ccc",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                    {/* CSS cho hiệu ứng fadeIn */}
                    <style>
                        {`
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        `}
                    </style>
                </div>

                <Divider sx={{ my: 4 }} />

                {/* HOT SALES */}
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <Typography variant="h5" gutterBottom>
                        HOT SALES
                    </Typography>
                    <Grid container spacing={1} justifyContent="center">
                        {relatedProducts.map((product, index) => (
                            <Grid item key={index} xs={12} sm={4} md={3}>
                                <ProductCard
                                    product={product}
                                    isFavorite={favoriteStates[index]}
                                    onToggleFavorite={handleToggleFavorite}
                                    index={index}
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
                                                    padding: "5px 10px",
                                                    fontSize: "12px",
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
            </div>

            <FooterComponent />
        </div>
    );
};

export default Home;