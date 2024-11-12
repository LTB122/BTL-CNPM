const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/authenticateToken');
const userController = require('../Controllers/userController');

// Route không yêu cầu đăng nhập (ví dụ: đăng nhập, đăng ký)
router.post('/login', userController.login);
router.post('/register', userController.createUser);

// Các route yêu cầu đăng nhập
router.get('/profile', auth.authenticateToken, userController.getOneUser);
router.post('/update-profile',auth.authenticateToken, userController.updateUser);
router.get('/get-users', auth.authenticateToken, auth.isAdmin, userController.getAllUsers);
router.post('/update-page',auth.authenticateToken, auth.isAdmin, userController.updatePage);
module.exports = router;
