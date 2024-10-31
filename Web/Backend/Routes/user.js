const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.get('/get', userController.getAllUsers);
router.post('/create', userController.createUser);

module.exports = router;
