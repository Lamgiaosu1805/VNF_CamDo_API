const express = require('express');
const AuthController = require('../controllers/AuthController');
const validateDeviceId = require('../middlewares/validateDeviceId');
const router = express.Router()

router.post('/validatePhoneNumber', validateDeviceId, AuthController.validatePhoneNumber);
router.post('/validateLogin', validateDeviceId, AuthController.validateLogin);
router.post('/validateOTPLogin', validateDeviceId, AuthController.validateOTP);

module.exports = router;