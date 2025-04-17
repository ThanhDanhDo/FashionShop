const API_BASE_URL = "/api/products";

export const getAllProducts = async (page = 0, size = 100) => {
  const response = await fetch(
    `${API_BASE_URL}/all?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) throw new Error("Không thể lấy danh sách sản phẩm!");
  const data = await response.json();
  console.log("getAllProducts response:", data);
  return data;
};

// Lấy sản phẩm theo main_category
export const getProductsByMainCategory = async (
  categoryId,
  page = 0,
  size = 10
) => {
  const response = await fetch(
    `${API_BASE_URL}/type/${categoryId}?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok)
    throw new Error("Không thể lấy sản phẩm theo main_category!");
  const data = await response.json();
  console.log("getProductsByMainCategory response:", data);
  return data; // Trả về toàn bộ Map để frontend xử lý
};

// Lấy sản phẩm theo sub_category
export const getProductsBySubCategory = async (
  subCategoryId,
  page = 0,
  size = 10
) => {
  const response = await fetch(
    `${API_BASE_URL}/type/${subCategoryId}?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok)
    throw new Error("Không thể lấy sản phẩm theo sub_category!");
  const data = await response.json();
  console.log("getProductsBySubCategory response:", data);
  return data; // Trả về Map để lấy subCategories
};

export const searchProducts = async (name) => {
  const response = await fetch(`${API_BASE_URL}/search?Name=${name}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Không thể tìm kiếm sản phẩm!");
  const data = await response.json();
  console.log("searchProducts response:", data);
  return data;
};

export const getProductsByGender = async (gender, page = 0, size = 50) => {
  const response = await fetch(
    `/api/products/gender/${gender}?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) throw new Error("Không thể lấy sản phẩm theo gender!");
  const data = await response.json();
  console.log("getProductsByGender response:", data);
  return data; // Trả về mảng List<Product>
};

export const getProductsByGenderAndMainCategory = async (gender, categoryId, page = 0, size = 20) => {
  const url = `/api/products/gender/${gender}/category/${categoryId}?page=${page}&size=${size}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Không thể lấy sản phẩm theo gender và main_category!");
  const data = await response.json();
  console.log("getProductsByGenderAndMainCategory response:", data);
  return data;
};

export const filterProducts = async ({
  gender,
  mainCategoryId,
  subCategoryId,
  sizes,
  colors,
  priceRanges,
  page = 0,
  size = 80,
}) => {
  const queryParams = new URLSearchParams({
    page,
    size,
  });

  if (gender && gender !== "all") queryParams.append("gender", gender);
  if (mainCategoryId) queryParams.append("mainCategoryId", mainCategoryId);
  if (subCategoryId) queryParams.append("subCategoryId", subCategoryId);
  if (sizes && sizes.length > 0) sizes.forEach((size) => queryParams.append("sizes", size));
  if (colors && colors.length > 0) colors.forEach((color) => queryParams.append("colors", color));
  if (priceRanges && priceRanges.length > 0) priceRanges.forEach((range) => queryParams.append("priceRanges", range));

  const url = `${API_BASE_URL}/filter?${queryParams.toString()}`;
  console.log("Filter products URL:", url);
  console.log("Filter params:", { gender, mainCategoryId, subCategoryId, sizes, colors, priceRanges });

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Không thể lọc sản phẩm: ${errorText}`);
  }

  const data = await response.json();
  console.log("filterProducts response:", data);
  return data;
};