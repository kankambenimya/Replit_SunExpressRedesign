export const AIRPORTS = [
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { code: "AYT", name: "Antalya Airport", city: "Antalya", country: "Turkey" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
  { code: "MUC", name: "Munich Airport", city: "Munich", country: "Germany" },
  { code: "BJV", name: "Bodrum Airport", city: "Bodrum", country: "Turkey" },
  { code: "ADB", name: "Izmir Airport", city: "Izmir", country: "Turkey" },
  { code: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
];

export const COUNTRIES = [
  "Germany", "Turkey", "United Kingdom", "France", "Spain", "Italy", "Netherlands", 
  "Belgium", "Austria", "Switzerland", "Greece", "Portugal", "Poland", "Czech Republic"
];

export const PASSENGER_TITLES = ["Mr", "Mrs", "Ms", "Dr"] as const;

export const SEAT_CLASSES = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
] as const;

export const TRIP_TYPES = [
  { value: "roundtrip", label: "Round trip" },
  { value: "oneway", label: "One way" },
  { value: "multicity", label: "Multi-city" },
] as const;
