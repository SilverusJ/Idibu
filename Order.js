const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String },
            description: { type: String },
            scent: { type: String },
            size: { type: String },
        },
    ],
    total: { type: Number, required: true },
    shipping: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        zip: { type: String, required: true },
    },
    paymentStatus: { type: String, default: 'pending' },
    paypalOrderId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);