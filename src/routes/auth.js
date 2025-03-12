const express = require('express');
const AuthController = require('../controllers/AuthController');
const validateDevice = require('../middlewares/validateDeviceId');
const router = express.Router()

router.post('/validatePhoneNumber', validateDevice.checkNullDeviceId, AuthController.validatePhoneNumber);
router.post('/validateLogin', validateDevice.checkNullDeviceId, AuthController.validateLogin);
router.post('/validateOTPLogin', validateDevice.checkNullDeviceId, AuthController.validateOTP);


router.post('/test', validateDevice.checkSameDeviceId, AuthController.test);

module.exports = router;