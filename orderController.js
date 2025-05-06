const paypal = require('paypal-rest-sdk');
const Order = require('../models/Order');

paypal.configure({
    mode: process.env.PAYPAL_MODE,
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { items, shipping } = req.body;
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create({ items, shipping, total });

        const create_payment_json = {
            intent: 'sale',
            payer: { payment_method: 'paypal' },
            redirect_urls: {
                return_url: 'http://localhost:5000/api/v1/orders/success',
                cancel_url: 'http://localhost:5000/api/v1/orders/cancel',
            },
            transactions: [
                {
                    item_list: {
                        items: items.map((item) => ({
                            name: item.name,
                            sku: item.name.replace(/\s+/g, '-'),
                            price: item.price.toFixed(2),
                            currency: 'USD',
                            quantity: item.quantity,
                        })),
                    },
                    amount: { currency: 'USD', total: total.toFixed(2) },
                    description: 'FNM Full Moisturized Beards Order',
                },
            ],
        };

        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                throw error;
            } else {
                order.paypalOrderId = payment.id;
                order.save();
                const approvalUrl = payment.links.find((link) => link.rel === 'approval_url').href;
                res.status(201).json({ status: 'success', data: { paymentUrl: approvalUrl } });
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

exports.handleSuccess = async (req, res) => {
    const { paymentId, PayerID } = req.query;
    const execute_payment_json = {
        payer_id: PayerID,
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            res.redirect('/api/v1/orders/cancel');
        } else {
            await Order.findOneAndUpdate({ paypalOrderId: paymentId }, { paymentStatus: 'completed' });
            res.redirect('http://localhost:8080/index.html'); // Redirect to frontend
        }
    });
};

exports.handleCancel = (req, res) => {
    res.redirect('http://localhost:8080/cart.html');
};