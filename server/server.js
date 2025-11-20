const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Assuming you have node-fetch installed
const path = require('path'); 
const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../client/'))); 

// Define the Backend Endpoint
app.get('/api/outages', async (req, res) => {
    const OUTAGES_URL = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json';

    try {
        const response = await fetch(OUTAGES_URL);
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: "Failed to fetch external power outage data." 
            });
        }
        
        const rawData = await response.json();
        
        // 1. Flatten the data
        let allOutages = Object.values(rawData).flat(); 
        
        // 🚨 2. ADD THE SORTING LOGIC HERE (Moved from the client!)
        // Sort by date (ascending, oldest first)
        allOutages.sort((a, b) => new Date(a.from) - new Date(b.from));
        
        // 3. Send the PROCESSED AND SORTED data back to the client
        res.json({ outages: allOutages });

    } catch (error) {
        console.error("Error fetching and processing power outages:", error);
        res.status(500).json({ error: "Internal server error during data processing." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});