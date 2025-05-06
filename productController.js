const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: 'success', data: { products } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ status: 'success', data: { product } });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};