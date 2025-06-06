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

export const searchProducts = async (name, page = 0, size = 5) => {
  const response = await fetch(`${API_BASE_URL}/search?Name=${name}&page=${page}&size=${size}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Cannot find product!");
  const data = await response.json();
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

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/id/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Unable to get product information with ID ${id}!`);
    }
    const data = await response.json();
    console.log("getProductById response:", data);
    // Đảm bảo size và color là mảng, nếu không có thì trả về mảng rỗng
    return {
      ...data,
      size: Array.isArray(data.size) ? data.size : [],
      color: Array.isArray(data.color) ? data.color : [],
    };
  } catch (error) {
    console.error("Error retrieving product information:", error);
    throw error;
  }
};

export const adminFilterProducts = async (params) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`/api/products/admin-filter?${query}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return await response.json();
};

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Upload failed");
  const imageUrl = await response.text(); // trả về dạng "/api/upload/image/filename"
  return imageUrl;
};

export const deleteProductImage = async (imgUrl) => {
  // imgUrl dạng "/api/upload/image/filename"
  const filename = imgUrl.split('/').pop();
  const response = await fetch(`/api/upload/image/${filename}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Delete failed");
  return await response.text();
};

export const addProduct = async (product) => {
  const response = await fetch('/api/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
    credentials: 'include', // Để gửi cookie JWT nếu cần xác thực ADMIN
  });
  if (!response.ok) throw new Error('Add product failed');
  return await response.json();
};

export const updateProduct = async (product) => {
  const response = await fetch('/api/products/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Update product failed');
  return await response.json();
};