const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const YeuCauVayVonController = require('../controllers/YeuCauVayVonController');
// const { processImages, uploadHandler } = require('../middlewares/uploadFile');
const CustomerController = require('../controllers/CustomerController');
const NotificationController = require('../controllers/NotificationController');
const router = express.Router()

//admin
router.get('/danhSachKhachHang', auth.verifyTokenAdmin, CustomerController.layDanhSachKhachHang);

//customer
router.post('/ekyc', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, CustomerController.ekyc);
router.post('/saveDeviceToken', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, NotificationController.saveToken);
router.get('/getCustomerInfo', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, CustomerController.getCustomerInfo);
router.post('/pushLocation', validateDevice.checkSameDeviceId, CustomerController.pushLocation);
router.post('/napTien', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, CustomerController.napTien);

module.exports = router;