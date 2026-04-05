const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3001;

// In-memory storage for API configs
const apiConfigs = {
  exchangerateApi: {
    url: 'https://api.exchangerate-api.com/v4/latest/',
    base: 'USD',
    rateLimit: 1500,
    currentUsage: 0,
    lastCall: null,
    supportsAll: true
  },
  fixer: {
    url: 'http://data.fixer.io/api/latest?access_key=',
    base: 'EUR',
    rateLimit: 1000,
    currentUsage: 0,
    lastCall: null,
    supportsAll: true
  },
  currencyApi: {
    url: 'https://api.currencyapi.com/v3/latest?apikey=',
    base: 'USD',
    rateLimit: 300,
    currentUsage: 0,
    lastCall: null,
    supportsAll: true
  },
  openExchangeRates: {
    url: 'https://openexchangerates.org/api/latest.json?app_id=',
    base: 'USD',
    rateLimit: 1000,
    currentUsage: 0,
    lastCall: null,
    supportsAll: true
  },
  frankfurter: {
    url: 'https://api.frankfurter.app/latest?from=',
    base: 'EUR',
    rateLimit: Infinity,
    currentUsage: 0,
    lastCall: null,
    supportsAll: true
  },
  exchangeRatesApi: {
    url: 'https://api.exchangeratesapi.io/v1/latest?access_key=',
    base: 'EUR',
    rateLimit: 1000,
    currentUsage: 0,
    lastCall: null,
    supportsAll: true
  }
};

// Note: Free tiers may not require API keys, but check documentation. For simplicity, assuming no keys or placeholders.

// In-memory cache: { base: { rates: {}, timestamp: Date } }
const cache = {};

// Cache expiration: 5 minutes
const CACHE_EXPIRY = 5 * 60 * 1000;

// Function to select API
function selectApi(base) {
  const candidates = Object.keys(apiConfigs).filter(key => apiConfigs[key].base === base && apiConfigs[key].currentUsage < apiConfigs[key].rateLimit);
  if (candidates.length === 0) return null;
  // Select least recently called
  candidates.sort((a, b) => (apiConfigs[a].lastCall || 0) - (apiConfigs[b].lastCall || 0));
  return candidates[0];
}

// Function to fetch from API
async function fetchRates(apiKey, base) {
  const config = apiConfigs[apiKey];
  config.lastCall = Date.now();
  config.currentUsage++;
  let url = config.url;
  if (apiKey === 'exchangerateApi') {
    url += base;
  } else if (apiKey === 'fixer') {
    // Assuming free key, but fixer free is limited
    url += 'free_key'; // Placeholder
  } else if (apiKey === 'currencyApi') {
    url += '&base_currency=' + base;
  } else if (apiKey === 'openExchangeRates') {
    url += 'free_app_id'; // Placeholder
  } else if (apiKey === 'frankfurter') {
    url += base;
  } else if (apiKey === 'exchangeRatesApi') {
    url += 'free_key'; // Placeholder
  }
  const response = await axios.get(url);
  return { rates: response.data.rates, timestamp: Date.now() };
}

// Endpoint
app.get('/api/rates', async (req, res) => {
  const base = req.query.base || 'USD';
  const symbols = req.query.symbols ? req.query.symbols.split(',') : null;

  // Check cache
  if (cache[base] && (Date.now() - cache[base].timestamp) < CACHE_EXPIRY) {
    let rates = cache[base].rates;
    if (symbols) {
      rates = Object.fromEntries(Object.entries(rates).filter(([key]) => symbols.includes(key)));
    }
    return res.json({ rates, timestamp: cache[base].timestamp });
  }

  // Select API
  const api = selectApi(base);
  if (!api) {
    return res.status(429).json({ error: 'All APIs rate limited or unavailable' });
  }

  try {
    const data = await fetchRates(api, base);
    // Cache if supports all
    if (apiConfigs[api].supportsAll) {
      cache[base] = data;
    }
    let rates = data.rates;
    if (symbols) {
      rates = Object.fromEntries(Object.entries(rates).filter(([key]) => symbols.includes(key)));
    }
    res.json({ rates, timestamp: data.timestamp });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rates' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});