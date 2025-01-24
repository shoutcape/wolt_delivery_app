
export interface UserLocation {
  Latitude: number;
  Longitude: number;
}

export interface VenueCoords {
  [index: number]: number;
}

export interface Distance_ranges {
  min: number;
  max: number;
  a: number;
  b: number;
  flag: number;
}

export interface FormData {
  userLocation: UserLocation | null;
  cartValue: number;
  venueSlug: string | null;
}

export interface ResultData {
  cartValue: number;
  deliveryFee: number;
  smallOrderSurcharge: number;
  deliveryDistance: number | null;
  totalPrice: number | null;
}
