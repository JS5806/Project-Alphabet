const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Performance Cache (Step 1 requirement: < 10ms latency)
const urlDatabase = new Map(); 
const reverseDatabase = new Map();

// Base62 Alphabet
const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeBase62(num) {
    let result = "";
    while (num > 0) {
        result = charset[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result || "0";
}

let counter = 1000000; // Starting point for short IDs

// API: Create Short URL
app.post('/api/shorten', (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: 'URL is required' });

    // Check if exists
    if (reverseDatabase.has(longUrl)) {
        return res.json({ shortCode: reverseDatabase.get(longUrl) });
    }

    const shortCode = encodeBase62(counter++);
    urlDatabase.set(shortCode, longUrl);
    reverseDatabase.set(longUrl, shortCode);

    res.json({ shortCode });
});

// REDIRECTION ENGINE (Optimized for Speed)
app.get('/:shortCode', (req, res) => {
    const start = Date.now();
    const { shortCode } = req.params;
    const longUrl = urlDatabase.get(shortCode);

    if (longUrl) {
        console.log(`[Redirect] Code: ${shortCode} -> ${Date.now() - start}ms`);
        return res.redirect(301, longUrl);
    }
    
    res.status(404).send('URL Not Found');
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});