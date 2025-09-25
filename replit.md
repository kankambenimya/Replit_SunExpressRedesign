# Overview

This is a full-stack flight booking application built for SunExpress airline. The application allows users to search for flights, view destinations, book tickets, and manage their reservations. It features a modern React frontend with TypeScript, a Node.js/Express backend, and uses Drizzle ORM for database management with PostgreSQL.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for SunExpress branding
- **Forms**: React Hook Form with Zod validation
- **Design System**: Custom color palette with SunExpress blue and orange theme

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development Setup**: Custom Vite integration for development middleware
- **API Structure**: RESTful APIs with proper error handling and logging
- **Request Processing**: JSON body parsing and URL-encoded form support
- **Error Handling**: Centralized error middleware with status code management

## Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon database)
- **Schema Management**: Shared schema definitions between client and server
- **Validation**: Zod schemas for runtime type checking and API validation
- **Storage Interface**: Abstract storage interface with in-memory implementation for development

## Database Schema
- **Users**: Authentication and profile management
- **Airports**: Airport codes, names, cities, and timezone information
- **Flights**: Flight schedules, pricing, aircraft details, and seat availability
- **Bookings**: Reservation management with passenger details and payment tracking
- **Destinations**: Popular destination information with marketing content

## Key Features
- **Flight Search**: Multi-criteria search with date ranges, passenger counts, and seat classes
- **Booking Flow**: Multi-step booking process with passenger forms and payment
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Real-time Updates**: Query invalidation and cache management for live data
- **Form Validation**: Client and server-side validation with user-friendly error messages

## Development Tools
- **Build System**: Vite with React plugin and custom error overlay
- **Type Safety**: Strict TypeScript configuration across frontend and backend
- **Code Quality**: ESBuild for production bundling
- **Development Experience**: Hot module replacement and runtime error handling

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL hosting with connection pooling
- **Database Connection**: @neondatabase/serverless for optimized serverless connections

## UI and Design
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Date-fns**: Date manipulation and formatting utilities

## Development and Build Tools
- **Vite**: Fast build tool with development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration

## State Management and API
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with validation
- **Zod**: Schema validation for runtime type safety
- **Wouter**: Lightweight client-side routing

## Additional Libraries
- **Class Variance Authority**: Utility for managing CSS class variants
- **CLSX**: Conditional CSS class management
- **Embla Carousel**: Touch-friendly carousel components
- **CMDK**: Command palette and search functionality