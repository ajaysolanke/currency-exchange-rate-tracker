# Currency Exchange Rate Application

A simple web application that displays live currency exchange rates using multiple free public APIs. The backend aggregates data from various sources to provide fresh rates, while the frontend offers a clean UI to view and refresh rates.

## Features
- Real-time currency exchange rates
- Support for multiple base currencies (USD, EUR)
- Data freshness indicators
- Manual refresh option
- Aggregated API data with intelligent selection

## Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Git (for cloning the repository)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd rate-exchange
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

## Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on http://localhost:3001

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000 and open automatically in your browser.

## Usage

- Select a base currency from the dropdown (USD or EUR).
- View the exchange rates in the table.
- Check the "Last updated" timestamp for data freshness.
- Click "Refresh" to manually update the rates.

## API Endpoints

### GET /api/rates
Returns exchange rates for a given base currency.

**Query Parameters:**
- `base` (optional): Base currency code (default: USD). Supported: USD, EUR.
- `symbols` (optional): Comma-separated list of currency codes to include (e.g., EUR,GBP,JPY).

**Example Request:**
```
GET http://localhost:3001/api/rates?base=USD&symbols=EUR,GBP
```

**Example Response:**
```json
{
  "rates": {
    "EUR": 0.85,
    "GBP": 0.73
  },
  "timestamp": 1640995200000
}
```

## Configuration

### API Keys
Some APIs may require free API keys. Update the placeholders in `backend/server.js`:
- Fixer: Replace `'free_key'` with your Fixer API key.
- CurrencyAPI: Replace `'free_key'` with your CurrencyAPI key.
- Open Exchange Rates: Replace `'free_app_id'` with your App ID.
- Exchange Rates API: Replace `'free_key'` with your API key.

Exchangerate-API and Frankfurter work without keys.

### Cache Expiration
Cache expiration is set to 5 minutes. To change, modify `CACHE_EXPIRY` in `backend/server.js`.

## Troubleshooting

- **CORS Errors:** Ensure the backend is running with CORS enabled.
- **API Failures:** Check console for errors. Some APIs may have rate limits or require keys.
- **Port Conflicts:** If ports 3000 or 3001 are in use, update the ports in the code.
- **Module Errors:** Run `npm install` in both directories if dependencies are missing.

## Project Structure
```
rate-exchange/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── public/
│       └── index.html
├── .gitignore
├── decisions.md
├── README.md
└── specs
```

## Technologies Used
- **Backend:** Node.js, Express.js, Axios
- **Frontend:** React.js
- **APIs:** Multiple free currency exchange APIs

## Contributing
1. Fork the repository.
2. Create a feature branch.
3. Make changes and test locally.
4. Submit a pull request.

## License
This project is for educational purposes. Check individual API terms of service.