const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;
const cors = require('cors');


require('./db'); 

// cross-orign source sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Middleware to parse JSON
app.use(express.json());

// Mount medicine routes
app.use('/api/medicines', require('./routes/medicine'));

app.use('/api/auth', require('./routes/auth'));

// Mount request routes
app.use('/api/requests', require('./routes/request'));

// Root test route
app.get('/', (req, res) => {
    res.send('MedDrop backend is live');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
