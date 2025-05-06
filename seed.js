const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const products = [
    {
        name: 'Beard Growth Oil',
        price: 19.99,
        image: './img/img/beardoil.jpeg',
        description: 'A lightweight, non-greasy oil that nourishes and softens your beard.',
        scent: 'Cedar',
        size: '2oz',
    },
    {
        name: 'Beard Wash',
        price: 15.99,
        image: './img/img/CPbeardwash.jpeg',
        description: 'A gentle cleanser that removes dirt and buildup while moisturizing your beard.',
        scent: 'Sandalwood',
        size: '8oz',
    },
    // Add more products as needed
];

Product.insertMany(products)
    .then(() => {
        console.log('Products seeded successfully');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('Error seeding products:', err);
        mongoose.connection.close();
    });