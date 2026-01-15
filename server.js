const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Tool to fetch data
const app = express();

app.use(cors());

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3000;
const NEWS_KEY = process.env.NEWS_KEY;     // From Render Vault
const MARKET_KEY = process.env.MARKET_KEY; // From Render Vault

// --- FALLBACK DATA (If API fails or quota runs out) ---
const FAKE_NEWS = [
    { title: "Global Markets Rally as Tech Sector Booms", url: "#" },
    { title: "SpaceX Announces New Mars Trajectory", url: "#" },
    { title: "Oil Prices Stabilize After Summit", url: "#" },
    { title: "AI Regulation Talks Stall in Senate", url: "#" },
    { title: "Crypto Bitcoin Surges Past Resistance", url: "#" }
];

// --- ROUTES ---

app.get('/', (req, res) => {
    res.send('ARIES UPLINK ESTABLISHED // SYSTEM ONLINE');
});

// 1. NEWS ENDPOINT
app.get('/news', async (req, res) => {
    const topic = req.query.topic || 'general';
    console.log(`[ARIES] Fetching News for: ${topic}`);

    try {
        if (!NEWS_KEY) throw new Error("No API Key");

        // Call MediaStack API
        const response = await axios.get(`http://api.mediastack.com/v1/news`, {
            params: {
                access_key: NEWS_KEY,
                keywords: topic,
                languages: 'en',
                limit: 5
            }
        });

        // Send Real Data
        if (response.data.data && response.data.data.length > 0) {
            console.log("-> Real Data Acquired");
            res.json({ articles: response.data.data });
        } else {
            throw new Error("No articles found");
        }

    } catch (error) {
        console.error("-> API Failed/Empty (Using Simulation):", error.message);
        // Fallback to fake data so app doesn't break
        res.json({ articles: FAKE_NEWS });
    }
});

// 2. MARKET ENDPOINT (Ready for future use)
app.get('/market', async (req, res) => {
    console.log("[ARIES] Fetching Market Data...");
    try {
        if (!MARKET_KEY) throw new Error("No API Key");
        
        // Call MarketStack API (EOD Data is free)
        const response = await axios.get(`http://api.marketstack.com/v1/eod`, {
            params: {
                access_key: MARKET_KEY,
                symbols: 'AAPL,MSFT,TSLA',
                limit: 1
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error("-> Market API Failed:", error.message);
        res.json({ status: "simulation", sp500: 5910, btc: 98420 });
    }
});

app.listen(PORT, () => {
    console.log(`ARIES SERVER LISTENING ON PORT ${PORT}`);
});