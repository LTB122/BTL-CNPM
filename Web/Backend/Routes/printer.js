const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/authenticateToken');
const printerController = require('../Controllers/printerController');

//Thêm máy in vào hệ thống
router.post('/printerAdded', auth.authenticateToken, printerController.addNewPrinter);

//Lấy toàn bộ json của máy in trong hệ thống
router.get('/printer', auth.authenticateToken, printerController.GetAllPrinter);
router.get('/printer/:printerID', auth.authenticateToken, printerController.GetOnePrinter);

//Cập nhật thông tin của máy in cụ thể
router.put('/printer/:printerID', auth.authenticateToken, printerController.UpdatePrinter);

module.exports = router;