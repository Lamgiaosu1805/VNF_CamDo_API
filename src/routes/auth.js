const express = require('express');
const AuthController = require('../controllers/AuthController');
const validateDevice = require('../middlewares/validateDeviceId');
const router = express.Router()

router.post('/validatePhoneNumber', AuthController.validatePhoneNumber);
router.post('/validateLogin', AuthController.validateLogin);
router.post('/validateOTPLogin', AuthController.validateOTP);

module.exports = router;