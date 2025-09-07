# SafeRoute - Women's Safety Navigation App

## Overview

SafeRoute is a women-focused safety navigation application that provides secure route planning with real-time safety assessments. The app helps users find the safest paths between destinations by analyzing factors like lighting conditions, crowd density, police presence, and community safety reports. Built as a full-stack web application, it combines modern frontend technologies with a robust backend API to deliver a comprehensive safety-first navigation experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type-safe component development
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query for server state management and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript throughout the stack for consistency
- **API Structure**: RESTful endpoints for route searching and safety reporting
- **Development**: Hot module replacement via Vite integration in development mode
- **Error Handling**: Centralized error middleware with structured error responses

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **ORM**: Drizzle with Zod schema validation for type-safe database operations
- **Schema**: Three main entities - users, routes, and safety reports
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Connection**: Neon Database serverless PostgreSQL for production

### Authentication and Authorization
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **User Storage**: Basic username/password authentication with hashed passwords
- **API Security**: Session-based authentication for protected endpoints

### External Dependencies
- **Maps Integration**: Ola Maps API for route calculation and location services
- **Geocoding**: Ola Maps geocoding for address-to-coordinate conversion
- **Location Search**: Ola Maps Places API for location autocomplete and suggestions
- **Route Planning**: Ola Maps Routing API for calculating optimal and safe paths
- **Database Hosting**: Neon Database for serverless PostgreSQL
- **Development Tools**: Replit-specific plugins for development environment integration

The architecture prioritizes safety-first features with a clean separation between client and server concerns, enabling scalable development while maintaining focus on user safety and experience.