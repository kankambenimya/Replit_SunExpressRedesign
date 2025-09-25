import type { Flight, Airport, Destination, Booking } from "@shared/schema";

export interface FlightWithAirports extends Flight {
  departureAirportInfo?: Airport;
  arrivalAirportInfo?: Airport;
}

export interface BookingWithFlight extends Booking {
  flight?: FlightWithAirports;
}

export interface FlightSearchFormData {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  seatClass: "economy" | "business";
  tripType: "roundtrip" | "oneway" | "multicity";
}

export interface PassengerFormData {
  title: "Mr" | "Mrs" | "Ms" | "Dr";
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  type: "adult" | "child" | "infant";
}
