require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// Define BASE_PATH early
const BASE_PATH = process.env.BASE_PATH || (process.env.NODE_ENV === 'production' ? '/backend' : '');
console.log(`✅ Base path configured as: "${BASE_PATH}"`);

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));
app.use(express.json());

// Mount routes with BASE_PATH prefix
app.use(`${BASE_PATH}/api/auth`, require('./routes/auth'));
app.use(`${BASE_PATH}/api/bookings`, require('./routes/bookings'));
app.use(`${BASE_PATH}/api/orders`, require('./routes/orders'));
app.use(`${BASE_PATH}/api/contacts`, require('./routes/contacts'));
app.use(`${BASE_PATH}/api/notifications`, require('./routes/notifications'));

app.get(`${BASE_PATH}/`, (req, res) => res.send('Hygienix Backend is running!'));
app.get(`${BASE_PATH}/health`, (req, res) => res.json({ status: 'ok', version: '1.0.6', base_path: BASE_PATH }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Error', details: err.message });
});

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
}

module.exports = app;
