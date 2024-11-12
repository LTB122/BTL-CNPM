const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/authenticateToken');
const paymentController = require('../Controllers/paymentController');

router.post('/createPayment', auth.authenticateToken, paymentController.createPayment);
router.post('/paymentHistory', auth.authenticateToken, paymentController.getUserPayments);

module.exports = router;
