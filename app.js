const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: 'C:/Users/hecla/IdeaProjects/fnm-backend/.env' });
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

dotenv.config();

console.log('Environment Variables:', {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    PAYPAL_MODE: process.env.PAYPAL_MODE,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });