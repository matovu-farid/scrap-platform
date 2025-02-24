# Web Scraping Dashboard

A Next.js application that provides an interactive dashboard for web scraping using AI assistance.

## Features

- Interactive web scraping interface
- AI-powered scraping capabilities
- Real-time scraping feedback and results
- API key management system
- Multiple API endpoints for scraping operations
- Progress tracking and status updates

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Project Structure

Key components and files:

- `components/dashboard/interactive-scrape-test.tsx` - Main dashboard interface for scraping
- `components/dashboard/api-key-management.tsx` - API key management interface
- `app/api/scrape/route.ts` - Primary scraping API endpoint
- `app/api/scrape-callback/route.ts` - API endpoint handling scrape callbacks
- `lib/scrap.ts` - Core scraping functionality
- `lib/api_key.ts` - API key handling utilities
- `lib/schemas/scrape-progress.ts` - Progress tracking schemas

## Dashboard Pages

- `/dashboard/scrape-test` - Interactive scraping interface
- `/dashboard/api-management` - API key management dashboard

## Development

The project is built with:

- [Next.js](https://nextjs.org) - React framework
- TypeScript for type safety
- AI-powered scraping capabilities
- Environment variable configuration for API keys

## API Documentation

### Main Scraping Endpoint

The `/api/scrape` endpoint initiates scraping operations. Requires a valid API key.

### Scrape Callback Endpoint

The `/api/scrape-callback` endpoint handles asynchronous scraping results and progress updates.

### API Key Management

The system includes secure API key management with:

- Key generation
- Key validation
- Usage tracking
- Secure storage

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
API_KEY=your_api_key_here
# Add other required environment variables
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
