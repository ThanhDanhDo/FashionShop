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
import ProductCard from '../../../components/ProductCard';

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
    const [currentIndex, setCurrentIndex] = useState(0); // Sửa lỗi cú pháp, xóa "abortion"
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [likedItems, setLikedItems] = useState({});
    const [favoriteStates, setFavoriteStates] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await fetch("/api/recommendations");
                if (!res.ok) throw new Error("Failed to fetch recommendations");
                const data = await res.json();
                setRelatedProducts(data);
                setFavoriteStates(new Array(data.length).fill(false));
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRecommendations();
    }, []);

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
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <div>
            <Navbar isLoggedIn={false} />
            <div style={{ padding: "0 48px" }}>
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
                        aspectRatio: "1588.44 / 630",
                        maxHeight: "80vh",
                        minHeight: "400px",
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

                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <Typography variant="h5" gutterBottom>
                        HOT SALES
                    </Typography>
                    <Grid container spacing={1} justifyContent="center">
                        {relatedProducts.map((product, index) => (
                            <Grid item key={index} xs={12} sm={4} md={3}>
                                <ProductCard
                                    product={product}
                                    isFavorite={favoriteStates[index] || false}
                                    onToggleFavorite={handleToggleFavorite}
                                    index={index}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </div>

                <Divider sx={{ my: 4 }} />

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