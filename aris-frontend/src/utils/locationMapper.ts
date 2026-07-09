export interface ReverseGeocodeAddress {
  state?: string;
  state_district?: string;
  county?: string;
  city_district?: string;
}

export function mapSriLankaLocation(address: ReverseGeocodeAddress) {
  return {
    province: address.state?.replace(/\s+Province$/i, "").trim() ?? "",
    district: (
      address.state_district ??
      address.county ??
      address.city_district ??
      ""
    )
      .replace(/\s+District$/i, "")
      .trim(),
  };
}