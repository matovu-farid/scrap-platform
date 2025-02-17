# Web Scraping Dashboard

A Next.js application that provides an interactive dashboard for web scraping using AI assistance.

## Features

- Interactive web scraping interface
- AI-powered scraping capabilities
- Real-time scraping feedback and results
- Callback API endpoint for scraping operations

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
- `app/api/scrape-callback/route.ts` - API endpoint handling scrape callbacks
- Integration with `scrap-ai` library for AI-powered scraping

## Development

The project is built with:

- [Next.js](https://nextjs.org) - React framework
- TypeScript for type safety
- AI-powered scraping capabilities

## API Documentation

### Scrape Callback Endpoint

The `/api/scrape-callback` endpoint handles asynchronous scraping results. See the route documentation for more details on the expected payload and response format.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
