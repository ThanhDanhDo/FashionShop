export const getInteractRecommendations = async () => {
  const response = await fetch("http://localhost:3000/api/rec", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch recommendations");
  return response.json();
};

export const addInteract = async (productId) => {
  const response = await fetch("http://localhost:3000/api/rec/add_interact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId }),
  });
  if (!response.ok) throw new Error("Failed to add interact");
  return response.json();
};

export const searchInteract = async ({
  id,
  userId,
  productId,
  page = 0,
  size = 10,
  sortBy = 'id',
  sortDir = 'asc',
}) => {
  const params = new URLSearchParams({ page, size, sortBy, sortDir });

  if (id !== undefined && id !== null) params.append('id', id);
  if (userId !== undefined && userId !== null) params.append('userId', userId);
  if (productId !== undefined && productId !== null) params.append('productId', productId);

  const url = `/api/rec/searchInteract?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Không thể tìm đề xuất sản phẩm!');
  }

  return response.json();
};

export const getContentBaseRec = async (productId) => {
  try {
    const res = await fetch(`/api/rec/${productId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Không thể lấy ContentBase recommendation");
    return res.json();
  } catch (error) {
    console.log("Không thể lấy ContentBase recommendation: ", error)
  }
}

