const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/authenticateToken');
const printLogController = require('../Controllers/printLogController');

//Thêm đơn in - dành cho một tài khoản cố định
router.post('/printRequest/:printerID', auth.authenticateToken, printLogController.createPrintLog);

//Xem toàn bộ đơn in của toàn bộ người dùng
router.get('/getPrintHistoryForadmin', auth.authenticateToken, auth.isAdmin, printLogController.GetAllPrintHistory);
router.get('/getPrintHistory/:userID', auth.authenticateToken, auth.isAdmin, printLogController.GetAccountPrintHistoryForAdmin);
router.get('/getPrintHistory', auth.authenticateToken, printLogController.GetAccountPrintHistory);

module.exports = router;
