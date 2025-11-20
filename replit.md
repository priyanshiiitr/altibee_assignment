# Product Transparency Platform

## Overview

A web application that generates comprehensive transparency reports for consumer products using AI-powered question generation. Users input basic product information, answer dynamically generated questions about ingredients, sourcing, ethics, and environmental impact, then receive detailed transparency reports with scoring metrics.

The platform helps conscious consumers make informed purchasing decisions by collecting and analyzing product information across multiple dimensions: ingredients/materials, supply chain sourcing, environmental impact, health/safety, certifications, and company ethics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and API caching

**UI Framework:**
- shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Design system based on Material Design principles with trust-building elements

**Form Management:**
- React Hook Form with Zod for schema validation
- Multi-step form flow with progress indication
- Dynamic AI-generated question rendering

**Key Design Decisions:**
- Single Page Application (SPA) architecture for smooth user experience
- Component-based architecture with reusable UI primitives
- CSS custom properties for theming (light/dark mode support)
- Responsive design with mobile-first approach
- Typography: Inter for UI/body, Poppins for headings

### Backend Architecture

**Technology Stack:**
- Express.js server running on Node.js
- TypeScript for type safety across the stack
- ESM module system (not CommonJS)

**API Design:**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Centralized error handling
- Request logging middleware for debugging

**Key Routes:**
- `POST /api/products` - Create new product submissions
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Get specific product details
- `POST /api/questions/generate` - AI-powered question generation
- `POST /api/responses` - Submit form responses
- `POST /api/reports/generate` - Generate transparency reports
- `GET /api/reports/:productId/pdf` - Download PDF reports

**Code Organization:**
- `/server/routes.ts` - Route definitions and handlers
- `/server/storage.ts` - Database abstraction layer
- `/server/openai.ts` - AI integration logic
- `/server/pdf.ts` - PDF generation utilities
- `/shared/schema.ts` - Shared types and validation schemas

### Data Storage

**Database:**
- PostgreSQL via Neon serverless driver
- Connection pooling for efficient database access
- WebSocket support for serverless environments

**ORM:**
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript types generated from schema
- Migration support via drizzle-kit

**Schema Structure:**

*Products Table:*
- Stores submitted product information
- Fields: id, name, category, brand, description, imageUrl, transparencyScore
- Automatically generates UUID primary keys
- Tracks creation timestamp

*Form Responses Table:*
- Stores all question-answer pairs
- Links to products via foreign key relationship
- Fields: id, productId, questionId, question, answer, category
- Enables detailed analysis and scoring

*Reports Table:*
- Stores generated transparency reports
- JSONB field for flexible report data structure
- Optional PDF URL for downloadable reports
- One-to-one relationship with products

**Design Rationale:**
- Normalized structure prevents data duplication
- JSONB for semi-structured report data allows flexibility
- Foreign key constraints ensure data integrity
- Timestamps enable audit trails

### AI Integration

**OpenAI Integration:**
- GPT-4 Mini model for question generation
- Model: "gpt-4o-mini" (cost-effective for structured output)
- Structured prompts for consistent question quality

**AI Features:**
1. **Dynamic Question Generation:**
   - Analyzes product category, name, brand, description
   - Generates 6-8 relevant questions covering key transparency areas
   - Returns structured JSON with question metadata and tooltips

2. **Transparency Scoring:**
   - Analyzes submitted responses for completeness
   - Categorizes information by transparency dimension
   - Generates overall transparency score (0-100)

**Prompt Engineering:**
- System role defines expert persona in product transparency
- User prompt provides product context and expected output structure
- Requests category-specific questions for relevance
- Includes tooltip generation for user education

### PDF Report Generation

**Current Implementation:**
- HTML-based report template
- Inline CSS for print styling
- Can be converted to PDF via browser print or headless browser

**Report Structure:**
- Product summary header
- Category-wise transparency breakdown
- Visual score indicators
- Detailed question-answer sections
- Generated timestamp

**Future Enhancement Path:**
- Integration with PDFKit or Puppeteer for server-side PDF generation
- Template system for customizable report formats

### Build and Deployment

**Development:**
- `npm run dev` - Runs development server with hot module replacement
- Vite dev server proxies API requests to Express backend
- TypeScript checking via `npm run check`

**Production Build:**
- `npm run build` - Compiles client and server code
- Client: Vite bundles React app to `dist/public`
- Server: esbuild bundles Express app to `dist/index.js`
- ESM output format for both client and server

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `OPENAI_API_KEY` - OpenAI API authentication (required)
- `NODE_ENV` - Environment indicator (development/production)

## External Dependencies

### Third-Party APIs

**OpenAI API:**
- Used for: AI-powered question generation and transparency scoring
- Model: gpt-4o-mini
- Integration: Official OpenAI Node.js SDK
- Authentication: API key via environment variable

### Database Service

**Neon PostgreSQL:**
- Serverless PostgreSQL database
- WebSocket-based connection for serverless compatibility
- Automatic connection pooling
- Schema managed via Drizzle migrations

### UI Component Libraries

**Radix UI:**
- Complete suite of accessible, unstyled UI primitives
- Components: Dialog, Dropdown, Select, Tooltip, Accordion, etc.
- Provides keyboard navigation and ARIA attributes
- Foundation for shadcn/ui component library

**shadcn/ui:**
- Pre-built component library using Radix UI primitives
- Styled with Tailwind CSS
- Customizable design tokens
- New York style variant selected for professional appearance

### Styling and Utilities

**Tailwind CSS:**
- Utility-first CSS framework
- Custom configuration with design tokens
- PostCSS for processing
- Autoprefixer for browser compatibility

**Supporting Libraries:**
- class-variance-authority (CVA) - Type-safe component variants
- clsx & tailwind-merge - Conditional class name utilities
- lucide-react - Icon library (consistent with shadcn/ui)

### Data Visualization

**Recharts:**
- React chart library for transparency score visualization
- Bar charts for category breakdown
- Responsive container support
- Theming via CSS custom properties

### Development Tools

**Replit Plugins:**
- @replit/vite-plugin-runtime-error-modal - Error overlay
- @replit/vite-plugin-cartographer - Code navigation (dev only)
- @replit/vite-plugin-dev-banner - Development indicator (dev only)

### Font Loading

**Google Fonts:**
- Inter - Primary UI and body text font
- Poppins - Heading and accent font
- Loaded via preconnect for performance
- Variable font weights for flexibility