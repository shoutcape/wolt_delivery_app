import axios from "axios";

export const fetchDynamicValues = async (venueSlug: string) => {
  const venueAPIDynamic = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`;
  const { data } = await axios.get(venueAPIDynamic);
  return data
};

export const fetchVenueCoords = async (venueSlug: string) => {
  const venueAPIStatic = `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`;
  const { data } = await axios.get(venueAPIStatic);
  return data
}
