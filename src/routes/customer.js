const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const YeuCauVayVonController = require('../controllers/YeuCauVayVonController');
// const { processImages, uploadHandler } = require('../middlewares/uploadFile');
const CustomerController = require('../controllers/CustomerController');
const NotificationController = require('../controllers/NotificationController');
const uploadEkycMiddleware = require('../middlewares/uploadImageEkyc');
const router = express.Router()

//admin
router.get('/danhSachKhachHang', auth.verifyTokenAdmin, CustomerController.layDanhSachKhachHang);
router.get('/customerInfo/:username', auth.verifyTokenAdmin, CustomerController.getCustomerInfoAdmin);
router.get('/identityCustomerImage/:fileName', auth.verifyTokenAdmin, CustomerController.getIdentityImage);

//customer
router.post('/ekyc', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, uploadEkycMiddleware, CustomerController.ekyc);
router.post('/saveDeviceToken', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, NotificationController.saveToken);
router.get('/getCustomerInfo', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, CustomerController.getCustomerInfo);
router.post('/pushLocation', validateDevice.checkSameDeviceId, CustomerController.pushLocation);

module.exports = router;