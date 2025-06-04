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
import { getRecommendations } from '../../../services/recommendService';
import { useNavigate } from "react-router-dom";
import FullPageSpin from '../../../components/ListSpin'; // Import ListSpin.jsx
import SpinPage from '../../../components/SpinPage'; // Import SpinPage.jsx

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
        price: 100000,
        rating: 4.5,
        reviewCount: 15,
        image: '/images/image1.png',
    },
    {
        name: 'Sản phẩm 2',
        price: 150000,
        rating: 4.0,
        reviewCount: 15,
        image: '/images/image2.png',
    },
    {
        name: 'Sản phẩm 3',
        price: 200000,
        rating: 4.8,
        reviewCount: 15,
        image: '/images/image3.png',
    },
    {
        name: 'Sản phẩm 4',
        price: 120000,
        rating: 4.2,
        reviewCount: 15,
        image: '/images/image4.png',
    },
];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [likedItems, setLikedItems] = useState({});
    const [favoriteStates, setFavoriteStates] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [recommendPage, setRecommendPage] = useState(0);
    const [bestSellingPage, setBestSellingPage] = useState(0);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true); // Add loading state for recommendations
    const [isPageLoading, setIsPageLoading] = useState(true); // Add loading state for entire page
    const RECOMMEND_PAGE_SIZE = 4;
    const BEST_SELLING_PAGE_SIZE = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setIsPageLoading(true); // Start full-page loading
                setIsLoadingRecommendations(true); // Start recommendations loading
                const data = await getRecommendations();
                setRelatedProducts(data);
                setFavoriteStates(new Array(data.length).fill(false));
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoadingRecommendations(false); // End recommendations loading
                setIsPageLoading(false); // End full-page loading
            }
        };
        fetchRecommendations();
    }, []);

    const totalRecommendPages = Math.ceil(relatedProducts.length / RECOMMEND_PAGE_SIZE);
    const totalBestSellingPages = Math.ceil(bestSellingProducts.length / BEST_SELLING_PAGE_SIZE);

    const handleRecommendPrev = () => {
        setRecommendPage((prev) => (prev - 1 + totalRecommendPages) % totalRecommendPages);
    };

    const handleRecommendNext = () => {
        setRecommendPage((prev) => (prev + 1) % totalRecommendPages);
    };

    const handleRecommendDot = (idx) => setRecommendPage(idx);

    const handleBestSellingPrev = () => {
        setBestSellingPage((prev) => (prev - 1 + totalBestSellingPages) % totalBestSellingPages);
    };

    const handleBestSellingNext = () => {
        setBestSellingPage((prev) => (prev + 1) % totalBestSellingPages);
    };

    const handleBestSellingDot = (idx) => setBestSellingPage(idx);

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
        <>
            <SpinPage spinning={isPageLoading} />
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
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '24px' }}>
                            Recommend Products
                        </Typography>
                        <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
                            {isLoadingRecommendations ? (
                                <FullPageSpin />
                            ) : (
                                <>
                                    <Grid container spacing={2} justifyContent="center">
                                        {relatedProducts
                                            .slice(recommendPage * RECOMMEND_PAGE_SIZE, recommendPage * RECOMMEND_PAGE_SIZE + RECOMMEND_PAGE_SIZE)
                                            .map((product, index) => (
                                                <Grid item key={index} xs={12} sm={6} md={3}>
                                                    <div
                                                        style={{ height: "100%" }}
                                                        onClick={() => navigate(`/product/${product.id}`)}
                                                    >
                                                        <ProductCard
                                                            product={{
                                                                ...product,
                                                                image: product.imgurls && product.imgurls.length > 0
                                                                    ? product.imgurls[0]
                                                                    : "/images/default-product.jpg",
                                                                sizes: product.size,
                                                                colors: product.color,
                                                                rating: product.rating || 4.8,
                                                                reviewCount: product.reviewCount || 15,
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

                    <Divider sx={{ my: 4 }} />

                    <div style={{ textAlign: "center", margin: "40px 0" }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '24px' }}>
                            Best Selling Products
                        </Typography>
                        <div style={{ position: "relative", width: "100%", margin: "0 auto" }}>
                            <Grid container spacing={2} justifyContent="center">
                                {bestSellingProducts
                                    .slice(bestSellingPage * BEST_SELLING_PAGE_SIZE, bestSellingPage * BEST_SELLING_PAGE_SIZE + BEST_SELLING_PAGE_SIZE)
                                    .map((product, index) => (
                                        <Grid item key={index} xs={12} sm={6} md={3}>
                                            <ProductCard
                                                product={{
                                                    ...product,
                                                    sizes: "N/A",
                                                    colors: [],
                                                }}
                                                isFavorite={likedItems[bestSellingPage * BEST_SELLING_PAGE_SIZE + index] || false}
                                                onToggleFavorite={() => toggleLike(bestSellingPage * BEST_SELLING_PAGE_SIZE + index)}
                                                index={bestSellingPage * BEST_SELLING_PAGE_SIZE + index}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                            {totalBestSellingPages > 1 && (
                                <>
                                    <IconButton
                                        onClick={handleBestSellingPrev}
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
                                        onClick={handleBestSellingNext}
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
                                        {Array.from({ length: totalBestSellingPages }).map((_, idx) => (
                                            <span
                                                key={idx}
                                                onClick={() => handleBestSellingDot(idx)}
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    background: bestSellingPage === idx ? "#001F3F" : "#ccc",
                                                    display: "inline-block",
                                                    cursor: "pointer",
                                                    transition: "background 0.3s",
                                                }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <FooterComponent />
            </div>
        </>
    );
};

export default Home;