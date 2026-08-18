import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Loader2, Search } from "lucide-react";

import { InputField } from "@/components/atoms/InputField";
import {
  reverseGeocode,
  searchLocation,
} from "@/services/geocoding.service";
import { mapSriLankaLocation } from "@/utils/locationMapper";

L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

type Props = {
  onLocationSelect: (location: {
    latitude: string;
    longitude: string;
    address: string;
    province: string;
    district: string;
  }) => void;
  initialLocation?: {
    latitude: number | null;
    longitude: number | null;
    address: string;
  };
};

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    state?: string;
    county?: string;
    state_district?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?: string;
  };
}

function MapClick({
  onLocationSelect,
  setPosition,
  setSearchQuery,
}: {
  onLocationSelect: Props["onLocationSelect"];
  setPosition: (pos: [number, number]) => void;
  setSearchQuery: (q: string) => void;
}) {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      try {
        const data = await reverseGeocode(lat, lng);

        if (!data) return;

        const { province, district } = mapSriLankaLocation(
          data.address ?? {}
        );

        setSearchQuery(data.display_name ?? "");

        onLocationSelect({
          latitude: lat.toString(),
          longitude: lng.toString(),
          address: data.display_name ?? "",
          province,
          district,
        });
      } catch (err) {
        console.error(err);
      }
    },
  });

  return null;
}

function MapFlyTo({
  position,
}: {
  position: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return null;
}

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
}: Props) {
  const [position, setPosition] =
    useState<[number, number] | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    NominatimSearchResult[]
  >([]);

  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const initializedLocation = useRef<string | null>(null);

  useEffect(() => {
    if (initialLocation?.latitude === null || initialLocation?.latitude === undefined
      || initialLocation.longitude === null || initialLocation.longitude === undefined) {
      return;
    }

    const locationKey = `${initialLocation.latitude},${initialLocation.longitude},${initialLocation.address}`;
    if (initializedLocation.current === locationKey) return;

    setPosition([initialLocation.latitude, initialLocation.longitude]);
    setSearchQuery(initialLocation.address);
    initializedLocation.current = locationKey;
  }, [initialLocation]);

  const handleSearch = async (query: string) => {
    const text = query.trim();

    if (text.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (searching) return;

    setSearching(true);

    try {
      const results = await searchLocation(text);

      setSearchResults(results);
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (
    result: NominatimSearchResult
  ) => {
    const lat = Number(result.lat);
    const lon = Number(result.lon);

    setPosition([lat, lon]);

    setSearchQuery(result.display_name);

    setShowDropdown(false);

    const { province, district } = mapSriLankaLocation(
      result.address ?? {}
    );

    onLocationSelect({
      latitude: lat.toString(),
      longitude: lon.toString(),
      address: result.display_name,
      province,
      district,
    });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />

            <InputField
              value={searchQuery}
              placeholder="Search location..."
              className="pl-10"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch(searchQuery);
                }
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => handleSearch(searchQuery)}
            disabled={searching}
            className="px-4 rounded-lg border flex items-center gap-2"
          >
            {searching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>

        {showDropdown && (
          <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg z-[9999] max-h-64 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">
                No locations found.
              </div>
            ) : (
              searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left p-3 hover:bg-blue-50 border-b last:border-0"
                >
                  {result.display_name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <MapContainer
        center={[6.9271, 79.8612]}
        zoom={8}
        style={{
          width: "100%",
          height: "500px",
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClick
          onLocationSelect={onLocationSelect}
          setPosition={setPosition}
          setSearchQuery={setSearchQuery}
        />

        <MapFlyTo position={position} />

        {position && <Marker position={position} />}
      </MapContainer>

      <p className="text-xs text-gray-500">
        Search a location or click on the map.
      </p>
    </div>
  );
}
