# WIZniche Job Costing Analyzer - Frontend

A modern, responsive frontend for the WIZniche Job Costing Analyzer, built with Nuxt 4 and Tailwind CSS.

## Tech Stack

- **Nuxt 4** - Vue.js framework with SSR support
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Profit visualization
- **Pinia** - State management

## Architecture Highlights

- **Repository Pattern** - API calls abstracted into composables (`useJobs`)
- **Type-safe API layer** - Full TypeScript interfaces for API responses
- **Reactive state management** - Pinia store for metadata caching
- **Debounced search** - Optimized API calls with 800ms debounce
- **Smart pagination** - Dynamic page number display with ellipsis

## Features

- **Dashboard** with real-time stats (total jobs, revenue, profit, margin)
- **Profit chart** visualization by job type
- **Job listing** with search, filters, and pagination
- **Job detail view** with full cost breakdown
- **Search** - Real-time search across jobs
- **Filters** - By status (completed/in_progress/pending) and job type
- **Pagination** - Navigate through 5,000+ jobs efficiently
- **Responsive design** - Mobile-first with adaptive layouts

## Local Setup

```bash
npm install
npm run dev
```

The app will run on `http://localhost:3000`

## Environment Variables

Create a `.env` file:

```env
API_BASE_URL=https://api-wizniche-demo.mirrorlog.com/api/v1
```

## Project Structure

```
app/
├── components/          # Vue components (JobCard, ProfitChart)
├── composables/         # API layer (useJobs, useFormatters)
├── pages/              # Route pages (index, jobs/[id])
└── stores/             # Pinia stores (metadata)

types/
└── index.ts            # TypeScript interfaces

nuxt.config.ts          # Nuxt configuration
tailwind.config.ts      # Tailwind configuration
```

## Production Build

```bash
npm run build
npm run preview
```

## Demo

Frontend: https://wizniche-demo.mirrorlog.com
Backend API: https://api-wizniche-demo.mirrorlog.com

---

Built as a demonstration of modern Nuxt development for WIZniche's Senior Full Stack Engineer role.

Demonstrates:
- Nuxt 4 composition API
- Type-safe development with TypeScript
- Proper state management patterns
- Responsive UI/UX design
- Production deployment experience
