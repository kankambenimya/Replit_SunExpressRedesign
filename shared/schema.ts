import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const airports = pgTable("airports", {
  id: varchar("id").primaryKey(),
  code: varchar("code", { length: 3 }).notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  timezone: text("timezone").notNull(),
});

export const flights = pgTable("flights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightNumber: varchar("flight_number").notNull(),
  airline: text("airline").notNull().default("SunExpress"),
  departureAirport: varchar("departure_airport").notNull(),
  arrivalAirport: varchar("arrival_airport").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  aircraft: text("aircraft").notNull(),
  economyPrice: decimal("economy_price", { precision: 10, scale: 2 }).notNull(),
  businessPrice: decimal("business_price", { precision: 10, scale: 2 }),
  economySeatsAvailable: integer("economy_seats_available").notNull(),
  businessSeatsAvailable: integer("business_seats_available").notNull(),
  isActive: boolean("is_active").default(true),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingReference: varchar("booking_reference").notNull().unique(),
  userId: varchar("user_id"),
  flightId: varchar("flight_id").notNull(),
  passengerDetails: json("passenger_details").notNull(), // Array of passenger objects
  seatClass: varchar("seat_class").notNull(), // 'economy' | 'business'
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull().default("confirmed"), // 'pending' | 'confirmed' | 'cancelled'
  contactEmail: text("contact_email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  startingPrice: decimal("starting_price", { precision: 10, scale: 2 }).notNull(),
  flightTime: text("flight_time").notNull(),
  isPopular: boolean("is_popular").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAirportSchema = createInsertSchema(airports);

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingReference: true,
  createdAt: true,
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

// Additional schemas for flight search
export const flightSearchSchema = z.object({
  from: z.string().min(1, "Departure city is required"),
  to: z.string().min(1, "Destination city is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  adults: z.number().min(1).max(9),
  children: z.number().min(0).max(9),
  infants: z.number().min(0).max(9),
  seatClass: z.enum(["economy", "business"]),
  tripType: z.enum(["roundtrip", "oneway", "multicity"]),
});

export const passengerSchema = z.object({
  title: z.enum(["Mr", "Mrs", "Ms", "Dr"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  passportNumber: z.string().optional(),
  type: z.enum(["adult", "child", "infant"]),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Airport = typeof airports.$inferSelect;
export type InsertAirport = z.infer<typeof insertAirportSchema>;

export type Flight = typeof flights.$inferSelect;
export type InsertFlight = z.infer<typeof insertFlightSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type FlightSearch = z.infer<typeof flightSearchSchema>;
export type Passenger = z.infer<typeof passengerSchema>;
