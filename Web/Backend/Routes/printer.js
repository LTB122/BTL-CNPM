const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/authenticateToken');
const printerController = require('../Controllers/printerController');

//Lấy toàn bộ json của máy in trong hệ thống
router.get('/printer', auth.authenticateToken, printerController.GetAllPrinter);
router.get('/printer/:printerID', auth.authenticateToken, printerController.GetOnePrinter);

//Thêm máy in vào hệ thống
router.post('/printerAdded', auth.authenticateToken, auth.isAdmin, printerController.addNewPrinter);

//Cập nhật thông tin của máy in cụ thể
router.put('/printerFixed/:printerID', auth.authenticateToken, auth.isAdmin, printerController.UpdatePrinter);

//Xóa máy in
router.delete('/printerDeleted/:printerID', auth.authenticateToken, auth.isAdmin, printerController.DeletePrinter);

module.exports = router;