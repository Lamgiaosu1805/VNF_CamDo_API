const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const YeuCauVayVonController = require('../controllers/YeuCauVayVonController');
// const { processImages, uploadHandler } = require('../middlewares/uploadFile');
const CustomerController = require('../controllers/CustomerController');
const router = express.Router()

//admin

//customer
router.post('/ekyc', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, CustomerController.ekyc);

module.exports = router;