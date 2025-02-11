import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = "643fe064dde123b80307032f";
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

  // Fetch available currencies
  useEffect(() => {
    axios
      .get(`${API_URL}USD`)
      .then((response) => {
        setCurrencies(Object.keys(response.data.conversion_rates));
      })
      .catch(() => {
        setError("Failed to load currencies.");
      });
  }, []);

  // Convert currency
  const convertCurrency = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");

    axios
      .get(`${API_URL}${fromCurrency}`)
      .then((response) => {
        const rate = response.data.conversion_rates[toCurrency]; 
        setConvertedAmount((amount * rate).toFixed(2));
      })
      .catch(() => setError("Failed to fetch exchange rate."));
  };

  // Swap Currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="container">
      <h2>Currency Converter</h2>
      {error && <p className="error">{error}</p>}

      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </div>
      <div className="currency-row">
        <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <button className="swap-btn" onClick={swapCurrencies}>⇄</button>

        <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <button onClick={convertCurrency}>Convert</button>

      {convertedAmount !== null && (
        <p>
          {amount} {fromCurrency} = <strong>{convertedAmount} {toCurrency}</strong>
        </p>
      )}
    </div>
  );
};

export default CurrencyConverter;
