import { useState } from "react";

export const useCurrentLocation = () => {
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getCurrentLocation = async () => {
    return new Promise<{
      latitude: string;
      longitude: string;
      location: string;
    }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by this browser.");
        return;
      }

      setLoadingLocation(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          let address = `${lat}, ${lng}`;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );

            const data = await response.json();

            address = data.display_name || address;
          } catch (error) {
            console.error(error);
          }

          setLoadingLocation(false);

          resolve({
            latitude: lat.toString(),
            longitude: lng.toString(),
            location: address,
          });
        },
        (error) => {
          setLoadingLocation(false);

          let message = "Unable to retrieve location.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Location permission denied.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              message = "Location request timed out.";
              break;
          }

          reject(message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  return {
    loadingLocation,
    getCurrentLocation,
  };
};