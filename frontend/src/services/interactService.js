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