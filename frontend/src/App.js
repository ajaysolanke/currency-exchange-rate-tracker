import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [rates, setRates] = useState({});
  const [timestamp, setTimestamp] = useState(null);
  const [base, setBase] = useState('USD');
  const [loading, setLoading] = useState(false);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/rates?base=${base}`);
      const data = await response.json();
      setRates(data.rates);
      setTimestamp(data.timestamp);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, [base]);

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleString();
  };

  return (
    <div className="App">
      <h1>Currency Exchange Rates</h1>
      <div>
        <label>Base Currency: </label>
        <select value={base} onChange={(e) => setBase(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <button onClick={fetchRates} disabled={loading}>Refresh</button>
      </div>
      {loading && <p>Loading...</p>}
      {timestamp && <p>Last updated: {formatTimestamp(timestamp)}</p>}
      <table>
        <thead>
          <tr>
            <th>Currency</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rates).map(([currency, rate]) => (
            <tr key={currency}>
              <td>{currency}</td>
              <td>{rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;