const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/success', orderController.handleSuccess);
router.get('/cancel', orderController.handleCancel);

module.exports = router;