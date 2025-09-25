import { type User, type InsertUser, type Airport, type InsertAirport, type Flight, type InsertFlight, type Booking, type InsertBooking, type Destination, type InsertDestination, type FlightSearch } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Airports
  getAllAirports(): Promise<Airport[]>;
  searchAirports(query: string): Promise<Airport[]>;
  getAirport(code: string): Promise<Airport | undefined>;
  createAirport(airport: InsertAirport): Promise<Airport>;

  // Flights
  searchFlights(searchParams: FlightSearch): Promise<Flight[]>;
  getFlight(id: string): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;

  // Bookings
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingByReference(reference: string): Promise<Booking | undefined>;
  getUserBookings(userId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;

  // Destinations
  getAllDestinations(): Promise<Destination[]>;
  getPopularDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private airports: Map<string, Airport>;
  private flights: Map<string, Flight>;
  private bookings: Map<string, Booking>;
  private destinations: Map<string, Destination>;

  constructor() {
    this.users = new Map();
    this.airports = new Map();
    this.flights = new Map();
    this.bookings = new Map();
    this.destinations = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample airports
    const sampleAirports: Airport[] = [
      { id: "1", code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", timezone: "Europe/Berlin" },
      { id: "2", code: "AYT", name: "Antalya Airport", city: "Antalya", country: "Turkey", timezone: "Europe/Istanbul" },
      { id: "3", code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey", timezone: "Europe/Istanbul" },
      { id: "4", code: "MUC", name: "Munich Airport", city: "Munich", country: "Germany", timezone: "Europe/Berlin" },
      { id: "5", code: "BJV", name: "Bodrum Airport", city: "Bodrum", country: "Turkey", timezone: "Europe/Istanbul" },
      { id: "6", code: "ADB", name: "Izmir Airport", city: "Izmir", country: "Turkey", timezone: "Europe/Istanbul" },
      { id: "7", code: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom", timezone: "Europe/London" },
      { id: "8", code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France", timezone: "Europe/Paris" },
    ];

    sampleAirports.forEach(airport => this.airports.set(airport.id, airport));

    // Sample destinations
    const sampleDestinations: Destination[] = [
      {
        id: "1",
        name: "Antalya",
        city: "Antalya",
        country: "Turkey",
        description: "Mediterranean paradise with ancient history",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        startingPrice: "89.00",
        flightTime: "3h 30m",
        isPopular: true,
      },
      {
        id: "2",
        name: "Istanbul",
        city: "Istanbul",
        country: "Turkey",
        description: "Where Europe meets Asia",
        imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        startingPrice: "125.00",
        flightTime: "3h 45m",
        isPopular: true,
      },
      {
        id: "3",
        name: "Bodrum",
        city: "Bodrum",
        country: "Turkey",
        description: "Aegean gem with vibrant nightlife",
        imageUrl: "https://images.unsplash.com/photo-1580500550469-1320e4dc9112?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        startingPrice: "149.00",
        flightTime: "3h 15m",
        isPopular: true,
      },
      {
        id: "4",
        name: "Izmir",
        city: "Izmir",
        country: "Turkey",
        description: "Pearl of the Aegean coast",
        imageUrl: "https://images.unsplash.com/photo-1604357737574-b8b5b7d1e6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        startingPrice: "135.00",
        flightTime: "3h 25m",
        isPopular: true,
      },
    ];

    sampleDestinations.forEach(dest => this.destinations.set(dest.id, dest));

    // Sample flights
    const sampleFlights: Flight[] = [
      {
        id: "1",
        flightNumber: "XQ123",
        airline: "SunExpress",
        departureAirport: "FRA",
        arrivalAirport: "AYT",
        departureTime: new Date("2024-12-20T10:30:00Z"),
        arrivalTime: new Date("2024-12-20T14:00:00Z"),
        duration: 210,
        aircraft: "Boeing 737-800",
        economyPrice: "89.00",
        businessPrice: "189.00",
        economySeatsAvailable: 156,
        businessSeatsAvailable: 12,
        isActive: true,
      },
      {
        id: "2",
        flightNumber: "XQ456",
        airline: "SunExpress",
        departureAirport: "AYT",
        arrivalAirport: "FRA",
        departureTime: new Date("2024-12-27T15:30:00Z"),
        arrivalTime: new Date("2024-12-27T17:00:00Z"),
        duration: 210,
        aircraft: "Boeing 737-800",
        economyPrice: "89.00",
        businessPrice: "189.00",
        economySeatsAvailable: 142,
        businessSeatsAvailable: 8,
        isActive: true,
      },
    ];

    sampleFlights.forEach(flight => this.flights.set(flight.id, flight));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
    };
    this.users.set(id, user);
    return user;
  }

  // Airports
  async getAllAirports(): Promise<Airport[]> {
    return Array.from(this.airports.values());
  }

  async searchAirports(query: string): Promise<Airport[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.airports.values()).filter(airport =>
      airport.name.toLowerCase().includes(searchTerm) ||
      airport.city.toLowerCase().includes(searchTerm) ||
      airport.code.toLowerCase().includes(searchTerm) ||
      airport.country.toLowerCase().includes(searchTerm)
    );
  }

  async getAirport(code: string): Promise<Airport | undefined> {
    return Array.from(this.airports.values()).find(airport => airport.code === code);
  }

  async createAirport(airport: InsertAirport): Promise<Airport> {
    const id = randomUUID();
    const newAirport: Airport = { ...airport, id };
    this.airports.set(id, newAirport);
    return newAirport;
  }

  // Flights
  async searchFlights(searchParams: FlightSearch): Promise<Flight[]> {
    const { from, to, departureDate } = searchParams;
    
    return Array.from(this.flights.values()).filter(flight => {
      const departureAirport = this.airports.get(flight.departureAirport);
      const arrivalAirport = this.airports.get(flight.arrivalAirport);
      
      const matchesRoute = 
        (departureAirport?.city.toLowerCase().includes(from.toLowerCase()) ||
         departureAirport?.code.toLowerCase().includes(from.toLowerCase())) &&
        (arrivalAirport?.city.toLowerCase().includes(to.toLowerCase()) ||
         arrivalAirport?.code.toLowerCase().includes(to.toLowerCase()));

      const flightDate = flight.departureTime.toISOString().split('T')[0];
      const searchDate = new Date(departureDate).toISOString().split('T')[0];
      const matchesDate = flightDate === searchDate;

      return matchesRoute && matchesDate && flight.isActive;
    });
  }

  async getFlight(id: string): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createFlight(flight: InsertFlight): Promise<Flight> {
    const id = randomUUID();
    const newFlight: Flight = { 
      ...flight, 
      id,
      airline: flight.airline || "SunExpress",
      isActive: flight.isActive ?? true,
      businessPrice: flight.businessPrice || null,
      economyPrice: flight.economyPrice || "0"
    };
    this.flights.set(id, newFlight);
    return newFlight;
  }

  // Bookings
  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(booking => booking.bookingReference === reference);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const bookingReference = this.generateBookingReference();
    const booking: Booking = {
      ...insertBooking,
      id,
      bookingReference,
      createdAt: new Date(),
      status: insertBooking.status || "confirmed",
      userId: insertBooking.userId || null,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
    }
    return booking;
  }

  private generateBookingReference(): string {
    return 'SX' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  // Destinations
  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getPopularDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(dest => dest.isPopular);
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const id = randomUUID();
    const newDestination: Destination = { 
      ...destination, 
      id,
      isPopular: destination.isPopular ?? false
    };
    this.destinations.set(id, newDestination);
    return newDestination;
  }
}

export const storage = new MemStorage();
