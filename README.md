# FibraX

Bitcoin Cycle Ratio Visualizer for research and education.

FibraX is a chart-first dashboard that maps Bitcoin cycle structure, Fibonacci zones, and scenario bands for historical comparison. It is a research tool, not a prediction engine.

## Disclaimer

- Educational and research use only.
- Not financial advice.
- Market behavior is uncertain and models can fail.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS 4
- ESLint 9

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

Before shipping significant changes:

```bash
npm run lint
npm run build
```

## Market Data: How BTC Is Fetched

FibraX does not fetch Coinbase directly from the browser. The flow is:

1. Client polls `GET /api/market/btc` every 60 seconds.
2. Route handler decides whether to return realtime, historical, or assumption snapshot.
3. Realtime pulls BTC data from Coinbase Exchange public market endpoints:
   - `/products/BTC-USD/ticker`
   - `/products/BTC-USD/candles`
4. Historical flow tries CryptoCompare first, then falls back to Coinbase candles if needed.

### Coinbase API Key Note

Current FibraX market feed uses public market-data endpoints and does not send Coinbase auth headers. No Coinbase API key is required for the current realtime ticker/candle flow.

Private trading/account endpoints are not used in this project.

## High-Level Structure

- `src/app`: routes, layout shells, API route entrypoints
- `src/features`: feature-based modules (`about`, `dashboard`, `market-data`, `methodology`, `learn-more`, etc.)
- `src/components`: shared layout and reusable UI pieces
- `src/lib`: cross-feature helpers

## Product Positioning

FibraX presents projection zones, scenarios, invalidation context, and historical comparisons. Outputs should never be interpreted as guaranteed future prices.
