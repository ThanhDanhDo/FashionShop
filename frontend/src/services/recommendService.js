export const getRecommendations = async () => {
  const response = await fetch("/api/recommendations", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch recommendations");
  return response.json();
};