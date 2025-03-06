const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router()

router.post('/validatePhoneNumber', AuthController.validatePhoneNumber);

module.exports = router;