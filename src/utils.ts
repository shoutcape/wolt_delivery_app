import { toast } from "react-toastify";
import { Distance_ranges, UserLocation, VenueCoords } from "./types";
import axios from "axios";

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const metersPerDegreeLatitude = 111320;
  const avgLat = ((lat1 + lat2) / 2) * (Math.PI / 180);
  const metersPerDegreeLongitude = 111320 * Math.cos(avgLat);

  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  const deltaX = deltaLat * metersPerDegreeLatitude;
  const deltaY = deltaLon * metersPerDegreeLongitude;

  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  return distance;
};

export const calculateDeliveryDistance = (
  userLocation: UserLocation,
  venueCoords: VenueCoords,
) => {
  if (!userLocation || !venueCoords) {
    throw Error('No userLocation or venueCoords')
  }

  const distance = calculateDistance(
    userLocation.Latitude,
    userLocation.Longitude,
    venueCoords[1],
    venueCoords[0],
  );
  return distance
};


export const calculateSmallOrderSurcharge = (
  cartValue: number,
  order_minimum_no_surcharge: number,
) => {
  if (cartValue < order_minimum_no_surcharge) {
    const surcharge = order_minimum_no_surcharge - cartValue;
    return surcharge
  } else {
    return 0
  }
};

export const calculateDeliveryFee = (
  base_price: number,
  distance_ranges: Distance_ranges[],
  deliveryDistance: number,
) => {
  let deliveryRange: Distance_ranges | null = null;

  //find a suitable distance range
  distance_ranges.forEach((range: Distance_ranges) => {
    if (deliveryDistance >= range.min && deliveryDistance <= range.max) {
      deliveryRange = range;
    }
  });

  if (deliveryRange == null) {
    toast.warn('No delivery available near you');
    throw Error('No matching deliveryRange found');
  }

  const calculatedFee =
    base_price +
      (deliveryRange as Distance_ranges).a +
      ((deliveryRange as Distance_ranges).b * deliveryDistance) / 10;
  return calculatedFee
};

export const calculateTotalPrice = (
  cartValue: number,
  smallOrderSurcharge: number,
  deliveryFee: number,
) => {
  const total = cartValue + smallOrderSurcharge + deliveryFee;
  return total
};

export const fetchVenueData = async (
  venueSlug: string,
  type: 'static' | 'dynamic',
) => {
  const api = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/${type}`;
  const { data } = await axios.get(api);
  if (type === 'static') {
    return {
      venueCoords: data.venue_raw.location.coordinates
    }
  } else if (type === 'dynamic') {
    const { delivery_specs } = data.venue_raw;
    return {
      order_minimum_no_surcharge: delivery_specs.order_minimum_no_surcharge,
      base_price: delivery_specs.delivery_pricing.base_price,
      distance_ranges: delivery_specs.delivery_pricing.distance_ranges,
    }
  }
};
