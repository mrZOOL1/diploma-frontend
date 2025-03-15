'use client'

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from 'react';
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile && selectedFile.type === 'application/pdf') {
    setFile(selectedFile);
    setError(null);
  } else {
    setFile(null);
    setError('Please select a PDF file');
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://your-fastapi-service.onrender.com';
      const response = await fetch(`${apiUrl}/calculate-avg/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('שגיאה');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Diploma Grade Calculator</title>
        <meta name="description" content="Calculate your diploma grade average" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>

      <main className="main">
        <h1 className="title">חישוב ממוצע בגרויות בקליק</h1>

        <form onSubmit={handleSubmit} className="form">
          <div className="frame">
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="fileInput"
            />
            <label htmlFor="pdf-upload" className="label">העלו את תעודת הבגרות שלכם</label>
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className={`submitButton ${loading ? 'loading' : ''}`}
          >
            {loading ? '...בתהליך' : 'חשב ממוצע'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="results">
            <h2 className="resultsTitle">Results:</h2>
            <p><strong>Regular Average:</strong> {result.regularAvg.toFixed(2)}</p>
            {result.omittedAvg && <p><strong>Optimized Average (with omissions):</strong> {result.omittedAvg.toFixed(2)}</p>}
            {result.reducedAvg && <p><strong>Average with Reduced Hebrew:</strong> {result.reducedAvg.toFixed(2)}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
