export async function searchLocation(query: string) {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&limit=5`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}