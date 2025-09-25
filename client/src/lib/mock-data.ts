// This file contains constants and data that don't require API calls
// All actual data should come from the API endpoints

export const SAMPLE_DESTINATIONS = [
  {
    id: "antalya",
    name: "Antalya",
    city: "Antalya",
    country: "Turkey",
    description: "Mediterranean paradise with ancient history",
    startingPrice: "89",
    flightTime: "3h 30m",
  },
  {
    id: "istanbul",
    name: "Istanbul",
    city: "Istanbul", 
    country: "Turkey",
    description: "Where Europe meets Asia",
    startingPrice: "125",
    flightTime: "3h 45m",
  },
  {
    id: "bodrum",
    name: "Bodrum",
    city: "Bodrum",
    country: "Turkey", 
    description: "Aegean gem with vibrant nightlife",
    startingPrice: "149",
    flightTime: "3h 15m",
  },
  {
    id: "izmir",
    name: "Izmir",
    city: "Izmir",
    country: "Turkey",
    description: "Pearl of the Aegean coast", 
    startingPrice: "135",
    flightTime: "3h 25m",
  },
];

export const SAMPLE_OFFERS = [
  {
    id: "frankfurt",
    price: "89",
    from: "Frankfurt",
    destination: "Turkey",
  },
  {
    id: "london", 
    price: "125",
    from: "London",
    destination: "Turkey",
  },
  {
    id: "paris",
    price: "159", 
    from: "Paris",
    destination: "Turkey",
  },
];

export const AIRLINE_FEATURES = [
  {
    id: "safety",
    title: "Safety First",
    description: "Award-winning safety record with the latest aircraft technology and rigorous maintenance standards.",
    icon: "shield",
  },
  {
    id: "punctuality",
    title: "On-Time Performance", 
    description: "Reliable schedules with industry-leading punctuality rates to get you to your destination on time.",
    icon: "clock",
  },
  {
    id: "service",
    title: "Exceptional Service",
    description: "Warm Turkish hospitality combined with European service standards for an unforgettable journey.",
    icon: "heart",
  },
];

export const ADDITIONAL_SERVICES = [
  {
    id: "baggage",
    title: "Baggage",
    description: "Generous baggage allowances",
    icon: "luggage",
  },
  {
    id: "seats",
    title: "Seat Selection", 
    description: "Choose your perfect seat",
    icon: "armchair",
  },
  {
    id: "meals",
    title: "Meals",
    description: "Delicious onboard dining", 
    icon: "utensils",
  },
  {
    id: "wifi",
    title: "Wi-Fi",
    description: "Stay connected in the sky",
    icon: "wifi", 
  },
];
