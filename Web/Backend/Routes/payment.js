const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/authenticateToken');
const paymentController = require('../Controllers/paymentController');

router.post('/create-payment', auth.authenticateToken, paymentController.createPayment);
router.get('/get-payments', auth.authenticateToken, paymentController.getUserPayments);
router.put('/update-payment/:paymentId', auth.authenticateToken, paymentController.updatePayment);
module.exports = router;
