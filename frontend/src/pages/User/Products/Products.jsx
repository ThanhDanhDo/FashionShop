import React, { useState, useEffect, useCallback } from "react";
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
  const [favorites, setFavorites] = useState({});
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
        title: "DÒNG SẢN PHẨM",
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

  const toggleFavorite = (productId) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

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
            {/* Free Shipping Banner */}
            <div className="free-shipping-banner">
              <img
                src="/images/free-shipping-banner.svg"
                alt="Ảnh và lời quảng cáo"
                style={{
                  filter: "brightness(0) invert(1)",
                  opacity: 0.9,
                }}
              />
            </div>

            {/* Product Grid */}
            <div className="product-grid">
              {loading ? (
                <div>Loading products...</div>
              ) : error ? (
                <div style={{ color: "red", textAlign: "center" }}>{error}</div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="product-image-container">
                      <img
                        src={
                          product.imgurls && product.imgurls.length > 0
                            ? product.imgurls[0]
                            : "/images/default-product.jpg"
                        }
                        alt={product.name}
                        className="product-image"
                      />
                      <IconButton
                        className="favorite-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        {favorites[product.id] ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </div>
                    <div className="product-info">
                      {product.tag && (
                        <div className="product-tag">{product.tag}</div>
                      )}
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">{product.price.toLocaleString("vi-VN")}đ</div>
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có sản phẩm nào.</div>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Products;