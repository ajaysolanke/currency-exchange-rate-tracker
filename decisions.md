# Project Decisions

## Technology Stack
- **Backend**: Node.js with Express.js for the API server.
- **Frontend**: React.js for the user interface.
- **HTTP Client**: Axios for making API requests in the backend.
- **CORS Handling**: CORS middleware for cross-origin requests.
- **Caching**: In-memory caching using JavaScript objects.
- **Version Control**: Git with GitHub for repository hosting.

## API Selection
Selected free currency exchange rate APIs:
- **Exchangerate-API** (exchangerate-api.com): 1500 requests/month, base USD, supports all currencies.
- **Fixer** (fixer.io): 1000 requests/month, base EUR, supports all currencies.
- **CurrencyAPI** (currencyapi.com): 300 requests/month, supports all currencies.
- **Open Exchange Rates** (openexchangerates.org): 1000 requests/month, base USD, supports all currencies.
- **Frankfurter** (frankfurter.app): Unlimited requests, base EUR, supports all currencies.
- **Exchange Rates API** (exchangeratesapi.io): 1000 requests/month, base EUR, supports all currencies.

APIs were chosen based on free tiers, reliability, and currency support.

## API Selection Logic
- Prioritize APIs that support the requested base currency.
- Among candidates, select the one least recently called to distribute load.
- Skip APIs that have exceeded their rate limits.
- Rate limits are tracked in-memory (resets not implemented for simplicity).

## Caching Strategy
- Cache full rate sets from APIs that provide all currencies from a base.
- Cache expiration: 5 minutes.
- Cache stored in-memory as { base: { rates: {}, timestamp: Date } }.
- Serve from cache if valid; otherwise fetch from API and update cache.

## Endpoint Design
- Single endpoint: `GET /api/rates?base=USD&symbols=EUR,GBP`
- Returns JSON: `{ rates: { currency: rate }, timestamp: unix_timestamp }`
- Default base: USD
- Optional symbols parameter to filter currencies.

## Frontend Features
- Dropdown to select base currency (USD, EUR).
- Table displaying currency codes and rates.
- "Last updated" timestamp showing data freshness.
- Refresh button to manually update rates.
- Fetches from backend on load and base change.

## Data Freshness
- Timestamp indicates when data was last fetched from an API.
- Displayed in human-readable format (locale string).

## Error Handling
- Backend: Return 429 if no APIs available, 500 on fetch errors.
- Frontend: Log errors to console; no user-facing error UI yet.

## Security
- No API keys required for free tiers (placeholders in code for APIs that need them).
- CORS enabled for development (localhost origins).

## Development Setup
- Backend runs on port 3001.
- Frontend runs on port 3000 (default React).
- No environment variables used yet.

## Future Considerations
- Implement persistent storage for rate limits (e.g., file or database).
- Add more currencies to the frontend dropdown.
- Handle API key management securely.
- Add loading states and error messages in UI.
- Implement historical rates if needed.

## Answers to Key Questions

### Which APIs did you choose and why?
Selected the following free APIs: Exchangerate-API, Fixer, CurrencyAPI, Open Exchange Rates, Frankfurter, and Exchange Rates API. They were chosen because they offer free tiers with reasonable rate limits (300-1500 requests/month), support multiple currencies including all major ones, and most don't require API keys for basic usage. Frankfurter stands out with unlimited requests. This provides diversity in data sources and bases (USD and EUR) to ensure broad currency support.

### What's your fallback strategy when an API fails?
The backend selects the best API based on base support, rate limits, and recency. If the selected API fails (network error, invalid response), it falls back to the next eligible API in the selection order. If all APIs fail or are rate-limited, it returns a 429 or 500 error to the frontend.

### How do you handle conflicting data from different sources?
Since only one API is queried per request, there are no conflicts. If multiple APIs were used simultaneously (not implemented), we could average rates or prioritize based on freshness, but this would add complexity.

### What does the user see when things fail or data is stale?
- **Failures**: Errors are logged to the console; the UI may show a loading state indefinitely or no data if the fetch fails. No user-friendly error messages are displayed yet.
- **Stale Data**: The "Last updated" timestamp shows when the data was fetched. If stale (cache expired), the user sees old data until refreshed. The refresh button allows manual updates.

### Did you do anything to improve the staleness of data? If so, what?
Yes:
- Implemented 5-minute in-memory caching to serve recent data without API calls.
- API selection prioritizes the least recently called API to distribute load and potentially get fresher data from underused sources.
- Manual refresh button in the UI for immediate updates.

### What did you cut to ship in 60 minutes?
- Persistent rate limit tracking (currently in-memory, resets on server restart).
- Comprehensive error handling and user-facing error messages.
- Loading indicators and better UX (e.g., skeleton screens).
- Support for more base currencies in the UI.
- Historical exchange rates.
- Unit tests and integration tests.
- Environment variable management for API keys.
- Database for caching or rate limits.

### What would you add with more time?
- User-friendly error messages and loading states in the frontend.
- Persistent storage (file or database) for rate limits and caching to survive restarts.
- More base currencies in the dropdown (e.g., GBP, JPY).
- Historical rates endpoint and UI charts.
- Automated testing (Jest for backend, React Testing Library for frontend).
- API key management with environment variables and validation.
- Rate limit reset logic based on monthly cycles.
- Data validation and conflict resolution if using multiple APIs.
- Deployment setup (e.g., Docker, cloud hosting).
- Performance optimizations (e.g., compression, pagination for large rate sets).