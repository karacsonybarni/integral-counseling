# Overview

This is a modern psychotherapist website built for Dr. Michael Thompson, featuring a professional, calming design focused on mental health services. The application is designed as a full-stack web platform with a React frontend and Express backend, emphasizing trust, accessibility, and user experience for therapy clients.

The website serves as both a marketing platform and client engagement tool, offering information about therapeutic services, professional credentials, and contact/appointment booking capabilities. It follows healthcare website best practices with a focus on calming aesthetics and professional presentation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with a custom design system based on calming colors (teal primary #2C5F5D, soft whites, muted blues)
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Typography**: Merriweather (serif) for headings, Source Sans Pro (sans-serif) for body text
- **Routing**: Wouter for lightweight client-side routing
- **Internationalization**: React-i18next supporting Hungarian (default) and English languages
- **State Management**: React Query for server state management and API interactions
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM with PostgreSQL schema definitions
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **API Design**: RESTful API endpoints for contact forms and appointment booking
- **Validation**: Zod schemas shared between frontend and backend for consistent validation
- **Development**: Vite integration for hot module replacement and development server

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon Database serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Tables**: Users, contact inquiries, and appointments with proper relationships
- **Fallback Storage**: In-memory storage implementation for development/testing

## Component Architecture
- **Design System**: Centralized color palette, typography, and spacing using CSS custom properties
- **Layout**: Mobile-first responsive design with consistent 32px vertical rhythm
- **Components**: Modular React components following shadcn/ui patterns
- **Accessibility**: ARIA labels, semantic HTML, and screen reader compatibility
- **Testing**: Data-testid attributes for component testing

## Form and Validation System
- **Contact Forms**: Professional inquiry forms with service type selection
- **Appointment Booking**: Comprehensive scheduling system with time slot management
- **Validation**: Real-time client-side validation with server-side verification
- **Error Handling**: User-friendly error messages with toast notifications

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database client for Neon hosting
- **drizzle-orm & drizzle-zod**: Type-safe ORM with Zod integration for schema validation
- **@tanstack/react-query**: Powerful data fetching and state management for React
- **wouter**: Lightweight router for React applications
- **react-i18next**: Internationalization framework for multi-language support

## UI and Styling Dependencies
- **@radix-ui/react-***: Comprehensive collection of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Type-safe utility for creating component variants
- **lucide-react**: Modern icon library with React components

## Form and Validation
- **react-hook-form**: Performant forms library with minimal re-renders
- **@hookform/resolvers**: Integration layer for external validation libraries
- **zod**: TypeScript-first schema validation library

## Development and Build Tools
- **vite**: Fast build tool and development server with HMR
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **tsx**: TypeScript execution engine for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds

## Database and Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **@jridgewell/trace-mapping**: Source map utilities for development debugging

## Additional Utilities
- **date-fns**: Modern date utility library for JavaScript
- **cmdk**: Command palette component for enhanced user interactions
- **embla-carousel-react**: Touch-friendly carousel component library