const BASE_URL = "https://nominatim.openstreetmap.org";

const headers = {
  Accept: "application/json",
};

export async function searchLocation(query: string) {
  const search = query.trim();

  if (search.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search?` +
        new URLSearchParams({
          q: search,
          format: "json",
          addressdetails: "1",
          limit: "5",
          countrycodes: "lk",
        }),
      {
        headers,
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          "Too many requests. Please wait a few seconds and try again."
        );
      }

      throw new Error(`Search failed (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lng: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/reverse?` +
        new URLSearchParams({
          lat: lat.toString(),
          lon: lng.toString(),
          format: "json",
          addressdetails: "1",
          countrycodes: "lk",
        }),
      {
        headers,
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          "Too many requests. Please wait a few seconds."
        );
      }

      throw new Error(`Reverse geocoding failed (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}