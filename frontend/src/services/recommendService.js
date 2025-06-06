export const getRecommendations = async () => {
  const response = await fetch("/api/recommendations", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch recommendations");
  return response.json();
};

export const searchRecommendations = async ({
  id,
  userId,
  page = 0,
  size = 10,
  sortBy = 'id',
  sortDir = 'asc',
}) => {
  const params = new URLSearchParams({ page, size, sortBy, sortDir });

  if (id !== undefined && id !== null) params.append('id', id);
  if (userId !== undefined && userId !== null) params.append('userId', userId);

  const url = `/api/recommendations/searchRecommendation?${params.toString()}`;

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

export const triggerTraining = async () => {
  const response = await fetch('/api/recommendations/start_training', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Không thể bắt đầu huấn luyện!');
  }

  const result = await response.text();
  return result;
};