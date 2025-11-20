# Product Transparency Platform - Design Guidelines

## Design Approach
**Selected Approach**: Material Design System + Trust-Building Elements
**Rationale**: Information-dense application requiring clear data presentation, intuitive form flows, and credibility signals. Material's elevation system and structured components suit the multi-step form experience while maintaining the clean, health-conscious aesthetic.

## Typography System

**Font Families**:
- Primary: Inter (Google Fonts) - Clean, modern sans-serif for UI and body text
- Accent: Poppins (Google Fonts) - Semibold for headings and emphasis

**Type Scale**:
- Hero/Page Titles: text-4xl md:text-5xl font-semibold
- Section Headings: text-2xl md:text-3xl font-semibold
- Form Labels: text-sm font-medium uppercase tracking-wide
- Body Text: text-base leading-relaxed
- Helper Text/Tooltips: text-sm
- Metrics/Stats: text-3xl md:text-4xl font-bold

## Layout System

**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, 16
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-16
- Form field gaps: space-y-6
- Card spacing: p-6

**Grid Structure**:
- Container: max-w-6xl mx-auto
- Form layouts: Single column with max-w-2xl for optimal readability
- Dashboard: 2-3 column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Report preview: 2-column layout (content + sidebar)

## Component Library

### Navigation
- Clean top navbar with logo left, main nav center, CTA button right
- Sticky positioning with subtle shadow on scroll
- Mobile: Hamburger menu with slide-in drawer

### Form Components

**Multi-Step Form**:
- Progress indicator: Horizontal stepper with completed/current/upcoming states
- Step numbers in circles with connecting lines
- Current step highlighted with larger scale
- Form cards: Elevated surface (shadow-lg) with rounded-xl corners
- Field groups: Organized with clear visual hierarchy using borders and spacing

**Input Fields**:
- Material-style with floating labels
- Focus state with border accent
- Error states with inline validation messages
- Helper text beneath fields in muted tone
- Tooltips: Question mark icon triggers popover with explanation

**Dynamic Question Display**:
- AI-generated questions appear with subtle fade-in
- Grouped by category with accordion-style sections
- Conditional fields slide in smoothly when triggered
- "Why we ask this" explainer text below complex questions

### Dashboard Components

**Product Cards**:
- Elevated cards with hover lift effect (shadow transition)
- Product image top, title, category badge, transparency score
- Quick view button overlays on hover
- Grid layout with consistent spacing

**Transparency Score Visual**:
- Circular progress indicator with percentage
- Radial gradient showing score health (low to high)
- Icon indicators for key metrics (organic, ethical, etc.)

### Report Display

**Report Preview**:
- Clean, printable layout
- Section dividers with subtle lines
- Data visualization: Simple bar charts and metric cards
- Summary boxes with key findings highlighted
- PDF download button prominently placed

### Trust Elements
- Security badges in footer
- "Your data is private" messaging near sensitive fields
- Verification checkmarks for validated information
- Expert-reviewed indicator badges

## Interactive Elements

**Buttons**:
- Primary CTA: Large (px-8 py-3), rounded-lg, font-semibold
- Secondary: Outlined style with hover fill
- Icon buttons: Circular with centered icon
- Disabled state: Reduced opacity with cursor-not-allowed

**Tooltips**:
- Triggered by info icons or question marks
- Positioned contextually (top/bottom/side)
- Max-width prose, subtle shadow, rounded corners
- Arrow pointer to source element

**Loading States**:
- Skeleton loaders for dashboard cards
- Spinner with "Generating questions..." text for AI processing
- Progress bar for PDF generation
- Shimmer effect for loading content

## Icons
**Library**: Heroicons (outline for UI, solid for filled states)
- Info/Help: question-mark-circle
- Success: check-circle
- Warning: exclamation-triangle
- Navigation: chevrons, arrows
- Actions: plus, pencil, trash, download

## Images

**Hero Section**: Yes - large hero image
- Full-width hero with semi-transparent overlay
- Image: Clean, bright product photography or produce/natural ingredients
- Overlaid heading + subheading centered
- CTA buttons with backdrop-blur-md backgrounds
- Height: min-h-[500px] md:min-h-[600px]

**Dashboard/Reports**: Product thumbnails as needed
- Placeholder images for products without photos
- Consistent aspect ratio (4:3) for grid uniformity

## Accessibility
- Consistent ARIA labels across all form inputs
- Keyboard navigation for multi-step form
- Focus indicators on all interactive elements
- High contrast ratios for text readability
- Screen reader announcements for dynamic content

## Page-Specific Layouts

**Homepage/Landing**:
- Hero with value proposition + CTA
- "How It Works" - 3-step process cards
- Featured Reports - Showcase grid
- Trust indicators - Partner logos/statistics
- Final CTA section with form preview

**Form Page**:
- Centered form with clear progress at top
- Sidebar with "Why this matters" educational content
- Sticky navigation between steps
- Save draft functionality prominently displayed

**Dashboard**:
- Filter bar with category/score range selectors
- Search input for products
- Sort dropdown (newest, highest score, category)
- Card grid of submitted products
- Empty state with illustration + "Create your first report" CTA

**Report View**:
- Printable layout optimized for PDF
- Header with product name + transparency score
- Categorized sections: Ingredients, Sourcing, Environmental Impact, Health Metrics
- Visual data representations (charts, icons, badges)
- Footer with timestamp + report ID