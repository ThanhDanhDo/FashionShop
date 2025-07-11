import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Container, Grid, IconButton, Collapse } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "../../../components/Navbar/Navbar";
import "./Products.css";
import { filterProducts } from "../../../services/productService";
import { getCategoryById } from "../../../services/categoryService";
import CustomBreadcrumb from '../../../components/Breadcrumb';
import FooterComponent from '../../../components/Footer/Footer';
import FullPageSpin from '../../../components/ListSpin';
import { getWishlist, toggleWishlistItem } from '../../../services/wishlistService'
import { AuthContext } from '../../../context/AuthContext';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gender: "all",
    selectedTitles: [],
    selectedItems: {},
  });
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    style: true,
    productLine: true,
    price: true,
    collection: true,
    material: true,
    color: true,
  });
  const { isLoggedIn } = useContext(AuthContext);

  const [favorites, setFavorites] = useState({});
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await getWishlist();
      // setWishListItems(res.products);

      // Map product ids in wishlist to true
      const favMap = {};
      res.products.forEach((p) => {
        favMap[p.id] = true;
      });
      setFavorites(favMap);

    } catch (error) {
      console.error("Lỗi khi lấy wishlist:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleFavorite = async (productId) => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      await toggleWishlistItem(productId);

      setFavorites((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));

    } catch (error) {
      console.error("Lỗi khi update wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const [categoryMap, setCategoryMap] = useState({});
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Lấy danh mục chính từ API
  const fetchMainCategories = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch("/api/categories/main", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Không thể lấy danh sách danh mục chính!");
        const categories = await response.json();
        console.log("Danh mục chính đã lấy:", categories);
        return categories.map((cat) => ({
          ...cat,
          name: /dress/i.test(cat.name.trim().toLowerCase()) ? "Dresses" :
            /bottom/i.test(cat.name.trim().toLowerCase()) ? "Bottoms" :
              cat.name.trim(),
        }));
      } catch (error) {
        console.error(`Lỗi khi lấy danh mục chính (thử ${i + 1}/${retries}):`, error);
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        setError("Không thể tải danh sách danh mục!");
        return [];
      }
    }
  };

  // Tải danh mục chính khi khởi động
  useEffect(() => {
    const loadCategories = async () => {
      const categories = await fetchMainCategories();
      const map = {};
      categories.forEach((cat) => {
        map[cat.name] = cat.id;
      });
      console.log("Bản đồ danh mục đã tạo:", map);
      setCategoryMap(map);
      setCategoriesLoaded(true);
    };
    loadCategories();
  }, []);

  // Khởi tạo bộ lọc từ tham số truy vấn URL
  useEffect(() => {
    const genderFromUrl = searchParams.get("gender") || "all";
    const mainCategoryId = searchParams.get("mainCategoryId");
    const subCategoryId = searchParams.get("subCategoryId");

    const initializeFilters = async () => {
      const newFilters = {
        gender: genderFromUrl,
        selectedTitles: mainCategoryId ? [parseInt(mainCategoryId)] : [],
        selectedItems: {},
      };

      if (subCategoryId && categoriesLoaded) {
        try {
          const subCategory = await getCategoryById(subCategoryId);
          if (subCategory && subCategory.name) {
            newFilters.selectedItems.productLine = {
              [subCategory.name]: true,
            };
            console.log(`Đã lấy danh mục phụ: ${subCategory.name} cho ID: ${subCategoryId}`);
          } else {
            console.warn(`Không tìm thấy danh mục phụ cho ID: ${subCategoryId}`);
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh mục phụ để khởi tạo:", error);
        }
      }

      console.log("Khởi tạo bộ lọc từ URL:", newFilters);
      setFilters(newFilters);
    };

    if (categoriesLoaded) {
      initializeFilters();
    }
  }, [searchParams, categoriesLoaded]);

  // Tiêu đề sản phẩm sử dụng ID, lọc "Dresses" cho Men và Unisex
  const productTitles = {
    all: Object.keys(categoryMap).map((name) => ({ name, id: categoryMap[name] })),
    Men: Object.keys(categoryMap)
      .filter((name) => name !== "Dresses")
      .map((name) => ({ name, id: categoryMap[name] })),
    Women: Object.keys(categoryMap).map((name) => ({ name, id: categoryMap[name] })),
    Unisex: Object.keys(categoryMap)
      .filter((name) => name !== "Dresses")
      .map((name) => ({ name, id: categoryMap[name] })),
  };

  const currentTitles = productTitles[filters.gender] || productTitles.all;

  // Filter sections
  const getFilterSections = () => {
    const baseSections = [
      {
        id: "price",
        title: "PRICE",
        items: ["Under 500.000đ", "500.000đ - 1.000.000đ", "Above 1.000.000đ"],
      },
      {
        id: "size",
        title: "SIZE",
        items: ["XS", "S", "M", "L", "XL"],
      },
      {
        id: "color",
        title: "COLOR",
        items: [
          "Black",
          "White",
          "Brown",
          "Natural",
          "Green",
          "Navy",
          "Grey",
          "Olive",
          "Blue",
          "Orange",
        ],
      },
    ];

    if (filters.selectedTitles.length > 0) {
      const selectedCategory = currentTitles.find((title) => title.id === filters.selectedTitles[0])?.name;
      console.log("Selected category for productLine:", selectedCategory);
      console.log("Product line items:", productLineItems[selectedCategory]);
      if (!selectedCategory || !productLineItems[selectedCategory]) {
        console.warn("Không tìm thấy danh mục hoặc productLineItems cho:", selectedCategory);
        return baseSections;
      }
      const productLineSection = {
        id: "productLine",
        title: "PRODUCT LINE",
        items: productLineItems[selectedCategory] || [],
      };
      return [productLineSection, ...baseSections];
    }

    return baseSections;
  };

  // Product line items for each category
  const productLineItems = {
    Outerwear: ["Jackets & Blazers", "Coats"],
    "T-shirt": ["Short-sleeve T-shirt", "Long-sleeve T-shirt"],
    Shirt: ["Short-sleeve Shirt", "Long-sleeve Shirt"],
    Dresses: ["Skirts", "Dresses"],
    Bottoms: ["Long", "Short"],
    Accessories: ["Bags", "Belts"],
  };

  // Apply all filters
  const applyFilters = useCallback(
    async (currentFilters) => {
      if (!categoriesLoaded) {
        console.log("Skipping applyFilters: categories not loaded");
        return;
      }
      console.log("Starting applyFilters with filters:", currentFilters);
      setLoading(true);
      setError(null);
      try {
        const selectedSizes = Object.entries(currentFilters.selectedItems.size || {})
          .filter(([_, isSelected]) => isSelected)
          .map(([size]) => size);
        const selectedColors = Object.entries(currentFilters.selectedItems.color || {})
          .filter(([_, isSelected]) => isSelected)
          .map(([color]) => color);
        const selectedPriceRanges = Object.entries(currentFilters.selectedItems.price || {})
          .filter(([_, isSelected]) => isSelected)
          .map(([range]) => range);
        const selectedProductLine = Object.entries(currentFilters.selectedItems.productLine || {})
          .filter(([_, isSelected]) => isSelected)
          .map(([line]) => line);

        let subCategoryId = null;
        if (selectedProductLine.length > 0) {
          const normalizedProductLine = selectedProductLine[0].trim();
          try {
            const response = await fetch(`/api/categories/name/${encodeURIComponent(normalizedProductLine)}`);
            if (response.ok) {
              const subCategories = await response.json();
              if (subCategories.length === 0) {
                console.warn(`Không tìm thấy danh mục phụ cho tên: ${normalizedProductLine}`);
                setError(`Danh mục phụ "${normalizedProductLine}" không tồn tại!`);
                setLoading(false);
                return;
              }
              subCategoryId = subCategories[0]?.id || null;
              console.log(`Đã lấy subCategoryId cho ${normalizedProductLine}:`, subCategoryId);
            } else {
              throw new Error(`Lỗi khi lấy danh mục phụ ${normalizedProductLine}: ${response.statusText}`);
            }
          } catch (error) {
            console.error("Lỗi khi lấy danh mục phụ:", error);
            setError(`Không thể lấy thông tin danh mục phụ "${normalizedProductLine}"!`);
            setLoading(false);
            return;
          }
        }

        const filterParams = {
          gender: currentFilters.gender === "all" ? null : currentFilters.gender,
          mainCategoryId: currentFilters.selectedTitles[0] || null,
          subCategoryId,
          sizes: selectedSizes.length > 0 ? selectedSizes : [],
          colors: selectedColors.length > 0 ? selectedColors : [],
          priceRanges: selectedPriceRanges.length > 0 ? selectedPriceRanges : [],
          page: 0,
          size: 80,
        };

        console.log("Applying filters with params:", filterParams);
        const data = await filterProducts(filterParams);

        console.log("Filtered products:", data);
        if (data.content.length === 0) {
          setError("Không tìm thấy sản phẩm nào phù hợp với bộ lọc!");
        }
        setProducts(data.content || []);
      } catch (error) {
        console.error("Lỗi khi lọc sản phẩm:", error);
        setError(error.message || "Không thể tải sản phẩm. Vui lòng thử lại!");
        setProducts([]);
      } finally {
        setLoading(false);
        console.log("Finished applyFilters");
      }
    },
    [categoriesLoaded]
  );

  // Load initial products when categories are loaded
  useEffect(() => {
    if (categoriesLoaded) {
      console.log("Filters changed, applying filters:", filters);
      applyFilters(filters);
    }
  }, [categoriesLoaded, filters, applyFilters]);

  const handleGenderChange = async (gender) => {
    const standardizedGender = gender === "all" ? "all" : gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
    console.log("Changing gender to:", standardizedGender);
    const newFilters = {
      ...filters,
      gender: standardizedGender,
      selectedTitles: [],
      selectedItems: {},
    };
    setFilters(newFilters);
    navigate(`/products?gender=${standardizedGender}`);
    await applyFilters(newFilters);
  };

  // const toggleFavorite = (productId) => {
  //   setFavorites((prev) => ({
  //     ...prev,
  //     [productId]: !prev[productId],
  //   }));
  // };


  const handleSectionExpand = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleTitleSelect = async (titleId) => {
    const isSelecting = !filters.selectedTitles.includes(titleId);
    console.log("Selecting title:", titleId, "isSelecting:", isSelecting);
    const newFilters = {
      ...filters,
      selectedTitles: isSelecting ? [titleId] : [],
      selectedItems: { ...filters.selectedItems, productLine: {} },
    };
    setFilters(newFilters);
    console.log("Updated filters for title select:", newFilters);

    const queryParams = new URLSearchParams();
    if (filters.gender && filters.gender !== "all") queryParams.append("gender", filters.gender);
    if (isSelecting) queryParams.append("mainCategoryId", titleId);
    navigate(`/products?${queryParams.toString()}`);
    await applyFilters(newFilters);
  };

  const handleItemSelect = async (sectionId, item) => {
    console.log(`Handling item select: ${sectionId} - ${item}`);
    const currentSectionItems = filters.selectedItems[sectionId] || {};
    let newSectionItems;
    if (currentSectionItems[item]) {
      console.log(`Deselecting ${sectionId}:`, item);
      newSectionItems = { ...currentSectionItems, [item]: false };
    } else {
      console.log(`Selecting ${sectionId}:`, item);
      newSectionItems = {};
      Object.keys(currentSectionItems).forEach((key) => {
        newSectionItems[key] = false;
      });
      newSectionItems[item] = true;
    }

    const newFilters = {
      ...filters,
      selectedItems: {
        ...filters.selectedItems,
        [sectionId]: newSectionItems,
      },
    };
    setFilters(newFilters);
    console.log("Updated filters for item select:", newFilters);

    const queryParams = new URLSearchParams();
    if (filters.gender && filters.gender !== "all") queryParams.append("gender", filters.gender);
    if (filters.selectedTitles[0]) queryParams.append("mainCategoryId", filters.selectedTitles[0]);
    if (sectionId === "productLine" && newSectionItems[item]) {
      try {
        const response = await fetch(`/api/categories/name/${encodeURIComponent(item)}`);
        if (response.ok) {
          const subCategories = await response.json();
          const subCategoryId = subCategories[0]?.id || null;
          if (subCategoryId) {
            queryParams.append("subCategoryId", subCategoryId);
          } else {
            console.warn(`Không tìm thấy subCategoryId cho ${item}`);
          }
        } else {
          console.error(`Lỗi khi lấy danh mục phụ ${item}:`, response.statusText);
        }
      } catch (error) {
        console.error("Lỗi khi lấy subCategoryId:", error);
      }
    }
    navigate(`/products?${queryParams.toString()}`);
    await applyFilters(newFilters);
  };

  return (
    <div>
      <Navbar isLoggedIn={false} />
      <CustomBreadcrumb
        items={[
          {
            title: "Products",
          }
        ]}
      />
      <div className="main-content-container">
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Sidebar */}
            <Grid item xs={12} md={3}>
              <div className="sidebar">
                {/* Gender Filter */}
                <div className="gender-filter">
                  <div className="gender-options">
                    <span
                      className={`gender-option ${filters.gender === "all" ? "active" : ""}`}
                      onClick={() => handleGenderChange("all")}
                    >
                      ALL
                    </span>
                    <span
                      className={`gender-option ${filters.gender === "Women" ? "active" : ""}`}
                      onClick={() => handleGenderChange("Women")}
                    >
                      WOMEN
                    </span>
                    <span
                      className={`gender-option ${filters.gender === "Men" ? "active" : ""}`}
                      onClick={() => handleGenderChange("Men")}
                    >
                      MEN
                    </span>
                    <span
                      className={`gender-option ${filters.gender === "Unisex" ? "active" : ""}`}
                      onClick={() => handleGenderChange("Unisex")}
                    >
                      UNISEX
                    </span>
                  </div>
                </div>

                {/* Product Titles Section */}
                {categoriesLoaded ? (
                  <div className="category-section product-titles">
                    {currentTitles.length > 0 ? (
                      currentTitles.map((title) => (
                        <div
                          key={title.id}
                          className={`category-item ${filters.selectedTitles.includes(title.id) ? "selected" : ""}`}
                          onClick={() => handleTitleSelect(title.id)}
                        >
                          {title.name}
                          {filters.selectedTitles.includes(title.id) && <CloseIcon className="remove-icon" />}
                        </div>
                      ))
                    ) : (
                      <div>Không có danh mục nào để hiển thị.</div>
                    )}
                  </div>
                ) : (
                  <div>Loading categories...</div>
                )}

                {/* Filter Sections */}
                {categoriesLoaded &&
                  getFilterSections().map((section) => (
                    <div key={section.id} className="category-section">
                      <div
                        className="category-header"
                        onClick={() => handleSectionExpand(section.id)}
                      >
                        <span className="category-title">{section.title}</span>
                        {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
                      </div>
                      <Collapse in={expandedSections[section.id]}>
                        <div className="category-list">
                          {section.items.map((item) => (
                            <div
                              key={item}
                              className={`category-item ${filters.selectedItems[section.id]?.[item] ? "selected" : ""}`}
                              onClick={() => handleItemSelect(section.id, item)}
                            >
                              <span>{item}</span>
                              <CloseIcon
                                className="remove-icon"
                                style={{
                                  opacity: filters.selectedItems[section.id]?.[item] ? 1 : 0,
                                  visibility: filters.selectedItems[section.id]?.[item] ? "visible" : "hidden",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </Collapse>
                    </div>
                  ))}
              </div>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              {/* Product Grid */}
              <div className="product-grid">
                {loading ? (
                  <div
                    style={{
                      width: "100%",
                      minHeight: 300,
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "150%",
                        top: 40,
                        transform: "translateX(-50%)",
                        zIndex: 10,
                      }}
                    >
                      <FullPageSpin />
                    </div>
                  </div>
                ) : error ? (
                  <div style={{ color: "red", textAlign: "center" }}>{error}</div>
                ) : products.length > 0 ? (
                  products.map((product) => (
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
                          type="button"
                          className="favorite-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
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
                          {favorites[product.id] ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
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
                  ))
                ) : (
                  <div>There are no products.</div>
                )}
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
      <FooterComponent />
    </div>
  );
};

export default Products;