const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/authenticateToken');
const printLogController = require('../Controllers/printLogController');

//Thêm đơn in - dành cho một tài khoản cố định
exports.post('/printRequest/:userID',auth.authenticateToken, printLogController.createPrintLog);

module.exports = router;
