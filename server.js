const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = 3000;
// --- PASTE YOUR API KEY BELOW ---
const API_KEY = 'ce2561a4dd254761808ce83c11e88793'; 

// --- SMART ROUTE ---
app.get('/news', async (req, res) => {
    try {
        // We look for a 'topic' sent from the browser
        // If none is sent, we default to 'general'
        const category = req.query.topic || 'general';
        
        console.log(`📡 COMMANDER REQUESTING INTEL ON: [ ${category.toUpperCase()} ]`);

        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
        
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

app.listen(PORT, () => {
    console.log(`\n✅ ARIES UPLINK ESTABLISHED`);
    console.log(`waiting for specific orders...\n`);
});