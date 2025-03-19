const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const YeuCauVayVonController = require('../controllers/YeuCauVayVonController');
// const { processImages, uploadHandler } = require('../middlewares/uploadFile');
const CustomerController = require('../controllers/CustomerController');
const NotificationController = require('../controllers/NotificationController');
const router = express.Router()

//admin

//customer
router.post('/ekyc', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, CustomerController.ekyc);
router.post('/saveDeviceToken', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, NotificationController.saveToken);

module.exports = router;