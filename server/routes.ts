import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { flightSearchSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Flight search endpoint
  app.get("/api/flights/search", async (req, res) => {
    try {
      const searchParams = flightSearchSchema.parse(req.query);
      const flights = await storage.searchFlights(searchParams);
      
      // Enrich flights with airport information
      const enrichedFlights = await Promise.all(
        flights.map(async (flight) => {
          const departureAirport = await storage.getAirport(flight.departureAirport);
          const arrivalAirport = await storage.getAirport(flight.arrivalAirport);
          return {
            ...flight,
            departureAirportInfo: departureAirport,
            arrivalAirportInfo: arrivalAirport,
          };
        })
      );

      res.json(enrichedFlights);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof z.ZodError ? "Invalid search parameters" : "Search failed",
        errors: error instanceof z.ZodError ? error.errors : undefined
      });
    }
  });

  // Get airports for autocomplete
  app.get("/api/airports", async (req, res) => {
    try {
      const query = req.query.q as string;
      const airports = query 
        ? await storage.searchAirports(query)
        : await storage.getAllAirports();
      res.json(airports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch airports" });
    }
  });

  // Get destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const popular = req.query.popular === "true";
      const destinations = popular 
        ? await storage.getPopularDestinations()
        : await storage.getAllDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  // Get specific flight
  app.get("/api/flights/:id", async (req, res) => {
    try {
      const flight = await storage.getFlight(req.params.id);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }

      const departureAirport = await storage.getAirport(flight.departureAirport);
      const arrivalAirport = await storage.getAirport(flight.arrivalAirport);

      res.json({
        ...flight,
        departureAirportInfo: departureAirport,
        arrivalAirportInfo: arrivalAirport,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof z.ZodError ? "Invalid booking data" : "Booking creation failed",
        errors: error instanceof z.ZodError ? error.errors : undefined
      });
    }
  });

  // Get booking by reference
  app.get("/api/bookings/:reference", async (req, res) => {
    try {
      const booking = await storage.getBookingByReference(req.params.reference);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Get flight details
      const flight = await storage.getFlight(booking.flightId);
      if (flight) {
        const departureAirport = await storage.getAirport(flight.departureAirport);
        const arrivalAirport = await storage.getAirport(flight.arrivalAirport);
        
        res.json({
          ...booking,
          flight: {
            ...flight,
            departureAirportInfo: departureAirport,
            arrivalAirportInfo: arrivalAirport,
          }
        });
      } else {
        res.json(booking);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email address is required" });
      }
      
      // In a real app, this would integrate with an email service
      console.log(`Newsletter subscription: ${email}`);
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(500).json({ message: "Subscription failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
