 
// @ts-ignore: no type declarations for 'google-map-react'
import GoogleMapReact from "google-map-react";
import { MapPin } from "lucide-react";

type Props = {
  lat: number;
  lng: number;
  onMapClick?: (lat: number, lng: number) => void;
};

const Marker = (_props: { lat: number; lng: number }) => (
  <MapPin className="text-red-600" size={32} />
);

export default function GoogleMap({lat,lng,onMapClick,}: Props) {

  return (
    <div className="h-72 w-full rounded-xl overflow-hidden border">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        }}
        defaultCenter={{ lat, lng }}
        center={{ lat, lng }}
        defaultZoom={15}
        onClick={({ lat, lng }: { lat: number; lng: number }) => {
          onMapClick?.(lat, lng);
        }}
      >
        <Marker lat={lat} lng={lng} />
      </GoogleMapReact>
    </div>
  );
}