const express = require('express');
const AuthController = require('../controllers/AuthController');
const validateDevice = require('../middlewares/validateDeviceId');
const auth = require('../middlewares/auth');
const router = express.Router()

router.post('/validatePhoneNumber', validateDevice.checkNullDeviceId, AuthController.validatePhoneNumber);
router.post('/validateLogin', validateDevice.checkNullDeviceId, AuthController.validateLogin);
router.post('/validateOTP', validateDevice.checkNullDeviceId, AuthController.validateOTP);
router.post('/signUp', validateDevice.checkNullDeviceId, AuthController.signUp);
router.post('/login', validateDevice.checkSameDeviceId, AuthController.login);
router.post('/forgotPassword', validateDevice.checkNullDeviceId, AuthController.forgotPassword);
router.post('/resetPassword', validateDevice.checkSameDeviceId, AuthController.resetPassword);
router.post('/generateOTP', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, AuthController.genOTP);
router.post('/changePassword', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, AuthController.changePassword);

// router.post('/createSystemAccount', AuthController.createAccountAdmin);
router.post('/loginAdmin', AuthController.loginAdmin);

module.exports = router;