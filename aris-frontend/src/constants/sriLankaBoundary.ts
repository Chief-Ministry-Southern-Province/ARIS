import type { LatLngBoundsExpression } from "leaflet";

export const SRI_LANKA_MAP_BOUNDS: LatLngBoundsExpression = [
  [5.8, 79.45],
  [10.0, 82.1],
];

type Position = [number, number];
type PolygonCoordinates = Position[][];
type MultiPolygonCoordinates = PolygonCoordinates[];

export type SriLankaBoundary = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "MultiPolygon";
      coordinates: MultiPolygonCoordinates;
    };
  }>;
};

function isPointInRing(latitude: number, longitude: number, ring: Position[]) {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [currentLongitude, currentLatitude] = ring[i];
    const [previousLongitude, previousLatitude] = ring[j];
    const intersects =
      currentLatitude > latitude !== previousLatitude > latitude &&
      longitude <
        ((previousLongitude - currentLongitude) * (latitude - currentLatitude)) /
          (previousLatitude - currentLatitude) +
          currentLongitude;

    if (intersects) inside = !inside;
  }

  return inside;
}

export function isPointInSriLanka(
  boundary: SriLankaBoundary | null,
  latitude: number,
  longitude: number
) {
  return boundary?.features.some((feature) =>
    feature.geometry.coordinates.some(([outerRing]) =>
      isPointInRing(latitude, longitude, outerRing)
    )
  ) ?? false;
}
