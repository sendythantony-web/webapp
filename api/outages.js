const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/outages', async (req, res) => {
    const OUTAGES_URL = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json';

    try {
        const response = await fetch(OUTAGES_URL);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Failed to fetch external power outage data."
            });
        }

        const rawData = await response.json();
        let allOutages = Object.values(rawData).flat();
        allOutages.sort((a, b) => new Date(a.from) - new Date(b.from));

        res.json({ outages: allOutages });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = app;
