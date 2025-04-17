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

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const genderParam = searchParams.get("gender") || "all";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gender: genderParam,
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

  // Đồng bộ gender từ searchParams
  useEffect(() => {
    const genderFromUrl = searchParams.get("gender") || "all";
    setFilters((prev) => {
      if (prev.gender !== genderFromUrl) {
        console.log("Syncing gender from URL:", genderFromUrl);
        return { ...prev, gender: genderFromUrl };
      }
      return prev;
    });
  }, [searchParams]);

  // Fetch main categories from API
  const fetchMainCategories = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch("/api/categories/main", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Không thể lấy danh sách main categories!");
        const categories = await response.json();
        console.log("Fetched main categories:", categories);
        return categories.map((cat) => ({
          ...cat,
          name: /dress/i.test(cat.name.trim().toLowerCase()) ? "Dresses" : cat.name,
        }));
      } catch (error) {
        console.error(`Lỗi khi lấy main categories (thử ${i + 1}/${retries}):`, error);
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        setError("Không thể tải danh sách danh mục!");
        return [];
      }
    }
  };

  // Fetch subCategoryId from subCategory name
  const getSubCategoryId = async (subCategoryName) => {
    try {
      const response = await fetch(`/api/categories/name/${subCategoryName}`);
      if (!response.ok) throw new Error("Không thể lấy subCategory!");
      const subCategories = await response.json();
      const subCategoryId = subCategories[0]?.id || null;
      console.log(`Fetched subCategoryId for ${subCategoryName}:`, subCategoryId);
      return subCategoryId;
    } catch (error) {
      console.error("Lỗi khi lấy subCategoryId:", error);
      return null;
    }
  };

  // Load main categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const categories = await fetchMainCategories();
      const map = {};
      categories.forEach((cat) => {
        map[cat.name] = cat.id;
      });
      console.log("Category map created:", map);
      setCategoryMap(map);
      setCategoriesLoaded(true);
    };
    loadCategories();
  }, []);

  // Product titles using IDs
  const productTitles = {
    all: Object.keys(categoryMap).map((name) => ({ name, id: categoryMap[name] })),
    Men: Object.keys(categoryMap)
      .filter((name) => !/dress/i.test(name))
      .map((name) => ({ name, id: categoryMap[name] })),
    Women: Object.keys(categoryMap).map((name) => ({ name, id: categoryMap[name] })),
    Unisex: Object.keys(categoryMap)
      .filter((name) => !/dress/i.test(name))
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
    "T-shirt": ["Short-sleeve", "Long-sleeve"],
    Shirt: ["Short-sleeve", "Long-sleeve"],
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
          subCategoryId = await getSubCategoryId(selectedProductLine[0]);
        }

        const filterParams = {
          gender: currentFilters.gender === "all" ? null : currentFilters.gender,
          mainCategoryId: currentFilters.selectedTitles[0] || null,
          subCategoryId,
          sizes: selectedSizes.length > 0 ? selectedSizes : [],
          colors: selectedColors.length > 0 ? selectedColors : [],
          priceRanges: selectedPriceRanges.length > 0 ? selectedPriceRanges : [],
        };

        console.log("Applying filters with params:", filterParams);
        console.log("selectedProductLine:", selectedProductLine);
        console.log("subCategoryId:", subCategoryId);
        console.log("selectedPriceRanges:", selectedPriceRanges);

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
      console.log("Initial load: calling applyFilters with filters:", filters);
      applyFilters(filters);
    }
  }, [categoriesLoaded, filters]);

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
                    className={`gender-option ${filters.gender === "Men" ? "active" : ""}`}
                    onClick={() => handleGenderChange("Men")}
                  >
                    MEN
                  </span>
                  <span
                    className={`gender-option ${filters.gender === "Women" ? "active" : ""}`}
                    onClick={() => handleGenderChange("Women")}
                  >
                    WOMEN
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
                  {currentTitles.map((title) => (
                    <div
                      key={title.id}
                      className={`category-item ${filters.selectedTitles.includes(title.id) ? "selected" : ""}`}
                      onClick={() => handleTitleSelect(title.id)}
                    >
                      {title.name}
                      {filters.selectedTitles.includes(title.id) && <CloseIcon className="remove-icon" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div>Đang tải danh mục...</div>
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
                <div>Đang tải sản phẩm...</div>
              ) : error ? (
                <div style={{ color: "red", textAlign: "center" }}>{error}</div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="product-card">
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
                        onClick={() => toggleFavorite(product.id)}
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