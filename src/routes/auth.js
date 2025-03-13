const express = require('express');
const AuthController = require('../controllers/AuthController');
const validateDevice = require('../middlewares/validateDeviceId');
const router = express.Router()

router.post('/validatePhoneNumber', validateDevice.checkNullDeviceId, AuthController.validatePhoneNumber);
router.post('/validateLogin', validateDevice.checkNullDeviceId, AuthController.validateLogin);
router.post('/validateOTP', validateDevice.checkNullDeviceId, AuthController.validateOTP);
router.post('/signUp', validateDevice.checkNullDeviceId, AuthController.signUp);
router.post('/login', validateDevice.checkSameDeviceId, AuthController.login);
router.post('/forgotPassword', validateDevice.checkNullDeviceId, AuthController.forgotPassword);

// router.post('/createSystemAccount', AuthController.createAccountAdmin);
router.post('/loginAdmin', AuthController.loginAdmin);

module.exports = router;