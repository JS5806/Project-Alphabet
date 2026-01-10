import React, { useState } from 'react';
import axios from 'axios';
import { Link, Copy, CheckCircle } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isValidUrl = (string) => {
    try { new URL(string); return true; } catch (_) { return false; }
  };

  const handleShorten = async () => {
    if (!isValidUrl(url)) {
      alert('Please enter a valid URL (including http/https)');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/shorten', { longUrl: url });
      setShortUrl(`http://localhost:5000/${res.data.shortCode}`);
    } catch (err) {
      alert('Error connecting to core engine');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}><Link size={32} /> QuickLink MVP</h1>
        <p style={styles.subtitle}>Ultra-fast Redirection Engine (Target: < 10ms)</p>
        
        <div style={styles.inputGroup}>
          <input 
            style={styles.input} 
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            style={loading ? styles.buttonDisabled : styles.button} 
            onClick={handleShorten}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Shorten'}
          </button>
        </div>

        {shortUrl && (
          <div style={styles.result}>
            <p style={styles.resultLabel}>Your short link is ready:</p>
            <div style={styles.resultBox}>
              <span style={styles.resultText}>{shortUrl}</span>
              <button onClick={copyToClipboard} style={styles.copyBtn}>
                {copied ? <CheckCircle color="#10b981" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' },
  card: { backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' },
  title: { fontSize: '2rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#1f2937' },
  subtitle: { color: '#6b7280', marginBottom: '2rem' },
  inputGroup: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' },
  button: { padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  buttonDisabled: { padding: '12px 24px', backgroundColor: '#93c5fd', color: 'white', border: 'none', borderRadius: '8px', cursor: 'not-allowed' },
  result: { marginTop: '2rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '8px' },
  resultLabel: { margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#1e40af' },
  resultBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  resultText: { fontWeight: 'bold', color: '#1e3a8a' },
  copyBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }
};

export default App;