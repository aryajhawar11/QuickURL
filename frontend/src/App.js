import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/short', {
        originalUrl,
      });
      setShortUrl(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
    <div className="card">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL to shorten"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <button onClick={handleSubmit} type="submit">Shorten</button>
      </form>
  
      {shortUrl && (
        <div className="short-url">
          <p>Shortened URL:</p>
          <a
            href={shortUrl.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortUrl.shortUrl}
          </a>
          {shortUrl.qrCode && (
            <div className="qr-code">
              <img src={shortUrl.qrCode} alt="QR Code" />
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  
  );
}

export default App;